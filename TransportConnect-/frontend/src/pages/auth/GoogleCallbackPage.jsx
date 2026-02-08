import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { authAPI } from "../../services/api"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import toast from "react-hot-toast"

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAuthState } = useAuth()

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const token = searchParams.get("token")
      const userId = searchParams.get("userId")
      const error = searchParams.get("error")

      if (error) {
        toast.error("Google authentication failed. Please try again.")
        navigate("/login", { replace: true })
        return
      }

      if (!token || !userId) {
        toast.error("Invalid authentication response")
        navigate("/login", { replace: true })
        return
      }

      try {
        // Store token first
        localStorage.setItem("token", token)

        // Fetch user profile
        const profileResponse = await authAPI.getProfile()
        if (profileResponse.data?.user) {
          const serverUser = profileResponse.data.user
          const user = {
            ...serverUser,
            _id: serverUser.id || serverUser._id,
          }

          console.log("🔍 User profile from server:", user)
          console.log("   Avatar:", user.avatar)

          // Store user data
          localStorage.setItem("user", JSON.stringify(user))

          // Set auth state properly (this updates isAuthenticated and token)
          setAuthState(user, token)

          // Show welcome message only once (use unique ID to prevent duplicates)
          toast.success(`Welcome ${user.firstName}!`, { 
            id: "google-login-success",
            duration: 3000 
          })
          
          // Wait a bit longer to ensure state is fully updated
          // Then navigate (don't use window.location.href to avoid full reload)
          setTimeout(() => {
            const redirectPath = user.role === "admin" ? "/admin" : "/dashboard"
            navigate(redirectPath, { replace: true })
          }, 300)
        } else {
          throw new Error("Failed to fetch user profile")
        }
      } catch (error) {
        console.error("Error handling Google callback:", error)
        toast.error("Error completing authentication")
        navigate("/login", { replace: true })
      }
    }

    handleGoogleCallback()
  }, [searchParams, navigate, setAuthState])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}

export default GoogleCallbackPage

