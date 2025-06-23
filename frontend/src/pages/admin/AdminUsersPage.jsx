import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Edit, 
  Eye,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { adminAPI } from "../../services/api"
import toast from "react-hot-toast"

const AdminUsersPage = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, statusFilter, roleFilter])

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers()
      setUsers(response.data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error)
      toast.error("Erreur lors du chargement des utilisateurs")
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        (user.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter (exclusif)
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => {
        if (statusFilter === "verified") return user.isVerified && user.isActive
        if (statusFilter === "unverified") return !user.isVerified && user.isActive
        if (statusFilter === "active") return user.isActive
        if (statusFilter === "suspended") return !user.isActive
        return true
      })
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }

  const handleVerifyUser = async (userId) => {
    try {
      await adminAPI.verifyUser(userId)
      toast.success("Utilisateur vérifié avec succès")
      fetchUsers()
    } catch (error) {
      toast.error("Erreur lors de la vérification")
    }
  }

  const handleSuspendUser = async (userId) => {
    try {
      await adminAPI.suspendUser(userId)
      toast.success("Utilisateur suspendu avec succès")
      fetchUsers()
    } catch (error) {
      toast.error("Erreur lors de la suspension")
    }
  }

  const getStatusBadge = (user) => {
    if (!user.isActive) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
          Suspendu
        </span>
      )
    }
    if (user.isVerified) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          Vérifié
        </span>
      )
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
        En attente
      </span>
    )
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
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-text-secondary to-primary p-8 text-white"
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
              Gestion des utilisateurs
            </motion.h1>
            <motion.p 
              className="text-xl opacity-90 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Gérez les comptes utilisateurs, vérifiez les nouveaux inscrits et surveillez l'activité
            </motion.p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <Input
                  placeholder="Rechercher par nom, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="verified">Vérifiés</option>
                  <option value="unverified">Non vérifiés</option>
                  <option value="active">Actifs</option>
                  <option value="suspended">Suspendus</option>
                </select>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="admin">Admin</option>
                  <option value="conducteur">Conducteur</option>
                  <option value="expediteur">Client</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Users Table */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Utilisateur</th>
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Rôle</th>
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Statut</th>
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Date d'inscription</th>
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-text-secondary rounded-full flex items-center justify-center text-white font-bold">
                            {user.firstName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-text-secondary">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(user)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 text-sm text-text-secondary">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(user.createdAt).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {!user.isVerified && user.isActive && (
                            <Button
                              size="small"
                              onClick={() => handleVerifyUser(user._id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          )}
                          {user.isActive ? (
                            <Button
                              size="small"
                              variant="outline"
                              onClick={() => handleSuspendUser(user._id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-text-secondary">Aucun utilisateur trouvé</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AdminUsersPage 