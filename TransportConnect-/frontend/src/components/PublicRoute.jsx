import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "./ui/LoadingSpinner"

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // Don't redirect if we're on the Google OAuth callback page
  // Let the callback page handle the redirect
  const isGoogleCallback = location.pathname === "/auth/google/callback"

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Don't redirect on Google callback page - let it handle its own flow
  if (isAuthenticated && !isGoogleCallback) {
    // Redirect based on user role
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicRoute
