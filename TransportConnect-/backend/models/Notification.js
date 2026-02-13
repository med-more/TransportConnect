import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
      enum: [
        "request_created", // Shipper created a request for driver's trip
        "request_accepted", // Driver accepted a request
        "request_rejected", // Driver rejected a request
        "pickup_confirmed", // Driver confirmed pickup
        "in_transit", // Driver confirmed in transit
        "delivered", // Driver confirmed delivery
        "request_cancelled", // Shipper cancelled a request
        "trip_created", // Driver created a new trip (for shippers following)
      ],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    },
    relatedTrip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 })

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification

