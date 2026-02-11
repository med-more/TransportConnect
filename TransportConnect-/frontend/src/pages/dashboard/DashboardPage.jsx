import { Link } from "react-router-dom"
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
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { tripsAPI, requestsAPI, usersAPI } from "../../services/api"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const DashboardPage = () => {
  const { user } = useAuth()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: usersAPI.getStats,
  })

  const { data: recentTrips, isLoading: tripsLoading } = useQuery({
    queryKey: ["recent-trips"],
    queryFn: () =>
      user?.role === "conducteur" ? tripsAPI.getMyTrips({ limit: 5 }) : tripsAPI.getTrips({ limit: 5 }),
  })

  const { data: recentRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["recent-requests"],
    queryFn: () =>
      user?.role === "conducteur"
        ? requestsAPI.getReceivedRequests({ limit: 5 })
        : requestsAPI.getRequests({ limit: 5 }),
  })

  const statsCards = [
    {
      title: user?.role === "conducteur" ? "Total Trips" : "Total Requests",
      value: stats?.data?.totalTrips || stats?.data?.totalRequests || 0,
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
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
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
                  <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </Card>
            )
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Map Widget */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Shipment Tracking</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="small" className="text-xs px-2 sm:px-3">
                      Tracking
                    </Button>
                    <Button variant="outline" size="small" className="text-xs px-2 sm:px-3">
                      Traffic
                    </Button>
                    <Button variant="outline" size="small" className="text-xs px-2 sm:px-3">
                      POI
                    </Button>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="w-full h-48 sm:h-56 md:h-64 bg-background rounded-lg border border-border mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Map visualization</p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Distance to arrival</p>
                      <p className="text-base sm:text-lg font-semibold text-foreground">120 KM / 1h 50min</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Traffic and route optimization</span>
                      <span className="font-medium text-foreground">85%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="small" className="w-full sm:w-auto">Optimize</Button>
                    <Button variant="outline" size="small" className="w-full sm:w-auto">
                      View all
                    </Button>
                  </div>
                </div>
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
                  {tripsLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : recentTrips?.data?.trips?.length > 0 ? (
                    recentTrips.data.trips.map((trip) => (
                      <div
                        key={trip._id}
                        className="p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
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
                          <span className="text-base sm:text-lg font-bold text-primary flex-shrink-0">{trip.pricePerKg}€/kg</span>
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
            {/* Alerts Widget */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Alerts & Notifications</h3>
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-accent rounded-lg border-l-4 border-primary">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground">Geofencing alert</span>
                      <span className="text-xs text-muted-foreground">13:48</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Truck crossed geofence at Warehouse A. Driver arrival notification sent to staff.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Shipment Details */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Shipment Details</h3>
                  <Button variant="ghost" size="small" className="text-xs sm:text-sm">
                    Read more
                  </Button>
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

                  <div className="p-2 sm:p-3 bg-background rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                    <p className="text-lg sm:text-xl font-bold text-foreground">$520.45</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                        Delivered
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type</span>
                      <span className="px-2 py-1 bg-accent text-foreground rounded-md text-xs font-medium">
                        Household
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="font-medium">4.2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Truck Capacity */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Current Truck Capacity</h3>
                  <Button variant="ghost" size="small" className="text-xs sm:text-sm">
                    Read more
                  </Button>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {/* Truck Illustration */}
                  <div className="relative w-full h-24 sm:h-28 md:h-32 bg-background rounded-lg flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 flex items-end">
                      <div className="w-full h-3/4 bg-primary/20 relative">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-primary"
                          style={{ height: "82%" }}
                        />
                      </div>
                    </div>
                    <Truck className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-foreground/20 relative z-10" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Truck ID</span>
                      <span className="font-medium text-foreground text-xs sm:text-sm truncate ml-2">AL-223965406</span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-bold text-primary">82%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className="text-primary font-medium">On Route</span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Weight</span>
                      <span className="font-medium text-foreground">8,453 KG</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

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
                  {requestsLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : recentRequests?.data?.requests?.length > 0 ? (
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
