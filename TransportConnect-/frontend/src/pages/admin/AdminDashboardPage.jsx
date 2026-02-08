import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Truck, 
  Package, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  Eye,
  UserCheck,
  UserX
} from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import { adminAPI } from "../../services/api"
import { useNavigate } from "react-router-dom"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrips: 0,
    totalRequests: 0,
    pendingVerifications: 0,
    activeUsers: 0,
    completedTrips: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const statsRes = await adminAPI.getStats()
      const statsData = statsRes.data || {}
      setStats({
        totalUsers: statsData.totalUsers || 0,
        totalTrips: statsData.totalTrips || 0,
        totalRequests: statsData.totalRequests || 0,
        pendingVerifications: statsData.pendingVerifications || 0,
        activeUsers: 0,
        completedTrips: 0
      })
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: "Utilisateurs totaux",
      value: stats.totalUsers,
      icon: Users,
      color: "primary",
      gradient: "from-primary to-blue-600"
    },
    {
      title: "Trajets actifs",
      value: stats.totalTrips,
      icon: Truck,
      color: "success",
      gradient: "from-success to-green-600"
    },
    {
      title: "Demandes en cours",
      value: stats.totalRequests,
      icon: Package,
      color: "warning",
      gradient: "from-warning to-orange-600"
    },
    {
      title: "Vérifications en attente",
      value: stats.pendingVerifications,
      icon: Shield,
      color: "error",
      gradient: "from-error to-red-600"
    }
  ]

  const quickActions = [
    {
      title: "Gérer les utilisateurs",
      description: "Voir, modifier et vérifier les comptes utilisateurs",
      icon: Users,
      href: "/admin/users",
      color: "primary"
    },
    {
      title: "Gérer les trajets",
      description: "Surveiller et gérer tous les trajets",
      icon: Truck,
      href: "/admin/trips",
      color: "success"
    },
    {
      title: "Gérer les demandes",
      description: "Traiter les demandes de transport",
      icon: Package,
      href: "/admin/requests",
      color: "warning"
    },
    {
      title: "Vérifications",
      description: "Approuver les nouveaux utilisateurs",
      icon: Shield,
      href: "/admin/verifications",
      color: "error"
    }
  ]

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

  const chartData = {
    labels: [
      "Utilisateurs",
      "Trajets",
      "Demandes",
      "Vérifications en attente"
    ],
    datasets: [
      {
        label: "Statistiques",
        data: [
          stats.totalUsers,
          stats.totalTrips,
          stats.totalRequests,
          stats.pendingVerifications
        ],
        backgroundColor: [
          "#6366f1",
          "#22c55e",
          "#f59e42",
          "#ef4444"
        ],
        borderRadius: 8,
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Statistiques globales" }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-50 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4 sm:space-y-6 md:space-y-8">
            <div className="h-24 sm:h-28 md:h-32 bg-gray-200 rounded-2xl sm:rounded-3xl"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 sm:h-28 md:h-32 bg-gray-200 rounded-lg sm:rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 sm:h-44 md:h-48 bg-gray-200 rounded-lg sm:rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-50 p-3 sm:p-4 md:p-6">
      <motion.div 
        className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Header */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-4 sm:p-6 md:p-8 text-white"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white rounded-full -translate-x-8 sm:-translate-x-12 md:-translate-x-16 -translate-y-8 sm:-translate-y-12 md:-translate-y-16"></div>
            <div className="absolute top-1/2 right-0 w-12 h-12 sm:w-18 sm:h-18 md:w-24 md:h-24 bg-white rounded-full translate-x-6 sm:translate-x-9 md:translate-x-12 -translate-y-6 sm:-translate-y-9 md:-translate-y-12"></div>
            <div className="absolute bottom-0 left-1/3 w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full translate-y-5 sm:translate-y-8 md:translate-y-10"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Tableau de bord Admin
            </motion.h1>
            <motion.p 
              className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 max-w-2xl mx-auto px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Gérez votre plateforme de transport et surveillez l'activité en temps réel
            </motion.p>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 sm:p-5 md:p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.gradient}`}></div>
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-text-secondary text-xs sm:text-sm font-medium mb-1 truncate">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-text-primary">{stat.value}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-lg bg-${stat.color}/10 group-hover:bg-${stat.color}/20 transition-colors duration-300 flex-shrink-0 ml-2`}>
                    <stat.icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Ajout du graphique sous les cards */}
        <motion.div variants={itemVariants} className="my-4 sm:my-6 md:my-8">
          <Card className="p-3 sm:p-4 md:p-6">
            <div className="h-48 sm:h-64 md:h-80">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3 sm:mb-4 md:mb-6 flex items-center">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-primary flex-shrink-0" />
            <span>Actions rapides</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 sm:p-5 md:p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${action.color} to-${action.color}/60`}></div>
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className={`p-2 sm:p-3 rounded-lg bg-${action.color}/10 group-hover:bg-${action.color}/20 transition-colors duration-300 flex-shrink-0`}>
                      <action.icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-${action.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-text-primary mb-1 truncate">{action.title}</h3>
                      <p className="text-text-secondary text-xs sm:text-sm line-clamp-2">{action.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="small"
                      className={`text-${action.color} hover:bg-${action.color}/10 flex-shrink-0`}
                      onClick={() => navigate(action.href)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3 sm:mb-4 md:mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-primary flex-shrink-0" />
            <span>Activité récente</span>
          </h2>
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text-primary text-sm sm:text-base">Nouveau trajet créé</p>
                  <p className="text-xs sm:text-sm text-text-secondary">Il y a 2 minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-yellow-50 rounded-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-warning flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text-primary text-sm sm:text-base">Demande en attente</p>
                  <p className="text-xs sm:text-sm text-text-secondary">Il y a 15 minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-info flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text-primary text-sm sm:text-base">Utilisateur vérifié</p>
                  <p className="text-xs sm:text-sm text-text-secondary">Il y a 1 heure</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AdminDashboardPage 