import Chat from "../models/Chat.js"
import Request from "../models/Request.js"
import User from "../models/User.js"

/**
 * List conversations for the current user with last message and unread count.
 */
export const getMyConversations = async (req, res) => {
  try {
    const userId = req.user._id
    const chats = await Chat.find({ participants: userId })
      .populate("request", "status cargo pickup delivery trip")
      .populate({
        path: "request",
        populate: {
          path: "trip",
            select: "departure destination",
        },
      })
      .populate("participants", "firstName lastName avatar")
      .sort({ updatedAt: -1 })
      .lean()

    const list = chats.map((chat) => {
      const lastMsg = chat.messages?.length
        ? chat.messages[chat.messages.length - 1]
        : null
      const other = (chat.participants || []).find(
        (p) => p._id.toString() !== userId.toString()
      )
      const unreadCount = (chat.messages || []).filter(
        (m) =>
          m.sender.toString() !== userId.toString() &&
          !(m.readBy || []).some((r) => r.toString() === userId.toString())
      ).length

      return {
        _id: chat._id,
        request: chat.request,
        requestId: chat.request?._id,
        otherParticipant: other,
        isActive: chat.isActive,
        lastMessage: lastMsg
          ? {
              content: lastMsg.content,
              sender: lastMsg.sender,
              createdAt: lastMsg.createdAt,
            }
          : null,
        unreadCount,
        updatedAt: chat.updatedAt,
      }
    })

    const totalUnread = list.reduce((acc, c) => acc + (c.unreadCount || 0), 0)

    res.json({
      conversations: list,
      totalUnread,
    })
  } catch (error) {
    console.error("getMyConversations error:", error)
    res.status(500).json({ message: "Error fetching conversations" })
  }
}

/**
 * Get or create conversation for a request. User must be sender or driver of the request.
 */
export const getConversationByRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const userId = req.user._id

    const request = await Request.findById(requestId)
      .populate("sender", "firstName lastName avatar")
      .populate({
        path: "trip",
        select: "driver departure destination",
        populate: { path: "driver", select: "firstName lastName avatar" },
      })

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    const driverId = request.trip?.driver?._id || request.trip?.driver
    const senderId = request.sender?._id || request.sender
    const isParticipant =
      userId.toString() === driverId?.toString() ||
      userId.toString() === senderId?.toString()

    if (!isParticipant) {
      return res.status(403).json({ message: "Not allowed to access this conversation" })
    }

    let chat = await Chat.findOne({ request: requestId })
      .populate("participants", "firstName lastName avatar lastSeenAt")
      .lean()

    if (!chat) {
      return res.status(404).json({
        message: "Conversation not found for this request",
        requestId,
      })
    }

    const other = (chat.participants || []).find(
      (p) => p._id.toString() !== userId.toString()
    )
    if (other?._id) {
      const otherUser = await User.findById(other._id).select("lastSeenAt").lean()
      other.lastSeenAt = otherUser?.lastSeenAt ?? null
    }
    const unreadCount = (chat.messages || []).filter(
      (m) =>
        m.sender.toString() !== userId.toString() &&
        !(m.readBy || []).some((r) => r.toString() === userId.toString())
    ).length

    res.json({
      conversation: {
        _id: chat._id,
        request: requestId,
        requestDetails: request,
        otherParticipant: other,
        isActive: chat.isActive,
        messages: chat.messages || [],
        unreadCount,
      },
    })
  } catch (error) {
    console.error("getConversationByRequest error:", error)
    res.status(500).json({ message: "Error fetching conversation" })
  }
}

/**
 * Get messages for a conversation (paginated optional).
 */
export const getMessages = async (req, res) => {
  try {
    const { id: conversationId } = req.params
    const userId = req.user._id

    const chat = await Chat.findById(conversationId).lean()
    if (!chat) {
      return res.status(404).json({ message: "Conversation not found" })
    }

    const isParticipant = (chat.participants || []).some(
      (p) => p.toString() === userId.toString()
    )
    if (!isParticipant) {
      return res.status(403).json({ message: "Not allowed" })
    }

    const messages = (chat.messages || []).map((m) => ({
      ...m,
      isRead: (m.readBy || []).some((r) => r.toString() === userId.toString()),
    }))

    res.json({ messages })
  } catch (error) {
    console.error("getMessages error:", error)
    res.status(500).json({ message: "Error fetching messages" })
  }
}

/**
 * Send a message and emit via Socket.io for real-time delivery.
 */
