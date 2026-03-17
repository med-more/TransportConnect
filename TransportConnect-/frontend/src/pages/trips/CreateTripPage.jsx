import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm, useFieldArray } from "react-hook-form"
import { ArrowLeft, MapPin, Calendar, Weight, Euro, Package, Plus, Trash2, ChevronUp, ChevronDown } from "../../utils/icons"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { tripsAPI, usersAPI, estimateAPI, recurringTripsAPI } from "../../services/api"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import PlaceAutocompleteInput from "../../components/ui/PlaceAutocompleteInput"
import Card from "../../components/ui/Card"
import RouteStepsMap from "../../components/map/RouteStepsMap"
import { CARGO_TYPES } from "../../config/constants"
import toast from "react-hot-toast"

const CreateTripPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedCargoTypes, setSelectedCargoTypes] = useState([])
  const [otherCargoType, setOtherCargoType] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm({
    defaultValues: { intermediateStops: [] },
  })

  const { fields: intermediateStopsFields, append: appendStop, remove: removeStop, move: moveStop } = useFieldArray({
    control,
    name: "intermediateStops",
  })

  const depLat = watch("departureLat")
  const depLng = watch("departureLng")
  const destLat = watch("destinationLat")
  const destLng = watch("destinationLng")
  const watchedStops = watch("intermediateStops") || []
  const waypoints = (() => {
    const dep = { lat: Number(depLat), lng: Number(depLng) }
    const dest = { lat: Number(destLat), lng: Number(destLng) }
    if (Number.isNaN(dep.lat) || Number.isNaN(dep.lng) || Number.isNaN(dest.lat) || Number.isNaN(dest.lng)) return null
    const stops = watchedStops
      .map((s) => ({ lat: Number(s?.lat ?? s?.coordinates?.lat), lng: Number(s?.lng ?? s?.coordinates?.lng) }))
      .filter((s) => !Number.isNaN(s.lat) && !Number.isNaN(s.lng))
    return [dep, ...stops, dest]
  })()
  const hasCoords = waypoints && waypoints.length >= 2

  const { data: routeEstimate } = useQuery({
    queryKey: ["route-estimate", waypoints?.map((w) => `${w.lat},${w.lng}`).join(";")],
    queryFn: () =>
      waypoints.length === 2
        ? estimateAPI.getRouteEstimate(waypoints[0].lat, waypoints[0].lng, waypoints[1].lat, waypoints[1].lng)
        : estimateAPI.getRouteEstimateMulti(waypoints),
    enabled: !!hasCoords && !!waypoints,
  })

  const { data: savedAddresses = [] } = useQuery({
    queryKey: ["saved-addresses"],
    queryFn: () => usersAPI.getSavedAddresses(),
  })

  const fillDepartureFromAddress = (addr) => {
    if (!addr) return
    setValue("departureAddress", addr.address)
    setValue("departureCity", addr.city)
    if (addr.coordinates?.lat != null && addr.coordinates?.lng != null) {
      setValue("departureLat", addr.coordinates.lat)
      setValue("departureLng", addr.coordinates.lng)
    } else {
      setValue("departureLat", "")
      setValue("departureLng", "")
    }
  }
  const fillDestinationFromAddress = (addr) => {
    if (!addr) return
    setValue("destinationAddress", addr.address)
    setValue("destinationCity", addr.city)
    if (addr.coordinates?.lat != null && addr.coordinates?.lng != null) {
      setValue("destinationLat", addr.coordinates.lat)
      setValue("destinationLng", addr.coordinates.lng)
    } else {
      setValue("destinationLat", "")
      setValue("destinationLng", "")
    }
  }

  const [saveAddressType, setSaveAddressType] = useState(null)
  const [saveAddressLabel, setSaveAddressLabel] = useState("")
  const saveAddressMutation = useMutation({
    mutationFn: (data) => usersAPI.addSavedAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-addresses"] })
      setSaveAddressType(null)
      setSaveAddressLabel("")
      toast.success("Address saved to your list")
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to save address"),
  })
  const handleSaveAddress = (type) => {
    const address = type === "departure" ? watch("departureAddress") : watch("destinationAddress")
    const city = type === "departure" ? watch("departureCity") : watch("destinationCity")
    if (!address?.trim() || !city?.trim()) {
      toast.error("Enter address and city first")
      return
    }
    saveAddressMutation.mutate(
      { label: saveAddressLabel.trim() || (type === "departure" ? "Departure" : "Destination"), address: address.trim(), city: city.trim(), country: "Maroc" },
      { onSuccess: () => setSaveAddressType(null) }
    )
  }

  const createTripMutation = useMutation({
    mutationFn: tripsAPI.createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] })
      toast.success("Trip created successfully!")
      navigate("/trips")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error creating trip")
    },
  })

  const createRecurringMutation = useMutation({
    mutationFn: recurringTripsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-trips"] })
      toast.success("Recurring trip created. Trips will be generated automatically.")
      navigate("/trips/recurring")
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "Error creating recurring trip"
      const errors = error.response?.data?.errors
      const detail = Array.isArray(errors) && errors.length ? errors.map((e) => e.msg || e.message).join(". ") : null
      toast.error(detail || msg)
    },
  })

  const watchedInsured = watch("insured")
  const watchedDeclaredValue = Number(watch("declaredValue") || 0)
  const INSURANCE_RATE = 0.01 // 1% of declared value
  const INSURANCE_MIN_PREMIUM = 20 // MAD
  const computedPremium =
    watchedInsured && watchedDeclaredValue > 0
      ? Math.max(INSURANCE_MIN_PREMIUM, Math.round(watchedDeclaredValue * INSURANCE_RATE))
      : 0

  const onSubmit = async (data) => {
    if (selectedCargoTypes.length === 0) {
      toast.error("Please select at least one cargo type")
      return
    }
    if (selectedCargoTypes.includes("autre") && !otherCargoType?.trim()) {
      toast.error("Précisez le type de cargaison pour « Autre »")
      return
    }

    const departureDate = new Date(data.departureDate + "T" + data.departureTime)
    const arrivalDate = new Date(data.arrivalDate + "T" + data.arrivalTime)
    const durationHours = (arrivalDate - departureDate) / (60 * 60 * 1000)

    if (isRecurring) {
      const template = {
        departure: {
          address: data.departureAddress,
          city: data.departureCity,
          coordinates:
            depLat && depLng && !Number.isNaN(Number(depLat)) && !Number.isNaN(Number(depLng))
              ? { lat: Number(depLat), lng: Number(depLng) }
              : undefined,
        },
        destination: {
          address: data.destinationAddress,
          city: data.destinationCity,
          coordinates:
            destLat && destLng && !Number.isNaN(Number(destLat)) && !Number.isNaN(Number(destLng))
              ? { lat: Number(destLat), lng: Number(destLng) }
              : undefined,
        },
        availableCapacity: {
          weight: Number.parseFloat(data.weight),
          dimensions: {
            length: Number.parseFloat(data.length),
            width: Number.parseFloat(data.width),
            height: Number.parseFloat(data.height),
          },
        },
        acceptedCargoTypes: selectedCargoTypes,
        otherCargoType: selectedCargoTypes.includes("autre") && otherCargoType?.trim() ? otherCargoType.trim() : undefined,
        pricePerKg: Number.parseFloat(data.pricePerKg),
        description: data.description || undefined,
        departureTime: data.departureTime || "08:00",
        durationHours: durationHours > 0 ? durationHours : 8,
      }
      const startDate = new Date(data.departureDate)
      startDate.setHours(0, 0, 0, 0)
      const frequency = (data.recurrenceFrequency || "weekly").toLowerCase()
      const clampedDuration = Math.min(72, Math.max(0.5, durationHours > 0 && Number.isFinite(durationHours) ? durationHours : 8))
      const payload = {
        frequency,
        startDate: startDate.toISOString(),
        template: {
          ...template,
          departureTime: (data.departureTime || "08:00").slice(0, 5),
          durationHours: clampedDuration,
        },
      }
      if (recurrenceEndDate) payload.endDate = new Date(recurrenceEndDate).toISOString()
      if (frequency === "weekly") payload.dayOfWeek = startDate.getDay()
      else payload.dayOfMonth = Math.min(31, Math.max(1, startDate.getDate()))
      createRecurringMutation.mutate(payload)
      return
    }

    const intermediateStops = (data.intermediateStops || [])
      .filter((s) => s && (s.address?.trim() || s.city?.trim()))
      .map((s, i) => {
        const lat = s.lat != null ? Number(s.lat) : Number(s.coordinates?.lat)
        const lng = s.lng != null ? Number(s.lng) : Number(s.coordinates?.lng)
        return {
          address: (s.address || "").trim(),
          city: (s.city || "").trim(),
          order: i,
          ...(Number.isFinite(lat) && Number.isFinite(lng) && { coordinates: { lat, lng } }),
        }
      })

    const tripData = {
      departure: {
        address: data.departureAddress,
        city: data.departureCity,
      },
      destination: {
        address: data.destinationAddress,
        city: data.destinationCity,
      },
      ...(intermediateStops.length > 0 && { intermediateStops }),
      departureDate,
      arrivalDate,
      availableCapacity: {
        weight: Number.parseFloat(data.weight),
        dimensions: {
          length: Number.parseFloat(data.length),
          width: Number.parseFloat(data.width),
          height: Number.parseFloat(data.height),
        },
      },
      acceptedCargoTypes: selectedCargoTypes,
      ...(selectedCargoTypes.includes("autre") && otherCargoType?.trim() && { otherCargoType: otherCargoType.trim() }),
      pricePerKg: Number.parseFloat(data.pricePerKg),
      description: data.description,
      insured: !!data.insured,
      ...(data.insured && watchedDeclaredValue > 0 && {
        declaredValue: watchedDeclaredValue,
        coverageAmount: watchedDeclaredValue,
        insurancePremium: computedPremium,
      }),
    }

    createTripMutation.mutate(tripData)
  }

  const toggleCargoType = (type) => {
    setSelectedCargoTypes((prev) => {
      const next = prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
      if (type === "autre" && !next.includes("autre")) setOtherCargoType("")
      return next
    })
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-4xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">Create New Trip</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Fill in your trip information to connect shippers and drivers</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center mb-6">
            <MapPin className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold text-foreground">Route</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Départ</h3>
              {savedAddresses?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Use saved address</label>
                  <select
                    className="input-field"
                    onChange={(e) => {
                      const id = e.target.value
                      if (!id) return
                      const addr = savedAddresses.find((a) => a._id === id)
                      fillDepartureFromAddress(addr)
                    }}
                  >
                    <option value="">Select an address...</option>
                    {savedAddresses.map((addr) => (
                      <option key={addr._id} value={addr._id}>
                        {addr.label} — {addr.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <input type="hidden" {...register("departureLat")} />
              <input type="hidden" {...register("departureLng")} />
              <PlaceAutocompleteInput
                label="Lieu de départ (Maroc)"
                cityField="departureCity"
                addressField="departureAddress"
                setValue={setValue}
                register={register}
                watch={watch}
                coordFields={{ lat: "departureLat", lng: "departureLng" }}
                error={errors.departureCity?.message || errors.departureAddress?.message}
                placeholder="Casablanca, Rabat, Fès..."
                cityRules={{ required: "Ville de départ requise" }}
                addressRules={{ required: "Adresse de départ requise" }}
              />
              <div className="pt-2 border-t border-border">
                {saveAddressType === "departure" ? (
                  <div className="flex flex-wrap items-end gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. Warehouse)"
                      value={saveAddressLabel}
                      onChange={(e) => setSaveAddressLabel(e.target.value)}
                      className="input-field flex-1 min-w-[120px]"
                    />
                    <button type="button" onClick={() => handleSaveAddress("departure")} disabled={saveAddressMutation.isPending} className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">Save</button>
                    <button type="button" onClick={() => setSaveAddressType(null)} className="rounded-xl border border-border px-3 py-2 text-sm text-foreground hover:bg-accent/50">Cancel</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setSaveAddressType("departure")} className="text-sm text-primary hover:underline">Save this departure to my addresses</button>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Destination</h3>
              {savedAddresses?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Use saved address</label>
                  <select
                    className="input-field"
                    onChange={(e) => {
                      const id = e.target.value
                      if (!id) return
                      const addr = savedAddresses.find((a) => a._id === id)
                      fillDestinationFromAddress(addr)
                    }}
                  >
                    <option value="">Select an address...</option>
                    {savedAddresses.map((addr) => (
                      <option key={addr._id} value={addr._id}>
                        {addr.label} — {addr.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <input type="hidden" {...register("destinationLat")} />
              <input type="hidden" {...register("destinationLng")} />
              <PlaceAutocompleteInput
                label="Lieu d'arrivée (Maroc)"
                cityField="destinationCity"
                addressField="destinationAddress"
                setValue={setValue}
                register={register}
                watch={watch}
                coordFields={{ lat: "destinationLat", lng: "destinationLng" }}
                error={errors.destinationCity?.message || errors.destinationAddress?.message}
                placeholder="Marrakech, Tanger, Oujda..."
                cityRules={{ required: "Ville de destination requise" }}
                addressRules={{ required: "Adresse de destination requise" }}
              />
              <div className="pt-2 border-t border-border">
                {saveAddressType === "destination" ? (
                  <div className="flex flex-wrap items-end gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. Client)"
                      value={saveAddressLabel}
                      onChange={(e) => setSaveAddressLabel(e.target.value)}
                      className="input-field flex-1 min-w-[120px]"
                    />
                    <button type="button" onClick={() => handleSaveAddress("destination")} disabled={saveAddressMutation.isPending} className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">Save</button>
                    <button type="button" onClick={() => setSaveAddressType(null)} className="rounded-xl border border-border px-3 py-2 text-sm text-foreground hover:bg-accent/50">Cancel</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setSaveAddressType("destination")} className="text-sm text-primary hover:underline">Save this destination to my addresses</button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-medium text-foreground">Intermediate stops (optional)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendStop({ address: "", city: "", lat: "", lng: "" })}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add stop
              </Button>
            </div>
            {intermediateStopsFields.length > 0 && (
              <ul className="space-y-4">
                {intermediateStopsFields.map((field, index) => (
                  <li key={field.id} className="flex flex-wrap items-start gap-2 p-3 rounded-lg border border-border bg-muted/30">
                    <div className="flex-1 min-w-[200px] space-y-2">
                      <input type="hidden" {...register(`intermediateStops.${index}.lat`)} />
                      <input type="hidden" {...register(`intermediateStops.${index}.lng`)} />
                      <PlaceAutocompleteInput
                        label={`Stop ${index + 1}`}
                        cityField={`intermediateStops.${index}.city`}
                        addressField={`intermediateStops.${index}.address`}
                        setValue={setValue}
                        register={register}
                        watch={watch}
                        coordFields={{ lat: `intermediateStops.${index}.lat`, lng: `intermediateStops.${index}.lng` }}
                        placeholder="Address or city..."
                      />
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveStop(index, index - 1)}
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveStop(index, index + 1)}
                        disabled={index === intermediateStopsFields.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removeStop(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {routeEstimate && (
            <>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">Route preview</p>
                <RouteStepsMap
                  waypoints={[
                    { ...waypoints[0], label: watch("departureCity") || "Departure" },
                    ...waypoints.slice(1, -1).map((w, i) => ({
                      ...w,
                      label: watchedStops[i]?.city || watchedStops[i]?.address || `Stop ${i + 1}`,
                    })),
                    { ...waypoints[waypoints.length - 1], label: watch("destinationCity") || "Destination" },
                  ]}
                  routeGeometry={routeEstimate.geometry}
                  height="280px"
                  className="mt-2"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 gap-y-2">
                <span className="text-sm text-muted-foreground">
                  Approx. distance: <strong className="text-foreground">{routeEstimate.distanceKm} km</strong>
                </span>
                <span className="text-sm text-muted-foreground">
                  Duration: <strong className="text-foreground">~{routeEstimate.durationMinutes} min</strong>
                  {routeEstimate.durationMinutes >= 60 && ` (${(routeEstimate.durationMinutes / 60).toFixed(1)} h)`}
                </span>
                <span className="text-sm text-muted-foreground">
                  Suggested price:{" "}
                  <strong className="text-primary">
                    {routeEstimate.estimatedPrice} {routeEstimate.currency}
                  </strong>
                </span>
                {watchedInsured && watchedDeclaredValue > 0 && (
                  <span className="text-sm text-muted-foreground">
                    Insurance:{" "}
                    <strong className="text-foreground">
                      {computedPremium} {routeEstimate.currency} premium
                    </strong>{" "}
                    (coverage up to{" "}
                    <strong className="text-foreground">
                      {watchedDeclaredValue.toLocaleString()} {routeEstimate.currency}
                    </strong>
                    )
                  </span>
                )}
              </div>
            </>
          )}
        </Card>
        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold text-foreground">Schedule</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Departure</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Departure date"
                  type="date"
                  error={errors.departureDate?.message}
                  {...register("departureDate", { required: "Departure date is required" })}
                />
                <Input
                  label="Departure time"
                  type="time"
                  error={errors.departureTime?.message}
                  {...register("departureTime", { required: "Departure time is required" })}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Arrival</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Arrival date"
                  type="date"
                  error={errors.arrivalDate?.message}
                  {...register("arrivalDate", { required: "Arrival date is required" })}
                />
                <Input
                  label="Arrival time"
                  type="time"
                  error={errors.arrivalTime?.message}
                  {...register("arrivalTime", { required: "Arrival time is required" })}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-border"
              />
              <span className="font-medium text-foreground">Repeat (recurring trip)</span>
            </label>
            {isRecurring && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Frequency</label>
                  <select
                    className="input-field w-full"
                    {...register("recurrenceFrequency")}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">End date (optional)</label>
                  <input
                    type="date"
                    className="input-field w-full"
                    value={recurrenceEndDate}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center mb-4 sm:mb-5">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-3" />
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Insurance (optional)</h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                {...register("insured")}
              />
              <span className="text-sm sm:text-base text-foreground">
                Insure this shipment
                <span className="block text-xs sm:text-sm text-muted-foreground">
                  Optional cargo insurance with coverage based on the declared value.
                </span>
              </span>
            </label>
            {watchedInsured && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  type="number"
                  label="Declared value (MAD)"
                  placeholder="e.g. 5000"
                  min={0}
                  {...register("declaredValue")}
                />
                {watchedDeclaredValue > 0 && (
                  <div className="text-xs sm:text-sm text-muted-foreground flex items-center">
                    <div className="space-y-1">
                      <p>
                        Estimated premium:{" "}
                        <span className="font-semibold text-foreground">
                          {computedPremium} MAD
                        </span>
                      </p>
                      <p>
                        Coverage up to:{" "}
                        <span className="font-semibold text-foreground">
                          {watchedDeclaredValue.toLocaleString()} MAD
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center mb-6">
            <Weight className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold text-foreground">Available Capacity</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <div>
              <Input
                label="Maximum weight (kg)"
                type="number"
                placeholder="500"
                error={errors.weight?.message}
                {...register("weight", {
                  required: "Maximum weight is required",
                  min: { value: 1, message: "Weight must be greater than 0" },
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Dimensions (cm)</label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Length"
                  type="number"
                  error={errors.length?.message}
                  {...register("length", {
                    required: "Length is required",
                    min: { value: 1, message: "Length must be greater than 0" },
                  })}
                />
                <Input
                  placeholder="Width"
                  type="number"
                  error={errors.width?.message}
                  {...register("width", {
                    required: "Width is required",
                    min: { value: 1, message: "Width must be greater than 0" },
                  })}
                />
                <Input
                  placeholder="Height"
                  type="number"
                  error={errors.height?.message}
                  {...register("height", {
                    required: "Height is required",
                    min: { value: 1, message: "Height must be greater than 0" },
                  })}
                />
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center mb-6">
            <Package className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold text-foreground">Accepted Cargo Types</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CARGO_TYPES.map((type) => (
              <label
                key={type.value}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                  selectedCargoTypes.includes(type.value)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary hover:bg-accent"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedCargoTypes.includes(type.value)}
                  onChange={() => toggleCargoType(type.value)}
                />
                <span className="text-sm font-medium text-foreground">{type.label}</span>
              </label>
            ))}
          </div>
          {selectedCargoTypes.includes("autre") && (
            <div className="mt-4">
              <Input
                label="Précisez le type (autre)"
                placeholder="Ex: machines, pièces détachées..."
                value={otherCargoType}
                onChange={(e) => setOtherCargoType(e.target.value)}
                maxLength={200}
              />
            </div>
          )}
        </Card>
        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center mb-6">
            <Euro className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold text-foreground">Pricing</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <Input
              label="Price per kg (€)"
              type="number"
              step="0.01"
              placeholder="2.50"
              error={errors.pricePerKg?.message}
              {...register("pricePerKg", {
                required: "Price per kg is required",
                min: { value: 0.01, message: "Price must be greater than 0" },
              })}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Description (optional)</label>
              <textarea
                className="input-field min-h-[100px] resize-none"
                placeholder="Additional information about your trip..."
                {...register("description")}
              />
            </div>
          </div>
        </Card>
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isRecurring ? createRecurringMutation.isPending : createTripMutation.isPending}
          >
            {isRecurring ? "Create Recurring Trip" : "Create Trip"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateTripPage
