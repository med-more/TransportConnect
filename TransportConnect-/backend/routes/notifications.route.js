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
router.put("/:id/read", validateObjectId("id"), markAsRead)
router.put("/all/read", markAllAsRead)
router.delete("/:id", validateObjectId("id"), deleteNotification)

export default router

