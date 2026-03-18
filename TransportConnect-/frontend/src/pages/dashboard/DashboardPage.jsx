import { useState, useCallback, useEffect } from "react"
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
import { useLocale } from "../../contexts/LocaleContext"
import { useTranslation } from "../../i18n/useTranslation"
import { tripsAPI, requestsAPI, usersAPI, notificationsAPI } from "../../services/api"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Skeleton from "../../components/ui/Skeleton"
import ShipmentTrackingMap from "../../components/ShipmentTrackingMap"

const DashboardPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { formatCurrency } = useLocale()

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
      ? recentTrips?.trips?.find((t) => t.status === "active")
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

  // Route duration from map (matches "696.8 km ~ 9h 12min") — so dashboard and map card show same value
  const [routeDurationSeconds, setRouteDurationSeconds] = useState(null)
  const handleRouteLoaded = useCallback((info) => {
    if (info?.durationSeconds != null) setRouteDurationSeconds(info.durationSeconds)
  }, [])

  useEffect(() => {
    setRouteDurationSeconds(null)
  }, [activeTrip?._id, activeRequest?._id])

  const formatRouteDuration = (seconds) => {
    if (seconds == null || seconds <= 0) return null
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return h > 0 ? `${h}h ${m}min` : `${m}min`
  }

  // Fallback: time until arrivalDate when route not yet loaded
  const getTimeToArrivalFallback = () => {
    const trip = activeTrip || activeRequest?.trip
    if (!trip?.arrivalDate) return null
    const now = new Date()
    const arrival = new Date(trip.arrivalDate)
    if (arrival <= now) return "Arrived"
    const min = Math.round((arrival - now) / (60 * 1000))
    const hours = Math.floor(min / 60)
    const mins = min % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const timeToArrivalText =
    routeDurationSeconds != null
      ? formatRouteDuration(routeDurationSeconds)
      : getTimeToArrivalFallback()

  const statsCards = [
    {
      title: user?.role === "conducteur" ? t("dashboard.totalTrips") : t("dashboard.totalRequests"),
      value: stats?.totalTrips ?? stats?.totalRequests ?? 0,
      icon: Truck,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+12%",
      trend: "up",
    },
    {
      title: t("dashboard.activeShipments"),
      value: recentTrips?.trips?.filter((trip) => trip.status === "active")?.length || 0,
      icon: Package,
      color: "text-info",
      bgColor: "bg-info/10",
      change: "+5%",
      trend: "up",
    },
    {
      title: t("dashboard.pendingRequests"),
      value: recentRequests?.data?.requests?.filter((r) => r.status === "pending")?.length || 0,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      change: "-3%",
      trend: "down",
    },
    {
      title: t("dashboard.successRate"),
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
              <div key={i} className="detail-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton variant="rect" className="h-10 w-10 rounded-xl" />
                  <Skeleton variant="line" className="h-4 w-10" />
                </div>
                <Skeleton variant="line" className="h-8 w-16 mb-2" />
                <Skeleton variant="line" className="h-4 w-24" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="detail-card p-4 sm:p-5 md:p-6">
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
              </div>
              <div className="detail-card p-4 sm:p-5 md:p-6">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl stat-tile">
                      <Skeleton variant="avatar" className="h-9 w-9" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="detail-card p-4 sm:p-5">
                <Skeleton className="h-5 w-28 mb-4" />
                <div className="space-y-3">
                  <Skeleton variant="text" lines={4} />
                </div>
              </div>
              <div className="detail-card p-4 sm:p-5">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton variant="avatar" className="h-10 w-10" />
                    <Skeleton variant="text" lines={2} className="flex-1" />
                  </div>
                  <Skeleton variant="text" lines={4} />
                </div>
              </div>
              <div className="detail-card p-4 sm:p-5">
                <Skeleton className="h-5 w-36 mb-4" />
                <Skeleton className="h-24 w-full rounded-xl mb-4" />
                <Skeleton variant="text" lines={3} />
              </div>
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
            const isPrimary = index === statsCards.length - 1
            return (
              <div
                key={index}
                className={clsx(
                  "cursor-pointer",
                  isPrimary ? "stat-tile-primary" : "stat-tile"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={clsx("section-icon-badge", stat.bgColor)}>
                    <Icon className={clsx("w-4 h-4 sm:w-5 sm:h-5", stat.color)} />
                  </div>
                  <div
                    className={clsx(
                      "flex items-center gap-1 text-xs font-semibold",
                      stat.trend === "up" ? "text-success" : "text-destructive"
                    )}
                  >
                    <TrendingUp className={clsx("w-3 h-3", stat.trend === "down" && "rotate-180")} />
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-0.5">{stat.value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.title}</p>
              </div>
            )
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-6">
          {/* Left Column - full width on mobile, 2/3 on lg */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            {/* Route Map Widget - Shipment Tracking */}
            <motion.div variants={itemVariants}>
              <div className="detail-card p-4 sm:p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="section-icon-badge bg-primary/15">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">{t("dashboard.shipmentTracking")}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="small" className="text-xs px-2 sm:px-3" onClick={() => navigate("/trips")}>
                      {t("dashboard.trips")}
                    </Button>
                    <Button variant="outline" size="small" className="text-xs px-2 sm:px-3" onClick={() => navigate("/requests")}>
                      {t("dashboard.requests")}
                    </Button>
                  </div>
                </div>

                {activeTrip || activeRequest ? (
                  <>
                    {/* Mobile: map 60vh so driver sees it clearly; desktop: fixed heights */}
                    <div className="mb-4 w-full rounded-xl overflow-hidden min-h-[60vh] h-[60vh] sm:min-h-[300px] sm:h-[300px] md:h-[360px] lg:h-[400px]">
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
                        onRouteLoaded={handleRouteLoaded}
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
                          <p className="text-xs sm:text-sm text-muted-foreground">{t("dashboard.timeToArrival")}</p>
                          <p className="text-base sm:text-lg font-semibold text-foreground">
                            {timeToArrivalText ?? "—"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        {activeTrip && (
                          <Button size="small" className="w-full sm:w-auto" onClick={() => navigate(`/trips/${activeTrip._id}`)}>
                            {t("dashboard.viewTrip")}
                          </Button>
                        )}
                        {activeRequest && !activeTrip && (
                          <Button size="small" className="w-full sm:w-auto" onClick={() => navigate(`/requests/${activeRequest._id}`)}>
                            {t("dashboard.viewRequest")}
                          </Button>
                        )}
                        <Button variant="outline" size="small" className="w-full sm:w-auto" onClick={() => navigate(user?.role === "conducteur" ? "/trips" : "/requests")}>
                          {t("dashboard.viewAll")}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full h-48 sm:h-56 md:h-64 stat-tile rounded-xl mb-4 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{t("dashboard.noActiveShipment")}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t("dashboard.timeToArrival")} —</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button size="small" className="w-full sm:w-auto" onClick={() => navigate(user?.role === "conducteur" ? "/trips/create" : "/requests/create")}>
                        {user?.role === "conducteur" ? t("trips.createTrip") : t("requests.createRequest")}
                      </Button>
                      <Button variant="outline" size="small" className="w-full sm:w-auto" onClick={() => navigate(user?.role === "conducteur" ? "/trips" : "/requests")}>
                        {t("dashboard.viewAll")}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Recent Trips */}
            <motion.div variants={itemVariants}>
              <div className="detail-card p-4 sm:p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="section-icon-badge bg-primary/15">
                      <Truck className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">
                      {user?.role === "conducteur" ? t("dashboard.myRecentTrips") : t("dashboard.availableTrips")}
                    </h3>
                  </div>
                  <Link to="/trips">
                    <Button variant="ghost" size="small" className="text-xs sm:text-sm">
                      {t("dashboard.viewAll")} <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {recentTrips?.trips?.length > 0 ? (
                    recentTrips.trips.map((trip) => (
                      <div
                        key={trip._id}
                        className="route-step-card"
                      >
                        <div className="flex items-start justify-between mb-1.5 gap-2">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="section-icon-badge bg-primary/10 shrink-0" style={{width:'2rem',height:'2rem'}}>
                              <Truck className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-foreground text-sm truncate">
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
                          <span className="text-sm font-bold text-primary flex-shrink-0 truncate" title={formatCurrency(trip.pricePerKg) + "/kg"}>{formatCurrency(trip.pricePerKg)}/kg</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs text-muted-foreground pl-9">
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {trip.availableCapacity.weight}{t("dashboard.kgAvailable")}
                          </span>
                          {user?.role !== "conducteur" && trip.driver && (
                            <span className="flex items-center gap-1">
                              <span className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0">
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
                      <p className="text-sm text-muted-foreground">{t("dashboard.noTripsFound")}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - full width on mobile */}
          <div className="col-span-2 lg:col-span-1 space-y-6">
            {/* Full-width stacked cards on mobile */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {/* Alerts & Notifications */}
            <motion.div variants={itemVariants}>
              <div className="detail-card p-3 sm:p-5">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="section-icon-badge bg-warning/10" style={{width:'2rem',height:'2rem'}}>
                      <AlertCircle className="w-4 h-4 text-warning" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground leading-tight">{t("dashboard.alertsNotifications")}</h3>
                  </div>
                  {notifications.some((n) => !n.read) && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" title="Unread" />
                  )}
                </div>
                <div className="space-y-2">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className={clsx(
                          "px-3 py-2.5 rounded-xl border-l-4 transition-colors",
                          notif.read
                            ? "stat-tile !border-l-border"
                            : "bg-primary/5 border-l-primary"
                        )}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-semibold text-foreground truncate flex-1 mr-2">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground shrink-0">
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
                    <p className="text-xs sm:text-sm text-muted-foreground py-2">{t("dashboard.noNotificationsYet")}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Shipment Details */}
            <motion.div variants={itemVariants}>
              <div className="detail-card p-3 sm:p-5">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="section-icon-badge bg-primary/15" style={{width:'2rem',height:'2rem'}}>
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground leading-tight">{t("dashboard.shipmentDetails")}</h3>
                  </div>
                  {(activeTrip || activeRequest) && (
                    <Button
                      variant="ghost"
                      size="small"
                      className="text-[11px] sm:text-xs whitespace-nowrap"
                      onClick={() =>
                        navigate(
                          activeTrip
                            ? `/trips/${activeTrip._id}`
                            : `/requests/${activeRequest._id}`
                        )
                      }
                    >
                      {t("dashboard.readMore")}
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">
                        {user?.firstName?.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">ID: {user?._id?.slice(-8)}</p>
                    </div>
                  </div>

                  {activeTrip || activeRequest ? (
                    <>
                      <div className="stat-tile-primary !p-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-0.5">{t("dashboard.totalValue")}</p>
                        <p className="text-xl font-bold text-primary">
                          {user?.role !== "conducteur" && activeRequest
                            ? formatCurrency(activeRequest.price || 0)
                            : activeTrip
                              ? formatCurrency(acceptedRequests.reduce((s, r) => s + (Number(r.price) || 0), 0))
                              : "—"}
                        </p>
                      </div>
                      <div className="stat-tile space-y-2 !p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-xs text-muted-foreground">Status</span>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-xs font-bold capitalize">
                            {activeRequest ? activeRequest.status : activeTrip?.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-xs text-muted-foreground">Type</span>
                          <span className="px-2 py-0.5 bg-muted/60 text-foreground rounded-lg text-xs font-semibold capitalize">
                            {activeRequest?.cargo?.type || (acceptedRequests[0]?.cargo?.type ?? "—")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-xs text-muted-foreground">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-warning text-warning" />
                            <span className="font-bold text-sm">
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
                      <div className="stat-tile !p-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{t("dashboard.totalValue")}</p>
                        <p className="text-xl font-bold text-foreground">—</p>
                      </div>
                      <div className="stat-tile space-y-2 !p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Status</span>
                          <span className="text-xs text-muted-foreground">{t("dashboard.noActiveShipment")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Type</span>
                          <span className="text-xs text-muted-foreground">—</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-muted-foreground" />
                            <span className="font-bold text-sm">
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
              </div>
            </motion.div>
            </div>

            {/* Current Truck Capacity - drivers only */}
            {user?.role === "conducteur" && (
              <motion.div variants={itemVariants}>
                <div className="detail-card p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="section-icon-badge bg-primary/15">
                        <Truck className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">{t("dashboard.currentTruckCapacity")}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="small"
                      className="text-xs sm:text-sm"
                      onClick={() => navigate("/profile")}
                    >
                      {t("nav.profile")}
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {/* Radial capacity display */}
                    <div className="relative w-full h-24 sm:h-28 stat-tile rounded-xl flex items-center justify-center overflow-hidden">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/60 transition-[height] duration-700"
                        style={{ height: `${Math.min(100, capacityPercent)}%` }}
                      />
                      <Truck className="w-12 h-12 sm:w-14 sm:h-14 text-foreground/20 relative z-10" />
                      <span className="absolute bottom-2 right-2 text-xs font-bold text-primary z-10 bg-background/80 px-1.5 py-0.5 rounded-md">
                        {capacityPercent}%
                      </span>
                    </div>

                    <div className="stat-tile space-y-2 !p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{t("dashboard.truckId")}</span>
                        <span className="font-semibold text-foreground truncate ml-2">
                          {user?.vehicleInfo?.licensePlate || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{t("dashboard.capacity")}</span>
                        <span className="font-bold text-primary">{capacityPercent}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Status</span>
                        <span className={activeTrip ? "text-primary font-semibold" : "text-muted-foreground"}>
                          {activeTrip ? t("dashboard.onRoute") : t("dashboard.available")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{t("dashboard.weight")}</span>
                        <span className="font-semibold text-foreground">
                          {truckCapacityKg != null
                            ? `${Number(usedWeight).toLocaleString()} / ${Number(truckCapacityKg).toLocaleString()} kg`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recent Requests */}
            <motion.div variants={itemVariants}>
              <div className="detail-card p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="section-icon-badge bg-primary/15" style={{width:'2rem',height:'2rem'}}>
                      <Package className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">
                      {user?.role === "conducteur" ? t("dashboard.receivedRequests") : t("dashboard.myRequests")}
                    </h3>
                  </div>
                  <Link to="/requests">
                    <Button variant="ghost" size="small" className="text-xs sm:text-sm">
                      {t("dashboard.viewAll")} <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-2">
                  {recentRequests?.data?.requests?.length > 0 ? (
                    recentRequests.data.requests.map((request) => (
                      <div
                        key={request._id}
                        className="route-step-card"
                      >
                        <div className="flex items-start justify-between mb-1 gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs text-foreground truncate">
                              {request.cargo?.description?.substring(0, 30)}...
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {request.pickup?.city} → {request.delivery?.city}
                            </p>
                          </div>
                          <span
                            className={clsx(
                              "px-2 py-0.5 rounded-lg text-[10px] font-bold flex-shrink-0",
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
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                          <span>{request.cargo?.weight}kg</span>
                          <span className="font-bold text-foreground">{formatCurrency(request.price)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-muted-foreground">{t("dashboard.noRequestsFound")}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardPage
