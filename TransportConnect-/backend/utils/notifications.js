import Notification from "../models/Notification.js"

/**
 * Create a notification for a user
 * @param {Object} options - Notification options
 * @param {String} options.recipientId - ID of the user receiving the notification
 * @param {String} options.senderId - ID of the user sending the notification (optional)
 * @param {String} options.type - Type of notification
 * @param {String} options.title - Title of the notification
 * @param {String} options.message - Message content
 * @param {String} options.relatedRequestId - Related request ID (optional)
 * @param {String} options.relatedTripId - Related trip ID (optional)
 */
export const createNotification = async ({
  recipientId,
  senderId = null,
  type,
  title,
  message,
  relatedRequestId = null,
  relatedTripId = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      title,
      message,
      relatedRequest: relatedRequestId,
      relatedTrip: relatedTripId,
    })

    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

/**
 * Get notification messages based on type and context
 */
export const getNotificationMessages = (type, context = {}) => {
  const { driverName, shipperName, tripRoute, requestDescription } = context

  const messages = {
    request_created: {
      title: "New Request Received",
      message: `${shipperName || "A shipper"} created a request for your trip ${tripRoute || ""}`,
    },
    request_accepted: {
      title: "Request Accepted",
      message: `${driverName || "The driver"} accepted your request${requestDescription ? `: ${requestDescription}` : ""}`,
    },
    request_rejected: {
      title: "Request Rejected",
      message: `${driverName || "The driver"} rejected your request${requestDescription ? `: ${requestDescription}` : ""}`,
    },
    pickup_confirmed: {
      title: "Pickup Confirmed",
      message: `${driverName || "The driver"} confirmed pickup of your package`,
    },
    in_transit: {
      title: "Package In Transit",
      message: `${driverName || "The driver"} confirmed your package is now in transit`,
    },
    delivered: {
      title: "Package Delivered",
      message: `${driverName || "The driver"} confirmed delivery of your package`,
    },
    request_cancelled: {
      title: "Request Cancelled",
      message: `${shipperName || "The shipper"} cancelled their request`,
    },
  }

  return messages[type] || { title: "Notification", message: "You have a new notification" }
}

