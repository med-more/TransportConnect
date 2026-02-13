import express from "express"
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notifications.controller.js"
import { authenticateToken } from "../middleware/auth.middleware.js"
import { validateObjectId } from "../middleware/validation.js"

const router = express.Router()

router.use(authenticateToken)

router.get("/", getNotifications)
// IMPORTANT: Put specific routes BEFORE parameterized routes
router.put("/all/read", markAllAsRead)
router.put("/:id/read", validateObjectId("id"), markAsRead)
router.delete("/:id", validateObjectId("id"), deleteNotification)

export default router

