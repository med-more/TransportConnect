import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useTranslation } from "../i18n/useTranslation"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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
  RefreshCw,
  Plus,
  Trash2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "../utils/icons"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import { usersAPI, documentsAPI } from "../services/api"
import toast from "react-hot-toast"
import clsx from "clsx"
import { normalizeAvatarUrl } from "../utils/avatar"

const ProfilePage = () => {
  const { user, updateUser, setAuthState } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [isChangingRole, setIsChangingRole] = useState(false)
  const [roleChangeMessage, setRoleChangeMessage] = useState("")
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [newAddressLabel, setNewAddressLabel] = useState("")
  const [newAddressAddress, setNewAddressAddress] = useState("")
  const [newAddressCity, setNewAddressCity] = useState("")
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [editLabel, setEditLabel] = useState("")
  const [editAddress, setEditAddress] = useState("")
  const [editCity, setEditCity] = useState("")
  const fileInputRef = useRef(null)

  const queryClient = useQueryClient()
  const { data: statsData } = useQuery({
    queryKey: ["user-stats"],
    queryFn: usersAPI.getStats,
  })

  const { data: savedAddresses = [], refetch: refetchSavedAddresses } = useQuery({
    queryKey: ["saved-addresses"],
    queryFn: () => usersAPI.getSavedAddresses(),
    enabled: !!user,
  })

  const addAddressMutation = useMutation({
    mutationFn: (data) => usersAPI.addSavedAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-addresses"] })
      refetchSavedAddresses()
      toast.success(t("profile.savedAddressAdded") || "Address added")
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to add address"),
  })
  const deleteAddressMutation = useMutation({
    mutationFn: (id) => usersAPI.deleteSavedAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-addresses"] })
      refetchSavedAddresses()
      toast.success(t("profile.savedAddressDeleted") || "Address removed")
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to remove address"),
  })
  const updateAddressMutation = useMutation({
    mutationFn: ({ id, ...data }) => usersAPI.updateSavedAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-addresses"] })
      refetchSavedAddresses()
      setEditingAddressId(null)
      setEditLabel("")
      setEditAddress("")
      setEditCity("")
      toast.success(t("profile.savedAddressUpdated") || "Address updated")
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update address"),
  })
  const startEditAddress = (addr) => {
    setEditingAddressId(addr._id)
    setEditLabel(addr.label)
    setEditAddress(addr.address)
    setEditCity(addr.city)
  }
  const cancelEditAddress = () => {
    setEditingAddressId(null)
    setEditLabel("")
    setEditAddress("")
    setEditCity("")
  }

  const { data: documents = [], refetch: refetchDocuments } = useQuery({
    queryKey: ["documents"],
    queryFn: () => documentsAPI.list(),
    enabled: !!user && user?.role === "conducteur",
  })
  const [docUploadType, setDocUploadType] = useState("license")
  const [docUploadFile, setDocUploadFile] = useState(null)
  const docUploadMutation = useMutation({
    mutationFn: () => {
      const form = new FormData()
      form.append("file", docUploadFile)
      form.append("type", docUploadType)
      return documentsAPI.upload(form)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] })
      refetchDocuments()
      setDocUploadFile(null)
      toast.success("Document uploaded for review")
    },
    onError: (e) => toast.error(e.response?.data?.message || "Upload failed"),
  })
  const docDeleteMutation = useMutation({
    mutationFn: (id) => documentsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] })
      refetchDocuments()
      toast.success("Document removed")
    },
    onError: (e) => toast.error(e.response?.data?.message || "Delete failed"),
  })

  const handleViewDocumentFile = async (doc) => {
    try {
      const { data } = await documentsAPI.getFile(doc._id)
      const url = URL.createObjectURL(data)
      window.open(url, "_blank", "noopener,noreferrer")
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch (e) {
      let msg = "Could not open file"
      if (e.response?.data instanceof Blob) {
        try {
          const text = await e.response.data.text()
          const j = JSON.parse(text)
          if (j.message) msg = j.message
        } catch (_) {}
      } else if (e.response?.data?.message) {
        msg = e.response.data.message
      }
      toast.error(msg)
    }
  }

  // Backend returns: { success: true, data: { totalTrips, totalRequests } }
  const stats = statsData?.data?.data || statsData?.data || {
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
      vehicleType: user?.vehicleInfo?.type || "",
      vehicleCapacity: user?.vehicleInfo?.capacity || "",
      vehicleLicensePlate: user?.vehicleInfo?.licensePlate || "",
      vehicleLength: user?.vehicleInfo?.dimensions?.length || "",
      vehicleWidth: user?.vehicleInfo?.dimensions?.width || "",
      vehicleHeight: user?.vehicleInfo?.dimensions?.height || "",
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
        vehicleType: user.vehicleInfo?.type || "",
        vehicleCapacity: user.vehicleInfo?.capacity || "",
        vehicleLicensePlate: user.vehicleInfo?.licensePlate || "",
        vehicleLength: user.vehicleInfo?.dimensions?.length || "",
        vehicleWidth: user.vehicleInfo?.dimensions?.width || "",
        vehicleHeight: user.vehicleInfo?.dimensions?.height || "",
      })
    }
  }, [user, reset])

  const handleUpdateProfile = async (data) => {
    setIsLoading(true)
    try {
      const response = await usersAPI.updateProfile(data)
      updateUser(response.data.data || response.data)
      setIsEditing(false)
      toast.success(t("profile.profileUpdated"))
    } catch (error) {
      toast.error(error.response?.data?.message || t("profile.errorUpdatingProfile"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    reset()
    setIsEditing(false)
  }

  const handleRoleChange = async (newRole) => {
    if (user?.role === newRole) {
      toast.info(t("profile.alreadyThisRole"))
      return
    }

    if (user?.role === "admin") {
      toast.error(t("profile.adminCannotChangeRole"))
      return
    }

    setIsChangingRole(true)
    const roleLabel = newRole === "conducteur" ? t("profile.driver") : t("profile.shipper")
    setRoleChangeMessage(t("profile.preparingMode").replace("{role}", roleLabel))

    try {
      const response = await usersAPI.updateProfile({ role: newRole })
      
      if (response.data?.data) {
        const updatedUser = response.data.data
        const fullUser = {
          ...updatedUser,
          _id: updatedUser._id || updatedUser.id,
        }

        // Update auth state with new role
        const token = localStorage.getItem("token")
        localStorage.setItem("user", JSON.stringify(fullUser))
        setAuthState(fullUser, token)

        toast.success(t("profile.switchedToMode").replace("{role}", roleLabel))
        
        // Wait a bit to show the success message, then redirect
        setTimeout(() => {
          navigate("/dashboard", { replace: true })
        }, 1500)
      } else {
        throw new Error("Failed to update role")
      }
    } catch (error) {
      console.error("Error changing role:", error)
      toast.error(error.response?.data?.message || t("profile.errorChangingRole"))
      setIsChangingRole(false)
      setRoleChangeMessage("")
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(t("profile.selectImageFile"))
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("profile.imageSizeMax"))
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
      console.log("📸 Avatar upload response:", updatedUserData)
      console.log("📸 Avatar URL from response:", updatedUserData.avatar)
      
      // Ensure avatar is included in the update
      if (updatedUserData.avatar) {
        console.log("📸 Updating user with avatar:", updatedUserData.avatar)
        updateUser({ avatar: updatedUserData.avatar, ...updatedUserData })
      } else {
        console.warn("⚠️ No avatar in response, updating with full data")
        updateUser(updatedUserData)
      }
      setAvatarPreview(null)
      toast.success(t("profile.avatarUploaded"))
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast.error(error.response?.data?.message || t("profile.errorUploadingAvatar"))
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
        return t("profile.driver")
      case "admin":
        return t("profile.administrator")
      case "expediteur":
        return t("profile.shipper")
      default:
        return t("profile.user")
    }
  }

  // Loading overlay when changing role
  if (isChangingRole) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-foreground mb-2">{t("profile.switchingRole")}</h3>
          <p className="text-muted-foreground mb-4">{roleChangeMessage}</p>
          <p className="text-sm text-muted-foreground">{t("profile.pleaseWaitPrepare")}</p>
        </motion.div>
      </div>
    )
  }

  const statsCards = [
    {
      title: user?.role === "conducteur" ? t("profile.totalTrips") : t("profile.totalRequests"),
      value: user?.role === "conducteur" 
        ? (stats.totalTrips || 0)
        : (stats.totalRequests || 0),
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: t("profile.averageRating"),
      value: stats.averageRating && stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "0.0",
      icon: Star,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: t("profile.totalReviews"),
      value: stats.totalReviews || stats.totalRatings || 0,
      icon: Award,
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ]

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{t("profile.myProfile")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t("profile.subtitle")}</p>
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
                {isUploadingAvatar ? t("profile.uploading") : t("profile.clickToChangePhoto")}
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
                {isEditing ? t("profile.cancelEditing") : t("profile.editProfile")}
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
                {t("profile.personalInformation")}
              </h3>
              {isEditing && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit(handleUpdateProfile)}
                    loading={isLoading}
                    size="small"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t("common.save")}
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="small">
                    <X className="w-4 h-4 mr-2" />
                    {t("common.cancel")}
                  </Button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t("profile.firstName")}
                  disabled={!isEditing}
                  error={errors.firstName?.message}
                  {...register("firstName", {
                    required: t("profile.firstNameRequired"),
                    minLength: { value: 2, message: t("profile.firstNameMinLength") },
                  })}
                />

                <Input
                  label={t("profile.lastName")}
                  disabled={!isEditing}
                  error={errors.lastName?.message}
                  {...register("lastName", {
                    required: t("profile.lastNameRequired"),
                    minLength: { value: 2, message: t("profile.lastNameMinLength") },
                  })}
                />
              </div>

              <Input
                label={t("auth.email")}
                type="email"
                disabled={true}
                value={user?.email}
                helperText={t("profile.emailCannotBeChanged")}
              />

              <Input
                label={t("profile.phone")}
                disabled={!isEditing}
                error={errors.phone?.message}
                {...register("phone", {
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: t("profile.invalidPhoneFormat"),
                  },
                })}
              />

              <Input
                label={t("profile.address")}
                disabled={!isEditing}
                error={errors.address?.message}
                {...register("address", {
                  minLength: { value: 10, message: t("profile.addressMinLength") },
                })}
              />
            </form>
          </Card>

          {/* Saved addresses */}
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {t("profile.savedAddresses") || "Saved addresses"}
              </h3>
              {!showAddAddress && (
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  onClick={() => setShowAddAddress(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("profile.addAddress") || "Add address"}
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t("profile.savedAddressesHint") || "Use these when creating requests for faster checkout."}
            </p>
            {showAddAddress && (
              <form
                className="mb-6 p-4 rounded-xl border border-border bg-muted/20 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!newAddressLabel.trim() || !newAddressAddress.trim() || !newAddressCity.trim()) {
                    toast.error("Label, address and city are required")
                    return
                  }
                  addAddressMutation.mutate(
                    { label: newAddressLabel.trim(), address: newAddressAddress.trim(), city: newAddressCity.trim(), country: "Maroc" },
                    {
                      onSuccess: () => {
                        setNewAddressLabel("")
                        setNewAddressAddress("")
                        setNewAddressCity("")
                        setShowAddAddress(false)
                      },
                    }
                  )
                }}
              >
                <Input
                  label={t("profile.addressLabel") || "Label"}
                  placeholder="Home, Office..."
                  value={newAddressLabel}
                  onChange={(e) => setNewAddressLabel(e.target.value)}
                />
                <Input
                  label={t("profile.addressStreet") || "Address"}
                  placeholder="Street, building"
                  value={newAddressAddress}
                  onChange={(e) => setNewAddressAddress(e.target.value)}
                />
                <Input
                  label={t("profile.city") || "City"}
                  placeholder="City"
                  value={newAddressCity}
                  onChange={(e) => setNewAddressCity(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button type="submit" loading={addAddressMutation.isPending} size="small">
                    {t("profile.addAddress") || "Add address"}
                  </Button>
                  <Button type="button" variant="outline" size="small" onClick={() => setShowAddAddress(false)}>
                    {t("common.cancel")}
                  </Button>
                </div>
              </form>
            )}
            {savedAddresses.length === 0 && !showAddAddress && (
              <p className="text-sm text-muted-foreground py-4">{t("profile.noSavedAddresses") || "No saved addresses yet."}</p>
            )}
            <ul className="space-y-3">
              {savedAddresses.map((addr) => (
                <li
                  key={addr._id}
                  className="p-3 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors"
                >
                  {editingAddressId === addr._id ? (
                    <form
                      className="space-y-3"
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (!editLabel.trim() || !editAddress.trim() || !editCity.trim()) {
                          toast.error("Label, address and city are required")
                          return
                        }
                        updateAddressMutation.mutate({
                          id: addr._id,
                          label: editLabel.trim(),
                          address: editAddress.trim(),
                          city: editCity.trim(),
                          country: "Maroc",
                        })
                      }}
                    >
                      <Input
                        label={t("profile.addressLabel") || "Label"}
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                      />
                      <Input
                        label={t("profile.addressStreet") || "Address"}
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                      />
                      <Input
                        label={t("profile.city") || "City"}
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button type="submit" size="small" loading={updateAddressMutation.isPending}>
                          {t("common.save")}
                        </Button>
                        <Button type="button" variant="outline" size="small" onClick={cancelEditAddress}>
                          {t("common.cancel")}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{addr.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {addr.address}, {addr.city}
                          {addr.postalCode ? ` ${addr.postalCode}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="small"
                          aria-label={t("common.edit")}
                          onClick={() => startEditAddress(addr)}
                          disabled={!!editingAddressId}
                        >
                          <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="small"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => deleteAddressMutation.mutate(addr._id)}
                          disabled={deleteAddressMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          {/* Vehicle Information (for drivers) */}
          {user?.role === "conducteur" && (
            <Card className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  {t("profile.vehicleInformation")}
                </h3>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="small"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {t("common.edit")}
                  </Button>
                )}
              </div>
              {isEditing ? (
                <form onSubmit={handleSubmit(async (data) => {
                  setIsLoading(true)
                  try {
                    const vehicleInfo = {
                      type: data.vehicleType,
                      capacity: Number.parseFloat(data.vehicleCapacity),
                      licensePlate: data.vehicleLicensePlate,
                      dimensions: {
                        length: data.vehicleLength ? Number.parseFloat(data.vehicleLength) : undefined,
                        width: data.vehicleWidth ? Number.parseFloat(data.vehicleWidth) : undefined,
                        height: data.vehicleHeight ? Number.parseFloat(data.vehicleHeight) : undefined,
                      },
                    }
                    const response = await usersAPI.updateProfile({ vehicleInfo })
                    updateUser(response.data.data || response.data)
                    setIsEditing(false)
                    toast.success(t("profile.vehicleUpdated"))
                  } catch (error) {
                    toast.error(error.response?.data?.message || t("profile.errorUpdatingVehicle"))
                  } finally {
                    setIsLoading(false)
                  }
                })} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">{t("profile.vehicleType")}</label>
                      <select
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        {...register("vehicleType", {
                          required: t("profile.vehicleTypeRequired"),
                        })}
                        defaultValue={user?.vehicleInfo?.type || ""}
                      >
                        <option value="">{t("profile.selectType")}</option>
                        <option value="camion">Camion</option>
                        <option value="camionnette">Camionnette</option>
                        <option value="voiture">Voiture</option>
                        <option value="moto">Moto</option>
                      </select>
                    </div>
                    <Input
                      label={t("profile.capacityKg")}
                      type="number"
                      step="0.1"
                      defaultValue={user?.vehicleInfo?.capacity || ""}
                      error={errors.vehicleCapacity?.message}
                      {...register("vehicleCapacity", {
                        required: t("profile.capacityRequired"),
                        min: { value: 0.1, message: t("profile.capacityMin") },
                      })}
                    />
                  </div>
                  <Input
                    label={t("profile.licensePlate")}
                    defaultValue={user?.vehicleInfo?.licensePlate || ""}
                    error={errors.vehicleLicensePlate?.message}
                    {...register("vehicleLicensePlate", {
                      required: t("profile.licensePlateRequired"),
                    })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t("profile.dimensionsOptional")}</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder={t("profile.length")}
                        type="number"
                        step="0.1"
                        defaultValue={user?.vehicleInfo?.dimensions?.length || ""}
                        error={errors.vehicleLength?.message}
                        {...register("vehicleLength")}
                      />
                      <Input
                        placeholder={t("profile.width")}
                        type="number"
                        step="0.1"
                        defaultValue={user?.vehicleInfo?.dimensions?.width || ""}
                        error={errors.vehicleWidth?.message}
                        {...register("vehicleWidth")}
                      />
                      <Input
                        placeholder={t("profile.height")}
                        type="number"
                        step="0.1"
                        defaultValue={user?.vehicleInfo?.dimensions?.height || ""}
                        error={errors.vehicleHeight?.message}
                        {...register("vehicleHeight")}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      loading={isLoading}
                      size="small"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {t("common.save")}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      size="small"
                    >
                      <X className="w-4 h-4 mr-2" />
                      {t("common.cancel")}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("profile.vehicleType")}</p>
                    <p className="font-medium text-foreground capitalize">
                      {user?.vehicleInfo?.type || t("profile.notSet")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("dashboard.capacity")}</p>
                    <p className="font-medium text-foreground">
                      {user?.vehicleInfo?.capacity ? `${user.vehicleInfo.capacity} kg` : t("profile.notSet")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("profile.licensePlate")}</p>
                    <p className="font-medium text-foreground">
                      {user?.vehicleInfo?.licensePlate || t("profile.notSet")}
                    </p>
                  </div>
                  {user?.vehicleInfo?.dimensions && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t("trips.dimensions")}</p>
                      <p className="font-medium text-foreground">
                        {user.vehicleInfo.dimensions.length} × {user.vehicleInfo.dimensions.width} ×{" "}
                        {user.vehicleInfo.dimensions.height} cm
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}

          {/* Document verification (drivers only) */}
          {user?.role === "conducteur" && (
            <Card className="p-4 sm:p-5 md:p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Document verification
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your license, insurance, or registration. Admin will review and approve or reject with a reason.
              </p>
              <div className="space-y-4">
                <form
                  className="flex flex-wrap items-end gap-3 p-3 rounded-xl border border-border bg-muted/20"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!docUploadFile) {
                      toast.error("Select a file")
                      return
                    }
                    docUploadMutation.mutate()
                  }}
                >
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
                    <select
                      className="input-field min-w-[140px]"
                      value={docUploadType}
                      onChange={(e) => setDocUploadType(e.target.value)}
                    >
                      <option value="license">License</option>
                      <option value="insurance">Insurance</option>
                      <option value="registration">Registration</option>
                      <option value="id_card">ID card</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">File (image or PDF)</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="block w-full text-sm text-muted-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-primary file:text-white file:text-sm"
                      onChange={(e) => setDocUploadFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button type="submit" size="small" loading={docUploadMutation.isPending} disabled={!docUploadFile}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </form>
                <ul className="space-y-2">
                  {documents.length === 0 && (
                    <p className="text-sm text-muted-foreground py-2">No documents uploaded yet.</p>
                  )}
                  {documents.map((doc) => (
                    <li
                      key={doc._id}
                      className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg border border-border bg-card"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium text-foreground capitalize">{doc.type.replace("_", " ")}</span>
                        <span
                          className={clsx(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
                            doc.status === "approved" && "bg-success/10 text-success",
                            doc.status === "rejected" && "bg-destructive/10 text-destructive",
                            doc.status === "pending" && "bg-warning/10 text-warning"
                          )}
                        >
                          {doc.status === "approved" && <CheckCircle className="w-3 h-3" />}
                          {doc.status === "rejected" && <XCircle className="w-3 h-3" />}
                          {doc.status === "pending" && <Clock className="w-3 h-3" />}
                          {doc.status}
                        </span>
                      </div>
                      {doc.status === "rejected" && doc.rejectionReason && (
                        <p className="text-xs text-destructive mt-1 w-full">Reason: {doc.rejectionReason}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewDocumentFile(doc)}
                          className="text-sm text-primary hover:underline bg-transparent border-0 cursor-pointer p-0 font-inherit"
                        >
                          View
                        </button>
                        {doc.status === "pending" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="small"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => docDeleteMutation.mutate(doc._id)}
                            disabled={docDeleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          )}

          {/* Role Selection */}
          {user?.role !== "admin" && (
            <Card className="p-4 sm:p-5 md:p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary" />
                {t("profile.switchRole")}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t("profile.switchRoleDescription")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={clsx(
                      "p-4 cursor-pointer transition-all border-2",
                      user?.role === "expediteur"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    )}
                    onClick={() => handleRoleChange("expediteur")}
                  >
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        "p-3 rounded-lg",
                        user?.role === "expediteur" ? "bg-primary/10" : "bg-accent"
                      )}>
                        <Package className={clsx(
                          "w-6 h-6",
                          user?.role === "expediteur" ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{t("profile.shipperMode")}</h4>
                        <p className="text-xs text-muted-foreground">{t("profile.shipperModeDesc")}</p>
                      </div>
                      {user?.role === "expediteur" && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </Card>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={clsx(
                      "p-4 cursor-pointer transition-all border-2",
                      user?.role === "conducteur"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    )}
                    onClick={() => handleRoleChange("conducteur")}
                  >
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        "p-3 rounded-lg",
                        user?.role === "conducteur" ? "bg-primary/10" : "bg-accent"
                      )}>
                        <Truck className={clsx(
                          "w-6 h-6",
                          user?.role === "conducteur" ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{t("profile.driverMode")}</h4>
                        <p className="text-xs text-muted-foreground">{t("profile.driverModeDesc")}</p>
                      </div>
                      {user?.role === "conducteur" && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </div>
            </Card>
          )}

          {/* Account Status */}
          <Card className="p-4 sm:p-5 md:p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              {t("profile.accountStatus")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{t("profile.verificationStatus")}</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.isVerified ? t("profile.accountVerified") : t("profile.accountPendingVerification")}
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
                  {user?.isVerified ? t("profile.verified") : t("status.pending")}
                </div>
              </div>
              {user?.lastLogin && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-medium text-foreground">{t("profile.lastLogin")}</p>
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
