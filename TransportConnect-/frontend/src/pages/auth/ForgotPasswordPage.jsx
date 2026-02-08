import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, CheckCircle, Home, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import toast from "react-hot-toast"

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setEmailSent(true)
      toast.success("Password reset email sent!")
    } catch (error) {
      toast.error("Error sending email")
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
              src="/auth/forgetMobile.webp"
              alt="Forgot Password"
              className="lg:hidden w-full h-full object-cover opacity-80"
            />
            {/* Desktop Image */}
            <img
              src="/auth/forgetDesktop.webp"
              alt="Forgot Password"
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

        {/* Right Section - Forgot Password Form */}
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
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Forgot Password?</h2>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              {emailSent
                ? "Check your email inbox for reset instructions"
                : "Enter your email address to receive a password reset link"}
            </p>
          </div>

          {/* Form */}
          <div className="flex-1 flex items-center justify-center">
            {emailSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-md w-full"
              >
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">Email sent!</h3>
                <p className="text-muted-foreground mb-8">
                  We've sent a password reset link to your email address. Check your inbox and follow the instructions
                  to reset your password.
                </p>
                <Link to="/login">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white" size="large">
                    Back to login
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

                <Button type="submit" loading={loading} className="w-full bg-primary hover:bg-primary/90 text-white" size="large">
                  <Mail className="w-4 h-4 mr-2" />
                  Send reset link
                </Button>
              </motion.form>
            )}
          </div>

          {/* Back to Login Link */}
          {!emailSent && (
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

export default ForgotPasswordPage
