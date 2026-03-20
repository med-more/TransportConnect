import express from "express"
import {
  deleteAdminContactMessage,
  getAdminContactMessageById,
  getAdminContactMessages,
  replyToAdminContactMessage,
  submitContactMessage,
  updateAdminContactMessageStatus,
} from "../controllers/contact.controller.js"
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js"
import { validateContactMessage, validateContactReply } from "../middleware/validation.js"

const router = express.Router()

// Public contact form endpoint
router.post("/", validateContactMessage, submitContactMessage)

// Admin inbox endpoints
router.use("/admin", authenticateToken, authorizeRoles("admin"))
router.get("/admin/messages", getAdminContactMessages)
router.get("/admin/messages/:id", getAdminContactMessageById)
router.patch("/admin/messages/:id/status", updateAdminContactMessageStatus)
router.post("/admin/messages/:id/reply", validateContactReply, replyToAdminContactMessage)
router.delete("/admin/messages/:id", deleteAdminContactMessage)

export default router
