import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Eye, EyeOff, Truck, Package } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "expediteur",
    },
  })

  const watchedPassword = watch("password")
  const watchedRole = watch("role")

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-f4f4f4 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Illustration décorative */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <Truck className="w-[350px] h-[350px] text-primary opacity-30" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl z-10"
      >
        {/* Logo et slogan */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-primary/90 shadow-lg rounded-2xl flex items-center justify-center">
              <Truck className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold text-primary drop-shadow">TransportConnect</h1>
          </div>
          <h2 className="text-3xl font-bold text-black mb-2">Créer un compte</h2>
          <p className="text-xl text-black/60 font-medium mb-2">Rejoignez TransportConnect aujourd'hui</p>
          <p className="text-base text-primary font-semibold italic">La plateforme qui relie expéditeurs et conducteurs partout en Maroc</p>
        </div>

        {/* Formulaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-blue-100"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Role Selection */}
            <div>
              <label className="block text-lg font-bold text-primary mb-4">Je suis un :</label>
              <div className="grid grid-cols-2 gap-6">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="expediteur"
                    {...register("role", { required: "Le rôle est requis" })}
                    className="sr-only"
                  />
                  <div
                    className={`p-6 border-2 rounded-2xl text-center transition-all shadow-md group hover:scale-105 ${
                      watchedRole === "expediteur"
                        ? "border-primary bg-input-background"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <Package className="w-10 h-10 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-lg text-primary">Expéditeur</span>
                    <p className="text-sm text-black/60 mt-1">J'envoie des colis</p>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="conducteur"
                    {...register("role", { required: "Le rôle est requis" })}
                    className="sr-only"
                  />
                  <div
                    className={`p-6 border-2 rounded-2xl text-center transition-all shadow-md group hover:scale-105 ${
                      watchedRole === "conducteur"
                        ? "border-primary bg-input-background"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <Truck className="w-10 h-10 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-lg text-primary">Conducteur</span>
                    <p className="text-sm text-black/60 mt-1">Je transporte des colis</p>
                  </div>
                </label>
              </div>
              {errors.role && <p className="text-sm text-error mt-2">{errors.role.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Prénom"
                placeholder="Votre prénom"
                error={errors.firstName?.message}
                {...register("firstName", {
                  required: "Le prénom est requis",
                  minLength: { value: 2, message: "Le prénom doit contenir au moins 2 caractères" },
                  maxLength: { value: 50, message: "Le prénom ne peut pas dépasser 50 caractères" },
                })}
                className="focus:ring-2 focus:ring-primary/60"
              />

              <Input
                label="Nom"
                placeholder="Votre nom"
                error={errors.lastName?.message}
                {...register("lastName", {
                  required: "Le nom est requis",
                  minLength: { value: 2, message: "Le nom doit contenir au moins 2 caractères" },
                  maxLength: { value: 50, message: "Le nom ne peut pas dépasser 50 caractères" },
                })}
                className="focus:ring-2 focus:ring-primary/60"
              />
            </div>

            <Input
              label="Adresse email"
              type="email"
              placeholder="votre@email.com"
              error={errors.email?.message}
              {...register("email", {
                required: "L'email est requis",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Format d'email invalide",
                },
              })}
              className="focus:ring-2 focus:ring-primary/60"
            />

            <Input
              label="Téléphone"
              type="tel"
              placeholder="0123456789"
              error={errors.phone?.message}
              {...register("phone", {
                required: "Le téléphone est requis",
                pattern: {
                  value: /^[0-9+\-\s()]+$/,
                  message: "Format de téléphone invalide",
                },
              })}
              className="focus:ring-2 focus:ring-primary/60"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  error={errors.password?.message}
                  {...register("password", {
                    required: "Le mot de passe est requis",
                    minLength: {
                      value: 6,
                      message: "Le mot de passe doit contenir au moins 6 caractères",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-text-secondary hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirmer le mot de passe"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmez votre mot de passe"
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword", {
                    required: "La confirmation du mot de passe est requise",
                    validate: (value) => value === watchedPassword || "Les mots de passe ne correspondent pas",
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-text-secondary hover:text-primary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Vehicle Information for Drivers */}
            {watchedRole === "conducteur" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-4 p-4 bg-input-background rounded-xl"
              >
                <h3 className="text-lg font-semibold text-text-primary mb-4">Informations du véhicule</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Type de véhicule</label>
                    <select
                      className="input-field"
                      {...register("vehicleType", {
                        required: watchedRole === "conducteur" ? "Le type de véhicule est requis" : false,
                      })}
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="camion">Camion</option>
                      <option value="camionnette">Camionnette</option>
                      <option value="voiture">Voiture</option>
                      <option value="moto">Moto</option>
                    </select>
                    {errors.vehicleType && <p className="text-sm text-error mt-1">{errors.vehicleType.message}</p>}
                  </div>

                  <Input
                    label="Capacité (kg)"
                    type="number"
                    step="0.1"
                    placeholder="1000"
                    error={errors.capacity?.message}
                    {...register("capacity", {
                      required: watchedRole === "conducteur" ? "La capacité est requise" : false,
                      min: { value: 0.1, message: "La capacité doit être supérieure à 0" },
                    })}
                  />
                </div>

                <Input
                  label="Plaque d'immatriculation"
                  placeholder="AB-123-CD"
                  error={errors.licensePlate?.message}
                  {...register("licensePlate", {
                    required: watchedRole === "conducteur" ? "La plaque d'immatriculation est requise" : false,
                  })}
                />

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">Dimensions (cm)</label>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      placeholder="Longueur"
                      type="number"
                      step="0.1"
                      error={errors.length?.message}
                      {...register("length", {
                        required: watchedRole === "conducteur" ? "La longueur est requise" : false,
                        min: { value: 1, message: "La longueur doit être supérieure à 0" },
                      })}
                    />
                    <Input
                      placeholder="Largeur"
                      type="number"
                      step="0.1"
                      error={errors.width?.message}
                      {...register("width", {
                        required: watchedRole === "conducteur" ? "La largeur est requise" : false,
                        min: { value: 1, message: "La largeur doit être supérieure à 0" },
                      })}
                    />
                    <Input
                      placeholder="Hauteur"
                      type="number"
                      step="0.1"
                      error={errors.height?.message}
                      {...register("height", {
                        required: watchedRole === "conducteur" ? "La hauteur est requise" : false,
                        min: { value: 1, message: "La hauteur doit être supérieure à 0" },
                      })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="large">
              Créer mon compte
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Vous avez déjà un compte ?{" "}
              <Link to="/login" className="text-primary hover:text-text-primary font-semibold">
                Se connecter
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default RegisterPage