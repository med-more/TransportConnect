import express from "express"
import { getUserStats, updateProfile, uploadAvatar } from "../controllers/users.controller.js"
import { authenticateToken } from "../middleware/auth.middleware.js"
import uploadSingle from "../middleware/upload.middleware.js"

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticateToken)

// Obtenir les statistiques de l'utilisateur
router.get("/stats", getUserStats)

// Mettre à jour le profil utilisateur
router.put("/profile", updateProfile)

// Upload avatar with error handling
router.post("/avatar", async (req, res, next) => {
  try {
    const upload = await uploadSingle("avatar")
    upload(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err)
        return res.status(400).json({
          success: false,
          message: err.message || "Error uploading file"
        })
      }
      next()
    })
  } catch (error) {
    console.error("Upload middleware error:", error)
    return res.status(500).json({
      success: false,
      message: "Error initializing upload middleware"
    })
  }
}, uploadAvatar)

export default router 