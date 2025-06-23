import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save, 
  X, 
  Camera, 
  Shield, 
  Star, 
  Package, 
  MessageCircle,
  Calendar,
  Truck,
  Settings,
  LogOut,
  Crown,
  Award,
  TrendingUp,
  Activity
} from "lucide-react"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import { usersAPI } from "../services/api"
import toast from "react-hot-toast"

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalRequests: 0,
    averageRating: 0,
    totalReviews: 0
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    }
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const handleUpdateProfile = async (data) => {
    setIsLoading(true)
    try {
      const response = await usersAPI.updateProfile(data)
      updateUser(response.data.data)
      setIsEditing(false)
      toast.success("Profil mis à jour avec succès !")
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    reset()
    setIsEditing(false)
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "conducteur":
        return <Truck className="w-6 h-6" />
      case "admin":
        return <Crown className="w-6 h-6" />
      default:
        return <User className="w-6 h-6" />
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case "conducteur":
        return "Conducteur"
      case "admin":
        return "Administrateur"
      default:
        return "Client"
    }
  }

  const getRoleGradient = (role) => {
    switch (role) {
      case "conducteur":
        return "from-blue-500 to-cyan-500"
      case "admin":
        return "from-purple-500 to-pink-500"
      default:
        return "from-primary to-text-secondary"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-f4f4f4 p-0 relative overflow-hidden">
      {/* Illustration décorative */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.10, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute right-0 top-0 w-[420px] h-[420px] pointer-events-none z-0"
      >
        <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="210" cy="210" rx="210" ry="210" fill="#0072bb" fillOpacity="0.15" />
          <rect x="120" y="120" width="180" height="80" rx="30" fill="#0072bb" fillOpacity="0.18" />
          <rect x="170" y="200" width="80" height="40" rx="20" fill="#5bc0eb" fillOpacity="0.18" />
        </svg>
      </motion.div>
      <motion.div 
        className="max-w-7xl mx-auto space-y-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Header */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-text-secondary to-primary p-10 text-white shadow-2xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10"></div>
          </div>
          <div className="relative z-10 text-center">
            <motion.h1 
              className="text-5xl font-extrabold mb-4 drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Mon Profil
            </motion.h1>
            <motion.p 
              className="text-xl opacity-90 max-w-2xl mx-auto font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Gérez vos informations personnelles et suivez vos statistiques en temps réel
            </motion.p>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Profile Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <Card className="p-8 relative overflow-hidden bg-white/80 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-2xl">
              {/* Background Gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-text-secondary to-primary"></div>
              <div className="text-center mb-8">
                <motion.div 
                  className="relative inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`w-40 h-40 bg-gradient-to-br ${getRoleGradient(user?.role)} rounded-full flex items-center justify-center text-white text-5xl font-bold mb-6 mx-auto shadow-2xl relative overflow-hidden border-4 border-white/60`}>
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-40 h-40 rounded-full object-cover"
                      />
                    ) : (
                      user?.firstName?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white/80 rounded-full p-2 shadow-md border border-blue-100">
                    {getRoleIcon(user?.role)}
                  </div>
                </motion.div>
                <h2 className="text-2xl font-bold text-primary mt-2 mb-1">{user?.firstName} {user?.lastName}</h2>
                <div className="text-sm text-black/60 mb-2">{getRoleLabel(user?.role)}</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-black/70">{user?.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-black/70">{user?.phone}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-black/70">{user?.address}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                <Button className="w-full text-lg py-3 rounded-xl shadow-md hover:scale-105 transition-transform" onClick={() => setIsEditing(true)}>
                  <Edit className="w-5 h-5 mr-2" /> Modifier le profil
                </Button>
                <Button className="w-full text-lg py-3 rounded-xl shadow-md hover:scale-105 transition-transform" variant="outline" onClick={logout}>
                  <LogOut className="w-5 h-5 mr-2" /> Déconnexion
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Enhanced Profile Details */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-8"
          >
            {/* Personal Information */}
            <Card className="p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-text-secondary"></div>
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-text-primary flex items-center">
                  <div className="p-2 rounded-lg bg-primary/10 mr-3">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  Informations personnelles
                </h3>
                <AnimatePresence mode="wait">
                  {!isEditing ? (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="small"
                        className="hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="save"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="flex space-x-2"
                    >
                      <Button
                        onClick={handleSubmit(handleUpdateProfile)}
                        loading={isLoading}
                        size="small"
                        className="bg-gradient-to-r from-primary to-text-secondary hover:from-text-secondary hover:to-primary transition-all duration-300"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="ghost"
                        size="small"
                        className="hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Input
                      label="Prénom"
                      icon={User}
                      disabled={!isEditing}
                      error={errors.firstName?.message}
                      className={isEditing ? "ring-2 ring-primary/20 focus:ring-primary" : ""}
                      {...register("firstName", {
                        required: "Le prénom est requis",
                        minLength: { value: 2, message: "Le prénom doit contenir au moins 2 caractères" }
                      })}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Input
                      label="Nom"
                      icon={User}
                      disabled={!isEditing}
                      error={errors.lastName?.message}
                      className={isEditing ? "ring-2 ring-primary/20 focus:ring-primary" : ""}
                      {...register("lastName", {
                        required: "Le nom est requis",
                        minLength: { value: 2, message: "Le nom doit contenir au moins 2 caractères" }
                      })}
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Input
                    label="Email"
                    type="email"
                    icon={Mail}
                    disabled={true}
                    value={user?.email}
                    className="bg-gray-50"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Input
                    label="Téléphone"
                    icon={Phone}
                    disabled={!isEditing}
                    error={errors.phone?.message}
                    className={isEditing ? "ring-2 ring-primary/20 focus:ring-primary" : ""}
                    {...register("phone", {
                      pattern: {
                        value: /^[0-9+\-\s()]+$/,
                        message: "Numéro de téléphone invalide"
                      }
                    })}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Input
                    label="Adresse"
                    icon={MapPin}
                    disabled={!isEditing}
                    error={errors.address?.message}
                    className={isEditing ? "ring-2 ring-primary/20 focus:ring-primary" : ""}
                    {...register("address", {
                      minLength: { value: 10, message: "L'adresse doit contenir au moins 10 caractères" }
                    })}
                  />
                </motion.div>
              </form>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfilePage 