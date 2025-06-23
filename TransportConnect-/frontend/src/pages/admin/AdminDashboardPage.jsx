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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-200 rounded-3xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
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
        {/* Hero Header */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-8 text-white"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <motion.h1 
              className="text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Tableau de bord Admin
            </motion.h1>
            <motion.p 
              className="text-xl opacity-90 max-w-2xl mx-auto"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.gradient}`}></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}/10 group-hover:bg-${stat.color}/20 transition-colors duration-300`}>
                    <stat.icon className={`w-8 h-8 text-${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Ajout du graphique sous les cards */}
        <motion.div variants={itemVariants} className="my-8">
          <Card className="p-6">
            <Bar data={chartData} options={chartOptions} height={80} />
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
            <Settings className="w-6 h-6 mr-3 text-primary" />
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${action.color} to-${action.color}/60`}></div>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-${action.color}/10 group-hover:bg-${action.color}/20 transition-colors duration-300`}>
                      <action.icon className={`w-8 h-8 text-${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-1">{action.title}</h3>
                      <p className="text-text-secondary text-sm">{action.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="small"
                      className={`text-${action.color} hover:bg-${action.color}/10`}
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
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-primary" />
            Activité récente
          </h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium text-text-primary">Nouveau trajet créé</p>
                  <p className="text-sm text-text-secondary">Il y a 2 minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                <Clock className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-text-primary">Demande en attente</p>
                  <p className="text-sm text-text-secondary">Il y a 15 minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <UserCheck className="w-5 h-5 text-info" />
                <div>
                  <p className="font-medium text-text-primary">Utilisateur vérifié</p>
                  <p className="text-sm text-text-secondary">Il y a 1 heure</p>
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