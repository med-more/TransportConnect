import { useState, useMemo } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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
} from "../../utils/icons"
import { recurringTripsAPI, estimateAPI } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import { useLocale } from "../../contexts/LocaleContext"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import ConfirmationDialog from "../../components/ui/ConfirmationDialog"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import RouteStepsMap from "../../components/map/RouteStepsMap"
import toast from "react-hot-toast"
import clsx from "clsx"

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const RecurringTripDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { formatCurrency } = useLocale()
  const isDriver = user?.role === "conducteur"
  const [editing, setEditing] = useState(false)
  const [editFrequency, setEditFrequency] = useState("weekly")
  const [editEndDate, setEditEndDate] = useState("")
  const [deleteDialog, setDeleteDialog] = useState(false)

  const { data: rec, isLoading, error } = useQuery({
    queryKey: ["recurring-trip", id],
    queryFn: () => recurringTripsAPI.getById(id),
    enabled: !!id,
  })

  const t = rec?.template
  const routeWaypoints = useMemo(() => {
    if (!t?.departure || !t?.destination) return []
    const dep = t.departure?.coordinates || t.departure
    const dest = t.destination?.coordinates || t.destination
    const depLat = dep?.lat ?? dep?.latitude
    const depLng = dep?.lng ?? dep?.longitude
    const destLat = dest?.lat ?? dest?.latitude
    const destLng = dest?.lng ?? dest?.longitude
    if (
      depLat == null || depLng == null ||
      destLat == null || destLng == null ||
      Number.isNaN(Number(depLat)) || Number.isNaN(Number(depLng)) ||
      Number.isNaN(Number(destLat)) || Number.isNaN(Number(destLng))
    ) return []
    return [
      { lat: Number(depLat), lng: Number(depLng), label: t.departure?.city || "Departure" },
      { lat: Number(destLat), lng: Number(destLng), label: t.destination?.city || "Destination" },
    ]
  }, [t])

  const { data: routeEstimate } = useQuery({
    queryKey: ["recurring-route", id, routeWaypoints.map((w) => `${w.lat},${w.lng}`).join(";")],
    queryFn: () =>
      routeWaypoints.length === 2
        ? estimateAPI.getRouteEstimate(
            routeWaypoints[0].lat,
            routeWaypoints[0].lng,
            routeWaypoints[1].lat,
            routeWaypoints[1].lng
          )
        : estimateAPI.getRouteEstimateMulti(routeWaypoints),
    enabled: !!id && routeWaypoints.length >= 2,
  })

  const deleteMutation = useMutation({
    mutationFn: (recurringId) => recurringTripsAPI.delete(recurringId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-trips"] })
      toast.success("Recurring trip deleted")
      navigate("/trips/recurring")
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to delete"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ recurringId, data }) => recurringTripsAPI.update(recurringId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-trips"] })
      queryClient.invalidateQueries({ queryKey: ["recurring-trip", id] })
      setEditing(false)
      toast.success("Recurring trip updated")
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to update"),
  })

  const startEdit = () => {
    if (!rec) return
    setEditing(true)
    setEditFrequency(rec.frequency)
    setEditEndDate(rec.endDate ? rec.endDate.slice(0, 10) : "")
  }

  const saveEdit = () => {
    if (!rec) return
    const payload = { frequency: editFrequency }
    if (editFrequency === "monthly" && (rec.dayOfMonth == null || rec.dayOfMonth === undefined)) {
      payload.dayOfMonth = rec.nextRunAt ? new Date(rec.nextRunAt).getDate() : 1
    } else if (editFrequency === "weekly" && (rec.dayOfWeek == null || rec.dayOfWeek === undefined)) {
      payload.dayOfWeek = rec.nextRunAt ? new Date(rec.nextRunAt).getDay() : 0
    }
    if (editEndDate) payload.endDate = new Date(editEndDate).toISOString()
    else payload.endDate = null
    updateMutation.mutate({ recurringId: rec._id, data: payload })
  }

  const formatNextRun = (r) => {
    if (!r?.nextRunAt) return "—"
    return new Date(r.nextRunAt).toLocaleDateString(undefined, { dateStyle: "medium" })
  }

  // Fallbacks for template fields (backend schema defaults; old docs may not have them)
  const departureTime = t?.departureTime ?? "08:00"
  const durationHours = t?.durationHours != null ? t.durationHours : 8

  const routeGeometry = routeEstimate?.geometry ?? null

  if (isLoading || !id) {
    return (
      <div className="w-full max-w-7xl mx-auto px-3 py-8 flex justify-center min-h-[200px] items-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !rec) {
    return (
      <div className="w-full max-w-7xl mx-auto px-3 py-6 sm:px-4 md:px-5">
        <Card className="p-6 sm:p-8 text-center">
          <p className="text-foreground font-medium">Recurring trip not found</p>
          <Button asChild className="mt-4">
            <Link to="/trips/recurring">Back to recurring trips</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const fromCity = t?.departure?.city || t?.departure?.address || "?"
  const toCity = t?.destination?.city || t?.destination?.address || "?"
  const hasMap = routeWaypoints.length >= 2

  return (
    <div className="w-full max-w-7xl mx-auto px-3 py-4 sm:px-4 sm:py-5 md:px-5 md:py-6 lg:px-6">
      {/* Top bar: back + title — full width */}
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Button variant="ghost" size="small" className="flex-shrink-0" asChild>
          <Link to="/trips/recurring">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
            {fromCity} → {toCity}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Recurring trip details</p>
        </div>
      </div>

      {/* Two columns: content left, map right; stack on small screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* Left: content */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col space-y-4 sm:space-y-5">
          {/* Price & recurrence badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              className={clsx(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border",
                "bg-info/10 text-info border-info/20"
              )}
            >
              <RefreshCw className="w-4 h-4 flex-shrink-0" />
              {rec.frequency === "weekly"
                ? `Weekly (${DAY_NAMES[rec.dayOfWeek]})`
                : `Monthly (day ${rec.dayOfMonth})`}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-primary">{formatCurrency(t?.pricePerKg ?? 0)}/kg</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Weight className="w-4 h-4" />
                {t?.availableCapacity?.weight ?? "—"}kg
              </span>
            </div>
          </div>

          {/* From / To */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">From</p>
                <p className="text-foreground text-sm sm:text-base">{t?.departure?.address}, {t?.departure?.city}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-destructive/80 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">To</p>
                <p className="text-foreground text-sm sm:text-base">{t?.destination?.address}, {t?.destination?.city}</p>
              </div>
            </div>
          </div>

          {/* Schedule: Next run, Ends, Departure time, Duration — always show */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-muted/50">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next run</p>
                <p className="text-sm font-medium text-foreground">{formatNextRun(rec)}</p>
              </div>
            </div>
            {rec.endDate ? (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-muted/50">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ends</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(rec.endDate).toLocaleDateString(undefined, { dateStyle: "medium" })}
                  </p>
                </div>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-muted/50">
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Departure time</p>
                <p className="text-sm font-medium text-foreground">{departureTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-muted/50">
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium text-foreground">{durationHours}h</p>
              </div>
            </div>
          </div>

          {/* Dimensions */}
          {t?.availableCapacity?.dimensions?.length != null && t?.availableCapacity?.dimensions?.width != null && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Dimensions</p>
              <p className="text-muted-foreground text-sm">
                {t.availableCapacity.dimensions.length} × {t.availableCapacity.dimensions.width} ×{" "}
                {t.availableCapacity.dimensions.height} cm
              </p>
            </div>
          )}

          {/* Cargo types */}
          {t?.acceptedCargoTypes?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Accepted cargo</p>
              <div className="flex flex-wrap gap-2">
                {t.acceptedCargoTypes.map((type) => (
                  <span
                    key={type}
                    className="px-2.5 py-1 bg-accent rounded-md text-xs font-medium text-foreground"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {t?.description && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Description</p>
              <p className="text-muted-foreground text-sm">{t.description}</p>
            </div>
          )}

          {/* Inline edit (driver only) */}
          {isDriver && editing && (
            <Card className="p-4 border border-border">
              <p className="text-sm font-medium text-foreground mb-3">Edit schedule</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <div className="min-w-[140px]">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Frequency</label>
                  <select
                    className="input-field w-full"
                    value={editFrequency}
                    onChange={(e) => setEditFrequency(e.target.value)}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="min-w-[160px]">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">End date (optional)</label>
                  <input
                    type="date"
                    className="input-field w-full"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button size="small" onClick={saveEdit} loading={updateMutation.isPending}>
                    Save
                  </Button>
                  <Button variant="ghost" size="small" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
            {isDriver && !editing && (
              <>
                <Button variant="outline" size="small" onClick={startEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="small"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteDialog(true)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
            <Link to="/trips/recurring" className="inline-flex sm:ml-auto">
              <Button variant="ghost" size="small">Back to list</Button>
            </Link>
          </div>
        </div>

        {/* Right: map */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col min-h-0">
          {hasMap ? (
            <div className="rounded-xl overflow-hidden border border-border bg-muted/20 h-[280px] sm:h-[320px] lg:h-[400px] xl:min-h-[420px]">
              <RouteStepsMap
                waypoints={routeWaypoints}
                routeGeometry={routeGeometry}
                className="w-full h-full"
                height="100%"
              />
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-8 h-[280px] sm:h-[320px] lg:h-[400px] text-center rounded-xl">
              <Navigation className="w-12 h-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-foreground">Route map</p>
              <p className="text-xs text-muted-foreground mt-1">
                Map is available when departure and destination have coordinates.
              </p>
            </Card>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={() => {
          deleteMutation.mutate(rec._id)
          setDeleteDialog(false)
        }}
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

export default RecurringTripDetailPage
