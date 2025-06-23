import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Package, 
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
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageCircle,
  DollarSign,
  Truck
} from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { adminAPI } from "../../services/api"
import toast from "react-hot-toast"

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, statusFilter])

  const fetchRequests = async () => {
    try {
      const response = await adminAPI.getAllRequests()
      setRequests(response.data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error)
      toast.error("Erreur lors du chargement des demandes")
    } finally {
      setIsLoading(false)
    }
  }

  const filterRequests = () => {
    let filtered = requests

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(request => request.status === statusFilter)
    }

    setFilteredRequests(filtered)
  }

  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    try {
      await adminAPI.updateRequestStatus(requestId, { status: newStatus })
      toast.success(`Statut de la demande mis à jour vers ${newStatus}`)
      fetchRequests()
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut")
    }
  }

  const handleDeleteRequest = async (requestId) => {
    toast((t) => (
      <span style={{display: 'block', minWidth: 220}}>
        <span style={{fontWeight: 600, color: '#b91c1c'}}>Supprimer cette demande ?</span>
        <div style={{marginTop: 14, display: 'flex', gap: 12, justifyContent: 'flex-end'}}>
          <button
            onClick={async () => { toast.dismiss(t.id); await adminAPI.deleteRequest(requestId); toast.success("Demande supprimée avec succès"); fetchRequests(); }}
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
      accepted: { color: "bg-green-100 text-green-800", label: "Acceptée" },
      rejected: { color: "bg-red-100 text-red-800", label: "Refusée" },
      completed: { color: "bg-blue-100 text-blue-800", label: "Terminée" },
      cancelled: { color: "bg-gray-100 text-gray-800", label: "Annulée" }
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
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-gray-600" />
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
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-warning via-orange-600 to-warning p-8 text-white"
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
              Gestion des demandes
            </motion.h1>
            <motion.p 
              className="text-xl opacity-90 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Traitez et gérez toutes les demandes de transport
            </motion.p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <Input
                  placeholder="Rechercher par origine, destination, utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warning focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="accepted">Acceptées</option>
                  <option value="rejected">Refusées</option>
                  <option value="completed">Terminées</option>
                  <option value="cancelled">Annulées</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Requests Table */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Demande</th>
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Utilisateur</th>
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Statut</th>
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request, index) => (
                    <motion.tr
                      key={request._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-warning" />
                            <span className="font-medium text-text-primary">
                              {(request.trip?.departure?.city || "")} → {(request.trip?.destination?.city || "")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-text-secondary">
                            <span className="flex items-center space-x-1">
                              <span className="font-bold">د.م</span>
                              <span>Budget: {request.price ? request.price + ' MAD' : 'N/A'}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Package className="w-3 h-3" />
                              <span>Colis: {request.cargo?.type || 'N/A'}{request.cargo?.weight ? `, ${request.cargo.weight}kg` : ''}</span>
                            </span>
                          </div>
                          {request.description && (
                            <p className="text-sm text-text-secondary max-w-xs truncate">
                              {request.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-text-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {request.sender?.firstName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">
                              {request.sender?.firstName} {request.sender?.lastName}
                            </p>
                            <p className="text-sm text-text-secondary">{request.sender?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          {getStatusBadge(request.status)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 text-sm text-text-secondary">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(request.createdAt).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {request.status === "pending" && (
                            <>
                              <Button
                                size="small"
                                onClick={() => handleUpdateRequestStatus(request._id, "accepted")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="small"
                                variant="outline"
                                onClick={() => handleUpdateRequestStatus(request._id, "rejected")}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="small"
                            variant="ghost"
                            onClick={() => handleDeleteRequest(request._id)}
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
              {filteredRequests.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-text-secondary">Aucune demande trouvée</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AdminRequestsPage 