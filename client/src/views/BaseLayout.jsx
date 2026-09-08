import { Outlet } from "react-router"
import Navbar from "../component/Navbar"

function BaseLayout() {
    // NOTE: the auth guard is now handled per-route (see ProtectedRoute),
    // so the Home & AI Suggest pages can be browsed without logging in.
    return (
        <div className="relative min-h-screen overflow-x-hidden">
            {/* ambient animated blobs */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-teal-200/40 rounded-full blur-3xl animate-blob" style={{ animationDelay: "-4s" }}></div>
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl animate-blob" style={{ animationDelay: "-8s" }}></div>
            </div>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default BaseLayout
