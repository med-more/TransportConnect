import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Plus, Search, Filter, MapPin, Calendar, Weight, Star, Truck } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { tripsAPI } from "../../services/api"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import { CARGO_TYPES } from "../../config/constants"

const TripsPage = () => {
  const { user } = useAuth()
  const [filters, setFilters] = useState({
    departure: "",
    destination: "",
    date: "",
    cargoType: "",
    status: "active",
  })
  const [showFilters, setShowFilters] = useState(false)

  const {
    data: tripsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["trips", filters],
    queryFn: () => {
      if (user?.role === "conducteur") {
        return tripsAPI.getMyTrips(filters)
      } else {
        return tripsAPI.getTrips(filters)
      }
    },
      enabled: !!user,
  })

  const trips = tripsData?.data?.trips || []

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      departure: "",
      destination: "",
      date: "",
      cargoType: "",
      status: "active",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-success bg-opacity-20 text-success"
      case "completed":
        return "bg-info bg-opacity-20 text-info"
      case "cancelled":
        return "bg-error bg-opacity-20 text-error"
      default:
        return "bg-placeholder-text bg-opacity-20 text-placeholder-text"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Actif"
      case "completed":
        return "Terminé"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-f4f4f4 p-0 relative overflow-hidden">
      {/* Illustration décorative */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.10, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute right-0 top-0 w-[420px] h-[420px] pointer-events-none z-0"
      >
        <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="210" cy="210" rx="210" ry="210" fill="#0072bb" fillOpacity="0.15" />
          <rect x="120" y="120" width="180" height="80" rx="30" fill="#0072bb" fillOpacity="0.18" />
          <rect x="170" y="200" width="80" height="40" rx="20" fill="#5bc0eb" fillOpacity="0.18" />
        </svg>
      </motion.div>
      <div className="relative z-10 p-6 space-y-8 max-w-6xl mx-auto">
        {/* Header modernisé */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-2">
          <div>
            <h1 className="text-4xl font-extrabold text-primary mb-1 flex items-center gap-2">
              <Truck className="w-8 h-8 text-primary" />
              {user?.role === "conducteur" ? "Mes trajets" : "Rechercher un trajet"}
            </h1>
            <p className="text-lg text-black/60 font-medium mb-1">
              {user?.role === "conducteur"
                ? "Gérez vos trajets et suivez vos demandes"
                : "Trouvez le trajet parfait pour vos colis partout en France"}
            </p>
            <p className="text-sm text-primary font-semibold italic">
              Plateforme sécurisée, rapide et efficace pour tous vos transports
            </p>
          </div>
          {user?.role === "conducteur" && (
            <Link to="/trips/create">
              <Button className="text-lg py-3 rounded-xl shadow-md hover:scale-105 transition-transform">
                <Plus className="w-5 h-5 mr-2" />
                Nouveau trajet
              </Button>
            </Link>
          )}
        </div>
        {/* Filtres modernisés */}
        <Card className="p-6 mb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filtres de recherche
            </h3>
            <Button variant="ghost" size="small" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? "Masquer" : "Afficher"} les filtres
            </Button>
          </div>
          <motion.div
            initial={false}
            animate={{ height: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
              <Input
                placeholder="Ville de départ"
                value={filters.departure}
                onChange={(e) => handleFilterChange("departure", e.target.value)}
                className="focus:ring-2 focus:ring-primary/60"
              />
              <Input
                placeholder="Ville de destination"
                value={filters.destination}
                onChange={(e) => handleFilterChange("destination", e.target.value)}
                className="focus:ring-2 focus:ring-primary/60"
              />
              <Input
                type="date"
                placeholder="Date de départ"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
                className="focus:ring-2 focus:ring-primary/60"
              />
              <select
                className="input-field focus:ring-2 focus:ring-primary/60"
                value={filters.cargoType}
                onChange={(e) => handleFilterChange("cargoType", e.target.value)}
              >
                <option value="">Tous les types</option>
                {CARGO_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-4">
                {user?.role === "conducteur" && (
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-primary">Statut:</label>
                    <select
                      className="input-field py-1 text-sm focus:ring-2 focus:ring-primary/60"
                      value={filters.status}
                      onChange={(e) => handleFilterChange("status", e.target.value)}
                    >
                      <option value="active">Actifs</option>
                      <option value="completed">Terminés</option>
                      <option value="cancelled">Annulés</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="small" onClick={clearFilters}>
                  Effacer
                </Button>
                <Button size="small" onClick={() => refetch()}>
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </motion.div>
        </Card>
        {/* Liste des trajets modernisée */}
        <div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : trips.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {trips.map((trip) => (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-6 flex flex-col gap-3 group hover:scale-[1.03]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span className="font-bold text-lg text-primary">
                          {trip.departure.city} → {trip.destination.city}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(trip.status)}`}>
                        {getStatusLabel(trip.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-black/70 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        {new Date(trip.departureDate).toLocaleDateString("fr-FR")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Weight className="w-4 h-4 text-primary" />
                        {trip.availableCapacity.weight}kg dispo
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning" />
                        {trip.driver?.stats?.averageRating?.toFixed(1) || "N/A"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4 text-primary" />
                        {trip.vehicle?.type || "Véhicule"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-2xl font-extrabold text-primary">{trip.pricePerKg}€/kg</span>
                      <Link to={`/trips/${trip._id}`} className="text-primary font-semibold hover:underline">
                        Voir le détail
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <Truck className="w-14 h-14 text-placeholder-text mx-auto mb-4" />
              <p className="text-text-secondary text-lg">Aucun trajet trouvé</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default TripsPage
