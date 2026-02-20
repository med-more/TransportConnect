import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../contexts/AuthContext"
import {
  BarChart3,
  Truck,
  Package,
  Shield,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sun,
  Moon,
} from "../utils/icons"
import clsx from "clsx"
import Button from "./ui/Button"
import logo from "../assets/logo.svg"
import { normalizeAvatarUrl } from "../utils/avatar"
import { adminAPI } from "../services/api"
import { useTheme } from "../contexts/ThemeContext"

const AdminLayout = ({ children }) => {
  // Load sidebar collapsed state from localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed")
    return saved ? JSON.parse(saved) : false
  })
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile sidebar
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const notificationRef = useRef(null)
  const searchRef = useRef(null)
  const mobileSearchRef = useRef(null)

  // Save sidebar collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed))
  }, [sidebarCollapsed])

  const adminNavigationItems = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Utilisateurs", href: "/admin/users", icon: Users },
    { name: "Trajets", href: "/admin/trips", icon: Truck },
    { name: "Demandes", href: "/admin/requests", icon: Package },
    { name: "Vérifications", href: "/admin/verifications", icon: Shield },
  ]

  // Fetch data for admin search
  const { data: tripsData } = useQuery({
    queryKey: ["admin-search-trips"],
    queryFn: adminAPI.getAllTrips,
    enabled: !!user && searchQuery.length >= 2,
  })

  const { data: requestsData } = useQuery({
    queryKey: ["admin-search-requests"],
    queryFn: adminAPI.getAllRequests,
    enabled: !!user && searchQuery.length >= 2,
  })

  const { data: usersData } = useQuery({
    queryKey: ["admin-search-users"],
    queryFn: adminAPI.getAllUsers,
    enabled: !!user && searchQuery.length >= 2,
  })

  const trips = tripsData?.data || []
  const requests = requestsData?.data || []
  const allUsers = usersData?.data || []

  // Filter search results
  const searchResults = {
    trips: searchQuery.length >= 2
      ? trips.filter(
          (trip) =>
            (trip.departure?.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (trip.destination?.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (trip.driver?.firstName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (trip.driver?.lastName || "").toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3)
      : [],
    requests: searchQuery.length >= 2
      ? requests.filter(
          (request) =>
            (request.pickup?.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (request.delivery?.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (request.cargo?.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (request.sender?.firstName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (request.sender?.lastName || "").toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3)
      : [],
    users: searchQuery.length >= 2
      ? allUsers.filter(
          (user) =>
            (user.firstName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.lastName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email || "").toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3)
      : [],
  }

  const totalResults = searchResults.trips.length + searchResults.requests.length + searchResults.users.length

  // Close notification popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }
    if (showNotifications || showSearchResults) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showNotifications, showSearchResults])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to trips page with search query
      navigate(`/admin/trips?search=${encodeURIComponent(searchQuery)}`)
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
    <div className="min-h-screen bg-background flex relative">
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
          "fixed inset-y-0 left-0 z-50 bg-card dark:bg-[#0a0a0a] border-r border-border flex flex-col transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
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
                <p className="text-xs text-muted-foreground truncate">Admin Panel</p>
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
          {adminNavigationItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  "flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative",
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
                <p className="text-xs text-muted-foreground capitalize truncate">Admin</p>
              </div>
            )}
            {/* Tooltip for collapsed state */}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {user?.firstName} {user?.lastName}
                <br />
                <span className="text-xs opacity-90">Admin</span>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={clsx(
              "w-full flex items-center rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-accent transition-colors",
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
          "flex-1 flex flex-col w-full relative z-0",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64",
          "transition-[padding-left] duration-300 ease-in-out"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-card dark:bg-[#0a0a0a] border-b border-border">
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
                    placeholder="Search trips, requests, users..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchQuery.length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
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
                                  to={`/admin/trips`}
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
                                  to={`/admin/requests`}
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

                          {searchResults.users.length > 0 && (
                            <div className="p-2 border-t border-border">
                              <p className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">Users</p>
                              {searchResults.users.map((searchUser) => (
                                <Link
                                  key={searchUser._id}
                                  to={`/admin/users`}
                                  onClick={() => {
                                    setSearchQuery("")
                                    setShowSearchResults(false)
                                  }}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                >
                                  <div className="p-2 bg-success/10 rounded-lg">
                                    <Users className="w-4 h-4 text-success" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {searchUser.firstName} {searchUser.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {searchUser.email}
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

            {/* Right: Theme toggle, Search (Mobile), Notifications & User Menu */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-accent transition-colors text-foreground"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
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
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div
                    ref={notificationRef}
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-card border border-border rounded-lg shadow-lg z-50 max-h-[calc(100vh-120px)] overflow-hidden"
                  >
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Notifications</h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border">
                          {notifications.map((notif, idx) => (
                            <div
                              key={idx}
                              className={clsx(
                                "p-4 hover:bg-accent transition-colors cursor-pointer",
                                !notif.read && "bg-accent/50"
                              )}
                            >
                              <p className="text-sm font-medium text-foreground">{notif.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notif.date).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.avatar ? (
                  <img
                    src={normalizeAvatarUrl(user.avatar)}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
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
            className="absolute top-0 left-0 right-0 bg-card dark:bg-[#0a0a0a] border-b border-border shadow-lg"
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <form onSubmit={handleSearchSubmit} className="flex-1 relative" ref={searchRef}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search trips, requests, users..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    autoFocus
                  />
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchQuery.length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-[60vh] overflow-y-auto">
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
                                  to={`/admin/trips`}
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
                                  to={`/admin/requests`}
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

                          {searchResults.users.length > 0 && (
                            <div className="p-2 border-t border-border">
                              <p className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">Users</p>
                              {searchResults.users.map((searchUser) => (
                                <Link
                                  key={searchUser._id}
                                  to={`/admin/users`}
                                  onClick={() => {
                                    setSearchQuery("")
                                    setShowSearchResults(false)
                                    setShowMobileSearch(false)
                                  }}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                >
                                  <div className="p-2 bg-success/10 rounded-lg">
                                    <Users className="w-4 h-4 text-success" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {searchUser.firstName} {searchUser.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {searchUser.email}
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

export default AdminLayout
