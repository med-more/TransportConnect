import mongoose from "mongoose"

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ["new", "in_progress", "replied", "closed"],
      default: "new",
      index: true,
    },
    adminReply: {
      message: { type: String, trim: true, maxlength: 5000, default: "" },
      sentAt: { type: Date },
      sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    repliedAt: {
      type: Date,
      default: null,
    },
    metadata: {
      ipAddress: { type: String, default: "" },
      userAgent: { type: String, default: "" },
    },
  },
  { timestamps: true }
)

contactMessageSchema.index({ status: 1, createdAt: -1 })

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema)
export default ContactMessage
