import express from "express";
import { getAllUsers, toggleUserActive, getAllTrips, getAllRequests, validateVerification, getAdminStats, updateTripStatus, deleteTrip, updateRequestStatus, deleteRequest } from "../controllers/admin.controller.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Toutes les routes nécessitent d'être admin
router.use(authenticateToken);
router.use(authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.put("/users/:id/toggle-active", toggleUserActive);
router.get("/trips", getAllTrips);
router.get("/requests", getAllRequests);
router.post("/verifications/:id/validate", validateVerification);
router.get("/stats", getAdminStats);
router.patch("/trips/:id/status", updateTripStatus);
router.delete("/trips/:id", deleteTrip);
router.patch("/requests/:id/status", updateRequestStatus);
router.delete("/requests/:id", deleteRequest);

export default router; 