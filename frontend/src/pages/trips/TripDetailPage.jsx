import { useParams, useNavigate, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Star } from "lucide-react"
import { tripsAPI } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import toast from "react-hot-toast"
import Card from "../../components/ui/Card"

const TripDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data: tripData, isLoading } = useQuery({
    queryKey: ["trip", id],
    queryFn: () => tripsAPI.getTripById(id)
  })

  const deleteTripMutation = useMutation({
    mutationFn: tripsAPI.deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries("trips")
      toast.success("Trajet supprimé avec succès")
      navigate("/trips")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression")
    },
  })

  const completeTripMutation = useMutation({
    mutationFn: tripsAPI.completeTrip,
    onSuccess: () => {
      queryClient.invalidateQueries(["trip", id])
      toast.success("Trajet marqué comme terminé")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors de la finalisation")
    },
  })

  const handleDeleteTrip = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
      deleteTripMutation.mutate(id)
    }
  }

  const handleCompleteTrip = () => {
    if (window.confirm("Êtes-vous sûr de vouloir marquer ce trajet comme terminé ?")) {
      completeTripMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!tripData?.data?.trip) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Trajet non trouvé</h1>
        <Button onClick={() => navigate("/trips")}>Retour aux trajets</Button>
      </div>
    )
  }

  const trip = tripData.data.trip
  const isOwner = user?.id === trip.driver._id

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
      <div className="relative z-10 p-6 max-w-6xl mx-auto space-y-8">
        {/* Header modernisé */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-extrabold text-primary flex items-center gap-2 mb-1">
                {trip.departure.city} → {trip.destination.city}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-lg text-black/60 font-medium">
                  Départ le {new Date(trip.departureDate).toLocaleDateString("fr-FR")}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${trip.status === "active" ? "bg-success bg-opacity-20 text-success" : trip.status === "completed" ? "bg-info bg-opacity-20 text-info" : "bg-error bg-opacity-20 text-error"}`}>
                  {trip.status === "active" ? "Actif" : trip.status === "completed" ? "Terminé" : "Annulé"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            {isOwner && trip.status === "active" && (
              <>
                <Button variant="outline" onClick={handleCompleteTrip} loading={completeTripMutation.isLoading} className="rounded-xl">
                  Marquer comme terminé
                </Button>
                <Button variant="danger" onClick={handleDeleteTrip} loading={deleteTripMutation.isLoading} className="rounded-xl">
                  Supprimer
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Itinéraire</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-primary">Départ</h3>
                  <p className="text-black/70">
                    {trip.departure.address}, {trip.departure.city}
                  </p>
                  <p className="text-sm text-black/50">{new Date(trip.departureDate).toLocaleString("fr-FR")}</p>
                </div>
                <div>
                  <h3 className="font-medium text-primary">Destination</h3>
                  <p className="text-black/70">
                    {trip.destination.address}, {trip.destination.city}
                  </p>
                  <p className="text-sm text-black/50">{new Date(trip.arrivalDate).toLocaleString("fr-FR")}</p>
                </div>
              </div>
            </Card>
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Capacité et tarification</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-primary mb-2">Capacité disponible</h3>
                  <p className="text-2xl font-extrabold text-primary">{trip.availableCapacity.weight} kg</p>
                  <p className="text-sm text-black/50">
                    Dimensions : {trip.availableCapacity.dimensions.length} × {trip.availableCapacity.dimensions.width} × {trip.availableCapacity.dimensions.height} cm
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-primary mb-2">Prix</h3>
                  <p className="text-2xl font-extrabold text-primary">{trip.pricePerKg}DH/kg</p>
                </div>
              </div>
            </Card>
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Types de cargaison acceptés</h2>
              <div className="flex flex-wrap gap-2">
                {trip.acceptedCargoTypes.map((type) => (
                  <span key={type} className="px-3 py-1 bg-input-background text-primary rounded-lg text-sm font-semibold">
                    {type}
                  </span>
                ))}
              </div>
            </Card>
            {trip.description && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-primary mb-4">Description</h2>
                <p className="text-black/70">{trip.description}</p>
              </Card>
            )}
            {isOwner && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Demandes reçues ({trip.requests?.length || 0})
                </h2>
                {trip.requests?.length > 0 ? (
                  <div className="space-y-4">
                    {trip.requests.map((request) => (
                      <div key={request._id} className="border rounded-xl p-4 bg-white/70 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-primary">
                            {request.sender.firstName} {request.sender.lastName}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${request.status === "pending" ? "bg-warning bg-opacity-20 text-warning" : request.status === "accepted" ? "bg-success bg-opacity-20 text-success" : "bg-error bg-opacity-20 text-error"}`}>{request.status}</span>
                          <p className="text-sm text-black/60 mt-1">{request.cargo.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-lg font-bold text-primary">{request.price}DH</span>
                          <span className="text-sm text-black/60">{request.cargo.weight}kg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-black/60">Aucune demande reçue pour ce trajet.</div>
                )}
              </Card>
            )}
          </div>
          {/* Carte conducteur */}
          <div className="space-y-6">
            <Card className="p-8 flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold text-primary mb-4">Conducteur</h2>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-300 flex items-center justify-center text-white text-4xl font-bold mb-2 shadow-xl">
                {trip.driver?.avatar ? (
                  <img src={trip.driver.avatar} alt="Avatar conducteur" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  trip.driver?.firstName?.charAt(0)?.toUpperCase()
                )}
              </div>
              <div className="text-lg font-semibold text-black/80 mb-1">{trip.driver?.firstName} {trip.driver?.lastName}</div>
              <div className="text-sm text-black/60 mb-2">{trip.driver?.email}</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-warning" />
                <span className="text-black/70 font-semibold">{trip.driver?.stats?.averageRating?.toFixed(1) || "N/A"}/5</span>
              </div>
              <div className="text-sm text-black/60">{trip.driver?.phone}</div>
            </Card>
            {user?.role !== "conducteur" && trip.status === "active" && (
              <div className="flex justify-center mt-6">
                <Link to={`/requests/create/${trip._id}`} className="w-full">
                  <button
                    className="w-full bg-white/70 backdrop-blur-xl border-2 border-[#5bc0eb] shadow-2xl rounded-2xl px-8 py-5 flex items-center justify-center gap-3 text-xl font-extrabold text-[#0072bb] transition-all duration-300 hover:bg-gradient-to-r hover:from-[#0072bb]/90 hover:to-[#5bc0eb]/90 hover:text-white hover:scale-105 hover:shadow-[#5bc0eb]/40 animate-fade-in"
                    style={{ boxShadow: '0 8px 32px 0 rgba(91,192,235,0.18)' }}
                  >
                    <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Nouvelle demande
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripDetailPage
