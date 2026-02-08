import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Eye, EyeOff, Truck, Mail, Lock, ArrowLeft, ArrowRight, Facebook, Twitter, Linkedin, Instagram, Home } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/dashboard"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Redirect when authenticated (fallback)
  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      const redirectPath = user.role === "admin" ? "/admin" : from
      console.log("Redirecting authenticated user to:", redirectPath)
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, user, navigate, from, loading])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      console.log("Attempting login...")
      const result = await login(data.email, data.password)
      console.log("Login result:", result)
      
      if (result && result.success) {
        console.log("Login successful, user:", result.user)
        setTimeout(() => {
          const redirectPath = result.user?.role === "admin" ? "/admin" : from
          console.log("Navigating to:", redirectPath)
          navigate(redirectPath, { replace: true })
        }, 200)
      } else {
        console.error("Login failed:", result?.message)
      }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Left Section - Visual Showcase */}
        <div className="relative lg:w-[40%] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 lg:p-12 flex flex-col justify-between overflow-hidden min-h-[200px] sm:min-h-[300px] lg:min-h-auto">
          {/* Background Image */}
          <div className="absolute inset-0">
            {/* Mobile Image */}
            <img
              src="/auth/loginMobile.webp"
              alt="Login"
              className="lg:hidden w-full h-full object-cover opacity-80"
            />
            {/* Desktop Image */}
            <img
              src="/auth/loginDesktop.webp"
              alt="Login"
              className="hidden lg:block w-full h-full object-cover opacity-80"
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Top Section */}
            <div className="mb-8">
              <div className="flex gap-3">
                <Link to="/register">
                  <button className="px-4 py-2 rounded-lg border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors">
                    Sign Up
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-2 rounded-lg bg-black/50 text-white text-sm font-medium hover:bg-black/70 transition-colors">
                    Join Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="lg:w-[60%] bg-white p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">Back to Home</span>
            </Link>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Hi there!</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Welcome to TransportConnect</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 max-w-md mx-auto w-full">
            <div>
              <Input
                type="email"
                placeholder="Email"
                error={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
                className="w-full"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                error={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Social Login */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-foreground font-medium">Login with Google</span>
            </button>

            {/* Submit Button */}
            <Button type="submit" loading={loading} className="w-full bg-primary hover:bg-primary/90 text-white" size="large">
              Login
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <a href="#" className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
