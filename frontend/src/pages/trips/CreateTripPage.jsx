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
      toast.success("Trajet créé avec succès !")
      navigate("/trips")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors de la création du trajet")
    },
  })

  const onSubmit = async (data) => {
    if (selectedCargoTypes.length === 0) {
      toast.error("Veuillez sélectionner au moins un type de cargaison")
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
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-f4f4f4 p-0 relative overflow-hidden">
      {/* Illustration décorative */}
      <div className="absolute right-0 top-0 w-[420px] h-[420px] pointer-events-none z-0 opacity-10">
        <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="210" cy="210" rx="210" ry="210" fill="#0072bb" fillOpacity="0.15" />
          <rect x="120" y="120" width="180" height="80" rx="30" fill="#0072bb" fillOpacity="0.18" />
          <rect x="170" y="200" width="80" height="40" rx="20" fill="#5bc0eb" fillOpacity="0.18" />
        </svg>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-8">
        {/* Header modernisé */}
        <div className="flex items-center mb-8 gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
            <h1 className="text-4xl font-extrabold text-primary mb-1">Créer un nouveau trajet</h1>
            <p className="text-lg text-black/60 font-medium mb-1">Remplissez les informations de votre trajet pour connecter expéditeurs et conducteurs partout en France.</p>
            <p className="text-sm text-primary font-semibold italic">Plateforme sécurisée, rapide et efficace pour tous vos transports</p>
          </div>
        </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card className="p-8">
          <div className="flex items-center mb-6">
            <MapPin className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-primary">Itinéraire</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="font-semibold text-primary">Départ</h3>
              <Input
                label="Ville de départ"
                placeholder="Paris"
                error={errors.departureCity?.message}
                {...register("departureCity", { required: "La ville de départ est requise" })}
                  className="focus:ring-2 focus:ring-primary/60"
              />
              <Input
                label="Adresse de départ"
                placeholder="123 Rue de la Paix"
                error={errors.departureAddress?.message}
                {...register("departureAddress", { required: "L'adresse de départ est requise" })}
                  className="focus:ring-2 focus:ring-primary/60"
              />
            </div>
            <div className="space-y-4">
                <h3 className="font-semibold text-primary">Destination</h3>
              <Input
                label="Ville de destination"
                placeholder="Lyon"
                error={errors.destinationCity?.message}
                {...register("destinationCity", { required: "La ville de destination est requise" })}
                  className="focus:ring-2 focus:ring-primary/60"
              />
              <Input
                label="Adresse de destination"
                placeholder="456 Avenue de la République"
                error={errors.destinationAddress?.message}
                {...register("destinationAddress", { required: "L'adresse de destination est requise" })}
                  className="focus:ring-2 focus:ring-primary/60"
              />
            </div>
          </div>
        </Card>
          <Card className="p-8">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-primary">Horaires</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="font-semibold text-primary">Départ</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date de départ"
                  type="date"
                  error={errors.departureDate?.message}
                  {...register("departureDate", { required: "La date de départ est requise" })}
                    className="focus:ring-2 focus:ring-primary/60"
                />
                <Input
                  label="Heure de départ"
                  type="time"
                  error={errors.departureTime?.message}
                  {...register("departureTime", { required: "L'heure de départ est requise" })}
                    className="focus:ring-2 focus:ring-primary/60"
                />
              </div>
            </div>
            <div className="space-y-4">
                <h3 className="font-semibold text-primary">Arrivée</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date d'arrivée"
                  type="date"
                  error={errors.arrivalDate?.message}
                  {...register("arrivalDate", { required: "La date d'arrivée est requise" })}
                    className="focus:ring-2 focus:ring-primary/60"
                />
                <Input
                  label="Heure d'arrivée"
                  type="time"
                  error={errors.arrivalTime?.message}
                  {...register("arrivalTime", { required: "L'heure d'arrivée est requise" })}
                    className="focus:ring-2 focus:ring-primary/60"
                />
              </div>
            </div>
          </div>
        </Card>
          <Card className="p-8">
          <div className="flex items-center mb-6">
            <Weight className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-primary">Capacité disponible</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Input
                label="Poids maximum (kg)"
                type="number"
                placeholder="500"
                error={errors.weight?.message}
                {...register("weight", {
                  required: "Le poids maximum est requis",
                  min: { value: 1, message: "Le poids doit être supérieur à 0" },
                })}
                  className="focus:ring-2 focus:ring-primary/60"
              />
            </div>
            <div>
                <label className="block text-sm font-semibold text-primary mb-2">Dimensions (cm)</label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Longueur"
                  type="number"
                  error={errors.length?.message}
                  {...register("length", {
                    required: "La longueur est requise",
                    min: { value: 1, message: "La longueur doit être supérieure à 0" },
                  })}
                    className="focus:ring-2 focus:ring-primary/60"
                />
                <Input
                  placeholder="Largeur"
                  type="number"
                  error={errors.width?.message}
                  {...register("width", {
                    required: "La largeur est requise",
                    min: { value: 1, message: "La largeur doit être supérieure à 0" },
                  })}
                    className="focus:ring-2 focus:ring-primary/60"
                />
                <Input
                  placeholder="Hauteur"
                  type="number"
                  error={errors.height?.message}
                  {...register("height", {
                    required: "La hauteur est requise",
                    min: { value: 1, message: "La hauteur doit être supérieure à 0" },
                  })}
                    className="focus:ring-2 focus:ring-primary/60"
                />
              </div>
            </div>
          </div>
        </Card>
          <Card className="p-8">
          <div className="flex items-center mb-6">
            <Package className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-primary">Types de cargaison acceptés</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CARGO_TYPES.map((type) => (
              <label
                key={type.value}
                className={`p-3 border-2 rounded-xl cursor-pointer transition-all text-center ${
                  selectedCargoTypes.includes(type.value)
                    ? "border-primary bg-input-background"
                    : "border-border hover:border-primary"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedCargoTypes.includes(type.value)}
                  onChange={() => toggleCargoType(type.value)}
                />
                <span className="text-sm font-medium text-text-primary">{type.label}</span>
              </label>
            ))}
          </div>
        </Card>
          <Card className="p-8">
          <div className="flex items-center mb-6">
            <Euro className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-primary">Tarification</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Prix par kg (DH)"
              type="number"
              step="0.01"
              placeholder="2.50"
              error={errors.pricePerKg?.message}
              {...register("pricePerKg", {
                required: "Le prix par kg est requis",
                min: { value: 0.01, message: "Le prix doit être supérieur à 0" },
              })}
                className="focus:ring-2 focus:ring-primary/60"
            />
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-primary">Description (optionnel)</label>
              <textarea
                  className="input-field min-h-[100px] resize-none focus:ring-2 focus:ring-primary/60"
                placeholder="Informations supplémentaires sur votre trajet..."
                {...register("description")}
              />
            </div>
          </div>
        </Card>
        <div className="flex items-center justify-end space-x-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button type="submit" loading={createTripMutation.isLoading}>
            Créer le trajet
          </Button>
        </div>
      </form>
      </div>
    </div>
  )
}

export default CreateTripPage
