import { useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import baseUrl from "../constant/baseUrl"
import Button from "../component/Button"
import Preloader from "../component/Preloader"
import { useSelector, useDispatch } from 'react-redux'
import { setUsername as setUsernameGlobal } from "../features/username/usernameSlice"


function ProfilePage() {
    const dispatch = useDispatch()
    const globalUsername = useSelector((state) => state.usernameReducer.username)

    const [user, setUser] = useState(null)


    const [photo, setPhoto] = useState(null)
    const [preview, setPreview] = useState(null)
    const [uploading, setUploading] = useState(false)

    const [username, setUsername] = useState("")
    const [updatingUsername, setUpdatingUsername] = useState(false)

    const [loadingProfile, setLoadingProfile] = useState(true)

    const token = localStorage.getItem("token")
    const payload = JSON.parse(atob(token.split(".")[1]))
    const userId = payload.id


    async function fetchProfile() {
        try {
            const { data } = await axios.get(
                `${baseUrl}/user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setUser(data)
            setPreview(data.avatarUrl)
            setUsername(data.username)
            dispatch(setUsernameGlobal(data.username))

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load profile"
            )
        } finally {
            setLoadingProfile(false)
        }
    }

    useEffect(() => {

        fetchProfile()
    }, [])


    const handleFileChange = (e) => {
        const file = e.target.files[0]

        if (!file) return

        setPhoto(file)
        setPreview(URL.createObjectURL(file))
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!photo) {
            toast.error("Please choose a photo")
            return
        }

        const formData = new FormData()
        formData.append("profile", photo)

        setUploading(true)

        try {
            const { data } = await axios.patch(
                `${baseUrl}/user/profile/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            )

            toast.success("Profile photo updated")

            setPreview(data.data)
            setPhoto(null)

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update profile photo"
            )
        } finally {
            setUploading(false)
        }
    }


    const handleUsernameSubmit = async (e) => {
        e.preventDefault()

        if (!username.trim()) {
            toast.error("Username cannot be empty")
            return
        }

        setUpdatingUsername(true)

        try {
            const { data } = await axios.patch(
                `${baseUrl}/user/name/${userId}`,
                {
                    username: username.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            toast.success("Username updated successfully")

            setUser((prev) => ({
                ...prev,
                username: data.data,
            }))

            dispatch(setUsernameGlobal(data.data))

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update username"
            )
        } finally {
            setUpdatingUsername(false)
        }
    }

    if (loadingProfile) {
        return (
            <div className="text-center py-10 text-slate-400">
                <Preloader />
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto px-4 py-10 animate-fade-in">

            {/* HEADER */}
            <div className="text-center mb-6 animate-fade-up">
                <h1 className="text-3xl font-extrabold text-slate-800">
                    Profile
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                    Manage your profile
                </p>
            </div>

            <div className="relative bg-white rounded-3xl border border-slate-200/70 shadow-2xl shadow-emerald-500/10 p-8 overflow-hidden animate-scale-in">

                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-200/40 blur-2xl animate-blob"></div>

                <div
                    className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-teal-200/40 blur-2xl animate-blob"
                    style={{ animationDelay: "-6s" }}
                ></div>

                <div className="relative flex flex-col items-center mb-6">
                    <div className="ring-pulse relative group">

                        {preview ? (
                            <img
                                src={preview}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center text-emerald-500 text-5xl">
                                👤
                            </div>
                        )}

                        <span className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm shadow-lg">
                            ✓
                        </span>

                    </div>
                </div>


                <div className="relative text-center mb-6">

                    <p className="text-xl font-bold text-slate-800">
                        {globalUsername}
                    </p>

                    <p className="text-sm text-slate-500">
                        {user?.email}
                    </p>

                </div>


                <form
                    onSubmit={handleUsernameSubmit}
                    className="relative space-y-3 mb-8"
                >

                    <label className="block text-sm font-semibold text-slate-700">
                        Username
                    </label>

                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                    />

                    <Button
                        type="submit"
                        disabled={updatingUsername}
                        className="w-full"
                    >
                        {updatingUsername
                            ? "Updating…"
                            : "Update Username"}
                    </Button>

                </form>


                <form
                    onSubmit={handleSubmit}
                    className="relative space-y-4"
                >

                    <label className="block text-sm font-semibold text-slate-700">
                        Profile Photo
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-slate-500 file:mr-4 file:px-4 file:py-2.5 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-600 file:font-semibold hover:file:bg-emerald-100 transition-colors"
                    />

                    <Button
                        type="submit"
                        disabled={uploading}
                        className="w-full"
                    >
                        {uploading
                            ? "Uploading…"
                            : "Update Photo"}
                    </Button>

                </form>

            </div>
        </div>
    )
}

export default ProfilePage