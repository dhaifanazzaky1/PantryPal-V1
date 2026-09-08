import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import toast from "react-hot-toast"
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux'
import { setUsername, clearUsername } from "../features/username/usernameSlice"
import baseUrl from "../constant/baseUrl"

function Navbar() {
    const dispatch = useDispatch()
    const username = useSelector((state) => state.usernameReducer.username)
    const navigate = useNavigate()
    const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem("token"))

    // react to token changes (e.g. login in another tab)
    useEffect(() => {
        const handler = () => setLoggedIn(!!localStorage.getItem("token"))
        window.addEventListener("storage", handler)
        return () => window.removeEventListener("storage", handler)
    }, [])

    useEffect(() => {
        const fetchUsername = async () => {
            const token = localStorage.getItem("token")
            if (!token) return
            try {
                const payload = JSON.parse(atob(token.split(".")[1]))
                const userId = payload.id
                const { data } = await axios.get(`${baseUrl}/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                dispatch(setUsername(data.username))
            } catch (error) {
                console.error("Failed to fetch username", error)
            }
        }

        if (loggedIn && !username) {
            fetchUsername()
        }
    }, [loggedIn, username, dispatch])

    const handleLogout = () => {
        localStorage.removeItem("token")
        setLoggedIn(false)
        toast.success("Logged out")
        dispatch(clearUsername())
        navigate("/")
    }

    const linkClass =
        "link-grow px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"

    return (
        <nav className="glass sticky top-0 z-30 shadow-lg shadow-slate-900/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                <Link
                    to="/"
                    className="group flex items-center gap-2 text-xl font-extrabold text-emerald-600"
                >
                    <span className="text-2xl inline-block group-hover:animate-wiggle transition-transform">
                        🍳
                    </span>
                    <span>
                        Pantry<span className="text-gradient-anim">Pal</span>
                    </span>
                </Link>

                <div className="flex items-center gap-1 sm:gap-2">
                    <Link to="/" className={linkClass}>
                        Home
                    </Link>
                    <Link to="/ai-suggest" className={linkClass}>
                        AI Suggest
                    </Link>

                    {loggedIn ? (
                        <>
                            <Link to="/saved" className={linkClass}>
                                Saved
                            </Link>
                            <Link
                                to="/profile"
                                className="ring-pulse ml-1 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-sm font-bold hover:scale-110 hover:rotate-6 transition-transform"
                                title="Profile"
                            >
                                👤
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="btn-shine ml-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md shadow-rose-300/50 active:scale-95 transition-all"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 border border-emerald-300/70 hover:bg-emerald-50 hover:border-emerald-400 hover:-translate-y-0.5 active:scale-95 transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="btn-shine px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md shadow-emerald-300/50 hover:-translate-y-0.5 active:scale-95 transition-all"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar