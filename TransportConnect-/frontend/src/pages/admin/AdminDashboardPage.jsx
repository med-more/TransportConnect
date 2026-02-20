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
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import { adminAPI } from "../../services/api"
import { normalizeAvatarUrl } from "../../utils/avatar"
import { useNavigate } from "react-router-dom"
import { Bar, Line, Doughnut } from "react-chartjs-2"
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

  const stats = statsData?.data || {}
  
  // Calculate activity statistics from recent data
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
    },
    {
      title: "Manage Trips",
      description: "Monitor and manage all trips",
      icon: Truck,
      href: "/admin/trips",
    },
    {
      title: "Manage Requests",
      description: "Process transport requests",
      icon: Package,
      href: "/admin/requests",
    },
    {
      title: "Verifications",
      description: "Approve new users",
      icon: Shield,
      href: "/admin/verifications",
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

  if (statsLoading) {
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
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Comprehensive overview of platform performance, user activity, trip statistics, and system-wide metrics at a glance
                </p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your platform and monitor activity</p>
          </div>
        </motion.div>

        {/* Attention needed */}
        {needsAttention && (
          <motion.div variants={itemVariants}>
            <Link to={(stats.pendingVerifications || 0) > 0 ? "/admin/verifications" : "/admin/requests"}>
              <Card className="p-4 border-l-4 border-l-warning bg-warning/5 hover:bg-warning/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/20">
                    <AlertCircle className="w-5 h-5 text-warning" />
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
                  <ArrowRight className="w-5 h-5 text-warning shrink-0" />
                </div>
              </Card>
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
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </Card>
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
          {/* Platform Overview Statistics */}
          <motion.div variants={itemVariants}>
            <Card className="p-4 sm:p-5 md:p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="admin-card-title">Platform overview</h3>
                  <p className="admin-card-subtitle">Users, trips, requests & verifications</p>
                </div>
              </div>
              <div className="h-48 sm:h-64 md:h-80">
                <Bar
                  data={{
                    labels: ["Users", "Trips", "Requests", "Pending Verifications"],
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
                      y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                      },
                    },
                  }}
                />
              </div>
            </Card>
          </motion.div>

          {/* Activity Statistics */}
          <motion.div variants={itemVariants}>
            <Card className="p-4 sm:p-5 md:p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-info/10">
                  <TrendingUp className="w-5 h-5 text-info" />
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
                        labels: {
                          padding: 15,
                          usePointStyle: true,
                        },
                      },
                      title: { display: false },
                    },
                  }}
                />
              </div>
            </Card>
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
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="admin-card-title">Quick actions</h3>
                    <p className="admin-card-subtitle">Jump to management sections</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.title}
                        onClick={() => navigate(action.href)}
                        className="p-4 bg-background rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all text-left group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <h4 className="font-semibold text-foreground text-sm sm:text-base">{action.title}</h4>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{action.description}</p>
                      </button>
                    )
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Recent Trips */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-info/10">
                      <Truck className="w-4 h-4 text-info" />
                    </div>
                    <h3 className="admin-card-title">Recent trips</h3>
                  </div>
                  <Link to="/admin/trips">
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
                  ) : (recentTrips?.data || []).length > 0 ? (
                    (recentTrips.data || []).slice(0, 5).map((trip) => (
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
                                {trip.departure?.city} → {trip.destination?.city}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {trip.driver?.firstName} {trip.driver?.lastName}
                              </p>
                            </div>
                          </div>
                          <span className="text-base sm:text-lg font-bold text-primary flex-shrink-0 truncate" title={`${Number(trip.pricePerKg).toFixed(2)}€/kg`}>
                            {Number(trip.pricePerKg).toFixed(2)}€/kg
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {trip.availableCapacity?.weight}kg available
                          </span>
                          <span
                            className={clsx(
                              "px-2 py-1 rounded-md text-xs font-medium",
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
              </Card>
            </motion.div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Recent Requests */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-warning/10">
                      <Package className="w-4 h-4 text-warning" />
                    </div>
                    <h3 className="admin-card-title">Recent requests</h3>
                  </div>
                  <Link to="/admin/requests">
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
                  ) : (recentRequests?.data || []).length > 0 ? (
                    (recentRequests.data || []).slice(0, 3).map((request) => (
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
                              "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium flex-shrink-0 capitalize",
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
                                        : request.status === "cancelled"
                                          ? "bg-muted text-muted-foreground"
                                          : "bg-muted text-muted-foreground"
                            )}
                          >
                            {request.status === "in_transit" ? "In Transit" : request.status}
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

            {/* Pending Verifications */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-success/10">
                      <Shield className="w-4 h-4 text-success" />
                    </div>
                    <h3 className="admin-card-title">Pending verifications</h3>
                  </div>
                  <Link to="/admin/verifications">
                    <Button variant="ghost" size="small" className="text-xs sm:text-sm">
                      View all <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {usersLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : (recentUsers?.data || []).filter((u) => !u.isVerified)?.length > 0 ? (
                    (recentUsers.data || []).filter((u) => !u.isVerified).slice(0, 3).map((user) => (
                        <div
                          key={user._id}
                          className="p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img
                                src={normalizeAvatarUrl(user.avatar)}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                onError={(e) => {
                                  e.target.style.display = "none"
                                  e.target.nextSibling.style.display = "flex"
                                }}
                              />
                            ) : null}
                            <div
                              className={clsx(
                                "w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0",
                                user.avatar && "hidden"
                              )}
                            >
                              <span className="text-white font-bold text-sm">
                                {user.firstName?.charAt(0)}
                                {user.lastName?.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground text-sm truncate">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                            <span className="px-2 py-1 bg-warning/10 text-warning rounded-md text-xs font-medium flex-shrink-0">
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
              </Card>
            </motion.div>

            {/* Platform at a glance */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="admin-card-title">Platform at a glance</h3>
                    <p className="admin-card-subtitle">Current counts</p>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between text-sm py-2 border-b border-border-subtle">
                    <span className="admin-description">Active users</span>
                    <span className="font-medium text-foreground">
                      {(recentUsers?.data || []).filter((u) => u.isActive)?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-2 border-b border-border-subtle">
                    <span className="admin-description">Verified users</span>
                    <span className="font-medium text-foreground">
                      {(recentUsers?.data || []).filter((u) => u.isVerified)?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-2 border-b border-border-subtle">
                    <span className="admin-description">Active trips</span>
                    <span className="font-medium text-foreground">
                      {(recentTrips?.data || []).filter((t) => t.status === "active")?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-2 border-b border-border-subtle">
                    <span className="admin-description">Pending requests</span>
                    <span className="font-medium text-foreground">
                      {(recentRequests?.data || []).filter((r) => r.status === "pending")?.length || 0}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AdminDashboardPage 