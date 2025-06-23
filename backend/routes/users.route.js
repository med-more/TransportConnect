import express from "express"
import { getUserStats, updateProfile } from "../controllers/users.controller.js"
import { authenticateToken } from "../middleware/auth.middleware.js"

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticateToken)

// Obtenir les statistiques de l'utilisateur
router.get("/stats", getUserStats)

// Mettre à jour le profil utilisateur
router.put("/profile", updateProfile)

export default router 