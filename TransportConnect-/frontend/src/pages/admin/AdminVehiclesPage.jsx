import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import clsx from "clsx"
import {
  Truck,
  Search,
  Edit,
  Car,
  Weight,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  X,
} from "../../utils/icons"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Skeleton from "../../components/ui/Skeleton"
import { adminAPI } from "../../services/api"
import { normalizeAvatarUrl } from "../../utils/avatar"
import toast from "react-hot-toast"
import { generatePageNumbers } from "../../utils/pagination"

const VEHICLE_TYPES = [
  { value: "camion", label: "Camion" },
  { value: "camionnette", label: "Camionnette" },
  { value: "voiture", label: "Voiture" },
  { value: "moto", label: "Moto" },
]

const AdminVehiclesPage = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [vehicleFilter, setVehicleFilter] = useState("all") // all | with | without
  const [currentPage, setCurrentPage] = useState(1)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState(null)
  const [formData, setFormData] = useState({
    type: "",
    capacity: "",
    licensePlate: "",
    length: "",
    width: "",
    height: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const itemsPerPage = 10

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminAPI.getAllUsers,
  })

  const updateVehicleMutation = useMutation({
    mutationFn: ({ userId, vehicleInfo }) => adminAPI.updateUserVehicle(userId, vehicleInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      toast.success("Vehicle updated successfully")
      setEditModalOpen(false)
      setEditingDriver(null)
      setFormErrors({})
    },
    onError: (err) => {
      const data = err.response?.data
      const firstError = data?.errors?.[0]?.msg || data?.message || "Failed to update vehicle"
      toast.error(firstError)
      if (data?.errors?.length) {
        const byPath = {}
        data.errors.forEach((e) => {
          const raw = e.path || ""
          const key = raw.replace("vehicleInfo.", "").replace("dimensions.", "") || "form"
          byPath[key] = e.msg
        })
        setFormErrors(byPath)
      } else {
        setFormErrors({})
      }
    },
  })

  const drivers = (usersData?.data || []).filter((u) => u.role === "conducteur")

  const filterDrivers = () => {
    let filtered = drivers

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (d) =>
          (d.firstName || "").toLowerCase().includes(term) ||
          (d.lastName || "").toLowerCase().includes(term) ||
          (d.email || "").toLowerCase().includes(term) ||
          (d.vehicleInfo?.licensePlate || "").toLowerCase().includes(term)
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((d) => d.vehicleInfo?.type === typeFilter)
    }

    if (vehicleFilter === "with") {
      filtered = filtered.filter((d) => d.vehicleInfo?.type || d.vehicleInfo?.licensePlate)
    }
    if (vehicleFilter === "without") {
      filtered = filtered.filter(
        (d) => !d.vehicleInfo?.type && !d.vehicleInfo?.licensePlate && d.vehicleInfo?.capacity == null
      )
    }

    return filtered
  }

  const filteredDrivers = filterDrivers()
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, typeFilter, vehicleFilter])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  const openEditModal = (driver) => {
    setEditingDriver(driver)
    setFormData({
      type: driver.vehicleInfo?.type || "",
      capacity: driver.vehicleInfo?.capacity != null ? String(driver.vehicleInfo.capacity) : "",
      licensePlate: driver.vehicleInfo?.licensePlate || "",
      length: driver.vehicleInfo?.dimensions?.length != null ? String(driver.vehicleInfo.dimensions.length) : "",
      width: driver.vehicleInfo?.dimensions?.width != null ? String(driver.vehicleInfo.dimensions.width) : "",
      height: driver.vehicleInfo?.dimensions?.height != null ? String(driver.vehicleInfo.dimensions.height) : "",
    })
    setFormErrors({})
    setEditModalOpen(true)
  }

  const validateForm = () => {
    const errors = {}
    const cap = formData.capacity.trim()
    if (cap && (Number.isNaN(Number(cap)) || Number(cap) < 0)) {
      errors.capacity = "Capacity must be 0 or greater"
    }
    const len = formData.length.trim()
    if (len && (Number.isNaN(Number(len)) || Number(len) < 0)) {
      errors.length = "Length must be 0 or greater"
    }
    const w = formData.width.trim()
    if (w && (Number.isNaN(Number(w)) || Number(w) < 0)) {
      errors.width = "Width must be 0 or greater"
    }
    const h = formData.height.trim()
    if (h && (Number.isNaN(Number(h)) || Number(h) < 0)) {
      errors.height = "Height must be 0 or greater"
    }
    if (formData.licensePlate.trim().length > 20) {
      errors.licensePlate = "License plate max 20 characters"
    }
    const hasData =
      formData.type ||
      formData.capacity.trim() ||
      formData.licensePlate.trim() ||
      formData.length.trim() ||
      formData.width.trim() ||
      formData.height.trim()
    if (!hasData) {
      errors.form = "Fill at least one field"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitEdit = (e) => {
    e.preventDefault()
    if (!editingDriver) return
    if (!validateForm()) {
      toast.error(formErrors.form || "Please fix the errors below")
      return
    }
    const vehicleInfo = {
      type: formData.type || undefined,
      capacity: formData.capacity.trim() ? Number(formData.capacity) : undefined,
      licensePlate: formData.licensePlate.trim() || undefined,
      dimensions: {
        length: formData.length.trim() ? Number(formData.length) : undefined,
        width: formData.width.trim() ? Number(formData.width) : undefined,
        height: formData.height.trim() ? Number(formData.height) : undefined,
      },
    }
    updateVehicleMutation.mutate({ userId: editingDriver._id, vehicleInfo })
  }

  const formatType = (type) => {
    const found = VEHICLE_TYPES.find((t) => t.value === type)
    return found ? found.label : type ? type.charAt(0).toUpperCase() + type.slice(1) : "—"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex items-start gap-4 mb-6">
          <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton variant="text" lines={2} className="max-w-xl" />
          </div>
        </div>
        <Card className="p-4 overflow-hidden">
          <div className="flex flex-wrap gap-3 mb-4">
            <Skeleton className="h-10 w-full max-w-xs" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 bg-muted/30 border-b border-border">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="grid grid-cols-5 gap-4 p-4 border-b border-border last:border-0 items-center"
              >
                <div className="flex items-center gap-3">
                  <Skeleton variant="avatar" className="h-9 w-9" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </Card>
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
            <div className="p-3 bg-info/10 rounded-xl">
              <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-info" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                Vehicle Management
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                View and edit driver vehicle information: type, capacity, license plate, and dimensions
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
                  placeholder="Search by driver name, email, or license plate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <div className="flex gap-3 sm:gap-4 flex-wrap">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 sm:px-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All types</option>
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <select
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                  className="px-3 sm:px-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All drivers</option>
                  <option value="with">With vehicle info</option>
                  <option value="without">Without vehicle info</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Mobile cards */}
        <motion.div variants={itemVariants} className="lg:hidden">
          <div className="space-y-3">
            {paginatedDrivers.length === 0 ? (
              <Card className="p-6">
                <div className="text-center py-12">
                  <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No drivers found</p>
                </div>
              </Card>
            ) : (
              paginatedDrivers.map((driver, index) => (
                <motion.div
                  key={driver._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {driver.avatar ? (
                            <img
                              src={normalizeAvatarUrl(driver.avatar)}
                              alt={`${driver.firstName} ${driver.lastName}`}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                e.target.style.display = "none"
                                e.target.nextSibling?.classList?.remove("hidden")
                              }}
                            />
                          ) : null}
                          <div
                            className={clsx(
                              "w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0",
                              driver.avatar && "hidden"
                            )}
                          >
                            {driver.firstName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-foreground truncate">
                              {driver.firstName} {driver.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{driver.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <Car className="w-4 h-4" />
                          {driver.vehicleInfo?.type ? formatType(driver.vehicleInfo.type) : "—"}
                        </p>
                        {driver.vehicleInfo?.capacity != null && (
                          <p className="flex items-center gap-2">
                            <Weight className="w-4 h-4" />
                            {driver.vehicleInfo.capacity} kg
                          </p>
                        )}
                        {driver.vehicleInfo?.licensePlate && (
                          <p className="font-medium text-foreground">{driver.vehicleInfo.licensePlate}</p>
                        )}
                      </div>
                      <Button
                        size="small"
                        variant="outline"
                        onClick={() => openEditModal(driver)}
                        className="w-full"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit vehicle
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {filteredDrivers.length > itemsPerPage && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t border-border">
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
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </Button>
              <span className="text-sm font-medium text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="small"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
          )}
        </motion.div>

        {/* Desktop table */}
        <motion.div variants={itemVariants} className="hidden lg:block">
          <Card className="p-4 sm:p-5 md:p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Driver</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Email</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Type</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Capacity</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">License plate</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Dimensions</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDrivers.map((driver, index) => (
                    <motion.tr
                      key={driver._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {driver.avatar ? (
                            <img
                              src={normalizeAvatarUrl(driver.avatar)}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                e.target.style.display = "none"
                                e.target.nextSibling?.classList?.remove("hidden")
                              }}
                            />
                          ) : null}
                          <div
                            className={clsx(
                              "w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0",
                              driver.avatar && "hidden"
                            )}
                          >
                            {driver.firstName?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground text-sm">
                            {driver.firstName} {driver.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{driver.email}</td>
                      <td className="py-4 px-4 text-sm">
                        {driver.vehicleInfo?.type ? formatType(driver.vehicleInfo.type) : "—"}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {driver.vehicleInfo?.capacity != null
                          ? `${driver.vehicleInfo.capacity} kg`
                          : "—"}
                      </td>
                      <td className="py-4 px-4 text-sm font-medium">
                        {driver.vehicleInfo?.licensePlate || "—"}
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {driver.vehicleInfo?.dimensions?.length != null
                          ? `${driver.vehicleInfo.dimensions.length}×${driver.vehicleInfo.dimensions.width ?? "—"}×${driver.vehicleInfo.dimensions.height ?? "—"} cm`
                          : "—"}
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() => openEditModal(driver)}
                          className="text-primary hover:bg-primary/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {paginatedDrivers.length === 0 && (
                <div className="text-center py-12">
                  <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No drivers found</p>
                </div>
              )}
            </div>

            {filteredDrivers.length > itemsPerPage && (
              <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredDrivers.length)} of{" "}
                    {filteredDrivers.length} drivers
                  </div>
                  <div className="flex items-center gap-2">
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
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {generatePageNumbers(currentPage, totalPages).map((page, i) =>
                        page === "ellipsis" ? (
                          <span key={`e-${i}`} className="px-2 text-muted-foreground">
                            ...
                          </span>
                        ) : (
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
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>

      {/* Edit vehicle modal */}
      {editModalOpen && editingDriver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => !updateVehicleMutation.isPending && setEditModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Edit vehicle</h2>
              <button
                type="button"
                onClick={() => !updateVehicleMutation.isPending && setEditModalOpen(false)}
                className="p-2 rounded-lg hover:bg-accent text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitEdit} className="p-4 sm:p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                {editingDriver.firstName} {editingDriver.lastName} — {editingDriver.email}
              </p>
              {formErrors.form && (
                <p className="text-sm text-destructive">{formErrors.form}</p>
              )}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Vehicle type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                  className="input-field w-full"
                  aria-invalid={!!formErrors.type}
                >
                  <option value="">Select type</option>
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {formErrors.type && (
                  <p className="text-sm text-destructive">{formErrors.type}</p>
                )}
              </div>
              <Input
                label="Capacity (kg)"
                type="number"
                min="0"
                step="1"
                value={formData.capacity}
                onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}
                error={formErrors.capacity}
              />
              <Input
                label="License plate (max 20 characters)"
                value={formData.licensePlate}
                onChange={(e) => setFormData((prev) => ({ ...prev, licensePlate: e.target.value }))}
                error={formErrors.licensePlate}
              />
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Length (cm)"
                  type="number"
                  min="0"
                  value={formData.length}
                  onChange={(e) => setFormData((prev) => ({ ...prev, length: e.target.value }))}
                  error={formErrors.length}
                />
                <Input
                  label="Width (cm)"
                  type="number"
                  min="0"
                  value={formData.width}
                  onChange={(e) => setFormData((prev) => ({ ...prev, width: e.target.value }))}
                  error={formErrors.width}
                />
                <Input
                  label="Height (cm)"
                  type="number"
                  min="0"
                  value={formData.height}
                  onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                  error={formErrors.height}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1"
                  disabled={updateVehicleMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={updateVehicleMutation.isPending}>
                  {updateVehicleMutation.isPending ? "Saving…" : "Save"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminVehiclesPage
