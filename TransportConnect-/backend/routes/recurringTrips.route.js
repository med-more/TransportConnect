import express from "express"
import {
  listRecurringTrips,
  getRecurringTripById,
  createRecurringTrip,
  updateRecurringTrip,
  deleteRecurringTrip,
} from "../controllers/recurringTrips.controller.js"
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js"
import { validateObjectId, validateRecurringTrip } from "../middleware/validation.js"

const router = express.Router()

router.use(authenticateToken)

// List and view: drivers see their own; shippers (expediteur) see all active recurring trips
router.get("/", authorizeRoles("conducteur", "expediteur"), listRecurringTrips)
router.get("/:id", validateObjectId("id"), authorizeRoles("conducteur", "expediteur"), getRecurringTripById)
// Create, update, delete: drivers only
router.post("/", authorizeRoles("conducteur"), validateRecurringTrip, createRecurringTrip)
router.patch("/:id", validateObjectId("id"), authorizeRoles("conducteur"), updateRecurringTrip)
router.delete("/:id", validateObjectId("id"), authorizeRoles("conducteur"), deleteRecurringTrip)

export default router
