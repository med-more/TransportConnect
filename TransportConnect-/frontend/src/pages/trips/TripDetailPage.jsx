import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Weight,
  Truck,
  Navigation,
  Package,
  User,
  Phone,
  Mail,
  Ruler,
  Euro,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
} from "../../utils/icons"
import { tripsAPI, requestsAPI } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import { useLocale } from "../../contexts/LocaleContext"
import { useTranslation } from "../../i18n/useTranslation"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Skeleton from "../../components/ui/Skeleton"
import ConfirmationDialog from "../../components/ui/ConfirmationDialog"
import toast from "react-hot-toast"
import Card from "../../components/ui/Card"
import { normalizeAvatarUrl } from "../../utils/avatar"
import clsx from "clsx"

const TripDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { t } = useTranslation()
  const { formatCurrency } = useLocale()
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [completeDialog, setCompleteDialog] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [scrollActive, setScrollActive] = useState(false)

  const { data: tripData, isLoading } = useQuery({
    queryKey: ["trip", id],
    queryFn: () => tripsAPI.getTripById(id),
  })

  // Check if user has an existing request for this trip
  const { data: userRequestsData } = useQuery({
    queryKey: ["user-requests", id],
    queryFn: () => requestsAPI.getRequests({ tripId: id }),
    enabled: !!user && !!id && user?.role !== "conducteur",
  })

  // Find existing request for this trip
  const existingRequest = userRequestsData?.data?.requests?.find(
    (req) => req.trip?._id === id || req.trip === id
  )

  // Check if existing request is in a blocking state (pending or accepted)
  const hasActiveRequest = existingRequest && ["pending", "accepted", "in_transit"].includes(existingRequest.status)

  const deleteTripMutation = useMutation({
    mutationFn: tripsAPI.deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries("trips")
      toast.success("Trip deleted successfully")
      navigate("/trips")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error deleting trip")
    },
  })

  const completeTripMutation = useMutation({
    mutationFn: tripsAPI.completeTrip,
    onSuccess: () => {
      queryClient.invalidateQueries(["trip", id])
      toast.success("Trip marked as completed")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error completing trip")
    },
  })

  const handleDeleteTrip = () => {
    setDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    deleteTripMutation.mutate(id)
    setDeleteDialog(false)
  }

  const handleCompleteTrip = () => {
    setCompleteDialog(true)
  }

  const handleConfirmComplete = () => {
    completeTripMutation.mutate(id)
    setCompleteDialog(false)
  }

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <Card className="p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton variant="text" lines={4} />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </Card>
        <Card className="p-6 space-y-4">
          <Skeleton className="h-5 w-56" />
          <Skeleton variant="text" lines={3} />
        </Card>
      </div>
    )
  }

  if (!tripData?.data?.trip) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Trip not found</h1>
        <Button onClick={() => navigate("/trips")}>Back to Trips</Button>
      </div>
    )
  }

  const trip = tripData.data.trip
  const isOwner = user?.id === trip.driver._id

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20"
      case "completed":
        return "bg-info/10 text-info border-info/20"
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-success" />
      case "completed":
        return <Clock className="w-5 h-5 text-info" />
      case "cancelled":
        return <XCircle className="w-5 h-5 text-destructive" />
      default:
        return <Truck className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Active"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const getRequestStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20"
      case "accepted":
        return "bg-success/10 text-success border-success/20"
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "in_transit":
        return "bg-info/10 text-info border-info/20"
      case "delivered":
        return "bg-success/10 text-success border-success/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const showStickyCta =
    user?.role !== "conducteur" && trip.status === "active" && (hasActiveRequest || !hasActiveRequest)

  useEffect(() => {
    let timeoutId = null
    const onScroll = () => {
      setScrollY(window.scrollY)
      setScrollActive(true)
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => setScrollActive(false), 1200)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])
  const showFloatingCta = scrollY > 120 && scrollActive

  return (
    <div className="min-h-screen pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex-shrink-0 min-h-[44px] min-w-[44px] sm:min-w-0 sm:min-h-0 p-2 sm:px-3"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-foreground truncate sm:text-xl md:text-2xl lg:text-3xl">
                {trip.departure?.city} → {trip.destination?.city}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1 sm:text-sm">
                {new Date(trip.departureDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
              </p>
            </div>
          </div>
          <div
            className={clsx(
              "flex items-center justify-center gap-2 px-3 py-2 rounded-lg border font-semibold text-sm w-full sm:w-auto sm:flex-shrink-0 min-h-[44px] sm:min-h-0",
              getStatusColor(trip.status)
            )}
          >
            {getStatusIcon(trip.status)}
            <span>{getStatusLabel(trip.status)}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Route Information */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                    <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground sm:text-lg md:text-xl">Route</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
                  <div className="p-3 sm:p-4 bg-accent/50 rounded-xl border border-border/50">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">Departure</h3>
                    </div>
                    <p className="text-foreground text-sm sm:text-base mb-0.5 break-words">{trip.departure?.address}</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">{trip.departure?.city}</p>
                    <div className="mt-2.5 pt-2.5 sm:mt-3 sm:pt-3 border-t border-border flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      {new Date(trip.departureDate).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>

                  {/* Route connector on mobile */}
                  <div className="flex items-center justify-center py-1 md:hidden" aria-hidden>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Navigation className="w-4 h-4 text-muted-foreground rotate-90" />
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 bg-accent/50 rounded-xl border border-border/50">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">Destination</h3>
                    </div>
                    <p className="text-foreground text-sm sm:text-base mb-0.5 break-words">{trip.destination?.address}</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">{trip.destination?.city}</p>
                    <div className="mt-2.5 pt-2.5 sm:mt-3 sm:pt-3 border-t border-border flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      {new Date(trip.arrivalDate).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Capacity and Pricing */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground sm:text-lg md:text-xl">Capacity & pricing</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-accent/50 rounded-xl border border-border/50 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <Weight className="w-4 h-4 text-muted-foreground shrink-0" />
                      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Weight</h3>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground truncate">{trip.availableCapacity?.weight ?? "—"} kg</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-accent/50 rounded-xl border border-border/50 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <Ruler className="w-4 h-4 text-muted-foreground shrink-0" />
                      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Dimensions</h3>
                    </div>
                    <p className="text-foreground font-semibold text-xs sm:text-sm break-words">
                      {trip.availableCapacity?.dimensions
                        ? `${trip.availableCapacity.dimensions.length} × ${trip.availableCapacity.dimensions.width} × ${trip.availableCapacity.dimensions.height} cm`
                        : "—"}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-primary/10 rounded-xl border border-primary/20 min-w-0 sm:col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <Euro className="w-4 h-4 text-primary shrink-0" />
                      <h3 className="text-xs sm:text-sm font-medium text-primary truncate">Price per kg</h3>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-primary truncate" title={formatCurrency(trip.pricePerKg || 0) + "/kg"}>
                      {formatCurrency(trip.pricePerKg || 0)}/kg
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Accepted Cargo Types */}
            {trip.acceptedCargoTypes && trip.acceptedCargoTypes.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <h2 className="text-base font-semibold text-foreground sm:text-lg">Cargo types</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trip.acceptedCargoTypes.map((type) => (
                      <span
                        key={type}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-accent rounded-lg text-xs sm:text-sm font-medium text-foreground"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Description */}
            {trip.description && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="p-4 sm:p-5 md:p-6">
                  <h2 className="text-base font-semibold text-foreground mb-3 sm:mb-4 sm:text-lg">Description</h2>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed break-words">{trip.description}</p>
                </Card>
              </motion.div>
            )}

            {/* Requests (for trip owner) */}
            {isOwner && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <Card className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <h2 className="text-base font-semibold text-foreground sm:text-lg">
                      Requests ({trip.requests?.length || 0})
                    </h2>
                  </div>
                  {trip.requests?.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {trip.requests.map((request) => (
                        <div
                          key={request._id}
                          className="p-3 sm:p-4 bg-accent/50 rounded-xl border border-border hover:border-primary/20 transition-colors"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2">
                                <User className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="font-medium text-foreground text-sm sm:text-base">
                                  {request.sender?.firstName} {request.sender?.lastName}
                                </span>
                                <span
                                  className={clsx(
                                    "px-2 py-0.5 rounded-md text-xs font-medium border",
                                    getRequestStatusColor(request.status)
                                  )}
                                >
                                  {request.status}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{request.cargo?.description}</p>
                              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                                <span className="text-muted-foreground">
                                  <Weight className="w-3 h-3 inline mr-1" />
                                  {request.cargo?.weight ?? "—"} kg
                                </span>
                                <span className="text-primary font-semibold">{formatCurrency(request.price)}</span>
                              </div>
                            </div>
                            <Link to={`/requests/${request._id}`} className="w-full sm:w-auto">
                              <Button variant="ghost" size="small" className="w-full sm:w-auto min-h-[44px] sm:min-h-0">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <Package className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-2 sm:mb-3 opacity-50" />
                      <p className="text-sm sm:text-base text-muted-foreground">No requests for this trip yet.</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Driver Card */}
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-4 sm:p-5 md:p-6">
                <h2 className="text-base font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2 sm:text-lg">
                  <User className="w-5 h-5 text-primary shrink-0" />
                  Driver
                </h2>
                <div className="flex flex-row items-center gap-4 sm:flex-col sm:text-center sm:gap-4">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center overflow-hidden shrink-0">
                    {trip.driver?.avatar ? (
                      <img
                        src={normalizeAvatarUrl(trip.driver.avatar)}
                        alt={`${trip.driver.firstName} ${trip.driver.lastName}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none"
                          const parent = e.target.parentElement
                          if (parent && !parent.querySelector("span")) {
                            const initials = document.createElement("span")
                            initials.className = "text-white text-lg sm:text-xl font-bold"
                            initials.textContent = `${trip.driver?.firstName?.charAt(0) || ""}${trip.driver?.lastName?.charAt(0) || ""}`
                            parent.appendChild(initials)
                          }
                        }}
                      />
                    ) : (
                      <span className="text-white text-lg sm:text-xl font-bold">
                        {trip.driver?.firstName?.charAt(0) || ""}{trip.driver?.lastName?.charAt(0) || ""}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 sm:flex-none">
                    <div className="font-semibold text-foreground text-sm sm:text-lg truncate">
                      {trip.driver?.firstName} {trip.driver?.lastName}
                    </div>
                    {trip.driver?.stats?.averageRating != null && (
                      <div className="flex items-center gap-1 mt-0.5 sm:justify-center sm:mb-1">
                        <Star className="w-4 h-4 text-warning fill-warning shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-foreground">
                          {Number(trip.driver.stats.averageRating).toFixed(1)}
                        </span>
                      </div>
                    )}
                    {trip.driver?.email && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span className="truncate">{trip.driver.email}</span>
                      </div>
                    )}
                    {trip.driver?.phone && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span className="truncate">{trip.driver.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Vehicle Info */}
            {trip.driver?.vehicleInfo && (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <Card className="p-4 sm:p-5 md:p-6">
                  <h2 className="text-base font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2 sm:text-lg">
                    <Truck className="w-5 h-5 text-primary shrink-0" />
                    Vehicle
                  </h2>
                  <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Type</p>
                      <p className="text-foreground font-semibold text-sm sm:text-base capitalize">
                        {trip.driver.vehicleInfo.type ?? "—"}
                      </p>
                    </div>
                    {trip.driver.vehicleInfo.capacity != null && (
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Capacity</p>
                        <p className="text-foreground font-semibold text-sm sm:text-base">{trip.driver.vehicleInfo.capacity} kg</p>
                      </div>
                    )}
                    {trip.driver.vehicleInfo.licensePlate && (
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">License</p>
                        <p className="text-foreground font-semibold text-sm sm:text-base">{trip.driver.vehicleInfo.licensePlate}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Actions (owner) */}
            {isOwner && trip.status === "active" && (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="p-4 sm:p-5 md:p-6">
                  <h2 className="text-base font-semibold text-foreground mb-3 sm:mb-4 sm:text-lg">Actions</h2>
                  <div className="space-y-2.5 sm:space-y-3">
                    <Button
                      className="w-full min-h-[44px] sm:min-h-0 bg-gradient-to-r from-success to-success/90"
                      onClick={handleCompleteTrip}
                      loading={completeTripMutation.isLoading}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark completed
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full min-h-[44px] sm:min-h-0 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={handleDeleteTrip}
                      loading={deleteTripMutation.isLoading}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Delete trip
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Create Request (shippers) - desktop */}
            {user?.role !== "conducteur" && trip.status === "active" && (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="hidden sm:block">
                {hasActiveRequest ? (
                  <Card className="p-4 sm:p-5 md:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="p-2 bg-warning/10 rounded-lg w-fit">
                        <Clock className="w-5 h-5 text-warning" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Request created</p>
                        <p className="text-xs text-muted-foreground">
                          You have a {existingRequest.status} request. View or wait for outcome.
                        </p>
                      </div>
                      <Link to={`/requests/${existingRequest._id}`} className="w-full sm:w-auto shrink-0">
                        <Button variant="outline" size="small" className="w-full sm:w-auto">
                          <Eye className="w-4 h-4 mr-2" />
                          View request
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ) : (
                  <Link to={`/requests/create/${trip._id}`} className="block">
                    <Button className="w-full min-h-[44px] sm:min-h-0 bg-gradient-to-r from-primary to-primary/90 shadow-lg">
                      <Package className="w-4 h-4 mr-2" />
                      Create request
                    </Button>
                  </Link>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile floating CTA (shippers only): shows while scrolling, hides when scroll stops; slide + fade */}
        {user?.role !== "conducteur" && trip.status === "active" && (
          <div
            className={clsx(
              "fixed bottom-0 left-0 right-0 z-40 flex justify-center p-3 pt-2 sm:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all duration-300 ease-out",
              showFloatingCta
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "opacity-0 translate-y-4 scale-95 pointer-events-none"
            )}
          >
            {hasActiveRequest ? (
              <Link to={`/requests/${existingRequest._id}`}>
                <Button className="min-h-[44px] px-5 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl active:scale-[0.98] transition-all border-none outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background">
                  <Eye className="w-4 h-4 mr-2" />
                  My request
                </Button>
              </Link>
            ) : (
              <Link to={`/requests/create/${trip._id}`}>
                <Button className="min-h-[44px] px-5 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl active:scale-[0.98] transition-all border-none outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background">
                  <Package className="w-4 h-4 mr-2" />
                  Request trip
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete this trip?"
        message="This action cannot be undone. All associated requests will also be cancelled."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteTripMutation.isLoading}
      />

      <ConfirmationDialog
        isOpen={completeDialog}
        onClose={() => setCompleteDialog(false)}
        onConfirm={handleConfirmComplete}
        title="Mark trip as completed?"
        message="This will mark the trip as completed. Make sure all deliveries are finished."
        confirmText="Mark as Completed"
        cancelText="Cancel"
        variant="success"
        loading={completeTripMutation.isLoading}
      />
    </div>
  )
}

export default TripDetailPage
