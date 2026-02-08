import { useState } from "react"
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
} from "lucide-react"
import { tripsAPI, requestsAPI } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
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
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [completeDialog, setCompleteDialog] = useState(false)

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
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
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

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
      >
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex-shrink-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground truncate">
              {trip.departure.city} → {trip.destination.city}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
              Departure: {new Date(trip.departureDate).toLocaleDateString("en-US", { dateStyle: "long" })}
            </p>
          </div>
        </div>

        <div
          className={clsx(
            "flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border font-semibold text-sm sm:text-base flex-shrink-0",
            getStatusColor(trip.status)
          )}
        >
          {getStatusIcon(trip.status)}
          <span>{getStatusLabel(trip.status)}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Navigation className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Route Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground">Departure</h3>
                  </div>
                  <p className="text-foreground mb-1">{trip.departure.address}</p>
                  <p className="text-muted-foreground">{trip.departure.city}</p>
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(trip.departureDate).toLocaleString("en-US", {
                          dateStyle: "long",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground">Destination</h3>
                  </div>
                  <p className="text-foreground mb-1">{trip.destination.address}</p>
                  <p className="text-muted-foreground">{trip.destination.city}</p>
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(trip.arrivalDate).toLocaleString("en-US", {
                          dateStyle: "long",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Capacity and Pricing */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Capacity & Pricing</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Weight className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">Available Weight</h3>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{trip.availableCapacity.weight} kg</p>
                </div>
                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">Dimensions</h3>
                  </div>
                  <p className="text-foreground font-semibold text-sm">
                    {trip.availableCapacity.dimensions.length} × {trip.availableCapacity.dimensions.width} ×{" "}
                    {trip.availableCapacity.dimensions.height} cm
                  </p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Euro className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium text-primary">Price per kg</h3>
                  </div>
                  <p className="text-2xl font-bold text-primary">{trip.pricePerKg}€/kg</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Accepted Cargo Types */}
          {trip.acceptedCargoTypes && trip.acceptedCargoTypes.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Accepted Cargo Types</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trip.acceptedCargoTypes.map((type) => (
                    <span
                      key={type}
                      className="px-4 py-2 bg-accent rounded-lg text-sm font-medium text-foreground"
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-4 sm:p-5 md:p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{trip.description}</p>
              </Card>
            </motion.div>
          )}

          {/* Requests (for trip owner) */}
          {isOwner && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Received Requests ({trip.requests?.length || 0})
                    </h2>
                  </div>
                </div>
                {trip.requests?.length > 0 ? (
                  <div className="space-y-4">
                    {trip.requests.map((request) => (
                      <div
                        key={request._id}
                        className="p-4 bg-accent rounded-lg border border-border hover:border-primary/20 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">
                                {request.sender.firstName} {request.sender.lastName}
                              </span>
                              <span
                                className={clsx(
                                  "px-2 py-1 rounded-md text-xs font-medium border",
                                  getRequestStatusColor(request.status)
                                )}
                              >
                                {request.status}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{request.cargo.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                <Weight className="w-3 h-3 inline mr-1" />
                                {request.cargo.weight}kg
                              </span>
                              <span className="text-primary font-semibold">{request.price}€</span>
                            </div>
                          </div>
                          <Link to={`/requests/${request._id}`}>
                            <Button variant="ghost" size="small">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No requests received for this trip yet.</p>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Driver Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-4 sm:p-5 md:p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Driver
              </h2>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                  {trip.driver?.avatar ? (
                    <img
                      src={trip.driver.avatar}
                      alt="Driver avatar"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {trip.driver?.firstName?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground mb-1">
                    {trip.driver?.firstName} {trip.driver?.lastName}
                  </div>
                  {trip.driver?.stats?.averageRating && (
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="text-sm font-medium text-foreground">
                        {trip.driver.stats.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {trip.driver?.email && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {trip.driver.email}
                    </div>
                  )}
                  {trip.driver?.phone && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {trip.driver.phone}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Vehicle Info */}
          {trip.driver?.vehicleInfo && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-4 sm:p-5 md:p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Vehicle
                </h2>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="text-foreground font-semibold">
                      {trip.driver.vehicleInfo.type 
                        ? trip.driver.vehicleInfo.type.charAt(0).toUpperCase() + trip.driver.vehicleInfo.type.slice(1)
                        : "N/A"}
                    </p>
                  </div>
                  {trip.driver.vehicleInfo.capacity && (
                    <div>
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="text-foreground font-semibold">{trip.driver.vehicleInfo.capacity} kg</p>
                    </div>
                  )}
                  {trip.driver.vehicleInfo.licensePlate && (
                    <div>
                      <p className="text-sm text-muted-foreground">License Plate</p>
                      <p className="text-foreground font-semibold">{trip.driver.vehicleInfo.licensePlate}</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Actions */}
          {isOwner && trip.status === "active" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-4 sm:p-5 md:p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Actions</h2>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-success to-success/90"
                    onClick={handleCompleteTrip}
                    loading={completeTripMutation.isLoading}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive/10"
                    onClick={handleDeleteTrip}
                    loading={deleteTripMutation.isLoading}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Delete Trip
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Create Request Button (for non-drivers) */}
          {user?.role !== "conducteur" && trip.status === "active" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              {hasActiveRequest ? (
                <Card className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <Clock className="w-5 h-5 text-warning" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Request Already Created</p>
                      <p className="text-xs text-muted-foreground">
                        You have a {existingRequest.status} request for this trip. Wait until it's cancelled or delivered.
                      </p>
                    </div>
                    <Link to={`/requests/${existingRequest._id}`}>
                      <Button variant="outline" size="small">
                        <Eye className="w-4 h-4 mr-2" />
                        View Request
                      </Button>
                    </Link>
                  </div>
                </Card>
              ) : (
                <Link to={`/requests/create/${trip._id}`} className="block">
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/90 shadow-lg">
                    <Package className="w-4 h-4 mr-2" />
                    Create Request
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </div>
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
