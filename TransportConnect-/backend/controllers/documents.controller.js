import Document from "../models/Document.js"
import User from "../models/User.js"
import path from "path"
import fs from "fs"
import { createNotification } from "../utils/notifications.js"

/**
 * Build file URL for stored document (local or full URL).
 */
function getDocumentFileUrl(req, filename) {
  if (!filename) return null
  if (filename.startsWith("http")) return filename
  const protocol = req.protocol || "http"
  const host = req.get("host") || `localhost:${process.env.PORT || 7000}`
  return `${protocol}://${host}/uploads/documents/${path.basename(filename)}`
}

/**
 * POST /api/documents — Driver uploads a document (auth, role conducteur).
 * Body (multipart): file, type (license|insurance|registration|id_card|other), optional expiryDate.
 */
export const createDocument = async (req, res) => {
  try {
    if (!req.file || !req.file.filename) {
      return res.status(400).json({ message: "No file uploaded" })
    }
    const { type, expiryDate } = req.body
    const allowedTypes = ["license", "insurance", "registration", "id_card", "other"]
    if (!type || !allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid document type. Use: license, insurance, registration, id_card, other" })
    }

    const fileUrl = getDocumentFileUrl(req, req.file.filename) || `/uploads/documents/${req.file.filename}`

    const doc = new Document({
      user: req.user._id,
      type,
      fileUrl,
      originalName: req.file.originalname || "",
      status: "pending",
      ...(expiryDate && { expiryDate: new Date(expiryDate) }),
    })
    await doc.save()
    const populated = await Document.findById(doc._id).populate("user", "firstName lastName email")
    const u = populated?.user
    const driverName = u ? String((u.firstName || "") + " " + (u.lastName || "")).trim() || "A driver" : "A driver"
    const docTypeLabel = String(type).replace("_", " ")
    try {
      const admins = await User.find({ role: "admin" }).select("_id").lean()
      const io = req.app.get("io")
      for (const admin of admins) {
        const notification = await createNotification({
          recipientId: admin._id,
          senderId: req.user._id,
          type: "document_submitted",
          title: "New document submitted",
          message: `${driverName} submitted a ${docTypeLabel} document for review.`,
          link: "/admin/documents",
        })
        if (io && notification) {
          const payload = notification.toObject ? notification.toObject() : notification
          io.to(`user_${admin._id}`).emit("new_notification", payload)
        }
      }
    } catch (notifErr) {
      console.error("Document submit notification error:", notifErr)
    }
    res.status(201).json({ document: populated })
  } catch (error) {
    console.error("Create document:", error)
    res.status(500).json({ message: "Erreur lors de l'upload du document" })
  }
}

/**
 * GET /api/documents — User: own documents; Admin: all with optional ?status=pending&userId=...
 */
export const listDocuments = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin"
    const { status, userId } = req.query

    let query = {}
    if (isAdmin) {
      if (userId) query.user = userId
      if (status && ["pending", "approved", "rejected"].includes(status)) query.status = status
    } else {
      query.user = req.user._id
    }

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email")
      .populate("reviewedBy", "firstName lastName")

    res.json({ documents })
  } catch (error) {
    console.error("List documents:", error)
    res.status(500).json({ message: "Erreur lors de la récupération des documents" })
  }
}

/**
 * GET /api/documents/:id/file — Stream document file (owner or admin). Works behind same-origin deploy (e.g. Vercel).
 */
export const getDocumentFile = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).select("fileUrl user")
    if (!doc) return res.status(404).json({ message: "Document non trouvé" })
    const ownerId = doc.user?.toString?.() || doc.user?.toString?.()
    const isOwner = ownerId === req.user._id.toString()
    const isAdmin = req.user.role === "admin"
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Non autorisé" })

    const fileUrl = doc.fileUrl
    if (!fileUrl) return res.status(404).json({ message: "No file for this document" })

    if (fileUrl.startsWith("http")) {
      return res.redirect(302, fileUrl)
    }

    const filename = path.basename(fileUrl)
    const documentsDir = path.join(__dirname, "../uploads/documents")
    const filePath = path.join(documentsDir, filename)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" })
    }
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`)
    return res.sendFile(path.resolve(filePath))
  } catch (error) {
    console.error("Get document file:", error)
    res.status(500).json({ message: "Erreur lors de la récupération du fichier" })
  }
}

/**
 * GET /api/documents/:id — Get one document (owner or admin).
 */
export const getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("reviewedBy", "firstName lastName")
    if (!doc) return res.status(404).json({ message: "Document non trouvé" })
    const ownerId = doc.user?._id?.toString() || doc.user?.toString()
    const isOwner = ownerId === req.user._id.toString()
    const isAdmin = req.user.role === "admin"
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Non autorisé" })
    res.json({ document: doc })
  } catch (error) {
    console.error("Get document:", error)
    res.status(500).json({ message: "Erreur lors de la récupération du document" })
  }
}

/**
 * PATCH /api/documents/:id — Admin: approve or reject with optional rejectionReason.
 */
export const updateDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: "Document non trouvé" })

    const { status, rejectionReason } = req.body
    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be 'approved' or 'rejected'" })
    }

    doc.status = status
    doc.reviewedBy = req.user._id
    doc.reviewedAt = new Date()
    doc.rejectionReason = status === "rejected" ? (rejectionReason || null) : null
    await doc.save()

    const driverId = doc.user?.toString?.() || doc.user
    const docTypeLabel = (doc.type || "").replace("_", " ")
    try {
      const notification = await createNotification({
        recipientId: driverId,
        senderId: req.user._id,
        type: "document_reviewed",
        title: status === "approved" ? "Document approved" : "Document rejected",
        message:
          status === "approved"
            ? `Your ${docTypeLabel} document has been approved.`
            : `Your ${docTypeLabel} document was rejected.${rejectionReason ? ` Reason: ${rejectionReason}` : ""}`,
        link: "/profile",
      })
      const io = req.app.get("io")
      if (io && notification) {
        const payload = notification.toObject ? notification.toObject() : notification
        io.to(`user_${driverId}`).emit("new_notification", payload)
      }
    } catch (notifErr) {
      console.error("Document review notification error:", notifErr)
    }

    const populated = await Document.findById(doc._id)
      .populate("user", "firstName lastName email")
      .populate("reviewedBy", "firstName lastName")
    res.json({ document: populated })
  } catch (error) {
    console.error("Update document:", error)
    res.status(500).json({ message: "Erreur lors de la mise à jour du document" })
  }
}

/**
 * DELETE /api/documents/:id — User deletes own document (optional, e.g. to re-upload).
 */
export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: "Document non trouvé" })
    if (doc.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" })
    }
    await Document.findByIdAndDelete(req.params.id)
    res.json({ message: "Document supprimé" })
  } catch (error) {
    console.error("Delete document:", error)
    res.status(500).json({ message: "Erreur lors de la suppression du document" })
  }
}
