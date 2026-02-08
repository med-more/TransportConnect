import User from "../models/User.js"
import Trip from "../models/Trip.js"
import Request from "../models/Request.js"
import { cloudinary } from "../middleware/upload.middleware.js"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id

    let totalTrips = 0
    let totalRequests = 0

    if (req.user.role === "conducteur") {
      totalTrips = await Trip.countDocuments({ driver: userId })
      totalRequests = await Request.countDocuments({ trip: { $in: await Trip.find({ driver: userId }).select('_id') } })
    } else {
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

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      })
    }

    const userId = req.user._id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    // Delete old avatar
    if (user.avatar) {
      if (user.avatar.includes("cloudinary") && cloudinary) {
        // Delete from Cloudinary
        try {
          const urlParts = user.avatar.split("/")
          const publicIdWithExt = urlParts.slice(-2).join("/")
          const publicId = publicIdWithExt.split(".")[0]
          await cloudinary.uploader.destroy(publicId)
        } catch (error) {
          console.error("Error deleting old avatar from Cloudinary:", error)
        }
      } else if (user.avatar.includes("/uploads/")) {
        // Delete local file
        try {
          const filePath = path.join(__dirname, "..", user.avatar.replace(/^\/api\//, ""))
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          }
        } catch (error) {
          console.error("Error deleting old local avatar:", error)
        }
      }
    }

    // Get avatar URL - must be a full HTTP URL
    let avatarUrl
    if (req.file.path && (req.file.path.includes("cloudinary") || req.file.path.startsWith("http"))) {
      // Cloudinary URL (already a full URL)
      avatarUrl = req.file.path
    } else {
      // Local file - create full HTTP URL
      const fileName = path.basename(req.file.path)
      // Get the base URL from the request
      const protocol = req.protocol || "http"
      // Use the actual request host, or fallback to environment variable
      const requestHost = req.get("host")
      const port = process.env.PORT || 7000
      const host = requestHost || `localhost:${port}`
      
      // Ensure we have a proper HTTP URL
      avatarUrl = `${protocol}://${host}/uploads/avatars/${fileName}`
      
      console.log("Generated avatar URL:", avatarUrl)
      console.log("Request host:", requestHost)
      console.log("File path:", req.file.path)
    }

    if (!avatarUrl) {
      return res.status(500).json({
        success: false,
        message: "Failed to get uploaded file URL"
      })
    }

    // Update user with new avatar URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true, runValidators: true }
    ).select("-password")

    res.json({
      success: true,
      data: updatedUser,
      message: "Avatar uploaded successfully"
    })
  } catch (error) {
    console.error("Erreur lors de l'upload de l'avatar:", error)
    console.error("Error stack:", error.stack)
    res.status(500).json({
      success: false,
      message: error.message || "Erreur lors de l'upload de l'avatar",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
} 