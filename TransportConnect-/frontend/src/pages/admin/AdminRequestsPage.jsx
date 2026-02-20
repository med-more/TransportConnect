import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import clsx from "clsx"
import {
  Package,
  Search,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  DollarSign,
  Eye,
  Weight,
  Ruler,
  Euro,
  User,
  Phone,
  Mail,
  Navigation,
  Truck,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from "../../utils/icons"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import ConfirmationDialog from "../../components/ui/ConfirmationDialog"
import { adminAPI, requestsAPI } from "../../services/api"
import { normalizeAvatarUrl } from "../../utils/avatar"
import toast from "react-hot-toast"
import { generatePageNumbers } from "../../utils/pagination"

const AdminRequestsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleteRequestId, setDeleteRequestId] = useState(null)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [showRequestDetails, setShowRequestDetails] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: requestsData, isLoading, refetch } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: adminAPI.getAllRequests,
  })

  const { data: requestDetailData, isLoading: requestDetailLoading } = useQuery({
    queryKey: ["request", selectedRequestId],
    queryFn: () => requestsAPI.getRequestById(selectedRequestId),
    enabled: !!selectedRequestId && showRequestDetails,
  })

  const requests = requestsData?.data || []
  const requestDetails = requestDetailData?.data?.request

  const filterRequests = () => {
    let filtered = requests

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          (request.pickup?.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (request.delivery?.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (request.sender?.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (request.sender?.lastName || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    return filtered
  }

  const filteredRequests = filterRequests()

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    try {
      await adminAPI.updateRequestStatus(requestId, { status: newStatus })
      toast.success(`Request status updated to ${newStatus}`)
      refetch()
    } catch (error) {
      toast.error("Error updating request status")
    }
  }

  const handleDeleteRequest = (requestId) => {
    setDeleteRequestId(requestId)
    setDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (deleteRequestId) {
      try {
        await adminAPI.deleteRequest(deleteRequestId)
        toast.success("Request deleted successfully")
        refetch()
      } catch (error) {
        toast.error("Error deleting request")
      }
    }
    setDeleteDialog(false)
    setDeleteRequestId(null)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-warning/10 text-warning", label: "Pending" },
      accepted: { color: "bg-success/10 text-success", label: "Accepted" },
      rejected: { color: "bg-destructive/10 text-destructive", label: "Rejected" },
      completed: { color: "bg-primary/10 text-primary", label: "Completed" },
      cancelled: { color: "bg-muted text-muted-foreground", label: "Cancelled" },
      in_transit: { color: "bg-info/10 text-info", label: "In Transit" },
      delivered: { color: "bg-success/10 text-success", label: "Delivered" },
    }

    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={clsx("px-2 py-1 text-xs font-medium rounded-md capitalize", config.color)}>{config.label}</span>
    )
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-destructive" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-primary" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-muted-foreground" />
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "in_transit":
        return <Truck className="w-4 h-4 text-info" />
      default:
        return <Clock className="w-4 h-4 text-warning" />
    }
  }

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

  if (isLoading) {
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
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-warning/10 rounded-xl">
              <Package className="w-6 h-6 sm:w-7 sm:h-7 text-warning" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                Request Management
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Handle all shipping requests, track delivery statuses, resolve disputes, and ensure timely processing of customer orders
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <Input
                  placeholder="Search by origin, destination, user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <div className="flex gap-3 sm:gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 sm:px-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="in_transit">In Transit</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Requests - Mobile Cards View */}
        <motion.div variants={itemVariants} className="lg:hidden">
          <div className="space-y-3">
            {paginatedRequests.length === 0 ? (
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No requests found</p>
                </div>
              </Card>
            ) : (
              paginatedRequests.map((request, index) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="font-semibold text-foreground text-base">
                              {request.pickup?.city || ""} → {request.delivery?.city || ""}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground ml-6">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {request.price ? request.price + "€" : "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {request.cargo?.type || "N/A"}
                              {request.cargo?.weight ? `, ${request.cargo.weight}kg` : ""}
                            </span>
                          </div>
                          {request.cargo?.description && (
                            <p className="text-xs text-muted-foreground mt-2 ml-6 line-clamp-2">
                              {request.cargo.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {getStatusBadge(request.status)}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2 border-t border-border">
                        {request.sender?.avatar ? (
                          <img
                            src={normalizeAvatarUrl(request.sender.avatar)}
                            alt={`${request.sender.firstName} ${request.sender.lastName}`}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = "none"
                              e.target.nextSibling.style.display = "flex"
                            }}
                          />
                        ) : null}
                        <div
                          className={clsx(
                            "w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
                            request.sender?.avatar && "hidden"
                          )}
                        >
                          {request.sender?.firstName?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground text-sm truncate">
                            {request.sender?.firstName} {request.sender?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{request.sender?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(request.createdAt).toLocaleDateString("en-US")}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        {request.status === "pending" && (
                          <>
                            <Button
                              size="small"
                              onClick={() => handleUpdateRequestStatus(request._id, "accepted")}
                              className="flex-1 bg-success hover:bg-success/90"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="small"
                              variant="outline"
                              onClick={() => handleUpdateRequestStatus(request._id, "rejected")}
                              className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() => {
                            setSelectedRequestId(request._id)
                            setShowRequestDetails(true)
                          }}
                          className="flex-1 text-primary hover:bg-primary/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() => handleDeleteRequest(request._id)}
                          className="flex-1 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
          
          {/* Pagination - Mobile */}
          {filteredRequests.length > itemsPerPage && (
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
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
                <span className="text-sm font-medium text-foreground">
                  Page {currentPage} of {totalPages}
                </span>
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
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-muted-foreground">Go to:</span>
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
                  className="w-16 px-2 py-1 text-sm border border-border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground">of {totalPages}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Requests - Desktop Table View */}
        <motion.div variants={itemVariants} className="hidden lg:block">
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Request</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">User</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.map((request, index) => (
                    <motion.tr
                      key={request._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="font-medium text-foreground text-sm">
                              {request.pickup?.city || ""} → {request.delivery?.city || ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              Budget: {request.price ? request.price + "€" : "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {request.cargo?.type || "N/A"}
                              {request.cargo?.weight ? `, ${request.cargo.weight}kg` : ""}
                            </span>
                          </div>
                          {request.cargo?.description && (
                            <p className="text-xs text-muted-foreground max-w-xs truncate">
                              {request.cargo.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {request.sender?.avatar ? (
                            <img
                              src={normalizeAvatarUrl(request.sender.avatar)}
                              alt={`${request.sender.firstName} ${request.sender.lastName}`}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                e.target.style.display = "none"
                                e.target.nextSibling.style.display = "flex"
                              }}
                            />
                          ) : null}
                          <div
                            className={clsx(
                              "w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
                              request.sender?.avatar && "hidden"
                            )}
                          >
                            {request.sender?.firstName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">
                              {request.sender?.firstName} {request.sender?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{request.sender?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          {getStatusBadge(request.status)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(request.createdAt).toLocaleDateString("en-US")}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="small"
                            variant="ghost"
                            onClick={() => {
                              setSelectedRequestId(request._id)
                              setShowRequestDetails(true)
                            }}
                            className="text-primary hover:bg-primary/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {request.status === "pending" && (
                            <>
                              <Button
                                size="small"
                                onClick={() => handleUpdateRequestStatus(request._id, "accepted")}
                                className="bg-success hover:bg-success/90"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="small"
                                variant="outline"
                                onClick={() => handleUpdateRequestStatus(request._id, "rejected")}
                                className="border-destructive text-destructive hover:bg-destructive/10"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="small"
                            variant="ghost"
                            onClick={() => handleDeleteRequest(request._id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {paginatedRequests.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No requests found</p>
                </div>
              )}
            </div>
            
            {/* Pagination - Desktop */}
            {filteredRequests.length > itemsPerPage && (
              <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length} requests
                  </div>
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
                    <div className="flex items-center gap-1">
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
                </div>
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
                    className="w-20 px-3 py-1.5 text-sm bg-background text-foreground border border-border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <span className="text-sm text-muted-foreground">of {totalPages}</span>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>

      {/* Request Details Modal */}
      {showRequestDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowRequestDetails(false)
            setSelectedRequestId(null)
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-lg p-4 sm:p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Request Details</h2>
              <Button variant="ghost" size="small" onClick={() => {
                setShowRequestDetails(false)
                setSelectedRequestId(null)
              }}>
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            {requestDetailLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            ) : requestDetails ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Cargo Information */}
                <Card className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Cargo Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p className="font-medium text-foreground">{requestDetails.cargo?.description}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Type</p>
                        <p className="font-medium text-foreground">{requestDetails.cargo?.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Weight</p>
                        <p className="font-medium text-foreground flex items-center gap-1">
                          <Weight className="w-4 h-4" />
                          {requestDetails.cargo?.weight} kg
                        </p>
                      </div>
                      {requestDetails.cargo?.dimensions && (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Dimensions</p>
                            <p className="font-medium text-foreground text-xs">
                              {requestDetails.cargo.dimensions.length} × {requestDetails.cargo.dimensions.width} × {requestDetails.cargo.dimensions.height} cm
                            </p>
                          </div>
                          {requestDetails.cargo?.value && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Value</p>
                              <p className="font-medium text-foreground">{requestDetails.cargo.value}€</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Pickup & Delivery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Pickup</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">{requestDetails.pickup?.address}</p>
                      <p className="text-sm text-muted-foreground">{requestDetails.pickup?.city}</p>
                      {requestDetails.pickup?.contactPerson && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-1">Contact Person</p>
                          <p className="text-sm font-medium text-foreground">{requestDetails.pickup.contactPerson.name}</p>
                          {requestDetails.pickup.contactPerson.phone && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Phone className="w-3 h-3" />
                              {requestDetails.pickup.contactPerson.phone}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-success" />
                      <h3 className="text-lg font-semibold text-foreground">Delivery</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">{requestDetails.delivery?.address}</p>
                      <p className="text-sm text-muted-foreground">{requestDetails.delivery?.city}</p>
                      {requestDetails.delivery?.contactPerson && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-1">Contact Person</p>
                          <p className="text-sm font-medium text-foreground">{requestDetails.delivery.contactPerson.name}</p>
                          {requestDetails.delivery.contactPerson.phone && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Phone className="w-3 h-3" />
                              {requestDetails.delivery.contactPerson.phone}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Sender Information */}
                {requestDetails.sender && (
                  <Card className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Sender Information</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      {requestDetails.sender.avatar ? (
                        <img
                          src={normalizeAvatarUrl(requestDetails.sender.avatar)}
                          alt={`${requestDetails.sender.firstName} ${requestDetails.sender.lastName}`}
                          className="w-16 h-16 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none"
                            e.target.nextSibling.style.display = "flex"
                          }}
                        />
                      ) : null}
                      <div
                        className={clsx(
                          "w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold",
                          requestDetails.sender.avatar && "hidden"
                        )}
                      >
                        {requestDetails.sender.firstName?.charAt(0)}
                        {requestDetails.sender.lastName?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {requestDetails.sender.firstName} {requestDetails.sender.lastName}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Mail className="w-4 h-4" />
                          <span>{requestDetails.sender.email}</span>
                        </div>
                        {requestDetails.sender.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Phone className="w-4 h-4" />
                            <span>{requestDetails.sender.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )}

                {/* Trip Information */}
                {requestDetails.trip && (
                  <Card className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Truck className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Trip Information</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {requestDetails.trip.departure?.city} → {requestDetails.trip.destination?.city}
                        </span>
                      </div>
                      {requestDetails.trip.driver && (
                        <div className="flex items-center gap-3 pt-2 border-t border-border">
                          {requestDetails.trip.driver.avatar ? (
                            <img
                              src={normalizeAvatarUrl(requestDetails.trip.driver.avatar)}
                              alt={`${requestDetails.trip.driver.firstName} ${requestDetails.trip.driver.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none"
                                e.target.nextSibling.style.display = "flex"
                              }}
                            />
                          ) : null}
                          <div
                            className={clsx(
                              "w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold",
                              requestDetails.trip.driver.avatar && "hidden"
                            )}
                          >
                            {requestDetails.trip.driver.firstName?.charAt(0)}
                            {requestDetails.trip.driver.lastName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {requestDetails.trip.driver.firstName} {requestDetails.trip.driver.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">Driver</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Pricing */}
                <Card className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Euro className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Pricing</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Price</span>
                    <span className="font-semibold text-foreground text-xl">{requestDetails.price || "N/A"}€</span>
                  </div>
                </Card>

                {/* Messages */}
                {(requestDetails.message || requestDetails.driverResponse?.message) && (
                  <Card className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Messages</h3>
                    </div>
                    <div className="space-y-3">
                      {requestDetails.message && (
                        <div className="p-3 bg-accent rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Message from sender</p>
                          <p className="text-sm text-foreground">{requestDetails.message}</p>
                        </div>
                      )}
                      {requestDetails.driverResponse?.message && (
                        <div className={clsx(
                          "p-3 rounded-lg",
                          requestDetails.status === "accepted" ? "bg-success/10" : "bg-destructive/10"
                        )}>
                          <p className="text-xs text-muted-foreground mb-1">
                            Driver response ({requestDetails.status === "accepted" ? "Accepted" : "Rejected"})
                          </p>
                          <p className="text-sm text-foreground">{requestDetails.driverResponse.message}</p>
                          {requestDetails.driverResponse.respondedAt && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(requestDetails.driverResponse.respondedAt).toLocaleString("en-US")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Status & Tracking */}
                <Card className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(requestDetails.status)}
                        {getStatusBadge(requestDetails.status)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Created</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(requestDetails.createdAt).toLocaleDateString("en-US")}
                      </p>
                    </div>
                  </div>
                  {requestDetails.tracking && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <h4 className="text-sm font-semibold text-foreground mb-3">Tracking Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-accent">
                          <span className="text-muted-foreground">Pickup Confirmed</span>
                          <span className={clsx(
                            "font-medium px-2 py-1 rounded",
                            requestDetails.tracking?.pickupConfirmed?.confirmed === true
                              ? "text-success bg-success/10"
                              : "text-muted-foreground bg-muted/10"
                          )}>
                            {requestDetails.tracking?.pickupConfirmed?.confirmed === true ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-accent">
                          <span className="text-muted-foreground">In Transit</span>
                          <span className={clsx(
                            "font-medium px-2 py-1 rounded",
                            requestDetails.tracking?.inTransit?.confirmed === true
                              ? "text-info bg-info/10"
                              : "text-muted-foreground bg-muted/10"
                          )}>
                            {requestDetails.tracking?.inTransit?.confirmed === true ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-accent">
                          <span className="text-muted-foreground">Delivered</span>
                          <span className={clsx(
                            "font-medium px-2 py-1 rounded",
                            requestDetails.tracking?.delivered?.confirmed === true
                              ? "text-success bg-success/10"
                              : "text-muted-foreground bg-muted/10"
                          )}>
                            {requestDetails.tracking?.delivered?.confirmed === true ? "Yes" : "No"}
                          </span>
                        </div>
                        {requestDetails.tracking?.delivered?.confirmedAt && (
                          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                            Delivered on: {new Date(requestDetails.tracking.delivered.confirmedAt).toLocaleString("en-US")}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Request details not found</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog}
        onClose={() => {
          setDeleteDialog(false)
          setDeleteRequestId(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete this request?"
        message="Are you sure you want to delete this request? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

export default AdminRequestsPage
