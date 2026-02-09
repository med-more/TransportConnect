import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import clsx from "clsx"
import { 
  Truck, 
  Search, 
  MapPin,
  Calendar,
  Package,
  Play,
  Pause,
  XCircle,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  Weight,
  Ruler,
  Euro,
  User,
  Phone,
  Mail,
  Navigation,
} from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import ConfirmationDialog from "../../components/ui/ConfirmationDialog"
import { adminAPI, tripsAPI } from "../../services/api"
import { normalizeAvatarUrl } from "../../utils/avatar"
import toast from "react-hot-toast"

const AdminTripsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleteTripId, setDeleteTripId] = useState(null)
  const [selectedTripId, setSelectedTripId] = useState(null)
  const [showTripDetails, setShowTripDetails] = useState(false)

  const { data: tripsData, isLoading, refetch } = useQuery({
    queryKey: ["admin-trips"],
    queryFn: adminAPI.getAllTrips,
  })

  const { data: tripDetailData, isLoading: tripDetailLoading } = useQuery({
    queryKey: ["trip", selectedTripId],
    queryFn: () => tripsAPI.getTripById(selectedTripId),
    enabled: !!selectedTripId && showTripDetails,
  })

  const trips = tripsData?.data || []
  const tripDetails = tripDetailData?.data?.trip

  const filterTrips = () => {
    let filtered = trips

    if (searchTerm) {
      filtered = filtered.filter(
        (trip) =>
        (trip.departure?.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trip.destination?.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trip.driver?.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trip.driver?.lastName || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((trip) => trip.status === statusFilter)
    }

    return filtered
  }

  const filteredTrips = filterTrips()

  const handleUpdateTripStatus = async (tripId, newStatus) => {
    try {
      await adminAPI.updateTripStatus(tripId, { status: newStatus })
      toast.success(`Trip status updated to ${newStatus}`)
      refetch()
    } catch (error) {
      toast.error("Error updating trip status")
    }
  }

  const handleDeleteTrip = (tripId) => {
    setDeleteTripId(tripId)
    setDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (deleteTripId) {
      try {
        await adminAPI.deleteTrip(deleteTripId)
        toast.success("Trip deleted successfully")
        refetch()
      } catch (error) {
        toast.error("Error deleting trip")
      }
    }
    setDeleteDialog(false)
    setDeleteTripId(null)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-warning/10 text-warning", label: "Pending" },
      active: { color: "bg-success/10 text-success", label: "Active" },
      completed: { color: "bg-primary/10 text-primary", label: "Completed" },
      cancelled: { color: "bg-destructive/10 text-destructive", label: "Cancelled" },
      paused: { color: "bg-muted text-muted-foreground", label: "Paused" },
    }
    
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={clsx("px-2 py-1 text-xs font-medium rounded-md", config.color)}>{config.label}</span>
    )
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Play className="w-4 h-4 text-success" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-primary" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-destructive" />
      case "paused":
        return <Pause className="w-4 h-4 text-muted-foreground" />
      default:
        return <Clock className="w-4 h-4 text-warning" />
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="large" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="mb-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">Trip Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Monitor and manage all trips on the platform
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <Input
                  placeholder="Search by origin, destination, driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <div className="flex gap-3 sm:gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 sm:px-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Trips - Mobile Cards View */}
        <motion.div variants={itemVariants} className="lg:hidden">
          <div className="space-y-3">
            {filteredTrips.length === 0 ? (
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="text-center py-12">
                  <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No trips found</p>
                </div>
              </Card>
            ) : (
              filteredTrips.map((trip, index) => (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="font-semibold text-foreground text-base">
                              {trip.departure?.city || ""} → {trip.destination?.city || ""}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground ml-6">
                            <span>Price: {trip.pricePerKg}€/kg</span>
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {trip.availableCapacity?.weight} kg
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(trip.status)}
                          {getStatusBadge(trip.status)}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2 border-t border-border">
                        {trip.driver?.avatar ? (
                          <img
                            src={normalizeAvatarUrl(trip.driver.avatar)}
                            alt={`${trip.driver.firstName} ${trip.driver.lastName}`}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = "none"
                              e.target.nextSibling.style.display = "flex"
                            }}
                          />
                        ) : null}
                        <div
                          className={clsx(
                            "w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
                            trip.driver?.avatar && "hidden"
                          )}
                        >
                          {trip.driver?.firstName?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground text-sm truncate">
                            {trip.driver?.firstName} {trip.driver?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{trip.driver?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(trip.departureDate).toLocaleDateString("en-US")}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        {trip.status === "pending" && (
                          <>
                            <Button
                              size="small"
                              onClick={() => handleUpdateTripStatus(trip._id, "active")}
                              className="flex-1 bg-success hover:bg-success/90"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Activate
                            </Button>
                            <Button
                              size="small"
                              variant="outline"
                              onClick={() => handleUpdateTripStatus(trip._id, "cancelled")}
                              className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {trip.status === "active" && (
                          <Button
                            size="small"
                            variant="outline"
                            onClick={() => handleUpdateTripStatus(trip._id, "paused")}
                            className="flex-1 border-warning text-warning hover:bg-warning/10"
                          >
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() => {
                            setSelectedTripId(trip._id)
                            setShowTripDetails(true)
                          }}
                          className="flex-1 text-primary hover:bg-primary/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() => handleDeleteTrip(trip._id)}
                          className="flex-1 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Trips - Desktop Table View */}
        <motion.div variants={itemVariants} className="hidden lg:block">
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Trip</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Driver</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrips.map((trip, index) => (
                    <motion.tr
                      key={trip._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="font-medium text-foreground text-sm">
                              {trip.departure?.city || ""} → {trip.destination?.city || ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Price: {trip.pricePerKg}€/kg</span>
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              Capacity: {trip.availableCapacity?.weight} kg
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {trip.driver?.avatar ? (
                            <img
                              src={normalizeAvatarUrl(trip.driver.avatar)}
                              alt={`${trip.driver.firstName} ${trip.driver.lastName}`}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                e.target.style.display = "none"
                                e.target.nextSibling.style.display = "flex"
                              }}
                            />
                          ) : null}
                          <div
                            className={clsx(
                              "w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
                              trip.driver?.avatar && "hidden"
                            )}
                          >
                            {trip.driver?.firstName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">
                              {trip.driver?.firstName} {trip.driver?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{trip.driver?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(trip.status)}
                          {getStatusBadge(trip.status)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(trip.departureDate).toLocaleDateString("en-US")}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="small"
                            variant="ghost"
                            onClick={() => {
                              setSelectedTripId(trip._id)
                              setShowTripDetails(true)
                            }}
                            className="text-primary hover:bg-primary/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {trip.status === "pending" && (
                            <>
                              <Button
                                size="small"
                                onClick={() => handleUpdateTripStatus(trip._id, "active")}
                                className="bg-success hover:bg-success/90"
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                              <Button
                                size="small"
                                variant="outline"
                                onClick={() => handleUpdateTripStatus(trip._id, "cancelled")}
                                className="border-destructive text-destructive hover:bg-destructive/10"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {trip.status === "active" && (
                            <Button
                              size="small"
                              variant="outline"
                              onClick={() => handleUpdateTripStatus(trip._id, "paused")}
                              className="border-warning text-warning hover:bg-warning/10"
                            >
                              <Pause className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="small"
                            variant="ghost"
                            onClick={() => handleDeleteTrip(trip._id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredTrips.length === 0 && (
                <div className="text-center py-12">
                  <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No trips found</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Trip Details Modal */}
      {showTripDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowTripDetails(false)
            setSelectedTripId(null)
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-lg p-4 sm:p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Trip Details</h2>
              <Button variant="ghost" size="small" onClick={() => {
                setShowTripDetails(false)
                setSelectedTripId(null)
              }}>
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            {tripDetailLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            ) : tripDetails ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Route Information */}
                <Card className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Navigation className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Route Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Departure</p>
                        <p className="text-sm text-muted-foreground">{tripDetails.departure?.address}</p>
                        <p className="text-sm text-muted-foreground">{tripDetails.departure?.city}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Destination</p>
                        <p className="text-sm text-muted-foreground">{tripDetails.destination?.address}</p>
                        <p className="text-sm text-muted-foreground">{tripDetails.destination?.city}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Schedule */}
                <Card className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Schedule</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Departure Date</p>
                      <p className="font-medium text-foreground">
                        {new Date(tripDetails.departureDate).toLocaleString("en-US")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Arrival Date</p>
                      <p className="font-medium text-foreground">
                        {new Date(tripDetails.arrivalDate).toLocaleString("en-US")}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Capacity & Pricing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Capacity</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Weight className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Available Weight:</span>
                        <span className="font-medium text-foreground">{tripDetails.availableCapacity?.weight} kg</span>
                      </div>
                      {tripDetails.availableCapacity?.dimensions && (
                        <div className="flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Dimensions:</span>
                          <span className="font-medium text-foreground">
                            {tripDetails.availableCapacity.dimensions.length} × {tripDetails.availableCapacity.dimensions.width} × {tripDetails.availableCapacity.dimensions.height} cm
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Euro className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Pricing</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Price per kg:</span>
                        <span className="font-semibold text-foreground text-lg">{tripDetails.pricePerKg}€</span>
                      </div>
                      {tripDetails.totalEarnings > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Total Earnings:</span>
                          <span className="font-semibold text-success">{tripDetails.totalEarnings}€</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Driver Information */}
                {tripDetails.driver && (
                  <Card className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Driver Information</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      {tripDetails.driver.avatar ? (
                        <img
                          src={normalizeAvatarUrl(tripDetails.driver.avatar)}
                          alt={`${tripDetails.driver.firstName} ${tripDetails.driver.lastName}`}
                          className="w-16 h-16 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none"
                            e.target.nextSibling.style.display = "flex"
                          }}
                        />
                      ) : null}
                      <div
                        className={clsx(
                          "w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold",
                          tripDetails.driver.avatar && "hidden"
                        )}
                      >
                        {tripDetails.driver.firstName?.charAt(0)}
                        {tripDetails.driver.lastName?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {tripDetails.driver.firstName} {tripDetails.driver.lastName}
                        </p>
                        {tripDetails.driver.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Phone className="w-4 h-4" />
                            <span>{tripDetails.driver.phone}</span>
                          </div>
                        )}
                        {tripDetails.driver.vehicleInfo && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Truck className="w-4 h-4" />
                            <span>{tripDetails.driver.vehicleInfo.type} - {tripDetails.driver.vehicleInfo.capacity?.weight}kg</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )}

                {/* Accepted Cargo Types */}
                {tripDetails.acceptedCargoTypes && tripDetails.acceptedCargoTypes.length > 0 && (
                  <Card className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Accepted Cargo Types</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tripDetails.acceptedCargoTypes.map((type, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Description */}
                {tripDetails.description && (
                  <Card className="p-4 sm:p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{tripDetails.description}</p>
                  </Card>
                )}

                {/* Status */}
                <Card className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tripDetails.status)}
                        {getStatusBadge(tripDetails.status)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Created</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(tripDetails.createdAt).toLocaleDateString("en-US")}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Trip details not found</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog}
        onClose={() => {
          setDeleteDialog(false)
          setDeleteTripId(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete this trip?"
        message="Are you sure you want to delete this trip? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

export default AdminTripsPage 
