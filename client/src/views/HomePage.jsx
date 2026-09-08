import { useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import baseUrl from "../constant/baseUrl"
import RecipeCard from "../component/RecipeCard"
import Preloader from "../component/Preloader"
import { Link } from "react-router"
import { useSelector } from 'react-redux'

function HomePage() {
    const [recipes, setRecipes] = useState([])
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const username = useSelector((state) => state.usernameReducer.username)

    const fetchRecipes = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/recipes`, {
                params: { search, page },
            })
            setRecipes(data.data)
            setTotalPage(data.totalPage)
        } catch (error) {
            toast.error(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchRecipes()
    }, [page])

    // debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1)
            fetchRecipes()
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    const goPrev = () => {
        setLoading(true)
        setPage((p) => Math.max(1, p - 1))
    }

    const goNext = () => {
        setLoading(true)
        setPage((p) => Math.min(totalPage, p + 1))
    }

    return (
        <div>
            {/* hero */}
            <section className="relative overflow-hidden bg-gradient-anim text-white">
                {/* floating decorative blobs */}
                <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white/10 blur-2xl animate-blob"></div>
                <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-amber-400/20 blur-2xl animate-blob" style={{ animationDelay: "-4s" }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-fuchsia-400/10 blur-3xl animate-blob" style={{ animationDelay: "-8s" }}></div>

                {/* floating food emojis */}
                <span className="absolute top-16 left-[12%] text-3xl opacity-40 animate-float">🥦</span>
                <span className="absolute top-28 right-[14%] text-3xl opacity-40 animate-float" style={{ animationDelay: "-2s" }}>🍅</span>
                <span className="absolute bottom-16 left-[20%] text-3xl opacity-40 animate-float" style={{ animationDelay: "-3s" }}>🥑</span>
                <span className="absolute bottom-20 right-[22%] text-3xl opacity-40 animate-float" style={{ animationDelay: "-1s" }}>🌶️</span>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center relative">
                    <span className="inline-block px-5 py-2 rounded-full glass-dark text-xs font-bold tracking-wide mb-6 animate-fade-up shadow-lg shadow-black/10">
                        ✨ AI-Powered Recipe Finder
                    </span>

                    <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight animate-fade-up">
                        Discover &amp; Cook{" "}
                        <span className="text-gradient-anim ">Delicious</span> Recipes
                    </h1>
                    {username && (
                        <p className="mt-2 text-white/90 text-sm font-medium animate-fade-up">
                            Welcome back, {username} 👋
                        </p>
                    )}
                    <p className="mt-5 max-w-xl mx-auto text-white/85 text-sm sm:text-lg animate-fade-up" style={{ animationDelay: "0.1s" }}>
                        Search thousands of recipes, or let our AI suggest meals
                        from the ingredients you already have in your pantry.
                    </p>

                    {/* search */}
                    <div className="mt-10 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
                        <div className="group flex items-center gap-2 bg-white rounded-2xl p-2 shadow-2xl shadow-black/30 focus-within:ring-4 focus-within:ring-white/40 transition-all">
                            <svg className="w-5 h-5 ml-3 text-emerald-500 group-focus-within:animate-wiggle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setLoading(true)
                                }}
                                placeholder="Search recipes, e.g. chicken pasta…"
                                className="flex-1 px-2 py-2 text-slate-800 placeholder-slate-400 focus:outline-none"
                            />
                            <Link
                                to="/ai-suggest"
                                className="btn-shine px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:-translate-y-0.5 active:scale-95 transition-all whitespace-nowrap"
                            >
                                ✨ AI Suggest
                            </Link>
                        </div>
                    </div>

                    {/* mini stats */}
                    <div className="stagger mt-12 flex flex-wrap items-center justify-center gap-8">
                        <div className="glass-dark px-5 py-3 rounded-2xl text-left">
                            <p className="text-2xl font-extrabold">10k+</p>
                            <p className="text-xs text-white/70">Recipes</p>
                        </div>
                        <div className="glass-dark px-5 py-3 rounded-2xl text-left">
                            <p className="text-2xl font-extrabold">AI</p>
                            <p className="text-xs text-white/70">Smart suggestions</p>
                        </div>
                        <div className="glass-dark px-5 py-3 rounded-2xl text-left">
                            <p className="text-2xl font-extrabold">100%</p>
                            <p className="text-xs text-white/70">Free to explore</p>
                        </div>
                    </div>
                </div>

                {/* wave divider */}
                <svg className="absolute bottom-0 left-0 w-full text-[#fbfcfa]" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" style={{ height: "48px" }}>
                    <path d="M0 80h1440V40c-120-20-260-20-400 0s-280 20-400 0-220-20-320 0S100 20 0 40z" fill="currentColor" />
                </svg>
            </section>

            {/* recipes */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
                        Explore{" "}
                        <span className="text-gradient-anim">Recipes</span>
                    </h2>
                    <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 shadow-sm">
                        Page {page} of {totalPage}
                    </span>
                </div>

                {loading ? (
                    <Preloader />
                ) : recipes.length === 0 ? (
                    <div className="text-center py-24 animate-pop">
                        <div className="text-6xl mb-4">😕</div>
                        <p className="text-slate-500 text-lg font-medium">No recipes found.</p>
                        <p className="text-slate-400 text-sm mt-1">Try a different search.</p>
                    </div>
                ) : (
                    <>
                        <div className="stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {recipes.map((recipe) => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                        </div>

                        {/* pagination */}
                        <div className="flex items-center justify-center gap-3 mt-12">
                            <button
                                onClick={goPrev}
                                disabled={page === 1}
                                className="btn-shine px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-sm hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-all"
                            >
                                ← Prev
                            </button>
                            <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-lg shadow-emerald-300/50 animate-pop">
                                {page}
                            </span>
                            <button
                                onClick={goNext}
                                disabled={page === totalPage}
                                className="btn-shine px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-sm hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-all"
                            >
                                Next →
                            </button>
                        </div>
                    </>
                )}
            </section>
        </div>
    )
}

export default HomePage