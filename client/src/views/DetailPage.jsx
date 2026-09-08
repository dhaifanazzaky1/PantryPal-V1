import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import axios from "axios"
import toast from "react-hot-toast"
import baseUrl from "../constant/baseUrl"
import Button from "../component/Button"
import Preloader from "../component/Preloader"

function DetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [recipe, setRecipe] = useState(null)
    const [ingredients, setIngredients] = useState([])
    const [instructions, setInstructions] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const token = localStorage.getItem("token")

    const fetchDetail = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/recipes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setRecipe(data.recipe)
            setIngredients(data.ingredients)
            setInstructions(data.instructions)
        } catch (error) {
            toast.error(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDetail()
    }, [id])

    const handleSave = async () => {
        setSaving(true)
        try {
            await axios.post(
                `${baseUrl}/saved`,
                {
                    spoonacularId: recipe.id,
                    title: recipe.title,
                    imageUrl: recipe.image,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            toast.success("Recipe saved")
        } catch (error) {
            toast.error(error.response?.data?.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <Preloader />

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            <button
                onClick={() => navigate(-1)}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 mb-5 transition-all hover:-translate-x-1"
            >
                <span className="inline-block group-hover:animate-wiggle">←</span> Back
            </button>

            <div className="group relative overflow-hidden rounded-3xl shadow-2xl shadow-emerald-900/20 animate-fade-up">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow animate-fade-up">
                        {recipe.title}
                    </h1>
                    <div className="mt-2 flex items-center gap-4 text-sm text-emerald-50">
                        <span className="inline-flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {recipe.readyInMinutes} min
                        </span>
                        <span>🍽 {recipe.servings} servings</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-6 animate-fade-up">
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving…" : "💾 Save Recipe"}
                </Button>
            </div>

            <div
                className="mt-6 text-slate-600 leading-relaxed animate-fade-up"
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
            />

            <h2 className="text-2xl font-extrabold text-slate-800 mt-10 mb-4 flex items-center gap-2">
                🧺 Ingredients
            </h2>
            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6 hover:shadow-lg transition-shadow animate-fade-up">
                <ul className="stagger space-y-2">
                    {ingredients.map((item) => (
                        <li key={item.id} className="flex items-center gap-3 text-slate-600 hover:text-emerald-700 transition-colors">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 animate-glow"></span>
                            {item.original}
                        </li>
                    ))}
                </ul>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-800 mt-10 mb-4 flex items-center gap-2">
                👨‍🍳 Instructions
            </h2>
            <ol className="space-y-4">
                {instructions.map((step) => (
                    <li key={step.number} className="flex gap-4 text-slate-600 bg-white rounded-2xl border border-slate-200/70 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                        <span className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-300/50 hover:scale-110 transition-transform">
                            {step.number}
                        </span>
                        <span className="leading-relaxed">{step.step}</span>
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default DetailPage