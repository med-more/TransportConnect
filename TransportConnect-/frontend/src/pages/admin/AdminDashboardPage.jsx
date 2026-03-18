/**
 * Admin dashboard – layout, typography, and data-display patterns aligned with
 * building-admin-dashboard-customizations (display on mount, loading states, semantic spacing).
 */
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import clsx from "clsx"
import {
  Users,
  Truck,
  Package,
  Shield,
  TrendingUp,
  ArrowRight,
  BarChart3,
  AlertCircle,
} from "../../utils/icons"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Skeleton from "../../components/ui/Skeleton"
import { adminAPI, documentsAPI } from "../../services/api"
import { normalizeAvatarUrl } from "../../utils/avatar"
import { useNavigate } from "react-router-dom"
import { Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const AdminDashboardPage = () => {
  const navigate = useNavigate()

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminAPI.getStats,
  })

  const { data: recentTrips, isLoading: tripsLoading } = useQuery({
    queryKey: ["admin-all-trips"],
    queryFn: () => adminAPI.getAllTrips(),
  })

  const { data: recentRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["admin-all-requests"],
    queryFn: () => adminAPI.getAllRequests(),
  })

  const { data: recentUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-all-users"],
    queryFn: () => adminAPI.getAllUsers(),
  })

  const { data: pendingDocuments = [] } = useQuery({
    queryKey: ["admin-documents-pending-count"],
    queryFn: () => documentsAPI.list({ status: "pending" }),
  })

  const stats = statsData?.data || {}

  const allTrips = recentTrips?.data || []
  const allRequests = recentRequests?.data || []
  const allUsers = recentUsers?.data || []

  const activityStats = {
    activeTrips: allTrips.filter(t => t.status === "active").length,
    completedTrips: allTrips.filter(t => t.status === "completed").length,
    pendingRequests: allRequests.filter(r => r.status === "pending").length,
    acceptedRequests: allRequests.filter(r => r.status === "accepted").length,
    activeUsers: allUsers.filter(u => u.isActive !== false).length,
    verifiedUsers: allUsers.filter(u => u.isVerified === true).length,
  }

  const needsAttention = (stats.pendingVerifications || 0) > 0 || activityStats.pendingRequests > 0

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Active Trips",
      value: stats.totalTrips || 0,
      icon: Truck,
      color: "text-info",
      bgColor: "bg-info/10",
      change: "+5%",
      trend: "up",
    },
    {
      title: "Pending Requests",
      value: (recentRequests?.data || []).filter((r) => r.status === "pending")?.length || 0,
      icon: Package,
      color: "text-warning",
      bgColor: "bg-warning/10",
      change: "-3%",
      trend: "down",
    },
    {
      title: "Pending Verifications",
      value: stats.pendingVerifications || 0,
      icon: Shield,
      color: "text-success",
      bgColor: "bg-success/10",
      change: "+2%",
      trend: "up",
    },
  ]

  const quickActions = [
    {
      title: "Manage Users",
      description: "View, modify and verify user accounts",
      icon: Users,
      href: "/admin/users",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Manage Trips",
      description: "Monitor and manage all trips",
      icon: Truck,
      href: "/admin/trips",
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "Manage Requests",
      description: "Process transport requests",
      icon: Package,
      href: "/admin/requests",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Verifications",
      description: "Approve new users",
      icon: Shield,
      href: "/admin/verifications",
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  if (statsLoading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-tile">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-8 w-20 mt-2" />
              <Skeleton className="h-3 w-24 mt-2" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="detail-card p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="detail-card p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
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
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="mb-2">
            <div className="flex items-start gap-4">
              <div className="section-icon-badge bg-primary/15">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1">
                  Admin Dashboard
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Comprehensive overview of platform performance, user activity, trip statistics, and system-wide metrics
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Attention banners */}
        {needsAttention && (
          <motion.div variants={itemVariants}>
            <Link to={(stats.pendingVerifications || 0) > 0 ? "/admin/verifications" : "/admin/requests"}>
              <div className="detail-card p-4 border-l-4 border-l-warning hover:border-warning/80 cursor-pointer transition-all group">
                <div className="flex items-center gap-3">
                  <div className="section-icon-badge bg-warning/15">
                    <AlertCircle className="w-4 h-4 text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">Attention needed</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {(stats.pendingVerifications || 0) > 0 && activityStats.pendingRequests > 0
                        ? `${stats.pendingVerifications} verification(s) and ${activityStats.pendingRequests} pending request(s) need review`
                        : (stats.pendingVerifications || 0) > 0
                          ? `${stats.pendingVerifications} user verification(s) pending`
                          : `${activityStats.pendingRequests} request(s) awaiting action`}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-warning shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {pendingDocuments.length > 0 && (
          <motion.div variants={itemVariants}>
            <Link to="/admin/documents">
              <div className="detail-card p-4 border-l-4 border-l-info hover:border-info/80 cursor-pointer transition-all group">
                <div className="flex items-center gap-3">
                  <div className="section-icon-badge bg-info/15">
                    <AlertCircle className="w-4 h-4 text-info" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">Documents pending</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {pendingDocuments.length} document verification(s) pending
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-info shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Key metrics */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="admin-label px-2">Key metrics</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              const isPrimary = index === statCards.length - 1
              return (
                <div
                  key={index}
                  className={clsx("cursor-pointer", isPrimary ? "stat-tile-primary" : "stat-tile")}
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
          </div>
        </motion.div>

        {/* Analytics */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="admin-label px-2">Analytics</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {/* Platform Overview chart */}
            <motion.div variants={itemVariants}>
              <div className="detail-card p-4 sm:p-5 md:p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="section-icon-badge bg-primary/15">
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="admin-card-title">Platform overview</h3>
                    <p className="admin-card-subtitle">Users, trips, requests & verifications</p>
                  </div>
                </div>
                <div className="h-48 sm:h-64 md:h-80">
                  <Bar
                    data={{
                      labels: ["Users", "Trips", "Requests", "Pending Verif."],
                      datasets: [
                        {
                          label: "Statistics",
                          data: [
                            stats.totalUsers || 0,
                            stats.totalTrips || 0,
                            stats.totalRequests || 0,
                            stats.pendingVerifications || 0,
                          ],
                          backgroundColor: [
                            "rgba(239, 68, 68, 0.8)",
                            "rgba(59, 130, 246, 0.8)",
                            "rgba(245, 158, 11, 0.8)",
                            "rgba(34, 197, 94, 0.8)",
                          ],
                          borderRadius: 8,
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        title: { display: false },
                      },
                      scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1 } },
                      },
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Activity Distribution chart */}
            <motion.div variants={itemVariants}>
              <div className="detail-card p-4 sm:p-5 md:p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="section-icon-badge bg-info/15">
                    <TrendingUp className="w-4 h-4 text-info" />
                  </div>
                  <div>
                    <h3 className="admin-card-title">Activity distribution</h3>
                    <p className="admin-card-subtitle">Trips & requests by status</p>
                  </div>
                </div>
                <div className="h-48 sm:h-64 md:h-80">
                  <Doughnut
                    data={{
                      labels: ["Active Trips", "Completed Trips", "Pending Requests", "Accepted Requests"],
                      datasets: [
                        {
                          label: "Activity",
                          data: [
                            activityStats.activeTrips,
                            activityStats.completedTrips,
                            activityStats.pendingRequests,
                            activityStats.acceptedRequests,
                          ],
                          backgroundColor: [
                            "rgba(59, 130, 246, 0.8)",
                            "rgba(34, 197, 94, 0.8)",
                            "rgba(245, 158, 11, 0.8)",
                            "rgba(168, 85, 247, 0.8)",
                          ],
                          borderColor: [
                            "rgba(59, 130, 246, 1)",
                            "rgba(34, 197, 94, 1)",
                            "rgba(245, 158, 11, 1)",
                            "rgba(168, 85, 247, 1)",
                          ],
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: "bottom",
                          labels: { padding: 15, usePointStyle: true },
                        },
                        title: { display: false },
                      },
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick access & Activity */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="admin-label px-2">Quick access & activity</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {/* Left Column - 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <motion.div variants={itemVariants}>
                <div className="detail-card p-4 sm:p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="section-icon-badge bg-primary/15">
                      <Truck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="admin-card-title">Quick actions</h3>
                      <p className="admin-card-subtitle">Jump to management sections</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quickActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <button
                          key={action.title}
                          onClick={() => navigate(action.href)}
                          className="route-step-card text-left group"
                        >
                          <div className="flex items-center gap-3 mb-1.5">
                            <div className={clsx("section-icon-badge shrink-0", action.bgColor)} style={{width:'2rem',height:'2rem'}}>
                              <Icon className={clsx("w-3.5 h-3.5", action.color)} />
                            </div>
                            <h4 className="font-bold text-foreground text-sm">{action.title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground pl-9">{action.description}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Recent Trips */}
              <motion.div variants={itemVariants}>
                <div className="detail-card p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="section-icon-badge bg-info/15" style={{width:'2rem',height:'2rem'}}>
                        <Truck className="w-3.5 h-3.5 text-info" />
                      </div>
                      <h3 className="admin-card-title">Recent trips</h3>
                    </div>
                    <Link to="/admin/trips">
                      <Button variant="ghost" size="small" className="text-xs sm:text-sm">
                        View all <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {tripsLoading ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner />
                      </div>
                    ) : (recentTrips?.data || []).length > 0 ? (
                      (recentTrips.data || []).slice(0, 5).map((trip) => (
                        <div key={trip._id} className="route-step-card">
                          <div className="flex items-start justify-between mb-1 gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="section-icon-badge bg-primary/10 shrink-0" style={{width:'1.75rem',height:'1.75rem'}}>
                                <Truck className="w-3 h-3 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-foreground text-sm truncate">
                                  {trip.departure?.city} → {trip.destination?.city}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {trip.driver?.firstName} {trip.driver?.lastName}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-primary flex-shrink-0">
                              {Number(trip.pricePerKg).toFixed(2)}€/kg
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground pl-8">
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {trip.availableCapacity?.weight}kg
                            </span>
                            <span
                              className={clsx(
                                "px-2 py-0.5 rounded-lg text-[10px] font-bold",
                                trip.status === "active"
                                  ? "bg-success/10 text-success"
                                  : trip.status === "completed"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                              )}
                            >
                              {trip.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-sm text-muted-foreground">No trips found</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - 1/3 */}
            <div className="space-y-6">
              {/* Recent Requests */}
              <motion.div variants={itemVariants}>
                <div className="detail-card p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="section-icon-badge bg-warning/15" style={{width:'2rem',height:'2rem'}}>
                        <Package className="w-3.5 h-3.5 text-warning" />
                      </div>
                      <h3 className="admin-card-title">Recent requests</h3>
                    </div>
                    <Link to="/admin/requests">
                      <Button variant="ghost" size="small" className="text-xs sm:text-sm">
                        View all <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {requestsLoading ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner />
                      </div>
                    ) : (recentRequests?.data || []).length > 0 ? (
                      (recentRequests.data || []).slice(0, 3).map((request) => (
                        <div key={request._id} className="route-step-card">
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
                                "px-2 py-0.5 rounded-lg text-[10px] font-bold flex-shrink-0 capitalize",
                                request.status === "pending"
                                  ? "bg-warning/10 text-warning"
                                  : request.status === "accepted"
                                    ? "bg-success/10 text-success"
                                    : request.status === "rejected"
                                      ? "bg-destructive/10 text-destructive"
                                      : request.status === "delivered"
                                        ? "bg-success/10 text-success"
                                        : request.status === "in_transit"
                                          ? "bg-info/10 text-info"
                                          : "bg-muted text-muted-foreground"
                              )}
                            >
                              {request.status === "in_transit" ? "In Transit" : request.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                            <span>{request.cargo?.weight}kg</span>
                            <span className="font-bold text-foreground">{request.price}€</span>
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
                </div>
              </motion.div>

              {/* Pending Verifications */}
              <motion.div variants={itemVariants}>
                <div className="detail-card p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="section-icon-badge bg-success/15" style={{width:'2rem',height:'2rem'}}>
                        <Shield className="w-3.5 h-3.5 text-success" />
                      </div>
                      <h3 className="admin-card-title">Pending verifications</h3>
                    </div>
                    <Link to="/admin/verifications">
                      <Button variant="ghost" size="small" className="text-xs sm:text-sm">
                        View all <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {usersLoading ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner />
                      </div>
                    ) : (recentUsers?.data || []).filter((u) => !u.isVerified)?.length > 0 ? (
                      (recentUsers.data || []).filter((u) => !u.isVerified).slice(0, 3).map((user) => (
                        <div key={user._id} className="route-step-card">
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img
                                src={normalizeAvatarUrl(user.avatar)}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                onError={(e) => {
                                  e.target.style.display = "none"
                                  e.target.nextSibling.style.display = "flex"
                                }}
                              />
                            ) : null}
                            <div
                              className={clsx(
                                "w-9 h-9 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm",
                                user.avatar && "hidden"
                              )}
                            >
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-sm truncate">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                            <span className="px-2 py-0.5 bg-warning/10 text-warning rounded-lg text-[10px] font-bold flex-shrink-0">
                              Pending
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-sm text-muted-foreground">No pending verifications</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Platform at a glance */}
              <motion.div variants={itemVariants}>
                <div className="detail-card p-4 sm:p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="section-icon-badge bg-primary/15">
                      <BarChart3 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="admin-card-title">Platform at a glance</h3>
                      <p className="admin-card-subtitle">Current counts</p>
                    </div>
                  </div>
                  <div className="stat-tile !p-3 space-y-2.5">
                    {[
                      { label: "Active users", value: (recentUsers?.data || []).filter((u) => u.isActive)?.length || 0 },
                      { label: "Verified users", value: (recentUsers?.data || []).filter((u) => u.isVerified)?.length || 0 },
                      { label: "Active trips", value: (recentTrips?.data || []).filter((t) => t.status === "active")?.length || 0 },
                      { label: "Pending requests", value: (recentRequests?.data || []).filter((r) => r.status === "pending")?.length || 0 },
                    ].map((row, i, arr) => (
                      <div
                        key={row.label}
                        className={clsx(
                          "flex items-center justify-between text-xs py-1.5",
                          i < arr.length - 1 && "border-b border-white/5"
                        )}
                      >
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="font-bold text-foreground">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AdminDashboardPage