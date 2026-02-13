import Notification from "../models/Notification.js"

// Get all notifications for the current user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id
    const { limit = 50, unreadOnly = false } = req.query

    console.log(`📬 Getting notifications for user: ${userId} (type: ${typeof userId})`)

    const query = { recipient: userId }
    console.log(`📬 Query:`, JSON.stringify(query))
    if (unreadOnly === "true") {
      query.read = false
    }

    const notifications = await Notification.find(query)
      .populate("sender", "firstName lastName avatar _id")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean() // Use lean() to get plain objects - relatedRequest and relatedTrip will be ObjectIds
    
    console.log(`📬 Fetched ${notifications.length} notifications for user ${userId}`)
    if (notifications.length > 0) {
      console.log(`📬 First notification sample:`, {
        _id: notifications[0]._id,
        type: notifications[0].type,
        title: notifications[0].title,
        read: notifications[0].read,
        recipient: notifications[0].recipient,
        sender: notifications[0].sender,
      })
    }

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      read: false,
    })

    console.log(`📬 Unread count for user ${userId}:`, unreadCount)

    const response = {
      notifications,
      unreadCount,
    }
    
    console.log(`📬 Sending response with ${response.notifications.length} notifications and ${response.unreadCount} unread`)

    res.json(response)
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

    const result = await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true, readAt: new Date() }
    )

    console.log(`✅ Marked ${result.modifiedCount} notifications as read for user ${userId}`)

    res.json({ 
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    console.error("❌ Error marking all notifications as read:", error)
    console.error("❌ Error stack:", error.stack)
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

