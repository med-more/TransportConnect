import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { ArrowLeft, MapPin, Calendar, Weight, Euro, Package } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { tripsAPI } from "../../services/api"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Card from "../../components/ui/Card"
import { CARGO_TYPES } from "../../config/constants"
import toast from "react-hot-toast"

const CreateTripPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedCargoTypes, setSelectedCargoTypes] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  const createTripMutation = useMutation({
    mutationFn: tripsAPI.createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries("trips")
      toast.success("Trip created successfully!")
      navigate("/trips")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error creating trip")
    },
  })

  const onSubmit = async (data) => {
    if (selectedCargoTypes.length === 0) {
      toast.error("Please select at least one cargo type")
      return
    }

    const tripData = {
      departure: {
        address: data.departureAddress,
        city: data.departureCity,
      },
      destination: {
        address: data.destinationAddress,
        city: data.destinationCity,
      },
      departureDate: new Date(data.departureDate + "T" + data.departureTime),
      arrivalDate: new Date(data.arrivalDate + "T" + data.arrivalTime),
      availableCapacity: {
        weight: Number.parseFloat(data.weight),
        dimensions: {
          length: Number.parseFloat(data.length),
          width: Number.parseFloat(data.width),
          height: Number.parseFloat(data.height),
        },
      },
      acceptedCargoTypes: selectedCargoTypes,
      pricePerKg: Number.parseFloat(data.pricePerKg),
      description: data.description,
    }

    createTripMutation.mutate(tripData)
  }

  const toggleCargoType = (type) => {
    setSelectedCargoTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
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
              <h3 className="font-medium text-foreground">Departure</h3>
              <Input
                label="Departure city"
                placeholder="Paris"
                error={errors.departureCity?.message}
                {...register("departureCity", { required: "Departure city is required" })}
              />
              <Input
                label="Departure address"
                placeholder="123 Rue de la Paix"
                error={errors.departureAddress?.message}
                {...register("departureAddress", { required: "Departure address is required" })}
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Destination</h3>
              <Input
                label="Destination city"
                placeholder="Lyon"
                error={errors.destinationCity?.message}
                {...register("destinationCity", { required: "Destination city is required" })}
              />
              <Input
                label="Destination address"
                placeholder="456 Avenue de la République"
                error={errors.destinationAddress?.message}
                {...register("destinationAddress", { required: "Destination address is required" })}
              />
            </div>
          </div>
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
          <Button type="submit" loading={createTripMutation.isLoading}>
            Create Trip
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateTripPage
