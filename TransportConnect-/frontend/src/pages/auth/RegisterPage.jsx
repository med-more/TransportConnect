import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import {
  Eye,
  EyeOff,
  Truck,
  Package,
  ArrowLeft,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Check,
  User,
  Lock,
  Car,
  Home,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "expediteur",
    },
    mode: "onChange",
  })

  const watchedPassword = watch("password")
  const watchedRole = watch("role")

  // Define steps based on role
  const getTotalSteps = () => {
    return watchedRole === "conducteur" ? 4 : 3
  }

  const steps = [
    { number: 1, title: "Role", icon: User },
    { number: 2, title: "Personal Info", icon: User },
    { number: 3, title: "Account", icon: Lock },
    ...(watchedRole === "conducteur" ? [{ number: 4, title: "Vehicle", icon: Car }] : []),
  ]

  const validateStep = async (step) => {
    switch (step) {
      case 1:
        return await trigger("role")
      case 2:
        return await trigger(["firstName", "lastName", "email", "phone"])
      case 3:
        return await trigger(["password", "confirmPassword"])
      case 4:
        if (watchedRole === "conducteur") {
          return await trigger(["vehicleType", "capacity", "licensePlate", "length", "width", "height"])
        }
        return true
      default:
        return true
    }
  }

  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < getTotalSteps()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
      }

      if (data.role === "conducteur") {
        userData.vehicleInfo = {
          type: data.vehicleType,
          capacity: Number.parseFloat(data.capacity),
          dimensions: {
            length: Number.parseFloat(data.length),
            width: Number.parseFloat(data.width),
            height: Number.parseFloat(data.height),
          },
          licensePlate: data.licensePlate,
        }
      }

      const result = await registerUser(userData)
      if (result.success) {
        navigate("/dashboard")
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
    } finally {
      setLoading(false)
    }
  }

  // Reset to step 1 when role changes
  const handleRoleChange = (value) => {
    setCurrentStep(1)
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
              src="/auth/registerMobile.webp"
              alt="Register"
              className="lg:hidden w-full h-full object-cover opacity-80"
            />
            {/* Desktop Image */}
            <img
              src="/auth/registerDesktop.webp"
              alt="Register"
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
                <Link to="/login">
                  <button className="px-4 py-2 rounded-lg bg-black/50 text-white text-sm font-medium hover:bg-black/70 transition-colors">
                    Join Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Registration Form */}
        <div className="lg:w-[60%] bg-white p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">Back to Home</span>
            </Link>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Create Account</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Join TransportConnect today</p>
          </div>

          {/* Step Indicator */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto pb-2">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.number
                const isCompleted = currentStep > step.number
                const isLast = index === steps.length - 1

                return (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                          isCompleted
                            ? "bg-primary border-primary text-white"
                            : isActive
                            ? "bg-primary border-primary text-white"
                            : "bg-white border-border text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </div>
                      <span className="text-xs mt-1 text-muted-foreground hidden sm:block">{step.title}</span>
                    </div>
                    {!isLast && (
                      <div
                        className={`h-0.5 w-4 sm:w-8 md:w-12 mx-1 sm:mx-2 transition-all flex-shrink-0 ${
                          isCompleted ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Step {currentStep} of {getTotalSteps()}
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {/* Step 1: Role Selection */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md"
                  >
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-4 text-center">
                        I am a:
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            value="expediteur"
                            {...register("role", {
                              required: "Role is required",
                              onChange: (e) => handleRoleChange(e.target.value),
                            })}
                            className="sr-only"
                          />
                          <div
                            className={`p-6 border-2 rounded-lg text-center transition-all ${
                              watchedRole === "expediteur"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:bg-accent"
                            }`}
                          >
                            <Package className="w-8 h-8 mx-auto mb-3 text-primary" />
                            <span className="font-semibold text-foreground block">Shipper</span>
                            <p className="text-xs text-muted-foreground mt-1">I send packages</p>
                          </div>
                        </label>
                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            value="conducteur"
                            {...register("role", {
                              required: "Role is required",
                              onChange: (e) => handleRoleChange(e.target.value),
                            })}
                            className="sr-only"
                          />
                          <div
                            className={`p-6 border-2 rounded-lg text-center transition-all ${
                              watchedRole === "conducteur"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:bg-accent"
                            }`}
                          >
                            <Truck className="w-8 h-8 mx-auto mb-3 text-primary" />
                            <span className="font-semibold text-foreground block">Driver</span>
                            <p className="text-xs text-muted-foreground mt-1">I transport packages</p>
                          </div>
                        </label>
                      </div>
                      {errors.role && <p className="text-sm text-destructive mt-2 text-center">{errors.role.message}</p>}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="First name"
                        error={errors.firstName?.message}
                        {...register("firstName", {
                          required: "First name is required",
                          minLength: { value: 2, message: "First name must be at least 2 characters" },
                        })}
                      />
                      <Input
                        placeholder="Last name"
                        error={errors.lastName?.message}
                        {...register("lastName", {
                          required: "Last name is required",
                          minLength: { value: 2, message: "Last name must be at least 2 characters" },
                        })}
                      />
                    </div>
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
                    />
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      error={errors.phone?.message}
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9+\-\s()]+$/,
                          message: "Invalid phone format",
                        },
                      })}
                    />
                  </motion.div>
                )}

                {/* Step 3: Account Security */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md space-y-4"
                  >
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
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword", {
                          required: "Password confirmation is required",
                          validate: (value) => value === watchedPassword || "Passwords do not match",
                        })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Vehicle Information (Driver only) */}
                {currentStep === 4 && watchedRole === "conducteur" && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Vehicle type</label>
                        <select
                          className="input-field"
                          {...register("vehicleType", {
                            required: "Vehicle type is required",
                          })}
                        >
                          <option value="">Select type</option>
                          <option value="camion">Truck</option>
                          <option value="camionnette">Van</option>
                          <option value="voiture">Car</option>
                          <option value="moto">Motorcycle</option>
                        </select>
                        {errors.vehicleType && (
                          <p className="text-sm text-destructive mt-1">{errors.vehicleType.message}</p>
                        )}
                      </div>
                      <Input
                        label="Capacity (kg)"
                        type="number"
                        step="0.1"
                        placeholder="1000"
                        error={errors.capacity?.message}
                        {...register("capacity", {
                          required: "Capacity is required",
                          min: { value: 0.1, message: "Capacity must be greater than 0" },
                        })}
                      />
                    </div>
                    <Input
                      label="License plate"
                      placeholder="AB-123-CD"
                      error={errors.licensePlate?.message}
                      {...register("licensePlate", {
                        required: "License plate is required",
                      })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Dimensions (cm)</label>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Length"
                          type="number"
                          step="0.1"
                          error={errors.length?.message}
                          {...register("length", {
                            required: "Length is required",
                            min: { value: 1, message: "Length must be greater than 0" },
                          })}
                        />
                        <Input
                          placeholder="Width"
                          type="number"
                          step="0.1"
                          error={errors.width?.message}
                          {...register("width", {
                            required: "Width is required",
                            min: { value: 1, message: "Width must be greater than 0" },
                          })}
                        />
                        <Input
                          placeholder="Height"
                          type="number"
                          step="0.1"
                          error={errors.height?.message}
                          {...register("height", {
                            required: "Height is required",
                            min: { value: 1, message: "Height must be greater than 0" },
                          })}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-2 sm:gap-4 mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-5 md:pt-6 border-t border-border">
              <div>
                {currentStep > 1 && (
                  <Button type="button" variant="ghost" onClick={handlePrevious}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex gap-3">
                {currentStep < getTotalSteps() ? (
                  <Button type="button" onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white">
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" loading={loading} className="bg-primary hover:bg-primary/90 text-white">
                    Create account
                  </Button>
                )}
              </div>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center justify-center gap-4 mt-6">
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

export default RegisterPage
