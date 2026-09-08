import { useState } from "react"
import { useNavigate, Link, Navigate, useLocation } from "react-router"
import axios from "axios"
import toast from "react-hot-toast"
import baseUrl from "../constant/baseUrl"
import Button from "../component/Button"
import { GoogleLogin } from '@react-oauth/google';

function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const redirectTo = location.state?.from || "/"
    const [form, setForm] = useState({ email: "", password: "" })
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
            const { data } = await axios.post(`${baseUrl}/login`, form)
            localStorage.setItem("token", data.access_token)
            window.dispatchEvent(new Event("storage"))
            toast.success("Login success")
            navigate(redirectTo)
        } catch (error) {
            toast.error(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSubmit = async (credentialResponse) => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${baseUrl}/google-login`, {}, {
                headers: {
                    token: credentialResponse.credential
                }
            })
            localStorage.setItem("token", data.access_token)
            window.dispatchEvent(new Event("storage"))
            toast.success("Login success")
            navigate(redirectTo)
        } catch (error) {
            toast.error(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* left branding panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-anim items-center justify-center text-white">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl animate-blob"></div>
                <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-amber-400/20 blur-2xl animate-blob" style={{ animationDelay: "-5s" }}></div>
                <div className="absolute top-24 left-16 w-40 h-40 rounded-full bg-fuchsia-400/10 blur-2xl animate-blob" style={{ animationDelay: "-9s" }}></div>

                <span className="absolute top-16 right-16 text-4xl opacity-40 animate-float">🍕</span>
                <span className="absolute bottom-24 left-20 text-4xl opacity-40 animate-float" style={{ animationDelay: "-3s" }}>🍜</span>

                <div className="relative px-12 text-center">
                    <div className="text-7xl mb-6 animate-float drop-shadow-lg">🍳</div>
                    <h2 className="text-4xl font-extrabold leading-tight">
                        Cook something <span className="text-gradient-anim">amazing</span>
                    </h2>
                    <p className="mt-4 text-white/85">
                        Save recipes, get AI suggestions from your pantry, and
                        never wonder "what's for dinner?" again.
                    </p>
                </div>
            </div>

            {/* right form panel */}
            <div className="flex-1 flex items-center justify-center bg-[#fbfcfa] px-4 py-10">
                <div className="w-full max-w-md animate-fade-up">
                    <div className="text-center mb-8">
                        <div className="text-4xl mb-2 lg:hidden inline-block animate-float">🍳</div>
                        <h1 className="text-3xl font-extrabold text-slate-800">
                            Welcome <span className="text-gradient-anim">back</span>
                        </h1>
                        <p className="text-slate-500 mt-1">Login to your PantryPal account</p>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200/70 shadow-2xl shadow-emerald-500/10 p-8 hover:shadow-emerald-500/20 transition-shadow duration-500">
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                            <Button type="submit" disabled={loading} className="w-full btn-shine">
                                {loading ? "Loading…" : "Login"}
                            </Button>
                        </form>

                        <div className="flex items-center gap-3 my-5">
                            <span className="flex-1 h-px bg-slate-200"></span>
                            <span className="text-xs font-medium text-slate-400">OR</span>
                            <span className="flex-1 h-px bg-slate-200"></span>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin onSuccess={handleGoogleSubmit} />
                        </div>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-semibold text-emerald-600 hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage