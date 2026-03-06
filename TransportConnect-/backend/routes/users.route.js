import express from "express"
import {
  getUserStats,
  updateProfile,
  updateLastSeen,
  uploadAvatar,
  getSavedAddresses,
  addSavedAddress,
  updateSavedAddress,
  deleteSavedAddress,
  getNotificationPreferences,
  updateNotificationPreferences,
  addPushSubscription,
  removePushSubscription,
} from "../controllers/users.controller.js"
import { authenticateToken } from "../middleware/auth.middleware.js"
import { validateObjectId } from "../middleware/validation.js"
import uploadSingle from "../middleware/upload.middleware.js"

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticateToken)

// Obtenir les statistiques de l'utilisateur
router.get("/stats", getUserStats)

// Mettre à jour le profil utilisateur
router.put("/profile", updateProfile)

// Mettre à jour last seen (pour afficher "dernière fois en ligne" dans le chat)
router.put("/me/last-seen", updateLastSeen)

// Upload avatar with error handling
router.post("/avatar", (req, res, next) => {
  console.log("📤 Avatar upload request received")
  
  // Set longer timeout for this specific route
  req.setTimeout(30000) // 30 seconds
  
  const upload = uploadSingle("avatar")
  console.log("✅ Upload middleware ready")
  
  upload(req, res, (err) => {
    if (err) {
      console.error("❌ Multer error:", err)
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        field: err.field,
        storageErrors: err.storageErrors
      })
      return res.status(400).json({
        success: false,
        message: err.message || "Error uploading file"
      })
    }
    
    if (!req.file) {
      console.error("❌ No file in request after multer processing")
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      })
    }
    
    console.log("✅ File received:", {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      filename: req.file.filename
    })
    
    next()
  })
}, uploadAvatar)

// Saved addresses
router.get("/saved-addresses", getSavedAddresses)
router.post("/saved-addresses", addSavedAddress)
router.put("/saved-addresses/:id", ...validateObjectId("id"), updateSavedAddress)
router.delete("/saved-addresses/:id", ...validateObjectId("id"), deleteSavedAddress)

// Notification preferences & Web Push
router.get("/me/notification-preferences", getNotificationPreferences)
router.patch("/me/notification-preferences", updateNotificationPreferences)
router.post("/push-subscription", addPushSubscription)
router.delete("/push-subscription", removePushSubscription)

export default router 