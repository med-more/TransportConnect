import { useState, useEffect, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Shield,
  Star,
  Package,
  Calendar,
  Truck,
  TrendingUp,
  Award,
  Camera,
  Upload,
} from "lucide-react"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import { usersAPI } from "../services/api"
import toast from "react-hot-toast"
import clsx from "clsx"
import { normalizeAvatarUrl } from "../utils/avatar"

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef(null)

  const { data: statsData } = useQuery({
    queryKey: ["user-stats"],
    queryFn: usersAPI.getStats,
  })

  const stats = statsData?.data || {
    totalTrips: 0,
    totalRequests: 0,
    averageRating: 0,
    totalReviews: 0,
  }

  // Helper function to format address (handles both string and object)
  const formatAddress = (address) => {
    if (!address) return ""
    if (typeof address === "string") return address
    if (typeof address === "object") {
      const parts = [
        address.street,
        address.city,
        address.postalCode,
        address.country,
      ].filter(Boolean)
      return parts.join(", ")
    }
    return ""
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: formatAddress(user?.address),
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: formatAddress(user.address),
      })
    }
  }, [user, reset])

  const handleUpdateProfile = async (data) => {
    setIsLoading(true)
    try {
      const response = await usersAPI.updateProfile(data)
      updateUser(response.data.data || response.data)
      setIsEditing(false)
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    reset()
    setIsEditing(false)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload to server
    setIsUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append("avatar", file)

      const response = await usersAPI.uploadAvatar(formData)
      const updatedUserData = response.data.data || response.data
      // Ensure avatar is included in the update
      if (updatedUserData.avatar) {
        updateUser({ avatar: updatedUserData.avatar, ...updatedUserData })
      } else {
        updateUser(updatedUserData)
      }
      setAvatarPreview(null)
      toast.success("Avatar uploaded successfully!")
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast.error(error.response?.data?.message || "Error uploading avatar")
      setAvatarPreview(null)
    } finally {
      setIsUploadingAvatar(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case "conducteur":
        return "Driver"
      case "admin":
        return "Administrator"
      case "expediteur":
        return "Shipper"
      default:
        return "User"
    }
  }

  const statsCards = [
    {
      title: user?.role === "conducteur" ? "Total Trips" : "Total Requests",
      value: stats.totalTrips || stats.totalRequests || 0,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Average Rating",
      value: stats.averageRating ? stats.averageRating.toFixed(1) : "N/A",
      icon: Star,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews || 0,
      icon: Award,
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ]

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">My Profile</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your personal information and view your statistics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div
                  className={clsx(
                    "relative w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden cursor-pointer group",
                    isUploadingAvatar && "opacity-50"
                  )}
                  onClick={handleAvatarClick}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : user?.avatar ? (
                    <img
                      src={normalizeAvatarUrl(user.avatar)}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <span>
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                      {user?.lastName?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  {/* Upload indicator */}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
                <div className="absolute bottom-0 right-0 bg-card border-2 border-border rounded-full p-2">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
              </div>
              <button
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className="text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
              >
                {isUploadingAvatar ? "Uploading..." : "Click to change photo"}
              </button>
              <h2 className="text-2xl font-semibold text-foreground mb-1">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-muted-foreground mb-4 capitalize">{getRoleLabel(user?.role)}</p>

              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{user?.phone}</span>
                  </div>
                )}
                {user?.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{formatAddress(user.address)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <Button
                className="w-full"
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "primary"}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </Button>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="mt-6 space-y-4">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className={clsx("p-3 rounded-lg", stat.bgColor)}>
                        <Icon className={clsx("w-6 h-6", stat.color)} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h3>
              {isEditing && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit(handleUpdateProfile)}
                    loading={isLoading}
                    size="small"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="small">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First name"
                  disabled={!isEditing}
                  error={errors.firstName?.message}
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: { value: 2, message: "First name must be at least 2 characters" },
                  })}
                />

                <Input
                  label="Last name"
                  disabled={!isEditing}
                  error={errors.lastName?.message}
                  {...register("lastName", {
                    required: "Last name is required",
                    minLength: { value: 2, message: "Last name must be at least 2 characters" },
                  })}
                />
              </div>

              <Input
                label="Email"
                type="email"
                disabled={true}
                value={user?.email}
                helperText="Email cannot be changed"
              />

              <Input
                label="Phone"
                disabled={!isEditing}
                error={errors.phone?.message}
                {...register("phone", {
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: "Invalid phone number format",
                  },
                })}
              />

              <Input
                label="Address"
                disabled={!isEditing}
                error={errors.address?.message}
                {...register("address", {
                  minLength: { value: 10, message: "Address must be at least 10 characters" },
                })}
              />
            </form>
          </Card>

          {/* Vehicle Information (for drivers) */}
          {user?.role === "conducteur" && user?.vehicleInfo && (
            <Card className="p-4 sm:p-5 md:p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Vehicle Type</p>
                  <p className="font-medium text-foreground capitalize">
                    {user.vehicleInfo.type || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Capacity</p>
                  <p className="font-medium text-foreground">
                    {user.vehicleInfo.capacity ? `${user.vehicleInfo.capacity} kg` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">License Plate</p>
                  <p className="font-medium text-foreground">
                    {user.vehicleInfo.licensePlate || "N/A"}
                  </p>
                </div>
                {user.vehicleInfo.dimensions && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Dimensions</p>
                    <p className="font-medium text-foreground">
                      {user.vehicleInfo.dimensions.length} × {user.vehicleInfo.dimensions.width} ×{" "}
                      {user.vehicleInfo.dimensions.height} cm
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Account Status */}
          <Card className="p-4 sm:p-5 md:p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Account Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Verification Status</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.isVerified ? "Your account is verified" : "Your account is pending verification"}
                  </p>
                </div>
                <div
                  className={clsx(
                    "px-3 py-1 rounded-md text-sm font-medium",
                    user?.isVerified
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  )}
                >
                  {user?.isVerified ? "Verified" : "Pending"}
                </div>
              </div>
              {user?.lastLogin && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-medium text-foreground">Last Login</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.lastLogin).toLocaleString("en-US")}
                    </p>
                  </div>
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
