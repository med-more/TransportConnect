import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useSocket } from "../contexts/SocketContext"
import { Home, Truck, Package, MessageCircle, User, LogOut, Menu, X, Shield, Bell, Settings, BarChart3, Users, FileText } from "lucide-react"
import clsx from "clsx"

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const { user, logout } = useAuth()
  const { socket, isConnected } = useSocket()
  const location = useLocation()
  const navigate = useNavigate()
  const notificationRef = useRef(null)

  const navigationItems = [
    { name: "Tableau de bord", href: "/dashboard", icon: Home },
    { name: "Mes trajets", href: "/trips", icon: Truck },
    { name: "Mes demandes", href: "/requests", icon: Package },
    { name: "Profil", href: "/profile", icon: User },
  ]

  const adminNavigationItems = [
    { name: "Admin Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Utilisateurs", href: "/admin/users", icon: Users },
    { name: "Trajets", href: "/admin/trips", icon: Truck },
    { name: "Demandes", href: "/admin/requests", icon: Package },
    { name: "Vérifications", href: "/admin/verifications", icon: Shield },
  ]

  const notificationNavItem = { name: "Notifications", icon: Bell, isNotification: true }
  const currentNavigationItems = user?.role === "admin" ? [...adminNavigationItems, notificationNavItem] : [...navigationItems, notificationNavItem]

  // Écoute des notifications via socket
  useEffect(() => {
    if (!socket || !user) return

    console.log("🔔 Configuration des écouteurs de notifications pour:", user.firstName)

    // Fonction pour gérer les nouvelles demandes (pour les conducteurs)
    const handleNewRequest = (data) => {
      console.log("📨 Nouvelle demande reçue:", data)
      const notification = {
        title: "Nouvelle demande de transport 📦",
        message: `Nouvelle demande de ${data.sender.name} pour le trajet ${data.trip.departure} → ${data.trip.destination}`,
        type: "info",
        date: new Date(),
        read: false,
        requestId: data.requestId
      }
      setNotifications((prev) => [notification, ...prev])
    }

    // Fonction pour gérer l'acceptation de demande (pour les expéditeurs)
    const handleRequestAccepted = (data) => {
      console.log("✅ Demande acceptée reçue:", data)
      const notification = {
        title: "Demande acceptée ! 🎉",
        message: `Votre demande a été acceptée par ${data.driver.name}. ${data.message ? `Message: ${data.message}` : ''}`,
        type: "success",
        date: new Date(),
        read: false,
        requestId: data.requestId
      }
      setNotifications((prev) => [notification, ...prev])
    }

    // Fonction pour gérer le refus de demande (pour les expéditeurs)
    const handleRequestRejected = (data) => {
      console.log("❌ Demande refusée reçue:", data)
      const notification = {
        title: "Demande refusée",
        message: `Votre demande a été refusée par ${data.driver.name}. ${data.message ? `Raison: ${data.message}` : ''}`,
        type: "error",
        date: new Date(),
        read: false,
        requestId: data.requestId
      }
      setNotifications((prev) => [notification, ...prev])
    }

    // Fonction pour gérer les autres mises à jour de demandes
    const handleRequestUpdated = (data) => {
      console.log("📨 Mise à jour de demande reçue:", data)
      const notification = {
        title: "Mise à jour sur votre demande",
        message: data.message || "Statut de votre demande mis à jour",
        type: "info",
        date: new Date(),
        read: false,
        requestId: data.requestId
      }
      setNotifications((prev) => [notification, ...prev])
    }

    // On écoute les événements liés aux demandes
    socket.on("new_request", handleNewRequest)
    socket.on("request_accepted", handleRequestAccepted)
    socket.on("request_rejected", handleRequestRejected)
    socket.on("request_updated", handleRequestUpdated)

    return () => {
      socket.off("new_request", handleNewRequest)
      socket.off("request_accepted", handleRequestAccepted)
      socket.off("request_rejected", handleRequestRejected)
      socket.off("request_updated", handleRequestUpdated)
    }
  }, [socket, user])

  // Fermer la popup si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showNotifications])

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-background">
    
      <div className={clsx("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-primary">TransportConnect</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6 text-text-secondary" />
            </button>
          </div>
          <nav className="mt-4">
            {currentNavigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    "flex items-center px-4 py-3 text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:bg-input-background hover:text-primary",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

    
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-lg">
          <div className="flex items-center px-6 py-4 border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h2 className="ml-3 text-xl font-bold text-primary">TransportConnect</h2>
            </div>
          </div>

          <nav className="mt-6 flex-1">
            {currentNavigationItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              const hasUnreadNotifications = item.isNotification && notifications.some((n) => !n.read)
              
              return (
                <div key={item.name} className="relative">
                  {item.isNotification ? (
                    <button
                      onClick={() => {
                        setShowNotifications((v) => !v)
                        markAllAsRead()
                      }}
                      className={clsx(
                        "flex items-center w-full px-6 py-3 text-sm font-medium transition-all duration-200",
                        showNotifications
                          ? "bg-gradient-to-r from-primary to-text-secondary text-white border-r-4 border-white shadow-lg"
                          : "text-text-secondary hover:bg-input-background hover:text-primary"
                      )}
                    >
                      <div className="relative">
                        <Icon className="w-5 h-5 mr-3" />
                        {hasUnreadNotifications && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full border-2 border-white animate-pulse" />
                        )}
                      </div>
                      {item.name}
                      {hasUnreadNotifications && (
                        <span className="ml-auto bg-error text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                          {notifications.filter((n) => !n.read).length}
                        </span>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={clsx(
                        "flex items-center px-6 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-white border-r-4 border-text-primary"
                          : "text-text-secondary hover:bg-input-background hover:text-primary",
                      )}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="p-6 border-t">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{user?.firstName?.charAt(0)}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-text-primary">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
              </div>
              <div className={clsx("ml-auto w-3 h-3 rounded-full", isConnected ? "bg-success" : "bg-error")} />
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-text-secondary hover:text-error transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

    
      <div className="lg:pl-64">
      
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setSidebarOpen(true)} className="text-text-secondary hover:text-primary">
              <Menu className="w-6 h-6" />
            </button>

            <h1 className="text-lg font-semibold text-primary">TransportConnect</h1>

            <div className="flex items-center space-x-2">
              <div className={clsx("w-3 h-3 rounded-full", isConnected ? "bg-success" : "bg-error")} />
              <Bell className="w-5 h-5 text-text-secondary" />
            </div>
          </div>
        </div>

       
        <main className="flex-1">{children}</main>
      </div>

      {/* Notification Popup */}
      {showNotifications && (
        <div ref={notificationRef} className="absolute left-64 top-10 z-50 w-[370px] max-w-[90vw] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#5bc0eb] p-0 animate-fade-in flex flex-col gap-0" style={{ boxShadow: '0 8px 32px 0 rgba(91,192,235,0.25)' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#5bc0eb]/20 bg-gradient-to-r from-[#0072bb]/10 to-[#5bc0eb]/10 rounded-t-3xl">
            <span className="font-bold text-lg text-[#0072bb] flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#5bc0eb] animate-bounce" /> Notifications
            </span>
            <button onClick={() => setShowNotifications(false)} className="text-[#222831] hover:text-[#0072bb] text-xl font-bold">×</button>
          </div>
          <div className="max-h-[400px] overflow-y-auto py-2 px-4 flex flex-col gap-3">
            {notifications.length === 0 && (
              <div className="text-center text-[#222831] py-8 opacity-60">
                <span>Aucune notification pour le moment.</span>
              </div>
            )}
            {notifications.map((notif, idx) => (
              <div key={idx} className={
                `rounded-2xl p-4 mb-1 shadow-md bg-white/70 border-l-4 ${
                  notif.type === 'success' ? 'border-green-400' : notif.type === 'error' ? 'border-red-400' : 'border-[#5bc0eb]'
                } flex flex-col gap-1 animate-slide-in`
              }>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[#0072bb] text-base">{notif.title}</span>
                  {!notif.read && <span className="ml-2 bg-[#5bc0eb] text-white text-xs px-2 py-0.5 rounded-full animate-pulse">Nouveau</span>}
                </div>
                <span className="text-[#222831] text-sm">{notif.message}</span>
                <span className="text-xs text-gray-400 mt-1">{notif.date.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout
