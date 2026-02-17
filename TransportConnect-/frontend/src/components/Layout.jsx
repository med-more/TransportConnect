import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "../contexts/AuthContext"
import {
  Home,
  Truck,
  Package,
  MessageCircle,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  BarChart3,
  Users,
  FileText,
  Bell,
  Search,
  ChevronDown,
  Plus,
  History,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Trash2,
  AlertCircle,
} from "../utils/icons"
import clsx from "clsx"
import Button from "./ui/Button"
import logo from "../assets/logo.svg"
import { normalizeAvatarUrl } from "../utils/avatar"
import { tripsAPI, requestsAPI, notificationsAPI } from "../services/api"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

const Layout = ({ children }) => {
  // Load sidebar collapsed state from localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed")
    return saved ? JSON.parse(saved) : false
  })
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile sidebar
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const notificationRef = useRef(null)
  const searchRef = useRef(null)
  const mobileSearchRef = useRef(null)

  // Debug: Log user avatar on mount and when user changes
  useEffect(() => {
    if (user) {
      console.log("👤 Layout - User object:", user)
      console.log("📸 Layout - User avatar:", user.avatar)
      console.log("📸 Layout - Normalized avatar URL:", user.avatar ? normalizeAvatarUrl(user.avatar) : "No avatar")
    }
  }, [user])

  // Save sidebar collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed))
  }, [sidebarCollapsed])

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Mes trajets", href: "/trips", icon: Truck },
    { name: "Mes demandes", href: "/requests", icon: Package },
    { name: "Profil", href: "/profile", icon: User },
  ]

  const getCreateButtonHref = () => {
    if (user?.role === "conducteur") {
      return "/trips/create"
    }
    return "/requests/create"
  }

  const getCreateButtonLabel = () => {
    if (user?.role === "conducteur") {
      return "Créer un trajet"
    }
    return "Créer une demande"
  }

  const adminNavigationItems = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Utilisateurs", href: "/admin/users", icon: Users },
    { name: "Trajets", href: "/admin/trips", icon: Truck },
    { name: "Demandes", href: "/admin/requests", icon: Package },
    { name: "Vérifications", href: "/admin/verifications", icon: Shield },
  ]

  const currentNavigationItems = user?.role === "admin" ? [...adminNavigationItems] : [...navigationItems]

  // Fetch trips and requests for search
  const { data: tripsData } = useQuery({
    queryKey: ["search-trips"],
    queryFn: () => (user?.role === "conducteur" ? tripsAPI.getMyTrips({ limit: 50 }) : tripsAPI.getTrips({ limit: 50 })),
    enabled: !!user && searchQuery.length >= 2,
  })

  const { data: requestsData } = useQuery({
    queryKey: ["search-requests"],
    queryFn: () =>
      user?.role === "conducteur"
        ? requestsAPI.getReceivedRequests({ limit: 50 })
        : requestsAPI.getRequests({ limit: 50 }),
    enabled: !!user && searchQuery.length >= 2,
  })

  // Fetch notifications
  const { data: notificationsData, refetch: refetchNotifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ["notifications", user?._id],
    queryFn: async () => {
      try {
        const response = await notificationsAPI.getNotifications({ limit: 50 })
        console.log("📬 Notifications response:", response)
        console.log("📬 Notifications response.data:", response.data)
        console.log("📬 Notifications response.data.notifications:", response.data?.notifications)
        console.log("📬 Notifications response.data.unreadCount:", response.data?.unreadCount)
        
        // Handle different response structures
        const data = response.data?.data || response.data
        const notifications = data?.notifications || []
        const unreadCount = data?.unreadCount || 0
        
        console.log("📬 Final notifications array:", notifications)
        console.log("📬 Final unreadCount:", unreadCount)
        
        return {
          notifications,
          unreadCount,
        }
      } catch (error) {
        console.error("❌ Error fetching notifications:", error)
        console.error("❌ Error response:", error.response)
        console.error("❌ Error response data:", error.response?.data)
        return { notifications: [], unreadCount: 0 }
      }
    },
    enabled: !!user,
    refetchInterval: 10000, // Poll every 10 seconds for better responsiveness
  })

  const notifications = notificationsData?.notifications || []
  const unreadCount = notificationsData?.unreadCount || 0
  
  // Debug: Log notifications state
  useEffect(() => {
    console.log("🔔 Current user._id:", user?._id)
    console.log("🔔 Current notificationsData:", notificationsData)
    console.log("🔔 Current notifications state:", notifications)
    console.log("🔔 Current unreadCount:", unreadCount)
    console.log("🔔 Notifications length:", notifications.length)
    if (notifications.length > 0) {
      console.log("🔔 First notification:", notifications[0])
    }
  }, [notifications, unreadCount, notificationsData, user?._id])

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "request_created":
        return <Package className="w-4 h-4 text-info" />
      case "request_accepted":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "request_rejected":
        return <XCircle className="w-4 h-4 text-destructive" />
      case "pickup_confirmed":
      case "in_transit":
        return <Truck className="w-4 h-4 text-primary" />
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "request_cancelled":
        return <XCircle className="w-4 h-4 text-warning" />
      case "trip_created":
        return <Truck className="w-4 h-4 text-info" />
      case "rating_received":
        return <Star className="w-4 h-4 text-warning" />
      case "account_verified":
        return <Shield className="w-4 h-4 text-success" />
      case "account_suspended":
        return <AlertCircle className="w-4 h-4 text-destructive" />
      case "account_reactivated":
        return <CheckCircle className="w-4 h-4 text-success" />
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />
    }
  }

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case "request_created":
        return "bg-info/10 border-info/20"
      case "request_accepted":
        return "bg-success/10 border-success/20"
      case "request_rejected":
        return "bg-destructive/10 border-destructive/20"
      case "pickup_confirmed":
        return "bg-primary/10 border-primary/20"
      case "in_transit":
        return "bg-info/10 border-info/20"
      case "delivered":
        return "bg-success/10 border-success/20"
      case "request_cancelled":
        return "bg-warning/10 border-warning/20"
      case "trip_created":
        return "bg-info/10 border-info/20"
      case "rating_received":
        return "bg-warning/10 border-warning/20"
      case "account_verified":
        return "bg-success/10 border-success/20"
      case "account_suspended":
        return "bg-destructive/10 border-destructive/20"
      case "account_reactivated":
        return "bg-success/10 border-success/20"
      default:
        return "bg-accent border-border"
    }
  }

  // Get time ago string
  const getTimeAgo = (date) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInSeconds = Math.floor((now - notificationDate) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return notificationDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  // Handle delete notification
  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation()
    try {
      await notificationsAPI.deleteNotification(notificationId)
      // Invalidate and refetch notifications
      await queryClient.invalidateQueries({ queryKey: ["notifications", user?._id] })
      await refetchNotifications()
      toast.success("Notification deleted")
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("Error deleting notification")
    }
  }

  const trips = tripsData?.data?.trips || []
  const requests = requestsData?.data?.requests || []

  // Filter search results
  const searchResults = {
    trips: searchQuery.length >= 2
      ? trips.filter(
          (trip) =>
            (trip.departure?.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (trip.destination?.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (trip.driver?.firstName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (trip.driver?.lastName || "").toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5)
      : [],
    requests: searchQuery.length >= 2
      ? requests.filter(
          (request) =>
            (request.pickup?.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (request.delivery?.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (request.cargo?.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (request.sender?.firstName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (request.sender?.lastName || "").toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5)
      : [],
  }

  const totalResults = searchResults.trips.length + searchResults.requests.length

  // Close notification popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setShowMobileSearch(false)
      }
    }
    if (showNotifications || showSearchResults || showMobileSearch) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showNotifications, showSearchResults, showMobileSearch])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to trips page with search query
      navigate(`/trips?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setShowSearchResults(false)
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setShowSearchResults(e.target.value.length >= 2)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-border flex flex-col transition-all duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className={clsx("flex items-center gap-3", sidebarCollapsed && "justify-center w-full")}>
            <img src={logo} alt="TransportConnect" className="h-16 w-auto flex-shrink-0" />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-foreground truncate">TransportConnect</h1>
                <p className="text-xs text-muted-foreground truncate">Tracking System</p>
              </div>
            )}
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
          {currentNavigationItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  "flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  sidebarCollapsed ? "justify-center px-3 py-3" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                title={sidebarCollapsed ? item.name : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}

          {/* Create Button in Navigation */}
          {user?.role !== "admin" && (
            <button
              onClick={() => {
                navigate(getCreateButtonHref())
                setSidebarOpen(false)
              }}
              className={clsx(
                "w-full relative overflow-hidden group transition-all duration-300 mt-2",
                sidebarCollapsed
                  ? "px-3 py-3 justify-center"
                  : "px-3 py-2.5 flex items-center gap-3",
                "bg-gradient-to-r from-primary via-primary to-primary/90",
                "hover:from-primary/90 hover:via-primary hover:to-primary",
                "text-white font-semibold rounded-lg",
                "shadow-lg hover:shadow-xl",
                "transform hover:scale-[1.02] active:scale-[0.98]"
              )}
              title={sidebarCollapsed ? getCreateButtonLabel() : ""}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              <div className="relative flex items-center justify-center gap-3 w-full">
                <div className="p-1 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                {!sidebarCollapsed && (
                  <span className="font-semibold text-sm">{getCreateButtonLabel()}</span>
                )}
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-lg bg-primary/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </button>
          )}
        </nav>

        {/* User Profile Section */}
        <div className={clsx("p-2 border-t border-border space-y-2", sidebarCollapsed && "px-2")}>
          {/* User Info */}
          <div
            className={clsx(
              "flex items-center rounded-lg bg-accent/50 group relative",
              sidebarCollapsed ? "justify-center p-2" : "gap-3 p-3"
            )}
            title={sidebarCollapsed ? `${user?.firstName} ${user?.lastName}` : ""}
          >
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={normalizeAvatarUrl(user.avatar)}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Avatar image failed to load:", normalizeAvatarUrl(user.avatar))
                    console.error("User avatar value:", user.avatar)
                    e.target.style.display = "none"
                    // Show initials if image fails
                    const parent = e.target.parentElement
                    if (parent && !parent.querySelector("span")) {
                      const initials = document.createElement("span")
                      initials.className = "text-sm font-semibold text-white"
                      initials.textContent = `${user?.firstName?.charAt(0)?.toUpperCase() || ""}${user?.lastName?.charAt(0)?.toUpperCase() || ""}`
                      parent.appendChild(initials)
                    }
                  }}
                  onLoad={() => {
                    console.log("✅ Avatar loaded successfully:", normalizeAvatarUrl(user.avatar))
                  }}
                />
              ) : (
                <span className="text-sm font-semibold text-white">
                  {user?.firstName?.charAt(0)?.toUpperCase()}
                  {user?.lastName?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground capitalize truncate">
                  {user?.role === "conducteur" ? "Driver" : user?.role === "expediteur" ? "Shipper" : "Admin"}
                </p>
              </div>
            )}
            {/* Tooltip for collapsed state */}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {user?.firstName} {user?.lastName}
                <br />
                <span className="text-xs opacity-90">
                  {user?.role === "conducteur" ? "Driver" : user?.role === "expediteur" ? "Shipper" : "Admin"}
                </span>
              </div>
            )}
          </div>


          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={clsx(
              "w-full flex items-center rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-accent transition-colors",
              sidebarCollapsed ? "justify-center px-3 py-2" : "gap-2 px-3 py-2"
            )}
            title={sidebarCollapsed ? "Logout" : ""}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={clsx(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-border">
          <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 md:py-4 gap-2">
            {/* Left: Sidebar Toggle */}
            <div className="flex-shrink-0">
              {/* Desktop Sidebar Toggle */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-2 hover:bg-accent rounded-lg transition-colors"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu className="w-5 h-5 text-foreground" />
              </button>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Center: Welcome & Search */}
            <div className="flex-1 flex items-center justify-center gap-4 min-w-0">
              <div className="hidden lg:block text-center min-w-0">
                <h2 className="text-base lg:text-lg font-semibold text-foreground">
                  Welcome back, {user?.firstName}!
                </h2>
                <p className="text-xs lg:text-sm text-muted-foreground hidden xl:block">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="hidden md:flex max-w-md w-full min-w-0">
                <form onSubmit={handleSearchSubmit} className="relative w-full" ref={searchRef}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search trips, requests..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchQuery.length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                      {totalResults === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No results found</p>
                        </div>
                      ) : (
                        <>
                          {searchResults.trips.length > 0 && (
                            <div className="p-2">
                              <p className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">Trips</p>
                              {searchResults.trips.map((trip) => (
                                <Link
                                  key={trip._id}
                                  to={`/trips/${trip._id}`}
                                  onClick={() => {
                                    setSearchQuery("")
                                    setShowSearchResults(false)
                                  }}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                >
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    <Truck className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {trip.departure?.city} → {trip.destination?.city}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {trip.driver?.firstName} {trip.driver?.lastName}
                                    </p>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                </Link>
                              ))}
                            </div>
                          )}
                          
                          {searchResults.requests.length > 0 && (
                            <div className="p-2 border-t border-border">
                              <p className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">Requests</p>
                              {searchResults.requests.map((request) => (
                                <Link
                                  key={request._id}
                                  to={`/requests/${request._id}`}
                                  onClick={() => {
                                    setSearchQuery("")
                                    setShowSearchResults(false)
                                  }}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                >
                                  <div className="p-2 bg-info/10 rounded-lg">
                                    <Package className="w-4 h-4 text-info" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {request.pickup?.city} → {request.delivery?.city}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {request.cargo?.description?.substring(0, 30)}...
                                    </p>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Right: Search (Mobile), Notifications & User Menu */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Mobile Search Icon */}
              <button
                onClick={() => setShowMobileSearch(true)}
                className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-foreground" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      ref={notificationRef}
                      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-border rounded-xl shadow-2xl z-50 max-h-[calc(100vh-120px)] overflow-hidden flex flex-col"
                    >
                      {/* Header */}
                      <div className="p-3 sm:p-4 border-b border-border bg-background">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                              <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full">
                                {unreadCount > 99 ? "99+" : unreadCount}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation()
                                  try {
                                    const response = await notificationsAPI.markAllAsRead()
                                    console.log("✅ Mark all as read response:", response.data)
                                    // Force immediate refetch by invalidating and refetching
                                    await queryClient.invalidateQueries({ queryKey: ["notifications", user?._id] })
                                    // Use refetch with force option
                                    const refetched = await refetchNotifications({ cancelRefetch: false })
                                    console.log("✅ Refetched notifications data:", refetched.data)
                                    toast.success("All notifications marked as read")
                                  } catch (error) {
                                    console.error("❌ Error marking all as read:", error)
                                    console.error("❌ Error details:", error.response?.data)
                                    toast.error(error.response?.data?.message || "Error marking all as read")
                                  }
                                }}
                                className="text-xs text-primary hover:text-primary/80 font-medium transition-colors px-2 py-1 hover:bg-primary/5 rounded"
                                title="Mark all as read"
                              >
                                Mark all read
                              </button>
                            )}
                            <button
                              onClick={() => setShowNotifications(false)}
                              className="p-1 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground"
                              title="Close"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                        {notificationsLoading ? (
                          <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                            <p className="text-sm text-muted-foreground mt-2">Loading notifications...</p>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                              <Bell className="w-8 h-8 text-muted-foreground opacity-50" />
                            </div>
                            <p className="text-sm font-medium text-foreground mb-1">No notifications</p>
                            <p className="text-xs text-muted-foreground">You're all caught up!</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-border">
                            <AnimatePresence mode="popLayout">
                              {notifications.map((notif, index) => {
                                const requestId = notif.relatedRequest?._id || notif.relatedRequest
                                const tripId = notif.relatedTrip?._id || notif.relatedTrip
                                const timeAgo = getTimeAgo(notif.createdAt)

                                return (
                                  <motion.div
                                    key={notif._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={async () => {
                                      if (!notif.read) {
                                        try {
                                          await notificationsAPI.markAsRead(notif._id)
                                          // Invalidate and refetch notifications
                                          await queryClient.invalidateQueries({ queryKey: ["notifications", user?._id] })
                                          await refetchNotifications()
                                        } catch (error) {
                                          console.error("Error marking notification as read:", error)
                                        }
                                      }
                                      if (requestId) {
                                        navigate(`/requests/${requestId}`)
                                        setShowNotifications(false)
                                      } else if (tripId) {
                                        navigate(`/trips/${tripId}`)
                                        setShowNotifications(false)
                                      }
                                    }}
                                    className={clsx(
                                      "group relative p-4 hover:bg-accent/50 transition-all cursor-pointer",
                                      !notif.read && "bg-primary/5"
                                    )}
                                  >
                                    <div className="flex items-start gap-3">
                                      {/* Avatar or Icon */}
                                      {notif.sender ? (
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                          {notif.sender?.avatar ? (
                                            <img
                                              src={normalizeAvatarUrl(notif.sender.avatar)}
                                              alt={`${notif.sender.firstName} ${notif.sender.lastName}`}
                                              className="w-full h-full object-cover"
                                              onError={(e) => {
                                                e.target.style.display = "none"
                                                // Show initials if image fails
                                                const parent = e.target.parentElement
                                                if (parent && !parent.querySelector("span")) {
                                                  const initials = document.createElement("span")
                                                  initials.className = "text-sm font-semibold text-white"
                                                  initials.textContent = `${notif.sender?.firstName?.charAt(0)?.toUpperCase() || ""}${notif.sender?.lastName?.charAt(0)?.toUpperCase() || ""}`
                                                  parent.appendChild(initials)
                                                }
                                              }}
                                            />
                                          ) : (
                                            <span className="text-sm font-semibold text-white">
                                              {notif.sender?.firstName?.charAt(0)?.toUpperCase() || ""}
                                              {notif.sender?.lastName?.charAt(0)?.toUpperCase() || ""}
                                            </span>
                                          )}
                                        </div>
                                      ) : (
                                        <div className={clsx(
                                          "p-2 rounded-lg flex-shrink-0 border",
                                          getNotificationColor(notif.type)
                                        )}>
                                          {getNotificationIcon(notif.type)}
                                        </div>
                                      )}

                                      {/* Content */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                          <p className={clsx(
                                            "text-sm font-semibold text-foreground",
                                            !notif.read && "font-bold"
                                          )}>
                                            {notif.title}
                                          </p>
                                          {!notif.read && (
                                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                                          )}
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                                          {notif.message}
                                        </p>
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-muted-foreground">{timeAgo}</span>
                                          {notif.sender && (
                                            <span className="text-xs text-muted-foreground">
                                              {notif.sender.firstName} {notif.sender.lastName}
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Actions */}
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={(e) => handleDeleteNotification(e, notif._id)}
                                          className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                                          title="Delete notification"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              })}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Avatar */}
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.avatar ? (
                  <img
                    src={normalizeAvatarUrl(user.avatar)}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Avatar image failed to load in header:", normalizeAvatarUrl(user.avatar))
                      console.error("User avatar value in header:", user.avatar)
                      e.target.style.display = "none"
                      // Show initials if image fails
                      const parent = e.target.parentElement
                      if (parent && !parent.querySelector("span")) {
                        const initials = document.createElement("span")
                        initials.className = "text-sm font-semibold text-white"
                        initials.textContent = `${user?.firstName?.charAt(0)?.toUpperCase() || ""}${user?.lastName?.charAt(0)?.toUpperCase() || ""}`
                        parent.appendChild(initials)
                      }
                    }}
                    onLoad={() => {
                      console.log("✅ Avatar loaded successfully in header:", normalizeAvatarUrl(user.avatar))
                    }}
                  />
                ) : (
                  <span className="text-sm font-semibold text-white">
                    {user?.firstName?.charAt(0)?.toUpperCase()}
                    {user?.lastName?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileSearch(false)}
          />
          {/* Search Modal */}
          <div 
            ref={mobileSearchRef}
            className="absolute top-0 left-0 right-0 bg-white border-b border-border shadow-lg"
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <form onSubmit={handleSearchSubmit} className="flex-1 relative" ref={searchRef}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search trips, requests..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    autoFocus
                  />
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchQuery.length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-50 max-h-[60vh] overflow-y-auto">
                      {totalResults === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No results found</p>
                        </div>
                      ) : (
                        <>
                          {searchResults.trips.length > 0 && (
                            <div className="p-2">
                              <p className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">Trips</p>
                              {searchResults.trips.map((trip) => (
                                <Link
                                  key={trip._id}
                                  to={`/trips/${trip._id}`}
                                  onClick={() => {
                                    setSearchQuery("")
                                    setShowSearchResults(false)
                                    setShowMobileSearch(false)
                                  }}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                >
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    <Truck className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {trip.departure?.city} → {trip.destination?.city}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {trip.driver?.firstName} {trip.driver?.lastName}
                                    </p>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                </Link>
                              ))}
                            </div>
                          )}
                          
                          {searchResults.requests.length > 0 && (
                            <div className="p-2 border-t border-border">
                              <p className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">Requests</p>
                              {searchResults.requests.map((request) => (
                                <Link
                                  key={request._id}
                                  to={`/requests/${request._id}`}
                                  onClick={() => {
                                    setSearchQuery("")
                                    setShowSearchResults(false)
                                    setShowMobileSearch(false)
                                  }}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                >
                                  <div className="p-2 bg-info/10 rounded-lg">
                                    <Package className="w-4 h-4 text-info" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {request.pickup?.city} → {request.delivery?.city}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {request.cargo?.description?.substring(0, 30)}...
                                    </p>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </form>
                <button
                  onClick={() => setShowMobileSearch(false)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout
