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

    // Get user with stats
    const user = await User.findById(userId).select("stats")
    
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
        totalRequests,
        averageRating: user?.stats?.averageRating || 0,
        totalRatings: user?.stats?.totalRatings || 0,
        totalReviews: user?.stats?.totalRatings || 0, // Alias for frontend compatibility
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
    const { firstName, lastName, phone, address, role, vehicleInfo } = req.body

    // Build update object
    const updateData = { firstName, lastName, phone, address }
    
    // Allow role update for all users (except admin role cannot be changed by user)
    // Users can switch between "expediteur" (shipper) and "conducteur" (driver)
    if (role && req.user.role !== "admin") {
      // Only allow switching between shipper and driver roles
      if (["expediteur", "conducteur"].includes(role)) {
        updateData.role = role
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid role. You can only switch between shipper and driver roles."
        })
      }
    }

    // Allow vehicleInfo update for drivers
    if (vehicleInfo && (req.user.role === "conducteur" || role === "conducteur")) {
      updateData.vehicleInfo = vehicleInfo
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password")

    res.json({
      success: true,
      data: updatedUser
    })
  } catch (error) {
    console.error("Erreur mise à jour profil:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du profil"
    })
  }
}

export const updateLastSeen = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { lastSeenAt: new Date() })
    res.json({ success: true })
  } catch (error) {
    console.error("updateLastSeen error:", error)
    res.status(500).json({ success: false, message: "Error updating last seen" })
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
          console.log("✅ Old Cloudinary avatar deleted")
        } catch (error) {
          console.error("Error deleting old avatar from Cloudinary:", error)
        }
      } else if (user.avatar.includes("/uploads/") || user.avatar.includes("uploads/")) {
        // Delete local file
        try {
          // Handle both /uploads/avatars/filename and uploads/avatars/filename
          let relativePath = user.avatar.replace(/^https?:\/\/[^\/]+/, "") // Remove protocol and host
          relativePath = relativePath.replace(/^\/api\//, "") // Remove /api/ if present
          if (!relativePath.startsWith("/")) {
            relativePath = "/" + relativePath
          }
          const filePath = path.join(__dirname, "..", relativePath)
          console.log("Attempting to delete old avatar:", filePath)
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
            console.log("✅ Old local avatar deleted")
          } else {
            console.warn("⚠️ Old avatar file not found:", filePath)
          }
        } catch (error) {
          console.error("Error deleting old local avatar:", error)
        }
      }
    }

    // Get avatar URL - must be a full HTTP URL
    let avatarUrl
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      })
    }

    if (req.file.path && (req.file.path.includes("cloudinary") || req.file.path.startsWith("http"))) {
      // Cloudinary URL (already a full URL)
      avatarUrl = req.file.path
      console.log("📸 Using Cloudinary URL:", avatarUrl)
    } else if (req.file.path) {
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
      
      console.log("📸 Generated local avatar URL:", avatarUrl)
      console.log("📸 Request host:", requestHost)
      console.log("📸 File path:", req.file.path)
      console.log("📸 File name:", fileName)
    } else if (req.file.filename) {
      // Fallback: if only filename is available
      const fileName = req.file.filename
      const protocol = req.protocol || "http"
      const requestHost = req.get("host")
      const port = process.env.PORT || 7000
      const host = requestHost || `localhost:${port}`
      avatarUrl = `${protocol}://${host}/uploads/avatars/${fileName}`
      console.log("📸 Generated avatar URL from filename:", avatarUrl)
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to determine file location"
      })
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

    console.log("📸 Avatar URL saved to database:", avatarUrl)
    console.log("📸 Updated user avatar field:", updatedUser.avatar)

    res.json({
      success: true,
      data: {
        ...updatedUser.toObject(),
        avatar: avatarUrl, // Ensure avatar is explicitly included
      },
      message: "Avatar uploaded successfully"
    })
  } catch (error) {
    console.error("Erreur lors de l'upload de l'avatar:", error)
  }
}

export const getSavedAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("savedAddresses").lean()
    res.json({ success: true, data: user?.savedAddresses || [] })
  } catch (error) {
    console.error("getSavedAddresses error:", error)
    res.status(500).json({ success: false, message: "Error fetching saved addresses" })
  }
}

export const addSavedAddress = async (req, res) => {
  try {
    const { label, address, city, postalCode, country, coordinates, type } = req.body
    if (!label || !address || !city) {
      return res.status(400).json({
        success: false,
        message: "Label, address and city are required",
      })
    }
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    user.savedAddresses.push({
      label: label.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode ? String(postalCode).trim() : "",
      country: country ? String(country).trim() : "Maroc",
      coordinates: coordinates && typeof coordinates.lat === "number" && typeof coordinates.lng === "number"
        ? { lat: coordinates.lat, lng: coordinates.lng }
        : undefined,
      type: type && ["home", "work", "other"].includes(type) ? type : "other",
    })
    await user.save()
    const added = user.savedAddresses[user.savedAddresses.length - 1]
    res.status(201).json({ success: true, data: added })
  } catch (error) {
    console.error("addSavedAddress error:", error)
    res.status(500).json({ success: false, message: "Error adding saved address" })
  }
}

export const updateSavedAddress = async (req, res) => {
  try {
    const { id } = req.params
    const { label, address, city, postalCode, country, coordinates, type } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    const subdoc = user.savedAddresses.id(id)
    if (!subdoc) {
      return res.status(404).json({ success: false, message: "Saved address not found" })
    }
    if (label != null) subdoc.label = String(label).trim()
    if (address != null) subdoc.address = String(address).trim()
    if (city != null) subdoc.city = String(city).trim()
    if (postalCode != null) subdoc.postalCode = String(postalCode).trim()
    if (country != null) subdoc.country = String(country).trim()
    if (coordinates && typeof coordinates.lat === "number" && typeof coordinates.lng === "number") {
      subdoc.coordinates = { lat: coordinates.lat, lng: coordinates.lng }
    }
    if (type && ["home", "work", "other"].includes(type)) subdoc.type = type
    await user.save()
    res.json({ success: true, data: subdoc })
  } catch (error) {
    console.error("updateSavedAddress error:", error)
    res.status(500).json({ success: false, message: "Error updating saved address" })
  }
}

export const deleteSavedAddress = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    const subdoc = user.savedAddresses.id(id)
    if (!subdoc) {
      return res.status(404).json({ success: false, message: "Saved address not found" })
    }
    subdoc.deleteOne()
    await user.save()
    res.json({ success: true, message: "Saved address deleted" })
  } catch (error) {
    console.error("deleteSavedAddress error:", error)
    res.status(500).json({ success: false, message: "Error deleting saved address" })
  }
}

export const getNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("notificationPreferences")
      .lean()
    const prefs = user?.notificationPreferences ?? { email: true, push: true }
    res.json({ success: true, data: prefs })
  } catch (error) {
    console.error("getNotificationPreferences error:", error)
    res.status(500).json({ success: false, message: "Error fetching notification preferences" })
  }
}

export const updateNotificationPreferences = async (req, res) => {
  try {
    const { email, push } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    if (typeof email === "boolean") user.notificationPreferences.email = email
    if (typeof push === "boolean") user.notificationPreferences.push = push
    await user.save()
    res.json({
      success: true,
      data: user.notificationPreferences,
    })
  } catch (error) {
    console.error("updateNotificationPreferences error:", error)
    res.status(500).json({ success: false, message: "Error updating notification preferences" })
  }
}

export const addPushSubscription = async (req, res) => {
  try {
    const { endpoint, keys } = req.body
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({
        success: false,
        message: "endpoint and keys.p256dh, keys.auth are required",
      })
    }
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    const existing = user.pushSubscriptions?.find((s) => s.endpoint === endpoint)
    if (existing) {
      existing.keys = { p256dh: keys.p256dh, auth: keys.auth }
      existing.createdAt = new Date()
    } else {
      user.pushSubscriptions = user.pushSubscriptions || []
      user.pushSubscriptions.push({
        endpoint,
        keys: { p256dh: keys.p256dh, auth: keys.auth },
      })
    }
    await user.save()
    res.json({ success: true, message: "Push subscription saved" })
  } catch (error) {
    console.error("addPushSubscription error:", error)
    res.status(500).json({ success: false, message: "Error saving push subscription" })
  }
}

export const removePushSubscription = async (req, res) => {
  try {
    const { endpoint } = req.body
    if (!endpoint) {
      return res.status(400).json({ success: false, message: "endpoint is required" })
    }
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    user.pushSubscriptions = (user.pushSubscriptions || []).filter((s) => s.endpoint !== endpoint)
    await user.save()
    res.json({ success: true, message: "Push subscription removed" })
  } catch (error) {
    console.error("removePushSubscription error:", error)
    res.status(500).json({ success: false, message: "Error removing push subscription" })
  }
} 