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
        // Fetch user profile
        const profileResponse = await authAPI.getProfile()
        if (profileResponse.data?.user) {
          const serverUser = profileResponse.data.user
          const user = {
            ...serverUser,
            _id: serverUser.id || serverUser._id,
          }

          // Set auth state properly (this updates isAuthenticated and token)
          setAuthState(user, token)

          toast.success(`Welcome ${user.firstName}!`)
          
          // Small delay to ensure state is updated before navigation
          setTimeout(() => {
            const redirectPath = user.role === "admin" ? "/admin" : "/dashboard"
            navigate(redirectPath, { replace: true })
          }, 100)
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

