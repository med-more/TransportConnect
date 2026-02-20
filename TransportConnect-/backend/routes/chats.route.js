import express from "express"
import {
  getMyConversations,
  getConversationByRequest,
  getMessages,
  sendMessage,
  reactToMessage,
  markAsRead,
  getUnreadCount,
} from "../controllers/chats.controller.js"
import { authenticateToken } from "../middleware/auth.middleware.js"
import { validateObjectId } from "../middleware/validation.js"

const router = express.Router()

router.use(authenticateToken)

router.get("/", getMyConversations)
router.get("/unread-count", getUnreadCount)
router.get("/by-request/:requestId", validateObjectId("requestId"), getConversationByRequest)
router.get("/:id/messages", validateObjectId("id"), getMessages)
router.post("/:id/messages", validateObjectId("id"), sendMessage)
router.put("/:id/messages/:messageId/react", validateObjectId("id"), validateObjectId("messageId"), reactToMessage)
router.put("/:id/read", validateObjectId("id"), markAsRead)

export default router
