import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "./ui/LoadingSpinner"

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // Don't redirect if we're on the Google OAuth callback or role selection page
  // Let these pages handle their own redirects
  const isGoogleCallback = location.pathname === "/auth/google/callback"
  const isRoleSelection = location.pathname === "/auth/select-role"

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Don't redirect on Google callback or role selection pages - let them handle their own flow
  if (isAuthenticated && !isGoogleCallback && !isRoleSelection) {
    // Redirect based on user role
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicRoute
