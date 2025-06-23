import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Truck, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  MapPin,
  Calendar,
  Clock,
  User,
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  StopCircle
} from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { adminAPI } from "../../services/api"
import toast from "react-hot-toast"

const AdminTripsPage = () => {
  const [trips, setTrips] = useState([])
  const [filteredTrips, setFilteredTrips] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchTrips()
  }, [])

  useEffect(() => {
    filterTrips()
  }, [trips, searchTerm, statusFilter])

  const fetchTrips = async () => {
    try {
      const response = await adminAPI.getAllTrips()
      setTrips(response.data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des trajets:", error)
      toast.error("Erreur lors du chargement des trajets")
    } finally {
      setIsLoading(false)
    }
  }

  const filterTrips = () => {
    let filtered = trips

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(trip => 
        (trip.departure?.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trip.destination?.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trip.driver?.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trip.driver?.lastName || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(trip => trip.status === statusFilter)
    }

    setFilteredTrips(filtered)
  }

  const handleUpdateTripStatus = async (tripId, newStatus) => {
    try {
      await adminAPI.updateTripStatus(tripId, { status: newStatus })
      toast.success(`Statut du trajet mis à jour vers ${newStatus}`)
      fetchTrips()
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut")
    }
  }

  const handleDeleteTrip = async (tripId) => {
    toast((t) => (
      <span style={{display: 'block', minWidth: 220}}>
        <span style={{fontWeight: 600, color: '#b91c1c'}}>Supprimer ce trajet ?</span>
        <div style={{marginTop: 14, display: 'flex', gap: 12, justifyContent: 'flex-end'}}>
          <button
            onClick={async () => { toast.dismiss(t.id); await adminAPI.deleteTrip(tripId); toast.success("Trajet supprimé avec succès"); fetchTrips(); }}
            style={{
              background: 'linear-gradient(90deg,#ef4444,#fca5a5)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '7px 18px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(239,68,68,0.08)',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg,#dc2626,#ef4444)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg,#ef4444,#fca5a5)'}
          >Oui</button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: '#f3f4f6',
              color: '#222831',
              border: 'none',
              borderRadius: 8,
              padding: '7px 18px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
            onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
          >Non</button>
        </div>
      </span>
    ), { duration: 7000 });
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "En attente" },
      active: { color: "bg-green-100 text-green-800", label: "Actif" },
      completed: { color: "bg-blue-100 text-blue-800", label: "Terminé" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Annulé" },
      paused: { color: "bg-gray-100 text-gray-800", label: "En pause" }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Play className="w-4 h-4 text-green-600" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "paused":
        return <Pause className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-200 rounded-3xl"></div>
            <div className="h-16 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-50 p-6">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-success via-green-600 to-success p-8 text-white"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <motion.h1 
              className="text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Gestion des trajets
            </motion.h1>
            <motion.p 
              className="text-xl opacity-90 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Surveillez et gérez tous les trajets de la plateforme
            </motion.p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <Input
                  placeholder="Rechercher par origine, destination, conducteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="active">Actifs</option>
                  <option value="completed">Terminés</option>
                  <option value="cancelled">Annulés</option>
                  <option value="paused">En pause</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Trips Table */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Trajet</th>
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Conducteur</th>
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Statut</th>
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrips.map((trip, index) => (
                    <motion.tr
                      key={trip._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-success" />
                            <span className="font-medium text-text-primary">
                              {(trip.departure?.city || "")} → {(trip.destination?.city || "")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-text-secondary">
                            <span>Prix&nbsp;: {trip.pricePerKg} DH/kg</span>
                            <span>Capacité&nbsp;: {trip.availableCapacity?.weight} kg</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-text-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {trip.driver?.firstName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">
                              {trip.driver?.firstName} {trip.driver?.lastName}
                            </p>
                            <p className="text-sm text-text-secondary">{trip.driver?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(trip.status)}
                          {getStatusBadge(trip.status)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 text-sm text-text-secondary">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(trip.departureDate).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {trip.status === "pending" && (
                            <>
                              <Button
                                size="small"
                                onClick={() => handleUpdateTripStatus(trip._id, "active")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                              <Button
                                size="small"
                                variant="outline"
                                onClick={() => handleUpdateTripStatus(trip._id, "cancelled")}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {trip.status === "active" && (
                            <Button
                              size="small"
                              variant="outline"
                              onClick={() => handleUpdateTripStatus(trip._id, "paused")}
                              className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                            >
                              <Pause className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="small"
                            variant="ghost"
                            onClick={() => handleDeleteTrip(trip._id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredTrips.length === 0 && (
                <div className="text-center py-12">
                  <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-text-secondary">Aucun trajet trouvé</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AdminTripsPage 