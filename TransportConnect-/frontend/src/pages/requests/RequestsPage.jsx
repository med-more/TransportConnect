import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  Search,
  Filter,
  MapPin,
  Calendar,
  Weight,
  Euro,
  User,
  ArrowRight,
  Plus,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "../../utils/icons"
import { useAuth } from "../../contexts/AuthContext"
import { requestsAPI } from "../../services/api"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Input from "../../components/ui/Input"
import clsx from "clsx"
import { normalizeAvatarUrl } from "../../utils/avatar"
import { generatePageNumbers } from "../../utils/pagination"

const RequestsPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    name: "",
    collecte: "",
    trajet: "",
    poids: "",
    prix: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ["requests", activeTab],
    queryFn: () => {
      if (user?.role === "conducteur") {
        return requestsAPI.getReceivedRequests({ status: activeTab === "all" ? "" : activeTab })
      } else {
        return requestsAPI.getRequests({ status: activeTab === "all" ? "" : activeTab })
      }
    },
    enabled: !!user,
  })

  const requests = requestsData?.data?.requests || []

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-destructive" />
      case "in_transit":
        return <Truck className="w-4 h-4 text-info" />
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-destructive" />
      default:
        return <Package className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "accepted":
        return "Accepted"
      case "rejected":
        return "Rejected"
      case "in_transit":
        return "In Transit"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20"
      case "accepted":
        return "bg-success/10 text-success border-success/20"
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "in_transit":
        return "bg-info/10 text-info border-info/20"
      case "delivered":
        return "bg-success/10 text-success border-success/20"
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const tabs = [
    { id: "all", label: "All", count: requests.length, icon: Package },
    {
      id: "pending",
      label: "Pending",
      count: requests.filter((r) => r.status === "pending").length,
      icon: Clock,
    },
    {
      id: "accepted",
      label: "Accepted",
      count: requests.filter((r) => r.status === "accepted").length,
      icon: CheckCircle,
    },
    {
      id: "in_transit",
      label: "In Transit",
      count: requests.filter((r) => r.status === "in_transit").length,
      icon: Truck,
    },
    {
      id: "delivered",
      label: "Delivered",
      count: requests.filter((r) => r.status === "delivered").length,
      icon: CheckCircle,
    },
  ]

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({ name: "", collecte: "", trajet: "", poids: "", prix: "" })
  }

  const filteredRequests = requests.filter(
    (request) =>
      (activeTab === "all" || request.status === activeTab) &&
      (!filters.name || request.cargo.description.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.collecte || request.pickup.city.toLowerCase().includes(filters.collecte.toLowerCase())) &&
      (!filters.trajet ||
        (request.trip?.departure?.city &&
          request.trip.departure.city.toLowerCase().includes(filters.trajet.toLowerCase())) ||
        (request.trip?.destination?.city &&
          request.trip.destination.city.toLowerCase().includes(filters.trajet.toLowerCase()))) &&
      (!filters.poids || String(request.cargo.weight).includes(filters.poids)) &&
      (!filters.prix || String(request.price).includes(filters.prix))
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex)

  // Track previous requests count to detect new requests
  const prevRequestsCountRef = useRef(0)

  // Reset to page 1 when filters or tab change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, filters.name, filters.collecte, filters.trajet, filters.poids, filters.prix])

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  // Reset to page 1 when a new request is added (count increases)
  useEffect(() => {
    const currentCount = requests.length
    if (prevRequestsCountRef.current > 0 && currentCount > prevRequestsCountRef.current) {
      setCurrentPage(1)
    }
    prevRequestsCountRef.current = currentCount
  }, [requests.length])

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    inTransit: requests.filter((r) => r.status === "in_transit").length,
    delivered: requests.filter((r) => r.status === "delivered").length,
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <span className="truncate">{user?.role === "conducteur" ? "Received Requests" : "My Requests"}</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {user?.role === "conducteur"
              ? "Manage and respond to transport requests"
              : "Track your transport requests in real-time"}
          </p>
        </div>
        {user?.role !== "conducteur" && (
          <Link to="/requests/create" className="flex-shrink-0">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Request
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 ml-2">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-warning">{stats.pending}</p>
            </div>
            <div className="p-2 bg-warning/10 rounded-lg flex-shrink-0 ml-2">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Accepted</p>
              <p className="text-xl sm:text-2xl font-bold text-success">{stats.accepted}</p>
            </div>
            <div className="p-2 bg-success/10 rounded-lg flex-shrink-0 ml-2">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">In Transit</p>
              <p className="text-xl sm:text-2xl font-bold text-info">{stats.inTransit}</p>
            </div>
            <div className="p-2 bg-info/10 rounded-lg flex-shrink-0 ml-2">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-info" />
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Delivered</p>
              <p className="text-xl sm:text-2xl font-bold text-success">{stats.delivered}</p>
            </div>
            <div className="p-2 bg-success/10 rounded-lg flex-shrink-0 ml-2">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Tabs */}
      <Card className="p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Filters & Search
          </h3>
          <Button variant="ghost" size="small" onClick={() => setShowFilters(!showFilters)} className="flex-shrink-0">
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 pb-4">
            <Input
              placeholder="Package name"
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
            />
            <Input
              placeholder="Pickup city"
              value={filters.collecte}
              onChange={(e) => handleFilterChange("collecte", e.target.value)}
            />
            <Input
              placeholder="Route"
              value={filters.trajet}
              onChange={(e) => handleFilterChange("trajet", e.target.value)}
            />
            <Input
              placeholder="Weight (kg)"
              value={filters.poids}
              onChange={(e) => handleFilterChange("poids", e.target.value)}
              type="number"
              min="0"
            />
            <Input
              placeholder="Price (€)"
              value={filters.prix}
              onChange={(e) => handleFilterChange("prix", e.target.value)}
              type="number"
              min="0"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button variant="ghost" size="small" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.95 }}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-accent text-accent-foreground hover:bg-accent/80"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={clsx(
                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                    activeTab === tab.id ? "bg-white/20" : "bg-background"
                  )}
                >
                  {tab.count}
                </span>
              </motion.button>
            )
          })}
        </div>
      </Card>

      {/* Requests List */}
      <div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredRequests.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {paginatedRequests.map((request, index) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card hover className="p-4 sm:p-5 md:p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground truncate">
                          {request.cargo.description}
                        </h3>
                      </div>
                      <div
                        className={clsx(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border",
                          getStatusColor(request.status)
                        )}
                      >
                        {getStatusIcon(request.status)}
                        <span>{getStatusLabel(request.status)}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-primary">{request.price}€</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Weight className="w-3 h-3" />
                        {request.cargo.weight}kg
                      </div>
                    </div>
                  </div>

                  {/* Driver Message - Show for expediteurs */}
                  {user?.role !== "conducteur" && request.driverResponse?.message && (
                    <div
                      className={clsx(
                        "mb-4 p-3 rounded-lg border text-sm",
                        request.status === "rejected"
                          ? "bg-destructive/5 border-destructive/20"
                          : request.status === "accepted"
                          ? "bg-success/5 border-success/20"
                          : "bg-accent border-border"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Truck
                          className={clsx(
                            "w-3 h-3",
                            request.status === "rejected"
                              ? "text-destructive"
                              : request.status === "accepted"
                              ? "text-success"
                              : "text-primary"
                          )}
                        />
                        <span className="font-medium text-foreground text-xs">
                          Driver: {request.driverResponse.message.length > 50 
                            ? request.driverResponse.message.substring(0, 50) + "..."
                            : request.driverResponse.message}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Route Information */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">Pickup:</span>
                      <span className="text-muted-foreground truncate">
                        {request.pickup.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">Delivery:</span>
                      <span className="text-muted-foreground truncate">
                        {request.delivery.city}
                      </span>
                    </div>
                    {request.trip && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">Route:</span>
                        <span className="text-muted-foreground">
                          {request.trip.departure?.city} → {request.trip.destination?.city}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        {user?.role === "conducteur" ? (
                          request.sender?.avatar ? (
                            <img
                              src={normalizeAvatarUrl(request.sender.avatar)}
                              alt={`${request.sender.firstName} ${request.sender.lastName}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error("Sender avatar failed to load in RequestsPage:", normalizeAvatarUrl(request.sender.avatar))
                                e.target.style.display = "none"
                                const parent = e.target.parentElement
                                if (parent && !parent.querySelector("span")) {
                                  const initials = document.createElement("span")
                                  initials.className = "text-white text-xs font-bold"
                                  initials.textContent = request.sender?.firstName?.charAt(0) || "?"
                                  parent.appendChild(initials)
                                }
                              }}
                            />
                          ) : (
                            <span className="text-white text-xs font-bold">
                              {request.sender?.firstName?.charAt(0)}
                            </span>
                          )
                        ) : request.trip?.driver?.avatar ? (
                          <img
                            src={normalizeAvatarUrl(request.trip.driver.avatar)}
                            alt={`${request.trip.driver.firstName} ${request.trip.driver.lastName}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error("Driver avatar failed to load in RequestsPage:", normalizeAvatarUrl(request.trip.driver.avatar))
                              e.target.style.display = "none"
                              const parent = e.target.parentElement
                              if (parent && !parent.querySelector("span")) {
                                const initials = document.createElement("span")
                                initials.className = "text-white text-xs font-bold"
                                initials.textContent = request.trip?.driver?.firstName?.charAt(0) || "?"
                                parent.appendChild(initials)
                              }
                            }}
                          />
                        ) : (
                          <span className="text-white text-xs font-bold">
                            {request.trip?.driver?.firstName?.charAt(0) || "?"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {user?.role === "conducteur"
                            ? `${request.sender?.firstName || ""} ${request.sender?.lastName || ""}`.trim() || "Unknown"
                            : `${request.trip?.driver?.firstName || ""} ${request.trip?.driver?.lastName || ""}`.trim() || "Unknown Driver"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.role === "conducteur" ? "Shipper" : "Driver"}
                        </p>
                      </div>
                    </div>
                    <Link to={`/requests/${request._id}`}>
                      <Button variant="ghost" size="small">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
            </div>
            
            {/* Pagination */}
            {filteredRequests.length > 0 && (
              <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-border">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        title="First page"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1 flex-wrap justify-center">
                        {generatePageNumbers(currentPage, totalPages).map((page, index) => {
                          if (page === 'ellipsis') {
                            return (
                              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                                ...
                              </span>
                            )
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={clsx(
                                "min-w-[36px] px-3 py-1 text-sm rounded-md transition-colors",
                                currentPage === page
                                  ? "bg-primary text-primary-foreground font-semibold"
                                  : "text-muted-foreground hover:bg-accent"
                              )}
                            >
                              {page}
                            </button>
                          )
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        title="Last page"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-muted-foreground">Go to page:</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value)
                        if (page >= 1 && page <= totalPages) {
                          setCurrentPage(page)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const page = parseInt(e.target.value)
                          if (page >= 1 && page <= totalPages) {
                            setCurrentPage(page)
                          }
                        }
                      }}
                      className="w-20 px-3 py-1.5 text-sm border border-border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <span className="text-sm text-muted-foreground">of {totalPages}</span>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <Card className="text-center py-16">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No requests found</h3>
              <p className="text-muted-foreground mb-6">
                {activeTab !== "all"
                  ? `No ${tabs.find((t) => t.id === activeTab)?.label.toLowerCase()} requests at the moment.`
                  : "Start by creating your first request."}
              </p>
              {user?.role !== "conducteur" && (
                <Link to="/requests/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Request
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

export default RequestsPage
