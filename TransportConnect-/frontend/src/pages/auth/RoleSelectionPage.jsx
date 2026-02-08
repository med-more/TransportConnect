import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Truck,
  Package,
  ArrowRight,
  CheckCircle,
  Home,
  User,
  MapPin,
  Clock,
  Shield,
  Star,
  TrendingUp,
  Check,
  Search,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { usersAPI, authAPI } from "../../services/api"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import toast from "react-hot-toast"

const RoleSelectionPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAuthState } = useAuth()
  const [selectedRole, setSelectedRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const token = searchParams.get("token")
  const userId = searchParams.get("userId")

  useEffect(() => {
    // Initialize auth state if we have token (but don't store in localStorage yet)
    const initializeAuth = async () => {
      if (!token || !userId) {
        navigate("/login", { replace: true })
        return
      }

      try {
        // Store token temporarily in sessionStorage (not localStorage)
        // This way it won't persist if user navigates away
        sessionStorage.setItem("temp_token", token)
        sessionStorage.setItem("temp_userId", userId)

        // Temporarily set token in localStorage for API calls
        // We'll remove it if user doesn't select role or goes back to home
        localStorage.setItem("token", token)
        // Mark this as a temporary token that requires role selection
        localStorage.setItem("temp_token_pending_role", "true")

        // Fetch user profile to display info, but don't set auth state yet
        const profileResponse = await authAPI.getProfile()
        if (profileResponse.data?.user) {
          const serverUser = profileResponse.data.user
          const user = {
            ...serverUser,
            _id: serverUser.id || serverUser._id,
          }

          // Store user data temporarily in sessionStorage (not localStorage)
          sessionStorage.setItem("temp_user", JSON.stringify(user))
          
          // Don't call setAuthState - user is not logged in yet
          // They need to select a role first
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        toast.error("Error loading user data")
        // Clear temp data
        sessionStorage.removeItem("temp_token")
        sessionStorage.removeItem("temp_userId")
        sessionStorage.removeItem("temp_user")
        localStorage.removeItem("token")
        localStorage.removeItem("temp_token_pending_role")
        navigate("/login", { replace: true })
      } finally {
        setInitializing(false)
      }
    }

    initializeAuth()
  }, [token, userId, navigate])

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  const roles = [
    {
      value: "expediteur",
      label: "Shipper",
      subtitle: "Send & Track Shipments",
      description: "Find reliable drivers to transport your goods across Morocco",
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary",
      hoverBgColor: "hover:bg-primary/5",
      features: [
        { icon: Search, text: "Find available trips" },
        { icon: MapPin, text: "Track shipments in real-time" },
        { icon: Shield, text: "Verified drivers only" },
        { icon: Star, text: "Rate your experience" },
      ],
      gradient: "from-primary/20 to-primary/5",
    },
    {
      value: "conducteur",
      label: "Driver",
      subtitle: "Offer Transport Services",
      description: "Earn money by providing reliable transport services",
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-600",
      hoverBgColor: "hover:bg-blue-50/50",
      features: [
        { icon: TrendingUp, text: "Earn competitive rates" },
        { icon: Clock, text: "Flexible schedule" },
        { icon: User, text: "Build your reputation" },
        { icon: MapPin, text: "Choose your routes" },
      ],
      gradient: "from-blue-500/20 to-blue-500/5",
    },
  ]

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      toast.error("Please select a role")
      return
    }

    // Get token from sessionStorage or query params
    const tempToken = sessionStorage.getItem("temp_token") || token
    if (!tempToken) {
      toast.error("Invalid session")
      navigate("/login", { replace: true })
      return
    }

    setLoading(true)
    try {
      // Update user role
      const response = await usersAPI.updateProfile({ role: selectedRole })

      if (response.data?.data) {
        const updatedUser = response.data.data
        const fullUser = {
          ...updatedUser,
          _id: updatedUser._id || updatedUser.id,
        }

        // Now that role is selected, store token and user in localStorage permanently
        localStorage.setItem("token", tempToken)
        localStorage.setItem("user", JSON.stringify(fullUser))
        
        // Remove the temporary token flag - user has selected role
        localStorage.removeItem("temp_token_pending_role")

        // Clear temporary sessionStorage data
        sessionStorage.removeItem("temp_token")
        sessionStorage.removeItem("temp_userId")
        sessionStorage.removeItem("temp_user")

        // Update auth state with new role - NOW user is logged in
        setAuthState(fullUser, tempToken)

        toast.success(`Welcome as a ${selectedRole === "conducteur" ? "Driver" : "Shipper"}!`)

        // Redirect to dashboard
        setTimeout(() => {
          navigate("/dashboard", { replace: true })
        }, 500)
      } else {
        throw new Error("Failed to update role")
      }
    } catch (error) {
      console.error("Error updating role:", error)
      toast.error(error.response?.data?.message || "Error updating role. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToHome = () => {
    // Clear temporary token and user data
    sessionStorage.removeItem("temp_token")
    sessionStorage.removeItem("temp_userId")
    sessionStorage.removeItem("temp_user")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("temp_token_pending_role")
    
    // Navigate to home without being logged in
    navigate("/", { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Left Section - Visual Showcase */}
        <div className="relative lg:w-[45%] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-between overflow-hidden min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-auto">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Top Section */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <button
                onClick={handleBackToHome}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 sm:mb-6"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">Back to Home</span>
              </button>
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white">Welcome to TransportConnect</h2>
              </div>
            </div>

            {/* Middle Section */}
            <div className="flex-1 flex items-center justify-center py-4 sm:py-6 md:py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center px-2 sm:px-4"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
                  Choose Your Path
                </h3>
                <p className="text-white/80 text-xs sm:text-sm md:text-base max-w-sm mx-auto px-2">
                  Select how you want to use TransportConnect. You can always change this later in your profile settings.
                </p>
              </motion.div>
            </div>

            {/* Bottom Section */}
            <div className="mt-4 sm:mt-6 md:mt-8">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/60 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Verified</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Trusted</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Role Selection */}
        <div className="lg:w-[55%] bg-white p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center">
          {/* Header */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
              Choose Your Role
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              Select how you want to use TransportConnect
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <AnimatePresence>
              {roles.map((role, index) => {
                const Icon = role.icon
                const isSelected = selectedRole === role.value

                return (
                  <motion.div
                    key={role.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      className={`p-4 sm:p-5 md:p-6 cursor-pointer transition-all duration-300 border-2 ${
                        isSelected
                          ? `${role.borderColor} ${role.bgColor} shadow-lg scale-[1.01] sm:scale-[1.02]`
                          : `border-border hover:border-primary/30 hover:shadow-md`
                      }`}
                      onClick={() => setSelectedRole(role.value)}
                      hover={false}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${role.bgColor} flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected ? "scale-110" : ""
                          }`}
                        >
                          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${role.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start sm:items-center justify-between mb-2 gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg sm:text-xl font-bold text-foreground">{role.label}</h3>
                              <p className="text-xs sm:text-sm text-muted-foreground">{role.subtitle}</p>
                            </div>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0"
                              >
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{role.description}</p>

                          {/* Features */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                            {role.features.map((feature, idx) => {
                              const FeatureIcon = feature.icon
                              return (
                                <div key={idx} className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                                  <FeatureIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                  <span className="truncate">{feature.text}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Continue Button */}
          <div className="space-y-3 sm:space-y-4">
            <Button
              onClick={handleRoleSelection}
              loading={loading}
              disabled={!selectedRole}
              className="w-full bg-primary hover:bg-primary/90 text-white text-sm sm:text-base"
              size="large"
            >
              Continue
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
            <p className="text-xs sm:text-sm text-center text-muted-foreground px-2">
              You can change your role later in your profile settings
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RoleSelectionPage
