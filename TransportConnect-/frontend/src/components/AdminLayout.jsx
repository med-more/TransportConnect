import { useState, useRef, useEffect } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { 
  Home, 
  Truck, 
  Package, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Shield, 
  BarChart3, 
  Users, 
  FileText 
} from "lucide-react"
import clsx from "clsx"
import toast from "react-hot-toast"

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const notificationRef = useRef(null)

  const adminNavigationItems = [
    { name: "Admin Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Utilisateurs", href: "/admin/users", icon: Users },
    { name: "Trajets", href: "/admin/trips", icon: Truck },
    { name: "Demandes", href: "/admin/requests", icon: Package },
    { name: "Vérifications", href: "/admin/verifications", icon: Shield },
  ]

  const handleLogout = () => {
    logout()
    toast.success("Déconnexion réussie")
  }

  const unreadCount = (notifications || []).filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={clsx(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-primary">TransportConnect</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="mt-4">
            {adminNavigationItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-primary text-white shadow-lg"
                        : "text-text-secondary hover:text-text-primary hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              )
            })}
          </nav>
          <div className="mt-auto p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-text-secondary hover:bg-gray-100 hover:text-text-primary transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-xl">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-primary">TransportConnect</h1>
          </div>
          <nav className="mt-6 flex-1">
            {adminNavigationItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200",
                    isActive
                      ? "bg-primary text-white shadow-lg"
                      : "text-text-secondary hover:text-text-primary hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              )
            })}
          </nav>
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-text-secondary hover:bg-gray-100 hover:text-text-primary transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-4 shadow-sm lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-text-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.firstName?.charAt(0)?.toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-text-primary">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-text-secondary">Administrateur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout 