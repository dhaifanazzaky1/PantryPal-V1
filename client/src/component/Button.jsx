function Button({ children, onClick, type = "button", variant = "primary", className = "", disabled = false }) {
    const base =
        "btn-shine inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95 hover:-translate-y-0.5"
    const styles = {
        primary:
            "text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-300/50 hover:shadow-emerald-300/70 focus:ring-emerald-400",
        secondary:
            "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-300 shadow-sm",
        danger:
            "text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-rose-300/50 hover:shadow-rose-300/70 focus:ring-rose-400",
        outline:
            "bg-transparent text-emerald-700 border-2 border-emerald-500 hover:bg-emerald-50 hover:border-emerald-600 focus:ring-emerald-300",
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${styles[variant]} ${className}`}
        >
            {children}
        </button>
    )
}

export default Button
