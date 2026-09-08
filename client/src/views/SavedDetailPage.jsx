import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import axios from "axios"
import toast from "react-hot-toast"
import baseUrl from "../constant/baseUrl"
import Preloader from "../component/Preloader"

function SavedDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [recipe, setRecipe] = useState(null)
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem("token")

    const fetchDetail = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/saved/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setRecipe(data)
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
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow">{recipe.title}</h1>
                    <div className="mt-2 flex items-center gap-4 text-sm text-emerald-50">
                        <span>⏱ {recipe.readyInMinutes} min</span>
                        <span>🍽 {recipe.servings} servings</span>
                    </div>
                </div>
            </div>

            <div
                className="mt-6 text-slate-600 leading-relaxed animate-fade-up"
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
            />

            <h2 className="text-2xl font-extrabold text-slate-800 mt-10 mb-4 flex items-center gap-2">🧺 Ingredients</h2>
            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6 hover:shadow-lg transition-shadow animate-fade-up">
                <ul className="stagger space-y-2">
                    {recipe.ingredients.map((item) => (
                        <li key={item.id} className="flex items-center gap-3 text-slate-600 hover:text-emerald-700 transition-colors">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 animate-glow"></span>
                            {item.original}
                        </li>
                    ))}
                </ul>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-800 mt-10 mb-4 flex items-center gap-2">👨‍🍳 Instructions</h2>
            <ol className="space-y-4">
                {recipe.instructions.flatMap((group) =>
                    group.steps.map((step) => (
                        <li key={step.number} className="flex gap-4 text-slate-600 bg-white rounded-2xl border border-slate-200/70 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <span className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-300/50 hover:scale-110 transition-transform">
                                {step.number}
                            </span>
                            <span className="leading-relaxed">{step.step}</span>
                        </li>
                    ))
                )}
            </ol>
        </div>
    )
}

export default SavedDetailPage