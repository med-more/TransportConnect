import mongoose from "mongoose"

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["license", "insurance", "registration", "id_card", "other"],
      required: true,
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
      maxlength: 500,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

documentSchema.index({ user: 1, type: 1 })
documentSchema.index({ status: 1, createdAt: -1 })

const Document = mongoose.model("Document", documentSchema)
export default Document