export const sendMessage = async (req, res) => {
  try {
    const { id: conversationId } = req.params
    const { content } = req.body
    const userId = req.user._id

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ message: "Message content is required" })
    }

    const chat = await Chat.findById(conversationId)
    if (!chat) {
      return res.status(404).json({ message: "Conversation not found" })
    }

    const isParticipant = (chat.participants || []).some(
      (p) => p.toString() === userId.toString()
    )
    if (!isParticipant) {
      return res.status(403).json({ message: "Not allowed to send messages" })
    }

    if (!chat.isActive) {
      return res.status(400).json({
        message: "This conversation is closed (request already delivered)",
      })
    }

    const newMessage = {
      sender: userId,
      content: content.trim().slice(0, 2000),
      readBy: [userId],
    }
    chat.messages.push(newMessage)
    await chat.save()

    await User.findByIdAndUpdate(userId, { lastSeenAt: new Date() })

    const populated = await Chat.findById(conversationId)
      .populate("messages.sender", "firstName lastName avatar")
      .lean()
    const lastMsg = populated.messages[populated.messages.length - 1]
    const messagePayload = {
      _id: lastMsg._id,
      sender: lastMsg.sender,
      content: lastMsg.content,
      readBy: lastMsg.readBy || [],
      createdAt: lastMsg.createdAt,
    }

    const io = req.app.get("io")
    if (io) {
      io.to(`conv_${conversationId}`).emit("new_message", messagePayload)
    }

    res.status(201).json({ message: messagePayload })
  } catch (error) {
    console.error("sendMessage error:", error)
    res.status(500).json({ message: "Error sending message" })
  }
}

const ALLOWED_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "👏", "😊"]

/**
 * Toggle reaction on a message (Telegram-style).
 */
export const reactToMessage = async (req, res) => {
  try {
    const { id: conversationId, messageId } = req.params
    const { emoji } = req.body
    const userId = req.user._id

    if (!emoji || !ALLOWED_EMOJIS.includes(emoji)) {
      return res.status(400).json({ message: "Invalid or missing emoji" })
    }

    const chat = await Chat.findById(conversationId)
    if (!chat) {
      return res.status(404).json({ message: "Conversation not found" })
    }

    const isParticipant = (chat.participants || []).some(
      (p) => p.toString() === userId.toString()
    )
    if (!isParticipant) {
      return res.status(403).json({ message: "Not allowed" })
    }

    const message = chat.messages.id(messageId)
    if (!message) {
      return res.status(404).json({ message: "Message not found" })
    }

    if (!message.reactions) message.reactions = []
    let reaction = message.reactions.find((r) => r.emoji === emoji)
    if (!reaction) {
      reaction = { emoji, users: [] }
      message.reactions.push(reaction)
    }
    const userStr = userId.toString()
    const idx = (reaction.users || []).findIndex((u) => u.toString() === userStr)
    if (idx >= 0) {
      reaction.users.splice(idx, 1)
      if (reaction.users.length === 0) {
        message.reactions = message.reactions.filter((r) => r.emoji !== emoji)
      }
    } else {
      reaction.users.push(userId)
    }
    await chat.save()

    const payload = {
      messageId,
      message: {
        _id: message._id,
        reactions: message.reactions,
      },
    }
    const io = req.app.get("io")
    if (io) {
      io.to(`conv_${conversationId}`).emit("message_reaction", payload)
    }

    res.json({ messageId, reactions: message.reactions })
  } catch (error) {
    console.error("reactToMessage error:", error)
    res.status(500).json({ message: "Error updating reaction" })
  }
}

/**
 * Mark all messages in a conversation as read by the current user.
 */
export const markAsRead = async (req, res) => {
  try {
    const { id: conversationId } = req.params
    const userId = req.user._id

    const chat = await Chat.findById(conversationId)
    if (!chat) {
      return res.status(404).json({ message: "Conversation not found" })
    }

    const isParticipant = (chat.participants || []).some(
      (p) => p.toString() === userId.toString()
    )
    if (!isParticipant) {
      return res.status(403).json({ message: "Not allowed" })
    }

    for (const msg of chat.messages) {
      if (
        msg.sender.toString() !== userId.toString() &&
        !(msg.readBy || []).some((r) => r.toString() === userId.toString())
      ) {
        msg.readBy = msg.readBy || []
        msg.readBy.push(userId)
      }
    }
    await chat.save()

    res.json({ success: true })
  } catch (error) {
    console.error("markAsRead error:", error)
    res.status(500).json({ message: "Error marking as read" })
  }
}

/**
 * Get total unread count for the current user (for header badge).
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id
    const chats = await Chat.find({ participants: userId }).select("messages").lean()
    let total = 0
    for (const chat of chats) {
      for (const m of chat.messages || []) {
        if (
          m.sender.toString() !== userId.toString() &&
          !(m.readBy || []).some((r) => r.toString() === userId.toString())
        ) {
          total++
        }
      }
    }
    res.json({ totalUnread: total })
  } catch (error) {
    console.error("getUnreadCount error:", error)
    res.status(500).json({ totalUnread: 0 })
  }
}
