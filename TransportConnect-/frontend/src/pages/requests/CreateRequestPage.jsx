import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Package, MapPin, Euro, AlertCircle, Weight, MessageCircle, Calendar } from "../../utils/icons"
import { tripsAPI, requestsAPI, usersAPI } from "../../services/api"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import PlaceAutocompleteInput from "../../components/ui/PlaceAutocompleteInput"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import { CARGO_TYPES } from "../../config/constants"
import toast from "react-hot-toast"
import clsx from "clsx"

const CreateRequestPage = () => {
  const { tripId: tripIdParam } = useParams()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const tripId = queryParams.get("tripId") || tripIdParam
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Redirect to trips page if no tripId is provided
  useEffect(() => {
    if (!tripId) {
      navigate("/trips", { replace: true })
    }
  }, [tripId, navigate])

  const { data: tripData, isLoading: tripLoading } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => tripId ? tripsAPI.getTripById(tripId) : Promise.resolve(null),
    enabled: !!tripId,
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  const createRequestMutation = useMutation({
    mutationFn: requestsAPI.createRequest,
    onSuccess: async (response) => {
      // Show success toast
      toast.success("Request created successfully!", {
        duration: 3000,
      })
      
      // Invalidate all requests queries (including all tabs: all, pending, accepted, etc.)
      await queryClient.invalidateQueries({ 
        queryKey: ["requests"],
        exact: false, // This will invalidate all queries that start with ["requests"]
      })
      
      // Invalidate user requests queries to update buttons on trips page
      await queryClient.invalidateQueries({ 
        queryKey: ["user-requests"],
        exact: false,
      })
      
      // Also invalidate user stats to update request count
      await queryClient.invalidateQueries({ queryKey: ["user-stats"] })
      
      // Navigate to requests page after a short delay
      setTimeout(() => {
        navigate("/requests", { replace: true })
      }, 500)
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Error creating request"
      toast.error(errorMessage, {
        duration: 4000,
      })
      
      // If error is about existing request, redirect to requests page after showing error
      if (errorMessage.includes("déjà une demande") || errorMessage.includes("already have a request")) {
        setTimeout(() => {
          navigate("/requests", { replace: true })
        }, 2000)
      }
    },
  })

  const watchedWeight = watch("weight")
  const watchedLength = watch("length")
  const watchedWidth = watch("width")
  const watchedHeight = watch("height")
  const trip = tripData?.trip

  const { data: estimateData } = useQuery({
    queryKey: ["price-estimate", tripId, watchedWeight],
    queryFn: () => requestsAPI.getPriceEstimate(tripId, Number(watchedWeight)),
    enabled: !!tripId && !!trip && Number(watchedWeight) > 0,
  })
  const serverEstimate = estimateData?.data?.estimatedPrice ?? estimateData?.estimatedPrice
  const estimatedPrice =
    serverEstimate != null
      ? Number(serverEstimate).toFixed(2)
      : watchedWeight && trip
        ? (Number.parseFloat(watchedWeight) * trip.pricePerKg).toFixed(2)
        : "0"

  const { data: savedAddresses = [] } = useQuery({
    queryKey: ["saved-addresses"],
    queryFn: () => usersAPI.getSavedAddresses(),
    enabled: true,
  })

  const fillPickupFromAddress = (addr) => {
    if (!addr) return
    setValue("pickupAddress", addr.address)
    setValue("pickupCity", addr.city)
  }
  const fillDeliveryFromAddress = (addr) => {
    if (!addr) return
    setValue("deliveryAddress", addr.address)
    setValue("deliveryCity", addr.city)
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
    const address = type === "pickup" ? watch("pickupAddress") : watch("deliveryAddress")
    const city = type === "pickup" ? watch("pickupCity") : watch("deliveryCity")
    if (!address?.trim() || !city?.trim()) {
      toast.error("Enter address and city first")
      return
    }
    saveAddressMutation.mutate(
      { label: saveAddressLabel.trim() || (type === "pickup" ? "Pickup" : "Delivery"), address: address.trim(), city: city.trim(), country: "Maroc" },
      { onSuccess: () => setSaveAddressType(null) }
    )
  }

  const maxWeight = trip?.availableCapacity?.weight
  const maxDims = trip?.availableCapacity?.dimensions

  const weightExceedsLimit = maxWeight != null && watchedWeight !== "" && Number(watchedWeight) > Number(maxWeight)
  const lengthExceedsLimit = maxDims?.length != null && watchedLength !== "" && Number(watchedLength) > Number(maxDims.length)
  const widthExceedsLimit = maxDims?.width != null && watchedWidth !== "" && Number(watchedWidth) > Number(maxDims.width)
  const heightExceedsLimit = maxDims?.height != null && watchedHeight !== "" && Number(watchedHeight) > Number(maxDims.height)

  const onSubmit = async (data) => {
    // Prevent double submission
    if (createRequestMutation.isLoading) {
      return
    }

    const requestData = {
      tripId,
      cargo: {
        description: data.description,
        weight: Number.parseFloat(data.weight),
        dimensions: {
          length: Number.parseFloat(data.length),
          width: Number.parseFloat(data.width),
          height: Number.parseFloat(data.height),
        },
        type: data.cargoType,
        value: data.value ? Number.parseFloat(data.value) : undefined,
      },
      pickup: {
        address: data.pickupAddress,
        city: data.pickupCity,
        contactPerson: {
          name: data.pickupContactName,
          phone: data.pickupContactPhone,
        },
      },
      delivery: {
        address: data.deliveryAddress,
        city: data.deliveryCity,
        contactPerson: {
          name: data.deliveryContactName,
          phone: data.deliveryContactPhone,
        },
      },
      message: data.message,
    }

    createRequestMutation.mutate(requestData)
  }

  // If no tripId is provided, show loading while redirecting
  if (!tripId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (tripLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Trip not found</h1>
        <p className="text-muted-foreground mb-6">The trip you're looking for doesn't exist or has been removed.</p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
          <Button onClick={() => navigate("/trips")}>Browse Trips</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header — aligned with Trip detail page */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex-shrink-0 min-h-[44px] min-w-[44px] sm:min-w-0 sm:min-h-0 p-2 sm:px-3"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-foreground truncate sm:text-xl md:text-2xl lg:text-3xl">
                New Transport Request
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1 sm:text-sm">
                Fill in cargo and stops—estimate updates when you enter weight.
              </p>
            </div>
          </div>
        </div>

        {/* Trip context — same visual language as Trip detail sections */}
        <div className="detail-card p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="section-icon-badge bg-primary/15">
              <MapPin className="w-5 h-5 text-primary" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selected trip</p>
              <p className="text-base sm:text-lg font-semibold text-foreground leading-tight">
                {trip.departure.city} → {trip.destination.city}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="stat-tile min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" aria-hidden />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">Departure date</h3>
              </div>
              <p className="text-lg sm:text-xl font-bold text-foreground tabular-nums">
                {new Date(trip.departureDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="stat-tile-primary min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Euro className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-primary truncate">Driver rate</h3>
              </div>
              <p className="text-lg sm:text-xl font-bold text-primary tabular-nums">{Number(trip.pricePerKg).toFixed(2)}€/kg</p>
            </div>
          </div>
        </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Package — detail-card + section header (Trip detail pattern) */}
        <div className="detail-card p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="section-icon-badge bg-primary/15">
              <Package className="w-5 h-5 text-primary" aria-hidden />
            </div>
            <h2 className="text-base font-semibold text-foreground sm:text-lg">Package information</h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Package description"
              placeholder="Laptops, documents, etc."
              error={errors.description?.message}
              {...register("description", {
                required: "Description is required",
                minLength: { value: 10, message: "Description must be at least 10 characters" },
              })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Cargo type</label>
                <select
                  className="input-field"
                  {...register("cargoType", { required: "Cargo type is required" })}
                >
                  <option value="">Select a type</option>
                  {CARGO_TYPES.filter((type) => trip.acceptedCargoTypes.includes(type.value)).map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.cargoType && <p className="text-sm text-destructive mt-1">{errors.cargoType.message}</p>}
              </div>

              <div>
                <Input
                  label="Weight (kg)"
                  type="number"
                  step="0.1"
                  placeholder="25.5"
                  error={errors.weight?.message || (weightExceedsLimit ? `Cannot exceed the driver's limit (${maxWeight} kg)` : undefined)}
                  {...register("weight", {
                    required: "Weight is required",
                    min: { value: 0.1, message: "Weight must be greater than 0" },
                    ...(maxWeight != null && {
                      max: {
                        value: maxWeight,
                        message: `Cannot exceed the driver's limit (${maxWeight} kg)`,
                      },
                    }),
                  })}
                />
                {maxWeight != null && (
                  <p className={clsx("text-xs mt-1.5 flex items-center gap-1.5 font-medium", weightExceedsLimit ? "text-destructive" : "text-info")}>
                    {weightExceedsLimit && <AlertCircle className="w-4 h-4 shrink-0" />}
                    Driver's maximum: {maxWeight} kg
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Dimensions (cm)</label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Input
                    placeholder="Length"
                    type="number"
                    error={errors.length?.message || (lengthExceedsLimit ? `Cannot exceed driver's limit (${maxDims?.length} cm)` : undefined)}
                    {...register("length", {
                      required: "Length is required",
                      min: { value: 1, message: "Length must be greater than 0" },
                      ...(maxDims?.length != null && {
                        max: {
                          value: maxDims.length,
                          message: `Cannot exceed the driver's limit (${maxDims.length} cm)`,
                        },
                      }),
                    })}
                  />
                  {maxDims?.length != null && (
                    <p className={clsx("text-xs mt-1.5 flex items-center gap-1.5 font-medium", lengthExceedsLimit ? "text-destructive" : "text-info")}>
                      {lengthExceedsLimit && <AlertCircle className="w-4 h-4 shrink-0" />}
                      Max: {maxDims.length} cm
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Width"
                    type="number"
                    error={errors.width?.message || (widthExceedsLimit ? `Cannot exceed driver's limit (${maxDims?.width} cm)` : undefined)}
                    {...register("width", {
                      required: "Width is required",
                      min: { value: 1, message: "Width must be greater than 0" },
                      ...(maxDims?.width != null && {
                        max: {
                          value: maxDims.width,
                          message: `Cannot exceed the driver's limit (${maxDims.width} cm)`,
                        },
                      }),
                    })}
                  />
                  {maxDims?.width != null && (
                    <p className={clsx("text-xs mt-1.5 flex items-center gap-1.5 font-medium", widthExceedsLimit ? "text-destructive" : "text-info")}>
                      {widthExceedsLimit && <AlertCircle className="w-4 h-4 shrink-0" />}
                      Max: {maxDims.width} cm
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Height"
                    type="number"
                    error={errors.height?.message || (heightExceedsLimit ? `Cannot exceed driver's limit (${maxDims?.height} cm)` : undefined)}
                    {...register("height", {
                      required: "Height is required",
                      min: { value: 1, message: "Height must be greater than 0" },
                      ...(maxDims?.height != null && {
                        max: {
                          value: maxDims.height,
                          message: `Cannot exceed the driver's limit (${maxDims.height} cm)`,
                        },
                      }),
                    })}
                  />
                  {maxDims?.height != null && (
                    <p className={clsx("text-xs mt-1.5 flex items-center gap-1.5 font-medium", heightExceedsLimit ? "text-destructive" : "text-info")}>
                      {heightExceedsLimit && <AlertCircle className="w-4 h-4 shrink-0" />}
                      Max: {maxDims.height} cm
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Input
              label="Declared value (€) - Optional"
              type="number"
              step="0.01"
              placeholder="500.00"
              error={errors.value?.message}
              {...register("value", {
                min: { value: 0, message: "Value cannot be negative" },
              })}
            />
          </div>
        </div>

        {/* Estimated cost — stat tiles like Capacity & pricing on Trip detail */}
        <div className="detail-card p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="section-icon-badge bg-primary/15">
              <Euro className="w-5 h-5 text-primary" aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground sm:text-lg">Estimated cost</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Based on weight and this trip&apos;s rate</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="stat-tile min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Weight className="w-3.5 h-3.5 text-muted-foreground shrink-0" aria-hidden />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">Weight</h3>
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums">{watchedWeight || "—"} kg</p>
            </div>
            <div className="stat-tile min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Euro className="w-3.5 h-3.5 text-muted-foreground shrink-0" aria-hidden />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">Price per kg</h3>
              </div>
              <p className="text-xl font-bold text-foreground tabular-nums">{Number(trip.pricePerKg).toFixed(2)}€</p>
            </div>
            <div className="stat-tile-primary min-w-0 sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-1.5">
                <Euro className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-primary truncate">Estimated total</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-primary tabular-nums">{estimatedPrice}€</p>
            </div>
          </div>
        </div>

        <div className="detail-card p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="section-icon-badge bg-primary/15">
              <MapPin className="w-5 h-5 text-primary" aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground sm:text-lg">Pickup &amp; delivery</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Collection first, then where the cargo should arrive
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {/* Pickup — route-step-card (Trip detail route steps) */}
            <div className="route-step-card">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-sm font-bold text-primary-foreground" aria-hidden>
                    1
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-sm sm:text-base">Pickup</h3>
              </div>
              {savedAddresses?.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Use saved address</label>
                  <select
                    className="input-field"
                    onChange={(e) => {
                      const id = e.target.value
                      if (!id) return
                      const addr = savedAddresses.find((a) => a._id === id)
                      fillPickupFromAddress(addr)
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PlaceAutocompleteInput
                  label="Lieu de ramassage (Maroc)"
                  cityField="pickupCity"
                  addressField="pickupAddress"
                  setValue={setValue}
                  register={register}
                  watch={watch}
                  error={errors.pickupCity?.message || errors.pickupAddress?.message}
                  placeholder="Casablanca, Rabat..."
                  cityRules={{ required: "Ville de ramassage requise" }}
                  addressRules={{ required: "Adresse de ramassage requise" }}
                />
                <Input
                  label="Contact name"
                  placeholder="John Doe"
                  error={errors.pickupContactName?.message}
                  {...register("pickupContactName")}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Contact phone"
                    placeholder="+1234567890"
                    error={errors.pickupContactPhone?.message}
                    {...register("pickupContactPhone")}
                  />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                {saveAddressType === "pickup" ? (
                  <div className="flex flex-wrap items-end gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. Warehouse)"
                      value={saveAddressLabel}
                      onChange={(e) => setSaveAddressLabel(e.target.value)}
                      className="input-field flex-1 min-w-[140px]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveAddress("pickup")}
                      disabled={saveAddressMutation.isPending}
                      className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setSaveAddressType(null)}
                      className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSaveAddressType("pickup")}
                    className="text-sm text-primary hover:underline"
                  >
                    Save this pickup to my addresses
                  </button>
                )}
              </div>
            </div>

            <div className="route-step-card">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-sm font-bold text-white" aria-hidden>
                    2
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-sm sm:text-base">Delivery</h3>
              </div>
              {savedAddresses?.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Use saved address</label>
                  <select
                    className="input-field"
                    onChange={(e) => {
                      const id = e.target.value
                      if (!id) return
                      const addr = savedAddresses.find((a) => a._id === id)
                      fillDeliveryFromAddress(addr)
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PlaceAutocompleteInput
                  label="Lieu de livraison (Maroc)"
                  cityField="deliveryCity"
                  addressField="deliveryAddress"
                  setValue={setValue}
                  register={register}
                  watch={watch}
                  error={errors.deliveryCity?.message || errors.deliveryAddress?.message}
                  placeholder="Marrakech, Fès, Tanger..."
                  cityRules={{ required: "Ville de livraison requise" }}
                  addressRules={{ required: "Adresse de livraison requise" }}
                />
                <Input
                  label="Contact name"
                  placeholder="Jane Smith"
                  error={errors.deliveryContactName?.message}
                  {...register("deliveryContactName")}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Contact phone"
                    placeholder="+0987654321"
                    error={errors.deliveryContactPhone?.message}
                    {...register("deliveryContactPhone")}
                  />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                {saveAddressType === "delivery" ? (
                  <div className="flex flex-wrap items-end gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. Client Rabat)"
                      value={saveAddressLabel}
                      onChange={(e) => setSaveAddressLabel(e.target.value)}
                      className="input-field flex-1 min-w-[140px]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveAddress("delivery")}
                      disabled={saveAddressMutation.isPending}
                      className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setSaveAddressType(null)}
                      className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSaveAddressType("delivery")}
                    className="text-sm text-primary hover:underline"
                  >
                    Save this delivery to my addresses
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="detail-card p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="section-icon-badge bg-primary/15">
              <MessageCircle className="w-5 h-5 text-primary" aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground sm:text-lg">Message to the driver</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Optional — access instructions, time windows, or special handling
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Message</label>
            <textarea
              className="input-field min-h-[100px] resize-y"
              placeholder="e.g. Call 15 min before arrival, goods at loading dock B…"
              {...register("message")}
            />
          </div>
        </div>

        <div className="detail-card p-4 sm:p-5 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate(-1)}
            disabled={createRequestMutation.isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
            <div className="text-center sm:text-right">
              <p className="text-xs text-muted-foreground">Estimated total</p>
              <p className="text-xl font-bold text-primary tabular-nums">{estimatedPrice}€</p>
            </div>
            <Button
              type="submit"
              loading={createRequestMutation.isLoading}
              disabled={createRequestMutation.isLoading}
              size="large"
              className="w-full sm:w-auto min-h-11"
            >
              Send request
            </Button>
          </div>
        </div>
      </form>
      </div>
    </div>
  )
}

export default CreateRequestPage
