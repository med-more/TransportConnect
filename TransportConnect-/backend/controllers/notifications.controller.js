import Notification from "../models/Notification.js"

// Get all notifications for the current user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id
    const { limit = 50, unreadOnly = false } = req.query

    const query = { recipient: userId }
    if (unreadOnly === "true") {
      query.read = false
    }

    const notifications = await Notification.find(query)
      .populate("sender", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean() // Use lean() to get plain objects - relatedRequest and relatedTrip will be ObjectIds

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      read: false,
    })

    res.json({
      notifications,
      unreadCount,
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    res.status(500).json({ message: "Error fetching notifications" })
  }
}

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id
    const { id } = req.params

    const notification = await Notification.findOne({
      _id: id,
      recipient: userId,
    })

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    notification.read = true
    notification.readAt = new Date()
    await notification.save()

    res.json({ message: "Notification marked as read", notification })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    res.status(500).json({ message: "Error marking notification as read" })
  }
}

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id

    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true, readAt: new Date() }
    )

    res.json({ message: "All notifications marked as read" })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    res.status(500).json({ message: "Error marking all notifications as read" })
  }
}

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id
    const { id } = req.params

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: userId,
    })

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    res.json({ message: "Notification deleted" })
  } catch (error) {
    console.error("Error deleting notification:", error)
    res.status(500).json({ message: "Error deleting notification" })
  }
}

