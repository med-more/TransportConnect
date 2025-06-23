import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Shield, 
  Search, 
  UserCheck, 
  UserX, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Truck,
  User,
  FileText
} from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { adminAPI } from "../../services/api"
import toast from "react-hot-toast"

const AdminVerificationsPage = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm])

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers()
      const unverifiedUsers = (response.data || []).filter(user => !user.isVerified)
      setUsers(unverifiedUsers)
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error)
      toast.error("Erreur lors du chargement des utilisateurs")
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }

  const handleVerifyUser = async (userId) => {
    try {
      await adminAPI.verifyUser(userId)
      toast.success("Utilisateur vérifié avec succès")
      fetchUsers()
      setShowDetails(false)
      setSelectedUser(null)
    } catch (error) {
      toast.error("Erreur lors de la vérification")
    }
  }

  const handleRejectUser = async (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir rejeter cet utilisateur ?")) {
      try {
        await adminAPI.suspendUser(userId)
        toast.success("Utilisateur rejeté avec succès")
        fetchUsers()
        setShowDetails(false)
        setSelectedUser(null)
      } catch (error) {
        toast.error("Erreur lors du rejet")
      }
    }
  }

  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setShowDetails(true)
  }

  const getRoleBadge = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      conducteur: "bg-blue-100 text-blue-800",
      expediteur: "bg-gray-100 text-gray-800"
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[role] || colors.expediteur}`}>
        {role === "conducteur" ? "Conducteur" : role === "admin" ? "Admin" : "Client"}
      </span>
    )
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
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-error via-red-600 to-error p-8 text-white"
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
              Vérifications en attente
            </motion.h1>
            <motion.p 
              className="text-xl opacity-90 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Approuvez ou rejetez les nouveaux utilisateurs de la plateforme
            </motion.p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <Input
              placeholder="Rechercher par nom, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </Card>
        </motion.div>

        {/* Users Grid */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-error to-red-600"></div>
                  
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-text-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      {user.firstName?.charAt(0)?.toUpperCase()}
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-2">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-text-secondary text-sm mb-3">{user.email}</p>
                    {getRoleBadge(user.role)}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-sm text-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center space-x-3 text-sm text-text-secondary">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.address && typeof user.address === 'object' && (
                      <div className="flex items-center space-x-3 text-sm text-text-secondary">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">
                          {user.address.street ? user.address.street + ', ' : ''}
                          {user.address.city ? user.address.city + ', ' : ''}
                          {user.address.postalCode ? user.address.postalCode + ', ' : ''}
                          {user.address.country || ''}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="small"
                      variant="outline"
                      onClick={() => handleViewDetails(user)}
                      className="flex-1 border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Détails
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleVerifyUser(user._id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      Approuver
                    </Button>
                    <Button
                      size="small"
                      variant="outline"
                      onClick={() => handleRejectUser(user._id)}
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <UserX className="w-4 h-4 mr-1" />
                      Rejeter
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-text-secondary">Aucune vérification en attente</p>
            </div>
          )}
        </motion.div>

        {/* User Details Modal */}
        {showDetails && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Détails de l'utilisateur</h2>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setShowDetails(false)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-text-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                    {selectedUser.firstName?.charAt(0)?.toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-text-secondary">{selectedUser.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-primary" />
                      <span className="font-medium">Rôle:</span>
                      {getRoleBadge(selectedUser.role)}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-medium">Inscrit le:</span>
                      <span>{new Date(selectedUser.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <span className="font-medium">Téléphone:</span>
                        <span>{selectedUser.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {selectedUser.address && typeof selectedUser.address === 'object' && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <span className="font-medium">Adresse:</span>
                          <p className="text-text-secondary">
                            {selectedUser.address.street ? selectedUser.address.street + ', ' : ''}
                            {selectedUser.address.city ? selectedUser.address.city + ', ' : ''}
                            {selectedUser.address.postalCode ? selectedUser.address.postalCode + ', ' : ''}
                            {selectedUser.address.country || ''}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedUser.role === "conducteur" && (
                      <div className="flex items-center space-x-3">
                        <Truck className="w-5 h-5 text-primary" />
                        <span className="font-medium">Conducteur</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4 pt-6 border-t">
                  <Button
                    onClick={() => handleVerifyUser(selectedUser._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Approuver l'utilisateur
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRejectUser(selectedUser._id)}
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Rejeter l'utilisateur
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default AdminVerificationsPage 