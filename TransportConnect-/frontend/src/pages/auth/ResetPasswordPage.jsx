import { useState, useEffect } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { ArrowLeft, Lock, CheckCircle, Home, Eye, EyeOff, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import toast from "react-hot-toast"
import { authAPI } from "../../services/api"

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [passwordReset, setPasswordReset] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const token = searchParams.get("token")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch("password")

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link. Please request a new password reset.")
      navigate("/forgot-password")
    }
  }, [token, navigate])

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Invalid reset token")
      return
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.resetPassword(token, data.password)
      setPasswordReset(true)
      toast.success(response.data?.message || "Password reset successfully!")
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error resetting password. Please try again."
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return null // Will redirect in useEffect
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
              src="/auth/forgetMobile.webp"
              alt="Reset Password"
              className="lg:hidden w-full h-full object-cover opacity-80"
            />
            {/* Desktop Image */}
            <img
              src="/auth/forgetDesktop.webp"
              alt="Reset Password"
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
                <Link to="/login">
                  <button className="px-4 py-2 rounded-lg border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors">
                    Sign In
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

        {/* Right Section - Reset Password Form */}
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
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Reset Password</h2>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              {passwordReset
                ? "Your password has been reset successfully!"
                : "Enter your new password below"}
            </p>
          </div>

          {/* Form */}
          <div className="flex-1 flex items-center justify-center">
            {passwordReset ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-md w-full"
              >
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">Password Reset!</h3>
                <p className="text-muted-foreground mb-8">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
                <Link to="/login">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white" size="large">
                    Go to Login
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 max-w-md mx-auto w-full"
              >
                <div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      error={errors.password?.message}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      error={errors.confirmPassword?.message}
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  size="large"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Reset Password
                </Button>
              </motion.form>
            )}
          </div>

          {/* Back to Login Link */}
          {!passwordReset && (
            <div className="text-center mt-6">
              <Link to="/login" className="inline-flex items-center text-sm text-primary hover:underline font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Link>
            </div>
          )}

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

export default ResetPasswordPage

