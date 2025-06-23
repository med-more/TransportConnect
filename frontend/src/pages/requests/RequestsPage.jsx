import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Package, Clock, CheckCircle, XCircle, Truck, MessageCircle, Eye } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { requestsAPI } from "../../services/api"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Input from "../../components/ui/Input"

const RequestsPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState({
    name: "",
    collecte: "",
    trajet: "",
    poids: "",
    prix: "",
  })

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ["requests", activeTab],
    queryFn: () => {
      if (user?.role === "conducteur") {
        return requestsAPI.getReceivedRequests({ status: activeTab === "all" ? "" : activeTab })
      } else {
        return requestsAPI.getRequests({ status: activeTab === "all" ? "" : activeTab })
      }
    },
    enabled: !!user,
  })

  const requests = requestsData?.data?.requests || []

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-error" />
      case "in_transit":
        return <Truck className="w-4 h-4 text-info" />
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-error" />
      default:
        return <Package className="w-4 h-4 text-text-secondary" />
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "accepted":
        return "Acceptée"
      case "rejected":
        return "Refusée"
      case "in_transit":
        return "En transit"
      case "delivered":
        return "Livrée"
      case "cancelled":
        return "Annulée"
      default:
        return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning bg-opacity-20 text-warning"
      case "accepted":
        return "bg-success bg-opacity-20 text-success"
      case "rejected":
        return "bg-error bg-opacity-20 text-error"
      case "in_transit":
        return "bg-info bg-opacity-20 text-info"
      case "delivered":
        return "bg-success bg-opacity-20 text-success"
      case "cancelled":
        return "bg-error bg-opacity-20 text-error"
      default:
        return "bg-placeholder-text bg-opacity-20 text-placeholder-text"
    }
  }

  const tabs = [
    { id: "all", label: "Toutes", count: requests.length },
    { id: "pending", label: "En attente", count: requests.filter((r) => r.status === "pending").length },
    { id: "accepted", label: "Acceptées", count: requests.filter((r) => r.status === "accepted").length },
    { id: "in_transit", label: "En transit", count: requests.filter((r) => r.status === "in_transit").length },
    { id: "delivered", label: "Livrées", count: requests.filter((r) => r.status === "delivered").length },
  ]

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({ name: "", collecte: "", trajet: "", poids: "", prix: "" })
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
      <div className="relative z-10 p-6 space-y-8 max-w-5xl mx-auto">
        {/* Header modernisé */}
        <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-primary mb-1 flex items-center gap-2">
              <Package className="w-8 h-8 text-primary" />
              {user?.role === "conducteur" ? "Demandes reçues" : "Mes demandes"}
            </h1>
            <p className="text-lg text-black/60 font-medium mb-1">
              {user?.role === "conducteur"
                ? "Gérez les demandes de transport reçues et suivez leur statut."
                : "Suivez l'état de vos demandes de transport en temps réel."}
            </p>
            <p className="text-sm text-primary font-semibold italic">
              Plateforme sécurisée, rapide et efficace pour tous vos transports
            </p>
          </div>
        </div>
        {/* Filtres avancés */}
        <Card className="p-4 mb-2 bg-white/80 backdrop-blur-xl border border-blue-100 rounded-2xl">
          <div className="flex flex-wrap gap-4 items-center justify-center mb-4">
            <Input
              placeholder="Nom du colis"
              value={filters.name}
              onChange={e => handleFilterChange('name', e.target.value)}
              className="w-40 focus:ring-2 focus:ring-primary/60"
            />
            <Input
              placeholder="Ville de collecte"
              value={filters.collecte}
              onChange={e => handleFilterChange('collecte', e.target.value)}
              className="w-40 focus:ring-2 focus:ring-primary/60"
            />
            <Input
              placeholder="Trajet (ex: Paris)"
              value={filters.trajet}
              onChange={e => handleFilterChange('trajet', e.target.value)}
              className="w-40 focus:ring-2 focus:ring-primary/60"
            />
            <Input
              placeholder="Poids (kg)"
              value={filters.poids}
              onChange={e => handleFilterChange('poids', e.target.value)}
              className="w-32 focus:ring-2 focus:ring-primary/60"
              type="number"
              min="0"
            />
            <Input
              placeholder="Prix (DH)"
              value={filters.prix}
              onChange={e => handleFilterChange('prix', e.target.value)}
              className="w-32 focus:ring-2 focus:ring-primary/60"
              type="number"
              min="0"
            />
            <Button variant="ghost" size="small" onClick={resetFilters} className="ml-2 mt-2">
              Réinitialiser
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-xl text-base font-semibold transition-colors shadow-sm border border-blue-100
                  ${activeTab === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-input-background text-primary hover:bg-primary/80 hover:text-white"}
                `}
              >
                {tab.label} ({tab.count})
              </motion.button>
            ))}
          </div>
        </Card>
        {/* Liste des demandes modernisée */}
        <div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-6">
              {requests
                .filter((request) =>
                  (activeTab === "all" || request.status === activeTab) &&
                  (!filters.name || request.cargo.description.toLowerCase().includes(filters.name.toLowerCase())) &&
                  (!filters.collecte || request.pickup.city.toLowerCase().includes(filters.collecte.toLowerCase())) &&
                  (!filters.trajet ||
                    (request.trip?.departure?.city && request.trip.departure.city.toLowerCase().includes(filters.trajet.toLowerCase())) ||
                    (request.trip?.destination?.city && request.trip.destination.city.toLowerCase().includes(filters.trajet.toLowerCase()))
                  ) &&
                  (!filters.poids || String(request.cargo.weight).includes(filters.poids)) &&
                  (!filters.prix || String(request.price).includes(filters.prix))
                )
                .map((request) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="p-6 flex flex-col gap-3 group hover:scale-[1.02]">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                              <Package className="w-5 h-5 text-primary" />
                              {request.cargo.description}
                            </h3>
                            <div
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(request.status)}`}
                            >
                              {getStatusIcon(request.status)}
                              <span>{getStatusLabel(request.status)}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-black/70">
                            <div>
                              <span className="font-medium">Collecte :</span>
                              <p>{request.pickup.address}, {request.pickup.city}</p>
                            </div>
                            <div>
                              <span className="font-medium">Livraison :</span>
                              <p>{request.delivery.address}, {request.delivery.city}</p>
                            </div>
                            <div>
                              <span className="font-medium">Trajet :</span>
                              <p>{request.trip?.departure?.city} → {request.trip?.destination?.city}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-extrabold text-primary">{request.price}DH</div>
                          <div className="text-sm text-black/60">{request.cargo.weight}kg</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4">
                          {user?.role === "conducteur" ? (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {/* Pas de point-virgule requis ici, c'est du JSX */}
                                  {request.sender?.firstName?.charAt(0)}
                                </span>
                              </div>
                              <span className="text-sm text-primary font-semibold">
                                {request.sender?.firstName} {request.sender?.lastName}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {request.driver?.firstName?.charAt(0)}
                                </span>
                              </div>
                              <span className="text-sm text-primary font-semibold">
                                {request.driver?.firstName} {request.driver?.lastName}
                              </span>
                            </div>
                          )}
                        </div>
                        <Link to={`/requests/${request._id}`} className="text-primary font-semibold hover:underline flex items-center gap-1">
                          <Eye className="w-4 h-4" /> Détail
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <MessageCircle className="w-14 h-14 text-placeholder-text mx-auto mb-4" />
              <p className="text-text-secondary text-lg">Aucune demande trouvée</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequestsPage