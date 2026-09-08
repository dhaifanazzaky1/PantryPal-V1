import { Navigate, useLocation } from "react-router"
import toast from "react-hot-toast"

function ProtectedRoute({ children }) {
    const location = useLocation()
    const token = localStorage.getItem("token")

    if (!token) {
        toast.error("Please Login First")
        // remember where the user wanted to go so we can send them back after login
        return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }

    return children
}

export default ProtectedRoute
