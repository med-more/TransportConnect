import User from "../models/User.js";
import Trip from "../models/Trip.js";
import Request from "../models/Request.js";

// Lister tous les utilisateurs
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

// Suspendre ou réactiver un utilisateur
export const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `Utilisateur ${user.isActive ? 'activé' : 'suspendu'}` });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du changement d'état de l'utilisateur" });
  }
};

// Lister tous les trajets
export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate("driver", "firstName lastName");
    res.json({ trips });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des trajets" });
  }
};

// Lister toutes les demandes
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate("sender", "firstName lastName").populate("trip");
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des demandes" });
  }
};

// Exemple de validation de vérification (à adapter selon le modèle)
export const validateVerification = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" })
    user.isVerified = true
    await user.save()
    res.json({ message: "Utilisateur vérifié avec succès" })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la vérification de l'utilisateur" })
  }
};

// Statistiques globales pour le dashboard admin
export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalTrips, totalRequests, pendingVerifications] = await Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      Request.countDocuments(),
      User.countDocuments({ isVerified: false })
    ])
    res.json({
      data: {
        totalUsers,
        totalTrips,
        totalRequests,
        pendingVerifications
      }
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques admin" })
  }
}

// Changer le statut d'un trajet
export const updateTripStatus = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
    if (!trip) return res.status(404).json({ message: "Trajet non trouvé" })
    if (req.body.status) trip.status = req.body.status
    await trip.save()
    res.json({ message: "Statut du trajet mis à jour", trip })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut du trajet" })
  }
}

// Supprimer un trajet
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id)
    if (!trip) return res.status(404).json({ message: "Trajet non trouvé" })
    res.json({ message: "Trajet supprimé avec succès" })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du trajet" })
  }
}

// Changer le statut d'une demande
export const updateRequestStatus = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
    if (!request) return res.status(404).json({ message: "Demande non trouvée" })
    if (req.body.status) request.status = req.body.status
    await request.save()
    res.json({ message: "Statut de la demande mis à jour", request })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut de la demande" })
  }
}

// Supprimer une demande
export const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id)
    if (!request) return res.status(404).json({ message: "Demande non trouvée" })
    res.json({ message: "Demande supprimée avec succès" })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la demande" })
  }
} 