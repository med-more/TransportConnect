import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Plus, Search, Package, MessageCircle, TrendingUp, Clock, MapPin, Star, ArrowRight } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { tripsAPI, requestsAPI, usersAPI } from "../../services/api"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const DashboardPage = () => {
  const { user } = useAuth()

  const { data: stats } = useQuery({
    queryKey: ["user-stats"],
    queryFn: usersAPI.getStats
  })
  
  const { data: recentTrips, isLoading: tripsLoading } = useQuery({
    queryKey: ["recent-trips"],
    queryFn: () => user?.role === "conducteur" ? tripsAPI.getMyTrips({ limit: 5 }) : tripsAPI.getTrips({ limit: 5 })
  })
  
  const { data: recentRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["recent-requests"],
    queryFn: () => user?.role === "conducteur" ? requestsAPI.getReceivedRequests({ limit: 5 }) : requestsAPI.getRequests({ limit: 5 })
  })

  const quickActions =
    user?.role === "conducteur"
      ? [
          {
            title: "Nouveau trajet",
            description: "Créer un nouveau trajet",
            icon: Plus,
            href: "/trips/create",
            color: "bg-primary",
          },
          {
            title: "Mes trajets",
            description: "Gérer mes trajets",
            icon: Package,
            href: "/trips",
            color: "bg-text-secondary",
          },
          {
            title: "Demandes reçues",
            description: "Voir les demandes",
            icon: MessageCircle,
            href: "/requests",
            color: "bg-info",
          },
        ]
      : [
          {
            title: "Rechercher",
            description: "Trouver un trajet",
            icon: Search,
            href: "/trips",
            color: "bg-primary",
          },
          {
            title: "Mes demandes",
            description: "Suivre mes demandes",
            icon: Package,
            href: "/requests",
            color: "bg-text-secondary",
          },
          {
            title: "Messages",
            description: "Mes conversations",
            icon: MessageCircle,
            href: "/chat",
            color: "bg-info",
          },
        ]

  const statsCards = [
    {
      title: user?.role === "conducteur" ? "Trajets effectués" : "Demandes envoyées",
      value: stats?.data?.totalTrips || stats?.data?.totalRequests || 0,
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Note moyenne",
      value: stats?.data?.averageRating ? `${stats.data.averageRating}/5` : "N/A",
      icon: Star,
      color: "text-warning",
    },
    {
      title: "Messages",
      value: "12",
      icon: MessageCircle,
      color: "text-info",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-f4f4f4 p-0 relative overflow-hidden">
      {/* Illustration décorative conducteur */}
      {user?.role === "conducteur" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute right-0 top-0 w-[420px] h-[420px] pointer-events-none z-0"
        >
          <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <ellipse cx="210" cy="210" rx="210" ry="210" fill="#0072bb" fillOpacity="0.15" />
            <rect x="120" y="120" width="180" height="80" rx="30" fill="#0072bb" fillOpacity="0.18" />
            <rect x="170" y="200" width="80" height="40" rx="20" fill="#5bc0eb" fillOpacity="0.18" />
          </svg>
        </motion.div>
      )}
      <div className="relative z-10 p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header conducteur */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-blue-100 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-primary mb-2 flex items-center gap-2">
                Bonjour {user?.firstName} !
                <span className="inline-block animate-bounce">👋</span>
              </h1>
              <p className="text-xl text-black/70 mb-4 font-medium">
                Gérez vos trajets, suivez vos demandes et transportez en toute sécurité.
              </p>
              <div className="flex items-center space-x-4 text-black/60 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Dernière connexion : {new Date().toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Compte conducteur</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 hidden md:block">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="60" width="100" height="40" rx="20" fill="#0072bb" />
                  <rect x="30" y="40" width="60" height="30" rx="15" fill="#5bc0eb" />
                  <circle cx="30" cy="105" r="10" fill="#222831" />
                  <circle cx="90" cy="105" r="10" fill="#222831" />
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} bg-opacity-10 mb-4`}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-1">{stat.value}</h3>
                <p className="text-text-secondary">{stat.title}</p>
              </Card>
            )
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={action.title} to={action.href}>
                  <Card className="text-center group cursor-pointer">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${action.color} text-white mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">{action.title}</h3>
                    <p className="text-text-secondary">{action.description}</p>
                  </Card>
                </Link>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Trips */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">
                {user?.role === "conducteur" ? "Mes trajets récents" : "Trajets disponibles"}
              </h2>
              <Link to="/trips">
                <Button variant="ghost" size="small">
                  Voir tout <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {tripsLoading ? (
                <LoadingSpinner />
              ) : recentTrips?.data?.trips?.length > 0 ? (
                recentTrips.data.trips.map((trip) => (
                  <Card key={trip._id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-text-secondary" />
                        <span className="font-semibold text-text-primary">
                          {trip.departure.city} → {trip.destination.city}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-primary">{trip.pricePerKg}€/kg</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <span>{new Date(trip.departureDate).toLocaleDateString("fr-FR")}</span>
                      <span>{trip.availableCapacity.weight}kg disponible</span>
                    </div>

                    {user?.role !== "conducteur" && (
                      <div className="flex items-center mt-3 space-x-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {trip.driver?.firstName?.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm text-text-primary">
                          {trip.driver?.firstName} {trip.driver?.lastName}
                        </span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-warning fill-current" />
                          <span className="text-xs text-text-secondary ml-1">
                            {trip.driver?.stats?.averageRating?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <Card className="text-center py-8">
                  <Package className="w-12 h-12 text-placeholder-text mx-auto mb-4" />
                  <p className="text-text-secondary">Aucun trajet trouvé</p>
                </Card>
              )}
            </div>
          </motion.div>

          {/* Recent Requests */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">
                {user?.role === "conducteur" ? "Demandes reçues" : "Mes demandes"}
              </h2>
              <Link to="/requests">
                <Button variant="ghost" size="small">
                  Voir tout <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {requestsLoading ? (
                <LoadingSpinner />
              ) : recentRequests?.data?.requests?.length > 0 ? (
                recentRequests.data.requests.map((request) => (
                  <Card key={request._id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-text-secondary" />
                        <span className="font-semibold text-text-primary">
                          {request.cargo?.description?.substring(0, 30)}...
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          request.status === "pending"
                            ? "bg-warning bg-opacity-20 text-warning"
                            : request.status === "accepted"
                              ? "bg-success bg-opacity-20 text-success"
                              : request.status === "rejected"
                                ? "bg-error bg-opacity-20 text-error"
                                : "bg-placeholder-text bg-opacity-20 text-placeholder-text"
                        }`}
                      >
                        {request.status === "pending"
                          ? "En attente"
                          : request.status === "accepted"
                            ? "Acceptée"
                            : request.status === "rejected"
                              ? "Refusée"
                              : request.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <span>{request.cargo?.weight}kg</span>
                      <span>{request.price}€</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-text-secondary mt-2">
                      <span>
                        {request.pickup?.city} → {request.delivery?.city}
                      </span>
                      <span>{new Date(request.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-placeholder-text mx-auto mb-4" />
                  <p className="text-text-secondary">Aucune demande trouvée</p>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
