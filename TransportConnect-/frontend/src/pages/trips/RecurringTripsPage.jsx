import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  RefreshCw,
  Trash2,
  Edit,
  Navigation,
  Weight,
  Clock,
  Eye,
} from "../../utils/icons"
import { recurringTripsAPI } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import { useLocale } from "../../contexts/LocaleContext"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import ConfirmationDialog from "../../components/ui/ConfirmationDialog"
import toast from "react-hot-toast"
import clsx from "clsx"

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const RecurringTripsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { formatCurrency } = useLocale()
  const isDriver = user?.role === "conducteur"
  const [editingId, setEditingId] = useState(null)
  const [editFrequency, setEditFrequency] = useState("weekly")
  const [editEndDate, setEditEndDate] = useState("")
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [recToDelete, setRecToDelete] = useState(null)

  const { data: recurringTrips = [], isLoading } = useQuery({
    queryKey: ["recurring-trips"],
    queryFn: () => recurringTripsAPI.list(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => recurringTripsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-trips"] })
      toast.success("Recurring trip deleted")
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to delete"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => recurringTripsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-trips"] })
      setEditingId(null)
      toast.success("Recurring trip updated")
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to update"),
  })

  const startEdit = (rec) => {
    setEditingId(rec._id)
    setEditFrequency(rec.frequency)
    setEditEndDate(rec.endDate ? rec.endDate.slice(0, 10) : "")
  }

  const saveEdit = (rec) => {
    if (!editingId) return
    const payload = { frequency: editFrequency }
    if (editFrequency === "monthly" && (rec.dayOfMonth == null || rec.dayOfMonth === undefined)) {
      payload.dayOfMonth = rec.nextRunAt ? new Date(rec.nextRunAt).getDate() : 1
    } else if (editFrequency === "weekly" && (rec.dayOfWeek == null || rec.dayOfWeek === undefined)) {
      payload.dayOfWeek = rec.nextRunAt ? new Date(rec.nextRunAt).getDay() : 0
    }
    if (editEndDate) payload.endDate = new Date(editEndDate).toISOString()
    else payload.endDate = null
    updateMutation.mutate({ id: editingId, data: payload })
  }

  const formatNextRun = (rec) => {
    if (!rec.nextRunAt) return "—"
    const d = new Date(rec.nextRunAt)
    return d.toLocaleDateString(undefined, { dateStyle: "medium" })
  }

  const handleConfirmDelete = () => {
    if (recToDelete) {
      deleteMutation.mutate(recToDelete._id)
      setRecToDelete(null)
    }
    setDeleteDialog(false)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 py-4 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-6 space-y-3 sm:space-y-4 md:space-y-5">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Recurring trips</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {isDriver
              ? "Trips that repeat weekly or monthly. Next run is created automatically."
              : "Browse recurring routes offered by drivers. Request cargo when a one-time trip is created from these routes."}
          </p>
        </div>
      </div>

      {isDriver && (
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link to="/trips/create">Create trip</Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            Enable &quot;Repeat&quot; when creating a trip to add a recurring rule.
          </span>
        </div>
      )}

      {isLoading ? (
        <Card className="p-6 text-center text-muted-foreground">Loading…</Card>
      ) : recurringTrips.length === 0 ? (
        <Card className="p-8 text-center">
          <RefreshCw className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-medium">
            {isDriver ? "No recurring trips" : "No recurring routes available"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {isDriver
              ? "Create a trip and turn on \"Repeat\" to add one."
              : "Drivers can offer recurring routes; check back later or browse one-time trips."}
          </p>
          {isDriver && (
            <Button asChild className="mt-4">
              <Link to="/trips/create">Create trip</Link>
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          {recurringTrips.map((rec, index) => {
            const t = rec.template
            const fromCity = t?.departure?.city || t?.departure?.address || "?"
            const toCity = t?.destination?.city || t?.destination?.address || "?"
            return (
              <motion.div
                key={rec._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card hover className="p-3 sm:p-4 md:p-5 lg:p-6 h-full flex flex-col relative overflow-visible">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0 pr-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Navigation className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {fromCity} → {toCity}
                        </h3>
                      </div>
                      <div
                        className={clsx(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border",
                          "bg-info/10 text-info border-info/20"
                        )}
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>
                          {rec.frequency === "weekly"
                            ? `Weekly (${DAY_NAMES[rec.dayOfWeek]})`
                            : `Monthly (day ${rec.dayOfMonth})`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 min-w-0">
                      <div className="text-2xl font-bold text-primary truncate" title={formatCurrency(t?.pricePerKg ?? 0) + "/kg"}>
                        {formatCurrency(t?.pricePerKg ?? 0)}/kg
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                        <Weight className="w-3 h-3" />
                        {t?.availableCapacity?.weight ?? "—"}kg
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">From:</span>
                      <span className="text-muted-foreground truncate">
                        {t?.departure?.address}, {t?.departure?.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">To:</span>
                      <span className="text-muted-foreground truncate">
                        {t?.destination?.address}, {t?.destination?.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">Next run:</span>
                      <span className="text-muted-foreground">{formatNextRun(rec)}</span>
                    </div>
                    {rec.endDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">Ends:</span>
                        <span className="text-muted-foreground">
                          {new Date(rec.endDate).toLocaleDateString(undefined, { dateStyle: "medium" })}
                        </span>
                      </div>
                    )}
                    {t?.durationHours != null && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">Duration:</span>
                        <span className="text-muted-foreground">{t.durationHours}h</span>
                      </div>
                    )}
                    {!isDriver && rec.driver && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-foreground font-medium">Driver:</span>
                        <span className="text-muted-foreground">
                          {rec.driver.firstName} {rec.driver.lastName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Cargo types */}
                  {t?.acceptedCargoTypes?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">Accepted cargo types:</p>
                      <div className="flex flex-wrap gap-2">
                        {t.acceptedCargoTypes.slice(0, 3).map((type) => (
                          <span
                            key={type}
                            className="px-2 py-1 bg-accent rounded-md text-xs font-medium text-foreground"
                          >
                            {type}
                          </span>
                        ))}
                        {t.acceptedCargoTypes.length > 3 && (
                          <span className="px-2 py-1 bg-accent rounded-md text-xs font-medium text-muted-foreground">
                            +{t.acceptedCargoTypes.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Inline edit form (driver only) */}
                  {isDriver && editingId === rec._id && (
                    <div className="mb-4 pt-4 border-t border-border flex flex-wrap items-end gap-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Frequency</label>
                        <select
                          className="input-field"
                          value={editFrequency}
                          onChange={(e) => setEditFrequency(e.target.value)}
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">End date (optional)</label>
                        <input
                          type="date"
                          className="input-field"
                          value={editEndDate}
                          onChange={(e) => setEditEndDate(e.target.value)}
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={() => saveEdit(rec)}
                        loading={updateMutation.isPending}
                      >
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-auto">
                    <Link to={`/trips/recurring/${rec._id}`}>
                      <Button variant="ghost" size="small">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    {isDriver && (
                      <>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => startEdit(rec)}
                          disabled={!!editingId && editingId !== rec._id}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="small"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            setRecToDelete(rec)
                            setDeleteDialog(true)
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      <ConfirmationDialog
        isOpen={deleteDialog}
        onClose={() => {
          setDeleteDialog(false)
          setRecToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete recurring trip?"
        message="Future trips will not be created from this rule. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

export default RecurringTripsPage
