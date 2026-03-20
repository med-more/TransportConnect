import ContactMessage from "../models/ContactMessage.js"
import {
  sendContactAdminNotificationEmail,
  sendContactAdminReplyEmail,
  sendContactAutoReplyEmail,
} from "../services/email.service.js"

const buildTicketId = (id) => `TC-${String(id).slice(-6).toUpperCase()}`

const sendWithRetry = async (fn, attempts = 2, delayMs = 500) => {
  let lastError = null
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
  }
  throw lastError
}

export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject = "", message } = req.body
    const contact = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      metadata: {
        ipAddress: req.ip || "",
        userAgent: req.get("user-agent") || "",
      },
    })

    const ticketId = buildTicketId(contact._id)

    // Auto-reply is mandatory: if it fails, API returns error so frontend doesn't show false success.
    await sendWithRetry(
      () => sendContactAutoReplyEmail({ to: email, name, subject, ticketId }),
      2,
      700
    )

    // Admin notification is best-effort and should not block user flow.
    sendContactAdminNotificationEmail({ name, email, subject, message, ticketId }).catch((error) => {
      console.error("sendContactAdminNotificationEmail error:", error)
    })

    return res.status(201).json({
      message: "Message sent successfully. Our support team will respond soon.",
      data: {
        id: contact._id,
        ticketId,
      },
    })
  } catch (error) {
    console.error("submitContactMessage error:", error)
    return res.status(500).json({
      message:
        "We could not send the confirmation email right now. Please try again in a moment.",
    })
  }
}

export const getAdminContactMessages = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page || "1", 10))
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit || "20", 10)))
    const status = (req.query.status || "all").toString()
    const search = (req.query.search || "").toString().trim()

    const filter = {}
    if (status !== "all") filter.status = status
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ]
    }

    const [messages, total] = await Promise.all([
      ContactMessage.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("adminReply.sentBy", "firstName lastName email")
        .lean(),
      ContactMessage.countDocuments(filter),
    ])

    return res.json({
      data: {
        messages: messages.map((m) => ({
          ...m,
          ticketId: buildTicketId(m._id),
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      },
    })
  } catch (error) {
    console.error("getAdminContactMessages error:", error)
    return res.status(500).json({ message: "Failed to load contact messages." })
  }
}

export const getAdminContactMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id)
      .populate("adminReply.sentBy", "firstName lastName email")
      .lean()
    if (!message) return res.status(404).json({ message: "Message not found." })

    return res.json({
      data: {
        ...message,
        ticketId: buildTicketId(message._id),
      },
    })
  } catch (error) {
    console.error("getAdminContactMessageById error:", error)
    return res.status(500).json({ message: "Failed to load message details." })
  }
}

export const updateAdminContactMessageStatus = async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ["new", "in_progress", "replied", "closed"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed: ${validStatuses.join(", ")}` })
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean()
    if (!message) return res.status(404).json({ message: "Message not found." })

    return res.json({
      message: "Status updated successfully.",
      data: { ...message, ticketId: buildTicketId(message._id) },
    })
  } catch (error) {
    console.error("updateAdminContactMessageStatus error:", error)
    return res.status(500).json({ message: "Failed to update status." })
  }
}

export const replyToAdminContactMessage = async (req, res) => {
  try {
    const { replyMessage } = req.body
    const message = await ContactMessage.findById(req.params.id)
    if (!message) return res.status(404).json({ message: "Message not found." })

    const ticketId = buildTicketId(message._id)
    await sendContactAdminReplyEmail({
      to: message.email,
      name: message.name,
      subject: message.subject,
      replyMessage,
      ticketId,
    })

    message.status = "replied"
    message.repliedAt = new Date()
    message.adminReply = {
      message: replyMessage,
      sentAt: new Date(),
      sentBy: req.user?._id || null,
    }
    await message.save()

    const updated = await ContactMessage.findById(message._id)
      .populate("adminReply.sentBy", "firstName lastName email")
      .lean()

    return res.json({
      message: "Reply sent successfully.",
      data: { ...updated, ticketId },
    })
  } catch (error) {
    console.error("replyToAdminContactMessage error:", error)
    return res.status(500).json({ message: "Failed to send reply email." })
  }
}

export const deleteAdminContactMessage = async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id).lean()
    if (!deleted) return res.status(404).json({ message: "Message not found." })
    return res.json({ message: "Ticket deleted successfully." })
  } catch (error) {
    console.error("deleteAdminContactMessage error:", error)
    return res.status(500).json({ message: "Failed to delete ticket." })
  }
}
