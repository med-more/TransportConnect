import { useState } from "react"
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
} from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import ConfirmationDialog from "../../components/ui/ConfirmationDialog"
import { adminAPI } from "../../services/api"
import { normalizeAvatarUrl } from "../../utils/avatar"
import toast from "react-hot-toast"

const AdminRequestsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleteRequestId, setDeleteRequestId] = useState(null)

  const { data: requestsData, isLoading, refetch } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: adminAPI.getAllRequests,
  })

  const requests = requestsData?.data || []

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
    }

    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={clsx("px-2 py-1 text-xs font-medium rounded-md", config.color)}>{config.label}</span>
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
          <div className="mb-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">Request Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Process and manage all transport requests
            </p>
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
            {filteredRequests.length === 0 ? (
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No requests found</p>
                </div>
              </Card>
            ) : (
              filteredRequests.map((request, index) => (
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
                  {filteredRequests.map((request, index) => (
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
              {filteredRequests.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No requests found</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>

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
