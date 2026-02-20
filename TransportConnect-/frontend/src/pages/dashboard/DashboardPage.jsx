import { Link, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import clsx from "clsx"
import {
  Plus,
  Search,
  Package,
  TrendingUp,
  Clock,
  MapPin,
  ArrowRight,
  Truck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  Route,
  BarChart3,
  MessageSquare,
  Send,
  Paperclip,
} from "../../utils/icons"
import { useAuth } from "../../contexts/AuthContext"
import { tripsAPI, requestsAPI, usersAPI, notificationsAPI } from "../../services/api"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Skeleton from "../../components/ui/Skeleton"
import ShipmentTrackingMap from "../../components/ShipmentTrackingMap"

const DashboardPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: statsResponse, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: usersAPI.getStats,
  })
  // API returns { data: { success, data: { totalTrips, totalRequests, averageRating, ... } } }
  const stats = statsResponse?.data?.data ?? statsResponse?.data ?? {}

  const { data: recentTrips, isLoading: tripsLoading } = useQuery({
    queryKey: ["recent-trips"],
    queryFn: () =>
      user?.role === "conducteur" ? tripsAPI.getMyTrips({ limit: 5 }) : tripsAPI.getTrips({ limit: 5 }),
  })

  const { data: recentRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["recent-requests"],
    queryFn: () =>
      user?.role === "conducteur"
        ? requestsAPI.getReceivedRequests({ limit: 10 })
        : requestsAPI.getRequests({ limit: 10 }),
  })

  const { data: notificationsData } = useQuery({
    queryKey: ["notifications-dashboard", user?._id],
    queryFn: () => notificationsAPI.getNotifications({ limit: 5 }),
    enabled: !!user?._id,
  })

  const notifications = notificationsData?.notifications || []

  // Active shipment: for driver = first active trip; for shipper = first accepted/in_transit request
  const activeTrip =
    user?.role === "conducteur"
      ? recentTrips?.data?.trips?.find((t) => t.status === "active")
      : null
  const activeRequest =
    user?.role !== "conducteur"
      ? recentRequests?.data?.requests?.find((r) =>
          ["accepted", "in_transit"].includes(r.status)
        )
      : recentRequests?.data?.requests?.find((r) =>
          ["accepted", "in_transit"].includes(r.status)
        )

  // For driver: used weight from active trip's accepted requests; truck capacity from vehicleInfo
  const acceptedRequests = activeTrip?.acceptedRequests || []
  const usedWeight = acceptedRequests.reduce(
    (sum, req) => sum + (req.cargo?.weight || 0),
    0
  )
  const truckCapacityKg = user?.vehicleInfo?.capacity
  const capacityPercent =
    truckCapacityKg > 0
      ? Math.min(100, Math.round((usedWeight / truckCapacityKg) * 100))
      : 0

  // ETA from trip arrival date (when we have an active trip)
  const getDistanceToArrival = () => {
    const trip = activeTrip || activeRequest?.trip
    if (!trip?.arrivalDate) return null
    const now = new Date()
    const arrival = new Date(trip.arrivalDate)
    if (arrival <= now) return { text: "Arrived", min: 0 }
    const min = Math.round((arrival - now) / (60 * 1000))
    const hours = Math.floor(min / 60)
    const mins = min % 60
    const timeStr =
      hours > 0 ? `${hours}h ${mins}min` : `${mins} min`
    return { text: `Est. ${timeStr}`, min }
  }
  const distanceToArrival = getDistanceToArrival()

  const statsCards = [
    {
      title: user?.role === "conducteur" ? "Total Trips" : "Total Requests",
      value: stats?.totalTrips ?? stats?.totalRequests ?? 0,
      icon: Truck,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Active Shipments",
      value: recentTrips?.data?.trips?.filter((t) => t.status === "active")?.length || 0,
      icon: Package,
      color: "text-info",
      bgColor: "bg-info/10",
      change: "+5%",
      trend: "up",
    },
    {
      title: "Pending Requests",
      value: recentRequests?.data?.requests?.filter((r) => r.status === "pending")?.length || 0,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      change: "-3%",
      trend: "down",
    },
    {
      title: "Success Rate",
      value: "96%",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
      change: "+2%",
      trend: "up",
    },
  ]

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

  const isLoading = statsLoading || tripsLoading || requestsLoading

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton variant="rect" className="h-12 w-12 rounded-xl" />
                  <Skeleton variant="line" className="h-4 w-12" />
                </div>
                <Skeleton variant="line" className="h-8 w-16 mb-2" />
                <Skeleton variant="line" className="h-4 w-24" />
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-5 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
                <Skeleton className="h-48 sm:h-56 md:h-64 w-full rounded-xl mb-4" />
                <Skeleton variant="text" lines={3} />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </Card>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border">
                      <Skeleton variant="avatar" className="h-10 w-10" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="p-4 sm:p-5 md:p-6">
                <Skeleton className="h-5 w-28 mb-4" />
                <div className="space-y-3">
                  <Skeleton variant="text" lines={4} />
                </div>
              </Card>
              <Card className="p-4 sm:p-5 md:p-6">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton variant="avatar" className="h-10 w-10" />
                    <Skeleton variant="text" lines={2} className="flex-1" />
                  </div>
                  <Skeleton variant="text" lines={4} />
                </div>
              </Card>
              <Card className="p-4 sm:p-5 md:p-6">
                <Skeleton className="h-5 w-36 mb-4" />
                <Skeleton className="h-24 w-full rounded-xl mb-4" />
                <Skeleton variant="text" lines={3} />
              </Card>
            </div>
          </div>
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
        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} hover className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div
                    className={clsx(
                      "flex items-center gap-1 text-xs font-medium",
                      stat.trend === "up" ? "text-success" : "text-destructive"
                    )}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-0.5">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </Card>
            )
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Map Widget - Shipment Tracking */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Shipment Tracking</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="small" className="text-xs px-2 sm:px-3" onClick={() => navigate("/trips")}>
                      Trips
                    </Button>
                    <Button variant="outline" size="small" className="text-xs px-2 sm:px-3" onClick={() => navigate("/requests")}>
                      Requests
                    </Button>
                  </div>
                </div>

                {activeTrip || activeRequest ? (
                  <>
                    <div className="mb-4 w-full rounded-xl overflow-hidden h-[220px] sm:h-[300px] md:h-[340px] lg:h-[380px]">
                      <ShipmentTrackingMap
                        departure={
                          activeTrip?.departure ||
                          activeRequest?.trip?.departure || { city: activeRequest?.pickup?.city, address: activeRequest?.pickup?.address }
                        }
                        destination={
                          activeTrip?.destination ||
                          activeRequest?.trip?.destination || { city: activeRequest?.delivery?.city, address: activeRequest?.delivery?.address }
                        }
                        departureDate={
                          activeTrip?.departureDate || activeRequest?.trip?.departureDate
                        }
                        arrivalDate={
                          activeTrip?.arrivalDate || activeRequest?.trip?.arrivalDate
                        }
                        fromLabel={
                          activeTrip?.departure?.city || activeRequest?.trip?.departure?.city || activeRequest?.pickup?.city || "Start"
                        }
                        toLabel={
                          activeTrip?.destination?.city || activeRequest?.trip?.destination?.city || activeRequest?.delivery?.city || "End"
                        }
                        height="100%"
                        className="w-full h-full"
                        showRouteStrip
                        showLegend
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">
                      {activeTrip
                        ? `${activeTrip.departure?.city} → ${activeTrip.destination?.city} · ${activeTrip.status}`
                        : activeRequest?.trip
                          ? `${activeRequest.trip.departure?.city} → ${activeRequest.trip.destination?.city} · ${activeRequest?.status}`
                          : `${activeRequest?.pickup?.city} → ${activeRequest?.delivery?.city}`}
                    </p>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Distance to arrival</p>
                          <p className="text-base sm:text-lg font-semibold text-foreground">
                            {distanceToArrival ? distanceToArrival.text : "—"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        {activeTrip && (
                          <Button size="small" className="w-full sm:w-auto" onClick={() => navigate(`/trips/${activeTrip._id}`)}>
                            View trip
                          </Button>
                        )}
                        {activeRequest && !activeTrip && (
                          <Button size="small" className="w-full sm:w-auto" onClick={() => navigate(`/requests/${activeRequest._id}`)}>
                            View request
                          </Button>
                        )}
                        <Button variant="outline" size="small" className="w-full sm:w-auto" onClick={() => navigate(user?.role === "conducteur" ? "/trips" : "/requests")}>
                          View all
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full h-48 sm:h-56 md:h-64 bg-muted/30 dark:bg-muted/50 rounded-xl border border-border mb-4 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No active shipment</p>
                        <p className="text-xs text-muted-foreground mt-1">Distance to arrival —</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button size="small" className="w-full sm:w-auto" onClick={() => navigate(user?.role === "conducteur" ? "/trips/create" : "/requests/create")}>
                        {user?.role === "conducteur" ? "Create trip" : "Create request"}
                      </Button>
                      <Button variant="outline" size="small" className="w-full sm:w-auto" onClick={() => navigate(user?.role === "conducteur" ? "/trips" : "/requests")}>
                        View all
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>

            {/* Recent Trips */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    {user?.role === "conducteur" ? "My Recent Trips" : "Available Trips"}
                  </h3>
                  <Link to="/trips">
                    <Button variant="ghost" size="small" className="text-xs sm:text-sm">
                      View all <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {recentTrips?.data?.trips?.length > 0 ? (
                    recentTrips.data.trips.map((trip) => (
                      <div
                        key={trip._id}
                        className="p-4 bg-muted/30 dark:bg-muted/50 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="p-2 bg-primary/10 rounded-xl flex-shrink-0">
                              <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-foreground text-sm sm:text-base truncate">
                                {trip.departure.city} → {trip.destination.city}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(trip.departureDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <span className="text-base sm:text-lg font-bold text-primary flex-shrink-0 truncate" title={`${Number(trip.pricePerKg).toFixed(2)}€/kg`}>{Number(trip.pricePerKg).toFixed(2)}€/kg</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {trip.availableCapacity.weight}kg available
                          </span>
                          {user?.role !== "conducteur" && trip.driver && (
                            <span className="flex items-center gap-1">
                              <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                                {trip.driver.firstName?.charAt(0)}
                              </span>
                              <span className="truncate">{trip.driver.firstName} {trip.driver.lastName}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-muted-foreground">No trips found</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Alerts & Notifications */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Alerts & Notifications</h3>
                  {notifications.some((n) => !n.read) && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" title="Unread" />
                  )}
                </div>
                <div className="space-y-3">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className={clsx(
                          "p-3 rounded-xl border-l-4 transition-colors",
                          notif.read
                            ? "bg-muted/30 dark:bg-muted/50 border-border"
                            : "bg-primary/5 border-primary"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground truncate flex-1 mr-2">
                            {notif.title}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {new Date(notif.createdAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">No notifications yet.</p>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Shipment Details */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Shipment Details</h3>
                  {(activeTrip || activeRequest) && (
                    <Button
                      variant="ghost"
                      size="small"
                      className="text-xs sm:text-sm"
                      onClick={() =>
                        navigate(
                          activeTrip
                            ? `/trips/${activeTrip._id}`
                            : `/requests/${activeRequest._id}`
                        )
                      }
                    >
                      Read more
                    </Button>
                  )}
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        {user?.firstName?.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm sm:text-base truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">ID: {user?._id?.slice(-8)}</p>
                    </div>
                  </div>

                  {activeTrip || activeRequest ? (
                    <>
                      <div className="p-2 sm:p-3 bg-muted/30 dark:bg-muted/50 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                        <p className="text-lg sm:text-xl font-bold text-foreground">
                          {user?.role !== "conducteur" && activeRequest
                            ? `${Number(activeRequest.price || 0).toFixed(2)}€`
                            : activeTrip
                              ? `${acceptedRequests.reduce((s, r) => s + (Number(r.price) || 0), 0).toFixed(2)}€`
                              : "—"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status</span>
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium capitalize">
                            {activeRequest ? activeRequest.status : activeTrip?.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Type</span>
                          <span className="px-2 py-1 bg-accent text-foreground rounded-lg text-xs font-medium capitalize">
                            {activeRequest?.cargo?.type || (acceptedRequests[0]?.cargo?.type ?? "—")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-warning text-warning" />
                            <span className="font-medium">
                              {stats?.averageRating != null
                                ? Number(stats.averageRating).toFixed(1)
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-2 sm:p-3 bg-muted/30 dark:bg-muted/50 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                        <p className="text-lg sm:text-xl font-bold text-foreground">—</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status</span>
                          <span className="text-muted-foreground">No active shipment</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Type</span>
                          <span className="text-muted-foreground">—</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {stats?.averageRating != null
                                ? Number(stats.averageRating).toFixed(1)
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Current Truck Capacity - drivers only */}
            {user?.role === "conducteur" && (
              <motion.div variants={itemVariants}>
                <Card className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">Current Truck Capacity</h3>
                    <Button
                      variant="ghost"
                      size="small"
                      className="text-xs sm:text-sm"
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </Button>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative w-full h-24 sm:h-28 md:h-32 bg-muted/30 dark:bg-muted/50 rounded-xl flex items-center justify-center overflow-hidden">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-primary transition-[height] duration-500"
                        style={{ height: `${Math.min(100, capacityPercent)}%` }}
                      />
                      <Truck className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-foreground/20 relative z-10" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Truck ID</span>
                        <span className="font-medium text-foreground text-xs sm:text-sm truncate ml-2">
                          {user?.vehicleInfo?.licensePlate || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Capacity</span>
                        <span className="font-bold text-primary">{capacityPercent}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className={activeTrip ? "text-primary font-medium" : "text-muted-foreground"}>
                          {activeTrip ? "On Route" : "Available"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Weight</span>
                        <span className="font-medium text-foreground">
                          {truckCapacityKg != null
                            ? `${Number(usedWeight).toLocaleString()} / ${Number(truckCapacityKg).toLocaleString()} kg`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Recent Requests */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    {user?.role === "conducteur" ? "Received Requests" : "My Requests"}
                  </h3>
                  <Link to="/requests">
                    <Button variant="ghost" size="small" className="text-xs sm:text-sm">
                      View all <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {recentRequests?.data?.requests?.length > 0 ? (
                    recentRequests.data.requests.map((request) => (
                      <div
                        key={request._id}
                        className="p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs sm:text-sm text-foreground truncate">
                              {request.cargo?.description?.substring(0, 30)}...
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {request.pickup?.city} → {request.delivery?.city}
                            </p>
                          </div>
                          <span
                            className={clsx(
                              "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium flex-shrink-0",
                              request.status === "pending"
                                ? "bg-warning/10 text-warning"
                                : request.status === "accepted"
                                  ? "bg-success/10 text-success"
                                  : request.status === "rejected"
                                    ? "bg-destructive/10 text-destructive"
                                    : "bg-muted text-muted-foreground"
                            )}
                          >
                            {request.status === "pending"
                              ? "Pending"
                              : request.status === "accepted"
                                ? "Accepted"
                                : request.status === "rejected"
                                  ? "Rejected"
                                  : request.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{request.cargo?.weight}kg</span>
                          <span className="font-medium text-foreground">{request.price}€</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-muted-foreground">No requests found</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardPage
