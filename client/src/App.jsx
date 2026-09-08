import { BrowserRouter, Routes, Route } from "react-router"
import { Toaster } from "react-hot-toast"
import LoginPage from "./views/LoginPage"
import RegisterPage from "./views/RegisterPage"
import HomePage from "./views/HomePage"
import DetailPage from "./views/DetailPage"
import AISuggestPage from "./views/AISuggestPage"
import SavedRecipesPage from "./views/SavedRecipesPage"
import SavedDetailPage from "./views/SavedDetailPage"
import ProfilePage from "./views/ProfilePage"
import BaseLayout from "./views/BaseLayout"
import ProtectedRoute from "./component/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "14px",
          },
        }}
      />
      <Routes>
        {/* auth pages are public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<BaseLayout />}>
          {/* public pages: no login needed */}
          <Route path="/" element={<HomePage />} />
          <Route path="/ai-suggest" element={<AISuggestPage />} />

          {/* protected pages: login required */}
          <Route
            path="/recipes/:id"
            element={
              <ProtectedRoute>
                <DetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedRecipesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved/:id"
            element={
              <ProtectedRoute>
                <SavedDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
