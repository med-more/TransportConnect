import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import clsx from "clsx"
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Phone,
  MapPin,
  Truck,
  Mail,
  Star,
  Award,
} from "../../utils/icons"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import ConfirmationDialog from "../../components/ui/ConfirmationDialog"
import { adminAPI } from "../../services/api"
import { normalizeAvatarUrl } from "../../utils/avatar"
import toast from "react-hot-toast"

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [rejectDialog, setRejectDialog] = useState(false)
  const [rejectUserId, setRejectUserId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserDetails, setShowUserDetails] = useState(false)

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminAPI.getAllUsers,
  })

  const users = usersData?.data || []

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          (user.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => {
        if (statusFilter === "verified") return user.isVerified && user.isActive
        if (statusFilter === "unverified") return !user.isVerified && user.isActive
        if (statusFilter === "active") return user.isActive
        if (statusFilter === "suspended") return !user.isActive
        return true
      })
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    return filtered
  }

  const filteredUsers = filterUsers()

  const handleVerifyUser = async (userId) => {
    try {
      await adminAPI.verifyUser(userId)
      toast.success("User verified successfully")
      refetch()
    } catch (error) {
      toast.error("Error verifying user")
    }
  }

  const handleSuspendUser = (userId) => {
    setRejectUserId(userId)
    setRejectDialog(true)
  }

  const handleConfirmSuspend = async () => {
    if (rejectUserId) {
      try {
        await adminAPI.suspendUser(rejectUserId)
        toast.success("User suspended successfully")
        refetch()
      } catch (error) {
        toast.error("Error suspending user")
      }
    }
    setRejectDialog(false)
    setRejectUserId(null)
  }

  const getStatusBadge = (user) => {
    if (!user.isActive) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-destructive/10 text-destructive rounded-md">
          Suspended
        </span>
      )
    }
    if (user.isVerified) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-md">
          Verified
        </span>
      )
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-warning/10 text-warning rounded-md">
        Pending
      </span>
    )
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
            <div className="p-3 bg-primary/10 rounded-xl">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                User Management
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Oversee all platform users, verify new registrations, manage account status, and track user activity across the system
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
                  placeholder="Search by name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <div className="flex gap-3 sm:gap-4 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 sm:px-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 sm:px-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="conducteur">Driver</option>
                  <option value="expediteur">Shipper</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Users - Mobile Cards View */}
        <motion.div variants={itemVariants} className="lg:hidden">
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <Card className="p-4 sm:p-5 md:p-6">
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              </Card>
            ) : (
              filteredUsers.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {user.avatar ? (
                            <img
                              src={normalizeAvatarUrl(user.avatar)}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                e.target.style.display = "none"
                                e.target.nextSibling.style.display = "flex"
                              }}
                            />
                          ) : null}
                          <div
                            className={clsx(
                              "w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0",
                              user.avatar && "hidden"
                            )}
                          >
                            {user.firstName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-foreground text-base truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user)}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString("en-US")}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserDetails(true)
                          }}
                          className="flex-1 text-primary hover:bg-primary/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        {!user.isVerified && user.isActive && (
                          <Button
                            size="small"
                            onClick={() => handleVerifyUser(user._id)}
                            className="flex-1 bg-success hover:bg-success/90"
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        )}
                        {user.isActive && (
                          <Button
                            size="small"
                            variant="outline"
                            onClick={() => handleSuspendUser(user._id)}
                            className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Suspend
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Users - Desktop Table View */}
        <motion.div variants={itemVariants} className="hidden lg:block">
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">User</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Role</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Registration Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-4 px-4">
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
                              "w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0",
                              user.avatar && "hidden"
                            )}
                          >
                            {user.firstName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">{getRoleBadge(user.role)}</td>
                      <td className="py-4 px-4">{getStatusBadge(user)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(user.createdAt).toLocaleDateString("en-US")}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="small"
                            variant="ghost"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowUserDetails(true)
                            }}
                            className="text-primary hover:bg-primary/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {!user.isVerified && user.isActive && (
                            <Button
                              size="small"
                              onClick={() => handleVerifyUser(user._id)}
                              className="bg-success hover:bg-success/90"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          )}
                          {user.isActive && (
                            <Button
                              size="small"
                              variant="outline"
                              onClick={() => handleSuspendUser(user._id)}
                              className="border-destructive text-destructive hover:bg-destructive/10"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowUserDetails(false)}
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
              <Button variant="ghost" size="small" onClick={() => setShowUserDetails(false)}>
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
                <div className="flex items-center justify-center gap-2 mt-2">
                  {getRoleBadge(selectedUser.role)}
                  {getStatusBadge(selectedUser)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
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
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Email:</span>
                    <span className="text-muted-foreground text-sm truncate">{selectedUser.email}</span>
                  </div>
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
                  {selectedUser.role === "conducteur" && selectedUser.vehicleInfo && (
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-primary" />
                      <div>
                        <span className="font-medium text-foreground">Vehicle:</span>
                        <p className="text-muted-foreground text-sm">
                          {selectedUser.vehicleInfo.type}
                          {selectedUser.vehicleInfo.capacity && ` - ${selectedUser.vehicleInfo.capacity}kg`}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Status:</span>
                    {getStatusBadge(selectedUser)}
                  </div>
                </div>
              </div>

              {/* Ratings Section */}
              {selectedUser.stats && (
                <Card className="p-4 sm:p-5 bg-accent/30">
                  <h4 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-warning" />
                    User Ratings
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-warning/10 rounded-lg">
                          <Star className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Average Rating</p>
                          <p className="text-lg font-semibold text-foreground">
                            {selectedUser.stats?.averageRating
                              ? selectedUser.stats.averageRating.toFixed(1)
                              : "0.0"}
                            <span className="text-sm text-muted-foreground ml-1">/ 5.0</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(selectedUser.stats?.averageRating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-muted-foreground/30 fill-muted-foreground/10"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-info/10 rounded-lg">
                          <Award className="w-5 h-5 text-info" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Reviews</p>
                          <p className="text-lg font-semibold text-foreground">
                            {selectedUser.stats?.totalRatings || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedUser.stats?.averageRating > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>
                          This user has received {selectedUser.stats.totalRatings || 0} review
                          {selectedUser.stats.totalRatings !== 1 ? "s" : ""} with an average rating of{" "}
                          {selectedUser.stats.averageRating.toFixed(1)} out of 5.0
                        </span>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-border">
                {!selectedUser.isVerified && selectedUser.isActive && (
                  <Button
                    onClick={() => {
                      handleVerifyUser(selectedUser._id)
                      setShowUserDetails(false)
                    }}
                    className="flex-1 bg-success hover:bg-success/90"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Verify User
                  </Button>
                )}
                {selectedUser.isActive && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleSuspendUser(selectedUser._id)
                      setShowUserDetails(false)
                    }}
                    className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Suspend User
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={rejectDialog}
        onClose={() => {
          setRejectDialog(false)
          setRejectUserId(null)
        }}
        onConfirm={handleConfirmSuspend}
        title="Suspend this user?"
        message="Are you sure you want to suspend this user? This action can be reversed."
        confirmText="Suspend"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

export default AdminUsersPage
