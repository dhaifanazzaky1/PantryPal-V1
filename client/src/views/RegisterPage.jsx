import { useState } from "react"
import { useNavigate, Link, Navigate } from "react-router"
import axios from "axios"
import toast from "react-hot-toast"
import baseUrl from "../constant/baseUrl"
import Button from "../component/Button"

function RegisterPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: "", email: "", password: "", avatarUrl: "" })
    const [loading, setLoading] = useState(false)

    // kalau sudah login, redirect ke home
    if (localStorage.getItem("token")) {
        return <Navigate to="/" />
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await axios.post(`${baseUrl}/register`, form)
            toast.success("Register success, please login")
            navigate("/login")
        } catch (error) {
            toast.error(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* left branding panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-anim items-center justify-center text-white" style={{ animationDelay: "-7s" }}>
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl animate-blob"></div>
                <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-rose-400/20 blur-2xl animate-blob" style={{ animationDelay: "-4s" }}></div>
                <div className="absolute top-24 right-24 w-40 h-40 rounded-full bg-indigo-400/10 blur-2xl animate-blob" style={{ animationDelay: "-8s" }}></div>

                <span className="absolute top-16 left-14 text-4xl opacity-40 animate-float">🍣</span>
                <span className="absolute bottom-24 right-16 text-4xl opacity-40 animate-float" style={{ animationDelay: "-2s" }}>🥗</span>

                <div className="relative px-12 text-center">
                    <div className="text-7xl mb-6 animate-float drop-shadow-lg">🥘</div>
                    <h2 className="text-4xl font-extrabold leading-tight">
                        Join the <span className="text-gradient-anim">PantryPal</span> family
                    </h2>
                    <p className="mt-4 text-white/85">
                        Create your free account to save your favorite recipes
                        and unlock AI-powered meal suggestions.
                    </p>
                </div>
            </div>

            {/* right form panel */}
            <div className="flex-1 flex items-center justify-center bg-[#fbfcfa] px-4 py-10">
                <div className="w-full max-w-md animate-fade-up">
                    <div className="text-center mb-8">
                        <div className="text-4xl mb-2 lg:hidden inline-block animate-float">🥘</div>
                        <h1 className="text-3xl font-extrabold text-slate-800">Create <span className="text-gradient-anim">account</span></h1>
                        <p className="text-slate-500 mt-1">Get started in under a minute</p>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200/70 shadow-2xl shadow-orange-500/10 p-8 hover:shadow-orange-500/20 transition-shadow duration-500">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="chef_amel"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 placeholder-slate-400 transition-all hover:border-slate-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 placeholder-slate-400 transition-all hover:border-slate-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 placeholder-slate-400 transition-all hover:border-slate-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Avatar URL (optional)</label>
                                <input
                                    type="text"
                                    name="avatarUrl"
                                    value={form.avatarUrl}
                                    onChange={handleChange}
                                    placeholder="https://…/avatar.jpg"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 placeholder-slate-400 transition-all hover:border-slate-300"
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full btn-shine">
                                {loading ? "Creating…" : "Create Account"}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-emerald-600 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage