import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Eye, EyeOff, Truck } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/dashboard"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const result = await login(data.email, data.password)
      if (result.success) {
        navigate(from, { replace: true })
      }
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
        className="w-full max-w-md z-10"
      >
        {/* Logo et slogan */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-primary/90 shadow-lg rounded-2xl flex items-center justify-center">
              <Truck className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold text-primary drop-shadow">TransportConnect</h1>
          </div>
          <h2 className="text-3xl font-bold text-black mb-2">Bon retour !</h2>
          <p className="text-xl text-black/60 font-medium mb-2">Connectez-vous à votre compte</p>
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
            <div>
              <Input
                label="Adresse email"
                type="email"
                placeholder="votre@email.com"
                error={errors.email?.message}
                className="focus:ring-2 focus:ring-primary/60"
                {...register("email", {
                  required: "L'email est requis",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Format d'email invalide",
                  },
                })}
              />
            </div>

            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                error={errors.password?.message}
                className="focus:ring-2 focus:ring-primary/60"
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
                className="absolute right-3 top-9 text-primary hover:text-black/80"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button type="submit" loading={loading} className="w-full text-lg py-3 rounded-xl shadow-md hover:scale-105 transition-transform" size="large">
              Se connecter
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-black/60">
              Vous n'avez pas de compte ?{' '}
              <Link to="/register" className="text-primary hover:underline font-semibold">
                Créer un compte
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginPage
