import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import clsx from "clsx"
import {
  Shield,
  Search,
  UserCheck,
  UserX,
  Eye,
  Clock,
  Calendar,
  Phone,
  MapPin,
  Truck,
  User,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from "../../utils/icons"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Skeleton from "../../components/ui/Skeleton"
import ConfirmationDialog from "../../components/ui/ConfirmationDialog"
import { adminAPI } from "../../services/api"
import { normalizeAvatarUrl } from "../../utils/avatar"
import toast from "react-hot-toast"
import { generatePageNumbers } from "../../utils/pagination"

const ITEMS_PER_PAGE = 9

const AdminVerificationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [rejectDialog, setRejectDialog] = useState(false)
  const [rejectUserId, setRejectUserId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminAPI.getAllUsers,
  })

  const allUsers = usersData?.data || []
  const users = allUsers.filter((user) => !user.isVerified)

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  const filteredUsers = filterUsers()

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [totalPages, currentPage])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  const handleVerifyUser = async (userId) => {
    try {
      await adminAPI.verifyUser(userId)
      toast.success("User verified successfully")
      refetch()
      setShowDetails(false)
      setSelectedUser(null)
    } catch (error) {
      toast.error("Error verifying user")
    }
  }

  const handleRejectUser = (userId) => {
    setRejectUserId(userId)
    setRejectDialog(true)
  }

  const handleConfirmReject = async () => {
    if (rejectUserId) {
      try {
        await adminAPI.suspendUser(rejectUserId)
        toast.success("User rejected successfully")
        refetch()
        setShowDetails(false)
        setSelectedUser(null)
      } catch (error) {
        toast.error("Error rejecting user")
      }
    }
    setRejectDialog(false)
    setRejectUserId(null)
  }

  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setShowDetails(true)
  }

  const getRoleBadge = (role) => {
    const colors = {
      admin: "bg-primary/10 text-primary",
      conducteur: "bg-info/10 text-info",
      expediteur: "bg-muted text-muted-foreground",
    }
    return (
      <span className={clsx("px-2 py-1 text-xs font-medium rounded-md", colors[role] || colors.expediteur)}>
        {role === "conducteur" ? "Driver" : role === "admin" ? "Admin" : "Shipper"}
      </span>
    )
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
      <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex items-start gap-4 mb-6">
          <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton variant="text" lines={2} className="max-w-md" />
          </div>
        </div>
        <Card className="p-4 sm:p-5 md:p-6">
          <Skeleton className="h-10 w-full rounded-xl" />
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-4 sm:p-5 md:p-6">
              <div className="text-center mb-4">
                <Skeleton variant="avatar" className="h-20 w-20 mx-auto mb-3" />
                <Skeleton className="h-5 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-48 mx-auto mb-3" />
                <Skeleton className="h-5 w-16 mx-auto" />
              </div>
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </Card>
          ))}
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
            <div className="p-3 bg-success/10 rounded-xl">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-success" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                Pending Verifications
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Review and validate new user registrations. Verify identity documents, approve accounts, or reject incomplete applications to maintain platform security
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants}>
          <Card className="p-4 sm:p-5 md:p-6">
            <Input
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </Card>
        </motion.div>

        {/* Users Grid */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedUsers.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-4 sm:p-5 md:p-6">
                  <div className="text-center mb-4 sm:mb-6">
                    {user.avatar ? (
                      <img
                        src={normalizeAvatarUrl(user.avatar)}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto mb-3 sm:mb-4"
                        onError={(e) => {
                          e.target.style.display = "none"
                          e.target.nextSibling.style.display = "flex"
                        }}
                      />
                    ) : null}
                    <div
                      className={clsx(
                        "w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4",
                        user.avatar && "hidden"
                      )}
                    >
                      {user.firstName?.charAt(0)?.toUpperCase()}
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-3">{user.email}</p>
                    {getRoleBadge(user.role)}
                  </div>

                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString("en-US")}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{user.phone}</span>
                      </div>
                    )}
                    {user.address && typeof user.address === "object" && (
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          {user.address.street ? user.address.street + ", " : ""}
                          {user.address.city ? user.address.city + ", " : ""}
                          {user.address.postalCode ? user.address.postalCode + ", " : ""}
                          {user.address.country || ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="small"
                      variant="outline"
                      onClick={() => handleViewDetails(user)}
                      className="flex-1 border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleVerifyUser(user._id)}
                      className="flex-1 bg-success hover:bg-success/90"
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="small"
                      variant="outline"
                      onClick={() => handleRejectUser(user._id)}
                      className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <UserX className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No pending verifications</p>
            </div>
          )}

          {/* Smart pagination */}
          {filteredUsers.length > ITEMS_PER_PAGE && (
            <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-border">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
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
                      if (page === "ellipsis") {
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
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value, 10)
                    if (page >= 1 && page <= totalPages) setCurrentPage(page)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const page = parseInt(e.target.value, 10)
                      if (page >= 1 && page <= totalPages) setCurrentPage(page)
                    }
                  }}
                  className="w-20 px-3 py-1.5 text-sm bg-background text-foreground border border-border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <span className="text-sm text-muted-foreground">of {totalPages}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* User Details Modal */}
        {showDetails && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">User Details</h2>
                <Button variant="ghost" size="small" onClick={() => setShowDetails(false)}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="text-center">
                  {selectedUser.avatar ? (
                    <img
                      src={normalizeAvatarUrl(selectedUser.avatar)}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto mb-3 sm:mb-4"
                      onError={(e) => {
                        e.target.style.display = "none"
                        e.target.nextSibling.style.display = "flex"
                      }}
                    />
                  ) : null}
                  <div
                    className={clsx(
                      "w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mx-auto mb-3 sm:mb-4",
                      selectedUser.avatar && "hidden"
                    )}
                  >
                    {selectedUser.firstName?.charAt(0)?.toUpperCase()}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Role:</span>
                      {getRoleBadge(selectedUser.role)}
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Joined:</span>
                      <span className="text-muted-foreground">
                        {new Date(selectedUser.createdAt).toLocaleDateString("en-US")}
                      </span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">Phone:</span>
                        <span className="text-muted-foreground">{selectedUser.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {selectedUser.address && typeof selectedUser.address === "object" && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <span className="font-medium text-foreground">Address:</span>
                          <p className="text-muted-foreground text-sm">
                            {selectedUser.address.street ? selectedUser.address.street + ", " : ""}
                            {selectedUser.address.city ? selectedUser.address.city + ", " : ""}
                            {selectedUser.address.postalCode ? selectedUser.address.postalCode + ", " : ""}
                            {selectedUser.address.country || ""}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedUser.role === "conducteur" && (
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">Driver</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border">
                  <Button
                    onClick={() => handleVerifyUser(selectedUser._id)}
                    className="flex-1 bg-success hover:bg-success/90"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Approve User
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRejectUser(selectedUser._id)}
                    className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Reject User
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={rejectDialog}
        onClose={() => {
          setRejectDialog(false)
          setRejectUserId(null)
        }}
        onConfirm={handleConfirmReject}
        title="Reject this user?"
        message="Are you sure you want to reject this user? This action cannot be undone."
        confirmText="Reject"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

export default AdminVerificationsPage
