import { useNavigate } from "react-router"

function RecipeCard({ recipe }) {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            className="group relative overflow-hidden bg-white rounded-3xl border border-slate-200/70 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 animate-fade-up transition-all duration-500"
        >
            <span className="card-shine"></span>
            <div className="relative overflow-hidden">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full glass text-[11px] font-bold text-emerald-700 shadow-sm group-hover:scale-105 transition-transform">
                    🍽 {recipe.servings} servings
                </span>
                <span className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-2 transition-all duration-300">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </span>
            </div>
            <div className="relative p-4">
                <h3 className="font-bold text-slate-800 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {recipe.title}
                </h3>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {recipe.readyInMinutes} min
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        View
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default RecipeCard
