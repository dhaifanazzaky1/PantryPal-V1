import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import axios from "axios"
import toast from "react-hot-toast"
import baseUrl from "../constant/baseUrl"
import Preloader from "../component/Preloader"

function SavedRecipesPage() {
    const navigate = useNavigate()
    const [saved, setSaved] = useState([])
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem("token")

    const fetchSaved = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/saved`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setSaved(data)
        } catch (error) {
            toast.error(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchSaved()
    }, [])

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseUrl}/saved/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            toast.success("Recipe removed")
            fetchSaved()
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }

    if (loading) return <Preloader />

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
            <div className="flex items-center gap-3 mb-8 animate-fade-up">
                <span className="text-4xl inline-block animate-float">🔖</span>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800">Saved <span className="text-gradient-anim">Recipes</span></h1>
                    <p className="text-sm text-slate-500">Your personal cookbook</p>
                </div>
            </div>

            {saved.length === 0 ? (
                <div className="text-center py-24 animate-pop">
                    <div className="text-7xl mb-4 inline-block animate-float">🍽️</div>
                    <p className="text-slate-500 text-lg font-medium">No saved recipes yet</p>
                    <p className="text-slate-400 text-sm mt-1">Browse recipes and save your favorites.</p>
                </div>
            ) : (
                <div className="stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {saved.map((item) => (
                        <Link to={`/saved/${item.id}`}
                            key={item.id}
                            className="group relative overflow-hidden bg-white rounded-3xl border border-slate-200/70 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 transition-all duration-500"
                        >
                            <span className="card-shine"></span>
                            <div className="relative overflow-hidden">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-48 object-cover cursor-pointer group-hover:scale-110 transition-transform duration-700"
                                    onClick={() => navigate(`/saved/${item.id}`)}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            <div className="relative p-4">
                                <h3
                                    className="font-bold text-slate-800 line-clamp-2 cursor-pointer group-hover:text-emerald-700 transition-colors"
                                    onClick={() => navigate(`/saved/${item.id}`)}
                                >
                                    {item.title}
                                </h3>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-semibold transition-colors hover:-translate-y-0.5 active:scale-95"
                                >
                                    🗑 Delete
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SavedRecipesPage