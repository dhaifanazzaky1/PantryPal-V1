import { useState } from "react"
import { Link, useNavigate } from "react-router"
import axios from "axios"
import toast from "react-hot-toast"
import baseUrl from "../constant/baseUrl"
import Button from "../component/Button"
import Preloader from "../component/Preloader"

function AISuggestPage() {
    const [ingredients, setIngredients] = useState("")
    const [photo, setPhoto] = useState(null)
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    // AI generation requires login — redirect to /login if not authenticated
    const requireLogin = () => {
        if (!token) {
            toast.error("Please login to use AI Suggest")
            navigate("/login", { state: { from: "/ai-suggest" } })
            return false
        }
        return true
    }

    const handleManualSubmit = async (e) => {
        e.preventDefault()
        const list = ingredients.split(",").map((i) => i.trim()).filter((i) => i.length > 0)
        if (list.length === 0) {
            toast.error("Please enter at least one ingredient")
            return
        }
        if (!requireLogin()) return
        setLoading(true)
        try {
            const { data } = await axios.post(
                `${baseUrl}/ai/recipes`,
                { ingredients: list },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setResult(data)
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    const handlePhotoSubmit = async (e) => {
        e.preventDefault()
        if (!photo) {
            toast.error("Please upload a photo")
            return
        }
        const formData = new FormData()
        formData.append("photo", photo)
        if (!requireLogin()) return
        setLoading(true)
        try {
            const { data } = await axios.post(`${baseUrl}/recipes/photo`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            setResult(data)
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
            {/* header */}
            <div className="relative text-center mb-10 animate-fade-up">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl opacity-30 animate-float">✨</div>
                <span className="btn-shine inline-block px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold tracking-wide shadow-lg shadow-amber-300/50 mb-4">
                    ✨ AI SUGGEST
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
                    What's in your{" "}
                    <span className="text-gradient-anim">
                        pantry?
                    </span>
                </h1>
                <p className="mt-3 max-w-xl mx-auto text-slate-500">
                    Enter your ingredients or upload a photo — our AI will suggest
                    recipes just for you. Login is needed when generating.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* manual input */}
                <div className="group relative overflow-hidden bg-white rounded-3xl border border-slate-200/70 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 p-6 transition-all hover:-translate-y-1.5 animate-fade-up">
                    <span className="card-shine"></span>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 group-hover:animate-wiggle transition-transform">📝</span>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Manual Ingredients</h2>
                            <p className="text-xs text-slate-400">Type what you have</p>
                        </div>
                    </div>
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                        <textarea
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="e.g. chicken, rice, garlic, onion"
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 resize-none transition-all hover:border-slate-300"
                        />
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Searching…" : "Suggest Recipe"}
                        </Button>
                    </form>
                </div>

                {/* photo upload */}
                <div className="group relative overflow-hidden bg-white rounded-3xl border border-slate-200/70 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 p-6 transition-all hover:-translate-y-1.5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                    <span className="card-shine"></span>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center text-xl group-hover:scale-110 group-hover:animate-wiggle transition-transform">📷</span>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Upload Photo</h2>
                            <p className="text-xs text-slate-400">Snap your ingredients</p>
                        </div>
                    </div>
                    <form onSubmit={handlePhotoSubmit} className="space-y-4">
                        <div className="w-full h-32 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 flex items-center justify-center text-slate-400 text-sm group-hover:border-emerald-400 transition-colors">
                            {photo ? `📎 ${photo.name}` : "Drop or choose an image"}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPhoto(e.target.files[0])}
                            className="w-full text-sm text-slate-500 file:mr-4 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-orange-50 file:text-orange-600 file:font-semibold hover:file:bg-orange-100 transition-colors"
                        />
                        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-amber-500">
                            {loading ? "Analyzing…" : "Analyze Photo"}
                        </Button>
                    </form>
                </div>
            </div>

            {loading && <Preloader />}

            {/* result */}
            {result && !loading && (
                <div className="mt-10 bg-white rounded-3xl border border-slate-200/70 shadow-2xl shadow-emerald-500/10 p-6 animate-scale-in">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-800">🎉 Result</h2>
                        <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-md shadow-emerald-300/40">
                            {result.source}
                        </span>
                    </div>

                    {result.source === "gemini" ? (
                        <div className="animate-fade-up">
                            <h3 className="text-2xl font-extrabold text-slate-800">{result.data.title}</h3>
                            <div className="mt-2 flex gap-4 text-slate-500">
                                <span>⏱ {result.data.readyInMinutes} min</span>
                                <span>🍽 {result.data.servings} servings</span>
                            </div>

                            <h4 className="font-bold text-slate-800 mt-6 mb-2">Ingredients</h4>
                            <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-sm">
                                <ul className="stagger space-y-1">
                                    {result.data.ingredients.map((item, i) => (
                                        <li key={i} className="text-slate-600 hover:text-emerald-700 transition-colors">
                                            • <span className="font-semibold">{item.name}</span> ({item.amount} {item.unit})
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <h4 className="font-bold text-slate-800 mt-6 mb-2">Instructions</h4>
                            <ol className="space-y-2">
                                {result.data.instructions.map((step, i) => (
                                    <li key={i} className="text-slate-600 bg-white rounded-2xl border border-slate-200/70 p-3 hover:shadow-md transition-shadow">
                                        <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold mr-2">{i + 1}</span>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ) : (
                        <div className="stagger grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {result.data.map((recipe) => (
                                <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="group border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
                                    <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{recipe.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Used {recipe.usedIngredientCount} of your ingredients
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default AISuggestPage