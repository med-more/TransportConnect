import { useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Package, MapPin, User, Euro } from "lucide-react"
import { tripsAPI, requestsAPI } from "../../services/api"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Card from "../../components/ui/Card"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import { CARGO_TYPES } from "../../config/constants"
import toast from "react-hot-toast"

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
  const trip = tripData?.data?.trip

  const estimatedPrice = watchedWeight && trip ? (Number.parseFloat(watchedWeight) * trip.pricePerKg).toFixed(2) : 0

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
    <div className="p-3 sm:p-4 md:p-6 max-w-4xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">New Transport Request</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            For trip {trip.departure.city} → {trip.destination.city}
          </p>
        </div>
      </div>

      {/* Trip Summary */}
      <Card className="p-4 sm:p-5 md:p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Trip Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <h3 className="font-medium text-foreground">Route</h3>
            <p className="text-muted-foreground">
              {trip.departure.city} → {trip.destination.city}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Departure</h3>
            <p className="text-muted-foreground">{new Date(trip.departureDate).toLocaleDateString("en-US")}</p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Price</h3>
            <p className="text-primary font-semibold">{trip.pricePerKg}€/kg</p>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Cargo Information */}
        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center mb-6">
            <Package className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold text-foreground">Package Information</h2>
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

              <Input
                label="Weight (kg)"
                type="number"
                step="0.1"
                placeholder="25.5"
                error={errors.weight?.message}
                {...register("weight", {
                  required: "Weight is required",
                  min: { value: 0.1, message: "Weight must be greater than 0" },
                  max: {
                    value: trip.availableCapacity.weight,
                    message: `Weight cannot exceed ${trip.availableCapacity.weight}kg`,
                  },
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Dimensions (cm)</label>
              <div className="grid grid-cols-3 gap-4">
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
        </Card>

        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center mb-6">
            <MapPin className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold text-foreground">Pickup Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Pickup city"
              placeholder="Paris"
              error={errors.pickupCity?.message}
              {...register("pickupCity", { required: "Pickup city is required" })}
            />

            <Input
              label="Pickup address"
              placeholder="123 Rue de la Paix"
              error={errors.pickupAddress?.message}
              {...register("pickupAddress", { required: "Pickup address is required" })}
            />

            <Input
              label="Contact name"
              placeholder="John Doe"
              error={errors.pickupContactName?.message}
              {...register("pickupContactName")}
            />

            <Input
              label="Contact phone"
              placeholder="+1234567890"
              error={errors.pickupContactPhone?.message}
              {...register("pickupContactPhone")}
            />
          </div>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center mb-6">
            <MapPin className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold text-foreground">Delivery Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Delivery city"
              placeholder="Lyon"
              error={errors.deliveryCity?.message}
              {...register("deliveryCity", { required: "Delivery city is required" })}
            />

            <Input
              label="Delivery address"
              placeholder="456 Avenue de la République"
              error={errors.deliveryAddress?.message}
              {...register("deliveryAddress", { required: "Delivery address is required" })}
            />

            <Input
              label="Contact name"
              placeholder="Jane Smith"
              error={errors.deliveryContactName?.message}
              {...register("deliveryContactName")}
            />

            <Input
              label="Contact phone"
              placeholder="+0987654321"
              error={errors.deliveryContactPhone?.message}
              {...register("deliveryContactPhone")}
            />
          </div>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center mb-6">
            <User className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold text-foreground">Message to Driver</h2>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Message (optional)</label>
            <textarea
              className="input-field min-h-[100px] resize-none"
              placeholder="Additional information for the driver..."
              {...register("message")}
            />
          </div>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center mb-6">
            <Euro className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold text-foreground">Cost Summary</h2>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weight:</span>
              <span className="text-foreground">{watchedWeight || 0} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price per kg:</span>
              <span className="text-foreground">{trip.pricePerKg}€</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-semibold text-foreground">Estimated total:</span>
              <span className="font-bold text-primary text-xl">{estimatedPrice}€</span>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            disabled={createRequestMutation.isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            loading={createRequestMutation.isLoading}
            disabled={createRequestMutation.isLoading}
          >
            Send Request
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateRequestPage
