import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Weight,
  Star,
  Truck,
  Navigation,
  Clock,
  CheckCircle,
  XCircle,
  Euro,
  Package,
  User,
  Eye,
  ArrowUpDown,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { tripsAPI } from "../../services/api"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { normalizeAvatarUrl } from "../../utils/avatar"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import { CARGO_TYPES } from "../../config/constants"
import clsx from "clsx"

const TripsPage = () => {
  const { user } = useAuth()
  const [filters, setFilters] = useState({
    departure: "",
    destination: "",
    date: "",
    cargoType: "",
    status: "active",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("departureDate")

  const {
    data: tripsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["trips", filters, sortBy],
    queryFn: () => {
      if (user?.role === "conducteur") {
        return tripsAPI.getMyTrips(filters)
      } else {
        return tripsAPI.getTrips({ ...filters, sortBy })
      }
    },
    enabled: !!user,
  })

  const trips = tripsData?.data?.trips || []

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      departure: "",
      destination: "",
      date: "",
      cargoType: "",
      status: "active",
    })
  }

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
        return <CheckCircle className="w-4 h-4 text-success" />
      case "completed":
        return <Clock className="w-4 h-4 text-info" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-destructive" />
      default:
        return <Truck className="w-4 h-4 text-muted-foreground" />
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

  const stats = {
    total: trips.length,
    active: trips.filter((t) => t.status === "active").length,
    completed: trips.filter((t) => t.status === "completed").length,
    cancelled: trips.filter((t) => t.status === "cancelled").length,
  }

  // For shippers: calculate average price and best deals
  const shipperStats = {
    totalAvailable: trips.filter((t) => t.status === "active").length,
    averagePrice: trips.length > 0
      ? (trips.reduce((sum, t) => sum + (t.pricePerKg || 0), 0) / trips.length).toFixed(2)
      : 0,
    totalCapacity: trips.reduce((sum, t) => sum + (t.availableCapacity?.weight || 0), 0),
  }

  // Sort trips
  const sortedTrips = [...trips].sort((a, b) => {
    switch (sortBy) {
      case "priceAsc":
        return (a.pricePerKg || 0) - (b.pricePerKg || 0)
      case "priceDesc":
        return (b.pricePerKg || 0) - (a.pricePerKg || 0)
      case "capacityDesc":
        return (b.availableCapacity?.weight || 0) - (a.availableCapacity?.weight || 0)
      case "departureDate":
      default:
        return new Date(a.departureDate) - new Date(b.departureDate)
    }
  })

  const isShipper = user?.role !== "conducteur"

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2 flex items-center gap-2">
            <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
            <span className="truncate">{user?.role === "conducteur" ? "My Trips" : "Search Trips"}</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {user?.role === "conducteur"
              ? "Manage your trips and track requests"
              : "Find the perfect trip for your packages"}
          </p>
        </div>
        {user?.role === "conducteur" && (
          <Link to="/trips/create" className="flex-shrink-0">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Trip
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      {user?.role === "conducteur" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Trips</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Truck className="w-8 h-8 text-primary/20" />
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active</p>
                <p className="text-2xl font-bold text-success">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success/20" />
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-2xl font-bold text-info">{stats.completed}</p>
              </div>
              <Clock className="w-8 h-8 text-info/20" />
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cancelled</p>
                <p className="text-2xl font-bold text-destructive">{stats.cancelled}</p>
              </div>
              <XCircle className="w-8 h-8 text-destructive/20" />
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Available Trips</p>
                <p className="text-2xl font-bold text-primary">{shipperStats.totalAvailable}</p>
              </div>
              <Truck className="w-8 h-8 text-primary/20" />
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Price</p>
                <p className="text-2xl font-bold text-success">{shipperStats.averagePrice}€/kg</p>
              </div>
              <Euro className="w-8 h-8 text-success/20" />
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Capacity</p>
                <p className="text-2xl font-bold text-info">{shipperStats.totalCapacity}kg</p>
              </div>
              <Weight className="w-8 h-8 text-info/20" />
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Best Deals</p>
                <p className="text-2xl font-bold text-warning">
                  {trips.length > 0
                    ? trips.filter((t) => t.pricePerKg <= parseFloat(shipperStats.averagePrice)).length
                    : 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-warning/20" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Search Filters
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {isShipper && (
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <select
                  className="input-field py-1.5 text-xs sm:text-sm min-w-[120px]"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="departureDate">Sort by Date</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="capacityDesc">Capacity: High to Low</option>
                </select>
              </div>
            )}
            <Button variant="ghost" size="small" onClick={() => setShowFilters(!showFilters)} className="flex-shrink-0">
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </div>
        <motion.div
          initial={false}
          animate={{ height: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
            <Input
              placeholder="Departure city"
              value={filters.departure}
              onChange={(e) => handleFilterChange("departure", e.target.value)}
            />
            <Input
              placeholder="Destination city"
              value={filters.destination}
              onChange={(e) => handleFilterChange("destination", e.target.value)}
            />
            <Input
              type="date"
              placeholder="Departure date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
            />
            <select
              className="input-field"
              value={filters.cargoType}
              onChange={(e) => handleFilterChange("cargoType", e.target.value)}
            >
              <option value="">All cargo types</option>
              {CARGO_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-4">
              {user?.role === "conducteur" && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-foreground">Status:</label>
                  <select
                    className="input-field py-1 text-sm"
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="small" onClick={clearFilters}>
                Clear
              </Button>
              <Button size="small" onClick={() => refetch()}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </motion.div>
      </Card>

      {/* Trips List */}
      <div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : sortedTrips.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {sortedTrips.map((trip, index) => {
              const isBestDeal =
                isShipper && trip.pricePerKg <= parseFloat(shipperStats.averagePrice) && shipperStats.averagePrice > 0

              return (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card
                    hover
                    className={clsx(
                      "p-4 sm:p-5 md:p-6 h-full flex flex-col relative overflow-hidden",
                      isBestDeal && "border-2 border-warning/30"
                    )}
                  >
                    {isBestDeal && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-warning/10 rounded-md border border-warning/20">
                        <Sparkles className="w-3 h-3 text-warning" />
                        <span className="text-xs font-semibold text-warning">Best Deal</span>
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Navigation className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {trip.departure.city} → {trip.destination.city}
                          </h3>
                        </div>
                        <div
                          className={clsx(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border",
                            getStatusColor(trip.status)
                          )}
                        >
                          {getStatusIcon(trip.status)}
                          <span>{getStatusLabel(trip.status)}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-primary">{trip.pricePerKg}€/kg</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Weight className="w-3 h-3" />
                          {trip.availableCapacity.weight}kg
                        </div>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">From:</span>
                        <span className="text-muted-foreground truncate">
                          {trip.departure.address}, {trip.departure.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">To:</span>
                        <span className="text-muted-foreground truncate">
                          {trip.destination.address}, {trip.destination.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">Departure:</span>
                        <span className="text-muted-foreground">
                          {new Date(trip.departureDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">Arrival:</span>
                        <span className="text-muted-foreground">
                          {new Date(trip.arrivalDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">Vehicle:</span>
                        <span className="text-muted-foreground">
                          {trip.driver?.vehicleInfo?.type 
                            ? trip.driver.vehicleInfo.type.charAt(0).toUpperCase() + trip.driver.vehicleInfo.type.slice(1)
                            : "N/A"}
                        </span>
                      </div>
                      {trip.driver?.stats?.averageRating && (
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="text-foreground font-medium">Driver Rating:</span>
                          <span className="text-muted-foreground">{trip.driver.stats.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Cargo Types */}
                    {trip.acceptedCargoTypes && trip.acceptedCargoTypes.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2">Accepted cargo types:</p>
                        <div className="flex flex-wrap gap-2">
                          {trip.acceptedCargoTypes.slice(0, 3).map((type) => (
                            <span
                              key={type}
                              className="px-2 py-1 bg-accent rounded-md text-xs font-medium text-foreground"
                            >
                              {type}
                            </span>
                          ))}
                          {trip.acceptedCargoTypes.length > 3 && (
                            <span className="px-2 py-1 bg-accent rounded-md text-xs font-medium text-muted-foreground">
                              +{trip.acceptedCargoTypes.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                          {trip.driver?.avatar ? (
                            <img
                              src={normalizeAvatarUrl(trip.driver.avatar)}
                              alt={`${trip.driver.firstName} ${trip.driver.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-xs font-bold">
                              {trip.driver?.firstName?.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {trip.driver?.firstName} {trip.driver?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">Driver</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isShipper && trip.status === "active" && (
                          <Link to={`/requests/create/${trip._id}`}>
                            <Button size="small" className="bg-gradient-to-r from-primary to-primary/90">
                              <Package className="w-4 h-4 mr-2" />
                              Request
                            </Button>
                          </Link>
                        )}
                        <Link to={`/trips/${trip._id}`}>
                          <Button variant="ghost" size="small">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <Card className="text-center py-16">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Truck className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No trips found</h3>
              <p className="text-muted-foreground mb-6">
                {user?.role === "conducteur"
                  ? "Start by creating your first trip."
                  : "No trips match your search criteria. Try adjusting your filters."}
              </p>
              {user?.role === "conducteur" && (
                <Link to="/trips/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Trip
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default TripsPage
