import User from "../models/User.js"
import Trip from "../models/Trip.js"
import Request from "../models/Request.js"

// Obtenir les statistiques de l'utilisateur connecté
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id

    // Compter les trajets selon le rôle
    let totalTrips = 0
    let totalRequests = 0

    if (req.user.role === "conducteur") {
      // Pour les conducteurs, compter leurs trajets
      totalTrips = await Trip.countDocuments({ driver: userId })
      
      // Compter les demandes reçues
      totalRequests = await Request.countDocuments({ 
        trip: { $in: await Trip.find({ driver: userId }).select('_id') }
      })
    } else {
      // Pour les clients, compter leurs demandes
      totalRequests = await Request.countDocuments({ sender: userId })
    }

    res.json({
      success: true,
      data: {
        totalTrips,
        totalRequests
      }
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques"
    })
  }
}

// Mettre à jour le profil utilisateur
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const { firstName, lastName, phone, address } = req.body

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, phone, address },
      { new: true, runValidators: true }
    ).select("-password")

    res.json({
      success: true,
      data: updatedUser
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du profil"
    })
  }
} 