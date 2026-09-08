function Preloader() {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
            <div className="relative">
                <div className="w-14 h-14 rounded-full border-4 border-emerald-100 border-t-emerald-500 border-r-emerald-300 animate-spin"></div>
                <span className="absolute inset-0 flex items-center justify-center text-xl animate-spin-slow">
                    🍳
                </span>
            </div>
            <p className="text-sm font-medium text-slate-400">Loading…</p>
        </div>
    )
}

export default Preloader
