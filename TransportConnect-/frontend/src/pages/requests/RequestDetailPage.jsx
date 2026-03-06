import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Truck,
  Calendar,
  Weight,
  Ruler,
  Euro,
  User,
  Phone,
  Mail,
  Navigation,
  Star,
} from "../../utils/icons"
import { requestsAPI } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import { useLocale } from "../../contexts/LocaleContext"
import { useTranslation } from "../../i18n/useTranslation"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Skeleton from "../../components/ui/Skeleton"
import ShipmentTrackingMap from "../../components/ShipmentTrackingMap"
import ConfirmationDialog from "../../components/ui/ConfirmationDialog"
import InputDialog from "../../components/ui/InputDialog"
import DeliveryConfirmModal from "../../components/ui/DeliveryConfirmModal"
import RatingDialog from "../../components/ui/RatingDialog"
import toast from "react-hot-toast"
import { normalizeAvatarUrl } from "../../utils/avatar"
import { API_BASE_URL } from "../../config/constants"
import clsx from "clsx"

const getPodImageUrl = (path) => {
  if (!path) return null
  const base = API_BASE_URL.replace(/\/api\/?$/, "")
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`
}

const RequestDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { t } = useTranslation()
  const { formatCurrency } = useLocale()
  const [cancelDialog, setCancelDialog] = useState(false)
  const [pickupDialog, setPickupDialog] = useState(false)
  const [deliveryDialog, setDeliveryDialog] = useState(false)
  const [acceptDialog, setAcceptDialog] = useState(false)
  const [rejectDialog, setRejectDialog] = useState(false)
  const [deliverySignatureDialog, setDeliverySignatureDialog] = useState(false)
  const [ratingDialog, setRatingDialog] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [scrollActive, setScrollActive] = useState(false)

  const { data: requestData, isLoading } = useQuery({
    queryKey: ["request", id],
    queryFn: () => requestsAPI.getRequestById(id),
    enabled: !!id,
  })

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

  const acceptRequestMutation = useMutation({
    mutationFn: ({ id, message }) => requestsAPI.acceptRequest(id, message),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["request", id] })
      await queryClient.invalidateQueries({ queryKey: ["requests"], exact: false })
      await queryClient.invalidateQueries({ queryKey: ["user-requests"], exact: false })
      await queryClient.refetchQueries({ queryKey: ["request", id] })
      await queryClient.refetchQueries({ queryKey: ["requests"], exact: false })
      toast.success("Request accepted successfully")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error accepting request")
    },
  })

  const rejectRequestMutation = useMutation({
    mutationFn: ({ id, message }) => requestsAPI.rejectRequest(id, message),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["request", id] })
      await queryClient.invalidateQueries({ queryKey: ["requests"], exact: false })
      await queryClient.invalidateQueries({ queryKey: ["user-requests"], exact: false })
      await queryClient.refetchQueries({ queryKey: ["request", id] })
      await queryClient.refetchQueries({ queryKey: ["requests"], exact: false })
      toast.success("Request rejected")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error rejecting request")
    },
  })

  const cancelRequestMutation = useMutation({
    mutationFn: requestsAPI.cancelRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["request", id] })
      await queryClient.invalidateQueries({ queryKey: ["requests"], exact: false })
      await queryClient.invalidateQueries({ queryKey: ["user-requests"], exact: false })
      await queryClient.refetchQueries({ queryKey: ["request", id] })
      await queryClient.refetchQueries({ queryKey: ["requests"], exact: false })
      toast.success("Request cancelled")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error cancelling request")
    },
  })

  const confirmPickupMutation = useMutation({
    mutationFn: requestsAPI.confirmPickup,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["request", id] })
      await queryClient.invalidateQueries({ queryKey: ["requests"], exact: false })
      await queryClient.invalidateQueries({ queryKey: ["user-requests"], exact: false })
      await queryClient.refetchQueries({ queryKey: ["request", id] })
      await queryClient.refetchQueries({ queryKey: ["requests"], exact: false })
      toast.success("Pickup confirmed")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error confirming pickup")
    },
  })

  const confirmDeliveryMutation = useMutation({
    mutationFn: ({ id, signature, podNotes, podPhoto }) =>
      requestsAPI.confirmDelivery(id, { signature, podNotes, podPhoto }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["request", id] })
      await queryClient.invalidateQueries({ queryKey: ["requests"], exact: false })
      await queryClient.invalidateQueries({ queryKey: ["user-requests"], exact: false })
      await queryClient.refetchQueries({ queryKey: ["request", id] })
      await queryClient.refetchQueries({ queryKey: ["requests"], exact: false })
      toast.success("Delivery confirmed")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error confirming delivery")
    },
  })

  const submitRatingMutation = useMutation({
    mutationFn: ({ id, rating, comment }) => requestsAPI.submitRating(id, rating, comment),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["request", id] })
      await queryClient.invalidateQueries({ queryKey: ["requests"], exact: false })
      await queryClient.invalidateQueries({ queryKey: ["user-requests"], exact: false })
      await queryClient.refetchQueries({ queryKey: ["request", id] })
      setRatingDialog(false)
      toast.success("Rating submitted successfully")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error submitting rating")
    },
  })

  const handleAcceptRequest = () => {
    setAcceptDialog(true)
  }

  const handleConfirmAccept = (message) => {
    acceptRequestMutation.mutate({ id, message: message || "" })
    setAcceptDialog(false)
  }

  const handleRejectRequest = () => {
    setRejectDialog(true)
  }

  const handleConfirmReject = (message) => {
    rejectRequestMutation.mutate({ id, message: message || "" })
    setRejectDialog(false)
  }

  const handleCancelRequest = () => {
    setCancelDialog(true)
  }

  const handleConfirmCancel = () => {
    cancelRequestMutation.mutate(id)
    setCancelDialog(false)
  }

  const handleConfirmPickup = () => {
    setPickupDialog(true)
  }

  const handleConfirmPickupAction = () => {
    confirmPickupMutation.mutate(id)
    setPickupDialog(false)
  }

  const handleConfirmDelivery = () => {
    setDeliverySignatureDialog(true)
  }

  const handleConfirmDeliveryWithPOD = (payload) => {
    confirmDeliveryMutation.mutate({
      id,
      signature: payload?.signature ?? "",
      podNotes: payload?.podNotes ?? "",
      podPhoto: payload?.podPhoto,
    })
    setDeliverySignatureDialog(false)
  }

  const handleOpenRatingDialog = () => {
    setRatingDialog(true)
  }

  const handleSubmitRating = ({ rating, comment }) => {
    submitRatingMutation.mutate({ id, rating, comment })
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-3 py-4 sm:px-4 md:px-5 lg:px-6 space-y-4 sm:space-y-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card className="p-4 sm:p-5 md:p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton variant="text" lines={4} />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </Card>
        <Card className="p-4 sm:p-5 md:p-6 space-y-4">
          <Skeleton className="h-5 w-56" />
          <Skeleton variant="text" lines={3} />
        </Card>
      </div>
    )
  }

  if (!requestData?.data?.request) {
    return (
      <div className="w-full max-w-7xl mx-auto px-3 py-6 sm:px-4 md:px-6 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Request not found</h1>
        <Button onClick={() => navigate("/requests")}>Back to Requests</Button>
      </div>
    )
  }

  const request = requestData.data.request
  const userId = user?._id || user?.id
  const driverId = request.trip?.driver?._id || request.trip?.driver?.id
  const senderId = request.sender?._id || request.sender?.id
  
  const isDriver = user?.role === "conducteur" && userId && driverId && userId.toString() === driverId.toString()
  const isSender = userId && senderId && userId.toString() === senderId.toString()
  
  // Check if user can rate (request is delivered and user hasn't rated yet)
  const canRateAsDriver = isDriver && request.status === "delivered" && !request.ratings?.driverRating?.rating
  const canRateAsSender = isSender && request.status === "delivered" && !request.ratings?.senderRating?.rating
  const hasRatedAsDriver = isDriver && request.ratings?.driverRating?.rating
  const hasRatedAsSender = isSender && request.ratings?.senderRating?.rating
  
  // Check if the other party has rated (to display their rating)
  const senderHasRated = request.ratings?.senderRating?.rating // Driver sees this
  const driverHasRated = request.ratings?.driverRating?.rating // Sender sees this

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-warning" />
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-success" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-destructive" />
      case "in_transit":
        return <Truck className="w-5 h-5 text-info" />
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-success" />
      case "cancelled":
        return <XCircle className="w-5 h-5 text-destructive" />
      default:
        return <Package className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "accepted":
        return "Accepted"
      case "rejected":
        return "Rejected"
      case "in_transit":
        return "In Transit"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const getStatusColor = (status) => {
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
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const showStickyCta = (isDriver || isSender) && request.status !== "pending" && request.status !== "rejected" && request.status !== "cancelled"
  const showFloatingCta = scrollY > 120 && scrollActive

  return (
    <>
    <div
      className={clsx(
        "min-h-screen",
        showStickyCta ? "pb-20 sm:pb-[max(1rem,env(safe-area-inset-bottom))]" : "pb-[max(1rem,env(safe-area-inset-bottom))]"
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-3 py-4 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-6 space-y-3 sm:space-y-4 md:space-y-5">
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
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">Request Details</h1>
              <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
                {new Date(request.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
              </p>
            </div>
          </div>
          <div
            className={clsx(
              "flex items-center justify-center gap-2 px-3 py-2 rounded-lg border font-semibold text-sm w-full sm:w-auto sm:flex-shrink-0 min-h-[44px] sm:min-h-0",
              getStatusColor(request.status)
            )}
          >
            {getStatusIcon(request.status)}
            <span>{getStatusLabel(request.status)}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Cargo Information */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground sm:text-lg md:text-xl">Package</h2>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">Description</h3>
                    <p className="text-foreground text-sm sm:text-base break-words">{request.cargo?.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-accent/50 rounded-xl border border-border/50 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <Package className="w-4 h-4 text-muted-foreground shrink-0" />
                        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Type</h3>
                      </div>
                      <p className="text-foreground font-semibold text-sm sm:text-base capitalize">{request.cargo?.type ?? "—"}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-accent/50 rounded-xl border border-border/50 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <Weight className="w-4 h-4 text-muted-foreground shrink-0" />
                        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Weight</h3>
                      </div>
                      <p className="text-foreground font-semibold text-sm sm:text-base">{request.cargo?.weight ?? "—"} kg</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-accent/50 rounded-xl border border-border/50 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <Ruler className="w-4 h-4 text-muted-foreground shrink-0" />
                        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Dimensions</h3>
                      </div>
                      <p className="text-foreground font-semibold text-xs sm:text-sm break-words">
                        {request.cargo?.dimensions
                          ? `${request.cargo.dimensions.length} × ${request.cargo.dimensions.width} × ${request.cargo.dimensions.height} cm`
                          : "—"}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-primary/10 rounded-xl border border-primary/20 min-w-0 sm:col-span-2 md:col-span-1">
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <Euro className="w-4 h-4 text-primary shrink-0" />
                        <h3 className="text-xs sm:text-sm font-medium text-primary truncate">Price</h3>
                      </div>
                      <p className="text-primary font-bold text-lg truncate">{request.price != null ? formatCurrency(request.price) : "—"}</p>
                    </div>
                  </div>

                  {request.cargo?.value && (
                    <div className="p-3 sm:p-4 bg-accent/50 rounded-xl border border-border/50">
                      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Declared Value</h3>
                      <p className="text-foreground font-semibold">{formatCurrency(request.cargo.value)}</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

          {/* Addresses */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-3 sm:p-4 md:p-5 lg:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h2 className="text-base font-semibold text-foreground sm:text-lg md:text-xl">Addresses</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
                <div className="p-3 sm:p-4 bg-accent/50 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Navigation className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">Pickup</h3>
                  </div>
                  <p className="text-foreground text-sm sm:text-base mb-0.5 break-words">{request.pickup?.address}</p>
                  <p className="text-muted-foreground text-xs sm:text-sm">{request.pickup?.city}</p>
                  {request.pickup?.contactPerson?.name && (
                    <div className="mt-2.5 pt-2.5 sm:mt-3 sm:pt-3 border-t border-border">
                      <div className="flex items-center gap-2 mb-0.5 text-xs sm:text-sm">
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-foreground truncate">{request.pickup.contactPerson.name}</span>
                      </div>
                      {request.pickup.contactPerson.phone && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground truncate">
                          <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          <span className="truncate">{request.pickup.contactPerson.phone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

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
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">Delivery</h3>
                  </div>
                  <p className="text-foreground text-sm sm:text-base mb-0.5 break-words">{request.delivery?.address}</p>
                  <p className="text-muted-foreground text-xs sm:text-sm">{request.delivery?.city}</p>
                  {request.delivery?.contactPerson?.name && (
                    <div className="mt-2.5 pt-2.5 sm:mt-3 sm:pt-3 border-t border-border">
                      <div className="flex items-center gap-2 mb-0.5 text-xs sm:text-sm">
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-foreground truncate">{request.delivery.contactPerson.name}</span>
                      </div>
                      {request.delivery.contactPerson.phone && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground truncate">
                          <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          <span className="truncate">{request.delivery.contactPerson.phone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Trip Information */}
          {request.trip && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                    <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground sm:text-lg md:text-xl">Trip</h2>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Navigation className="w-5 h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">Route</p>
                      <p className="text-foreground font-semibold text-sm sm:text-base truncate">
                        {request.trip.departure?.city} → {request.trip.destination?.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    <Calendar className="w-5 h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">Departure</p>
                      <p className="text-foreground font-semibold text-sm sm:text-base">
                        {new Date(request.trip.departureDate).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    <Calendar className="w-5 h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">Arrival</p>
                      <p className="text-foreground font-semibold text-sm sm:text-base">
                        {new Date(request.trip.arrivalDate).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                  {request.trip._id && (
                    <Link
                      to={`/trips/${request.trip._id}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mt-2"
                    >
                      View trip details
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Link>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Shipper: live map + message/call */}
          {isSender &&
            request.trip &&
            (request.status === "accepted" || request.status === "in_transit") && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
                <Card className="p-3 sm:p-4 md:p-5 overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                    <h2 className="text-base font-semibold text-foreground sm:text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary shrink-0" />
                      Où est le chauffeur ?
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="small"
                        className="min-h-[40px]"
                        onClick={() => navigate(`/conversations/${request._id}`)}
                      >
                        <MessageCircle className="w-4 h-4 mr-1.5 sm:mr-2" />
                        Message
                      </Button>
                      {request.trip?.driver?.phone && (
                        <a href={`tel:${request.trip.driver.phone}`} className="inline-flex">
                          <Button variant="outline" size="small" className="min-h-[40px] w-full">
                            <Phone className="w-4 h-4 mr-1.5 sm:mr-2" />
                            Appeler
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-border min-h-[50vh] sm:min-h-[320px] h-[50vh] sm:h-[340px]">
                    <ShipmentTrackingMap
                      departure={request.trip.departure || { city: request.pickup?.city, address: request.pickup?.address }}
                      destination={request.trip.destination || { city: request.delivery?.city, address: request.delivery?.address }}
                      departureDate={request.trip.departureDate}
                      arrivalDate={request.trip.arrivalDate}
                      fromLabel={request.trip.departure?.city || request.pickup?.city || "Départ"}
                      toLabel={request.trip.destination?.city || request.delivery?.city || "Arrivée"}
                      height="100%"
                      className="w-full h-full"
                      showRouteStrip
                      cameraFollow={false}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Position du chauffeur en temps réel · Utilisez Message ou Appeler pour le contacter
                  </p>
                </Card>
              </motion.div>
            )}

          {/* Messages */}
          {(request.message || request.driverResponse?.message) && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground sm:text-lg md:text-xl">Messages</h2>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {request.message && (
                    <div className="p-3 sm:p-4 bg-accent/50 rounded-xl border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-primary" />
                        <h3 className="font-medium text-foreground">From Sender</h3>
                      </div>
                      <p className="text-muted-foreground text-sm sm:text-base break-words">{request.message}</p>
                    </div>
                  )}
                  {request.driverResponse?.message && (
                    <div
                      className={clsx(
                        "p-3 sm:p-4 rounded-xl border",
                        request.status === "rejected"
                          ? "bg-destructive/5 border-destructive/20"
                          : request.status === "accepted"
                          ? "bg-success/5 border-success/20"
                          : "bg-accent border-border"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Truck
                          className={clsx(
                            "w-4 h-4",
                            request.status === "rejected"
                              ? "text-destructive"
                              : request.status === "accepted"
                              ? "text-success"
                              : "text-primary"
                          )}
                        />
                        <h3 className="font-medium text-foreground">
                          From Driver
                          {request.status === "accepted" && (
                            <span className="ml-2 text-xs font-normal text-success">(Accepted)</span>
                          )}
                          {request.status === "rejected" && (
                            <span className="ml-2 text-xs font-normal text-destructive">(Rejected)</span>
                          )}
                        </h3>
                      </div>
                      <p className="text-foreground text-sm sm:text-base mb-2 break-words">{request.driverResponse.message}</p>
                      {request.driverResponse.respondedAt && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.driverResponse.respondedAt).toLocaleString("en-US", {
                            dateStyle: "long",
                            timeStyle: "short",
                          })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Tracking */}
          {request.status !== "pending" &&
            request.status !== "rejected" &&
            request.status !== "cancelled" &&
            request.tracking && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card className="p-3 sm:p-4 md:p-5 lg:p-6">
                  <h2 className="text-base font-semibold text-foreground mb-4 sm:mb-5 sm:text-lg">Tracking</h2>
                  <div className="space-y-3 sm:space-y-4">
                    <div
                      className={clsx(
                        "flex items-center gap-3 p-3 sm:p-4 rounded-xl",
                        request.tracking?.pickupConfirmed?.confirmed
                          ? "bg-success/10 border border-success/20"
                          : "bg-accent"
                      )}
                    >
                      <CheckCircle
                        className={clsx(
                          "w-5 h-5",
                          request.tracking?.pickupConfirmed?.confirmed ? "text-success" : "text-muted-foreground"
                        )}
                      />
                      <div className="flex-1">
                        <span className="font-medium text-foreground">Pickup Confirmed</span>
                        {request.tracking?.pickupConfirmed?.confirmedAt && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.tracking.pickupConfirmed.confirmedAt).toLocaleString("en-US", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={clsx(
                        "flex items-center gap-3 p-3 sm:p-4 rounded-xl",
                        request.tracking?.inTransit?.confirmed
                          ? "bg-info/10 border border-info/20"
                          : "bg-accent"
                      )}
                    >
                      <Truck
                        className={clsx(
                          "w-5 h-5",
                          request.tracking?.inTransit?.confirmed ? "text-info" : "text-muted-foreground"
                        )}
                      />
                      <div className="flex-1">
                        <span className="font-medium text-foreground">In Transit</span>
                        {request.tracking?.inTransit?.confirmedAt && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.tracking.inTransit.confirmedAt).toLocaleString("en-US", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={clsx(
                        "flex items-center gap-3 p-3 sm:p-4 rounded-xl",
                        request.tracking?.delivered?.confirmed
                          ? "bg-success/10 border border-success/20"
                          : "bg-accent"
                      )}
                    >
                      <CheckCircle
                        className={clsx(
                          "w-5 h-5",
                          request.tracking?.delivered?.confirmed ? "text-success" : "text-muted-foreground"
                        )}
                      />
                      <div className="flex-1">
                        <span className="font-medium text-foreground">Delivery Confirmed</span>
                        {request.tracking?.delivered?.confirmedAt && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.tracking.delivered.confirmedAt).toLocaleString("en-US", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Proof of delivery — photo, signature, notes */}
                    {request.tracking?.delivered?.confirmed &&
                      (request.tracking.delivered.podPhotoUrl ||
                        request.tracking.delivered.signature ||
                        request.tracking.delivered.podNotes) && (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">Proof of delivery</h4>
                        {request.tracking.delivered.podPhotoUrl && (
                          <div className="rounded-xl overflow-hidden border border-border bg-muted/30">
                            <img
                              src={`${API_BASE_URL.replace(/\/api\/?$/, "")}${request.tracking.delivered.podPhotoUrl}`}
                              alt="Delivery proof"
                              className="w-full max-h-64 object-contain bg-muted/20"
                            />
                          </div>
                        )}
                        {request.tracking.delivered.signature && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Signature: </span>
                            {request.tracking.delivered.signature}
                          </p>
                        )}
                        {request.tracking.delivered.podNotes && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Notes: </span>
                            {request.tracking.delivered.podNotes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* User Info */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-3 sm:p-4 md:p-5 lg:p-6">
              <h2 className="text-base font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2 sm:text-lg">
                <User className="w-5 h-5 text-primary shrink-0" />
                {isDriver ? "Shipper" : "Driver"}
              </h2>

              {isDriver ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-center sm:text-center sm:gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center overflow-hidden shrink-0">
                      {request.sender?.avatar ? (
                        <img
                          src={normalizeAvatarUrl(request.sender.avatar)}
                          alt={`${request.sender.firstName} ${request.sender.lastName}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none"
                            const parent = e.target.parentElement
                            if (parent && !parent.querySelector("span")) {
                              const initials = document.createElement("span")
                              initials.className = "text-white text-lg sm:text-xl font-bold"
                              initials.textContent = request.sender?.firstName?.charAt(0) || "?"
                              parent.appendChild(initials)
                            }
                          }}
                        />
                      ) : (
                        <span className="text-white text-lg sm:text-xl font-bold">
                          {request.sender?.firstName?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 sm:flex-none">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                        {request.sender?.firstName} {request.sender?.lastName}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Shipper</p>
                      {request.sender?.email && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1 truncate sm:justify-center">
                          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          <span className="truncate">{request.sender.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Show rating received from sender (if they rated the driver) */}
                  {senderHasRated && (
                    <div className="p-3 bg-info/10 border border-info/20 rounded-lg mt-4">
                      <div className="flex items-center gap-2 text-info mb-2">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-medium">Rating from Shipper</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= request.ratings.senderRating.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                        <span className="text-sm font-medium text-foreground ml-2">
                          {request.ratings.senderRating.rating}/5
                        </span>
                      </div>
                      {request.ratings.senderRating.comment && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          "{request.ratings.senderRating.comment}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-center sm:text-center sm:gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center overflow-hidden shrink-0">
                      {request.trip?.driver?.avatar ? (
                        <img
                          src={normalizeAvatarUrl(request.trip.driver.avatar)}
                          alt={`${request.trip.driver.firstName} ${request.trip.driver.lastName}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none"
                            const parent = e.target.parentElement
                            if (parent && !parent.querySelector("span")) {
                              const initials = document.createElement("span")
                              initials.className = "text-white text-lg sm:text-xl font-bold"
                              initials.textContent = request.trip?.driver?.firstName?.charAt(0) || "?"
                              parent.appendChild(initials)
                            }
                          }}
                        />
                      ) : (
                        <span className="text-white text-lg sm:text-xl font-bold">
                          {request.trip?.driver?.firstName?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 sm:flex-none">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                        {request.trip?.driver?.firstName} {request.trip?.driver?.lastName}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Driver</p>
                      {request.trip?.driver?.email && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1 truncate sm:justify-center">
                          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          <span className="truncate">{request.trip.driver.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Show rating received from driver (if they rated the sender) */}
                  {driverHasRated && (
                    <div className="p-3 bg-info/10 border border-info/20 rounded-lg mt-4">
                      <div className="flex items-center gap-2 text-info mb-2">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-medium">Rating from Driver</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= request.ratings.driverRating.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                        <span className="text-sm font-medium text-foreground ml-2">
                          {request.ratings.driverRating.rating}/5
                        </span>
                      </div>
                      {request.ratings.driverRating.comment && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          "{request.ratings.driverRating.comment}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-3 sm:p-4 md:p-5 lg:p-6">
              <h2 className="text-base font-semibold text-foreground mb-3 sm:mb-4 sm:text-lg">Actions</h2>
              <div className="space-y-2.5 sm:space-y-3">
                {(isDriver || isSender) && (
                  <Button
                    variant="outline"
                    className="w-full min-h-[44px] sm:min-h-0 border-primary text-primary hover:bg-primary/10"
                    onClick={() => navigate(`/conversations/${request._id}`)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {request.status === "delivered" ? "View conversation" : "Open conversation"}
                  </Button>
                )}
                {isDriver && request.status === "pending" && (
                  <>
                    <Button
                      className="w-full min-h-[44px] sm:min-h-0 bg-gradient-to-r from-success to-success/90"
                      onClick={handleAcceptRequest}
                      loading={acceptRequestMutation.isLoading}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Request
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full min-h-[44px] sm:min-h-0"
                      onClick={handleRejectRequest}
                      loading={rejectRequestMutation.isLoading}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Request
                    </Button>
                  </>
                )}

                {isDriver && request.status === "accepted" && (
                  <Button
                    className="w-full min-h-[44px] sm:min-h-0 bg-gradient-to-r from-info to-info/90"
                    onClick={handleConfirmPickup}
                    loading={confirmPickupMutation.isLoading}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Confirm Pickup
                  </Button>
                )}

                {isDriver && request.status === "in_transit" && (
                  <Button
                    className="w-full min-h-[44px] sm:min-h-0 bg-gradient-to-r from-success to-success/90"
                    onClick={handleConfirmDelivery}
                    loading={confirmDeliveryMutation.isLoading}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Delivery
                  </Button>
                )}

                {isSender && (request.status === "pending" || request.status === "accepted") && (
                  <Button
                    variant="outline"
                    className="w-full min-h-[44px] sm:min-h-0 border-destructive text-destructive hover:bg-destructive/10"
                    onClick={handleCancelRequest}
                    loading={cancelRequestMutation.isLoading}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Request
                  </Button>
                )}

                {isSender &&
                  (request.status === "rejected" || request.status === "cancelled") &&
                  request.trip?._id && (
                    <Button
                      variant="outline"
                      className="w-full min-h-[44px] sm:min-h-0"
                      onClick={() => navigate(`/requests/create/${request.trip._id}`)}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Create New Request
                    </Button>
                  )}

                {/* Rating Section - Show when delivered */}
                {request.status === "delivered" && (
                  <div className="mt-4">
                    {canRateAsDriver && (
                      <Card className="p-4 border-2 border-warning/30 bg-warning/5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-warning/10 rounded-lg">
                            <Star className="w-5 h-5 text-warning fill-warning" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm">Rate Your Experience</h4>
                            <p className="text-xs text-muted-foreground">Share your feedback about this shipper</p>
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={handleOpenRatingDialog}
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Rate Shipper
                        </Button>
                      </Card>
                    )}
                    {canRateAsSender && (
                      <Card className="p-4 border-2 border-warning/30 bg-warning/5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-warning/10 rounded-lg">
                            <Star className="w-5 h-5 text-warning fill-warning" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm">Rate Your Experience</h4>
                            <p className="text-xs text-muted-foreground">Share your feedback about this driver</p>
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={handleOpenRatingDialog}
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Rate Driver
                        </Button>
                      </Card>
                    )}
                    {hasRatedAsDriver && (
                      <Card className="p-4 border-2 border-success/30 bg-success/5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-success/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-success fill-success" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm">Rating Submitted</h4>
                            <p className="text-xs text-muted-foreground">You've rated this shipper</p>
                          </div>
                        </div>
                        {request.ratings?.driverRating?.rating && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={clsx(
                                    "w-5 h-5 transition-colors",
                                    star <= request.ratings.driverRating.rating
                                      ? "text-warning fill-warning"
                                      : "text-muted-foreground/30"
                                  )}
                                />
                              ))}
                              <span className="text-sm font-medium text-foreground ml-2">
                                {request.ratings.driverRating.rating}/5
                              </span>
                            </div>
                            {request.ratings.driverRating.comment && (
                              <div className="p-3 bg-accent rounded-lg mt-2">
                                <p className="text-sm text-foreground italic">
                                  "{request.ratings.driverRating.comment}"
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    )}
                    {hasRatedAsSender && (
                      <Card className="p-4 border-2 border-success/30 bg-success/5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-success/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-success fill-success" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm">Rating Submitted</h4>
                            <p className="text-xs text-muted-foreground">You've rated this driver</p>
                          </div>
                        </div>
                        {request.ratings?.senderRating?.rating && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={clsx(
                                    "w-5 h-5 transition-colors",
                                    star <= request.ratings.senderRating.rating
                                      ? "text-warning fill-warning"
                                      : "text-muted-foreground/30"
                                  )}
                                />
                              ))}
                              <span className="text-sm font-medium text-foreground ml-2">
                                {request.ratings.senderRating.rating}/5
                              </span>
                            </div>
                            {request.ratings.senderRating.comment && (
                              <div className="p-3 bg-accent rounded-lg mt-2">
                                <p className="text-sm text-foreground italic">
                                  "{request.ratings.senderRating.comment}"
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

        {/* Mobile floating CTA: shows while scrolling, hides when scroll stops; slide + fade */}
        {showStickyCta && (
          <div
            className={clsx(
              "fixed bottom-0 left-0 right-0 z-40 flex justify-center p-3 pt-2 sm:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all duration-300 ease-out",
              showFloatingCta
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "opacity-0 translate-y-4 scale-95 pointer-events-none"
            )}
          >
            <Button
              className="min-h-[44px] px-5 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl active:scale-[0.98] transition-all border-none outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
              onClick={() => navigate(`/conversations/${request._id}`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        )}
      </div>
    </div>

    {/* Confirmation Dialogs */}
    <ConfirmationDialog
        isOpen={cancelDialog}
        onClose={() => setCancelDialog(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel this request?"
        message="This action cannot be undone. The request will be cancelled and removed from your list."
        confirmText="Cancel Request"
        cancelText="Keep Request"
        variant="danger"
        loading={cancelRequestMutation.isLoading}
      />

      <ConfirmationDialog
        isOpen={pickupDialog}
        onClose={() => setPickupDialog(false)}
        onConfirm={handleConfirmPickupAction}
        title="Confirm package pickup?"
        message="This will mark the package as picked up. Make sure you have received the package before confirming."
        confirmText="Confirm Pickup"
        cancelText="Cancel"
        variant="success"
        loading={confirmPickupMutation.isLoading}
      />

      <DeliveryConfirmModal
        isOpen={deliverySignatureDialog}
        onClose={() => setDeliverySignatureDialog(false)}
        onConfirm={handleConfirmDeliveryWithPOD}
        loading={confirmDeliveryMutation.isLoading}
        confirmText={t("request.confirmDelivery")}
        cancelText={t("common.cancel")}
      />

      <InputDialog
        isOpen={acceptDialog}
        onClose={() => setAcceptDialog(false)}
        onConfirm={handleConfirmAccept}
        title="Accept Request"
        message="Add an optional acceptance message"
        placeholder="Acceptance message (optional)"
        confirmText="Accept Request"
        cancelText="Cancel"
        variant="success"
        loading={acceptRequestMutation.isLoading}
        type="text"
      />

      <InputDialog
        isOpen={rejectDialog}
        onClose={() => setRejectDialog(false)}
        onConfirm={handleConfirmReject}
        title="Reject Request"
        message="Add an optional rejection reason"
        placeholder="Rejection reason (optional)"
        confirmText="Reject Request"
        cancelText="Cancel"
        variant="danger"
        loading={rejectRequestMutation.isLoading}
        type="text"
      />

      <RatingDialog
        isOpen={ratingDialog}
        onClose={() => setRatingDialog(false)}
        onConfirm={handleSubmitRating}
        title={canRateAsDriver ? "Rate Shipper" : canRateAsSender ? "Rate Driver" : "Rate Delivery"}
        message={
          canRateAsDriver
            ? "How would you rate your experience with this shipper?"
            : canRateAsSender
            ? "How would you rate your experience with this driver?"
            : "How would you rate this delivery?"
        }
        confirmText="Submit Rating"
        cancelText="Cancel"
        loading={submitRatingMutation.isLoading}
        existingRating={null}
      />
    </>
  )
}

export default RequestDetailPage
