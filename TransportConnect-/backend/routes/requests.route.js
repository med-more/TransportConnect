import express from "express"
import { getUserRequests, getReceivedRequests, getRequestById, createRequest, acceptRequest, rejectRequest, cancelRequest, confirmPickup, confirmDelivery, submitRating, getPriceEstimate } from "../controllers/requests.controller.js"
import { authorizeRoles, authenticateToken } from "../middleware/auth.middleware.js"
import { validateRequest, validateObjectId } from "../middleware/validation.js"
import { uploadPodPhoto } from "../middleware/upload.middleware.js"




const router = express.Router();

router.use(authenticateToken)

router.post("/estimate", getPriceEstimate)
router.get("/", getUserRequests)
router.get("/received", authorizeRoles("conducteur"), getReceivedRequests)
router.get("/:id", validateObjectId("id"), getRequestById)
router.post("/" ,authorizeRoles("expediteur"), validateRequest, createRequest)
router.put("/:id/accept", validateObjectId("id"), acceptRequest)
router.put("/:id/reject", validateObjectId("id"), rejectRequest)
router.put("/:id/cancel", validateObjectId("id"), cancelRequest)
router.put("/:id/pickup-confirm", validateObjectId("id"), confirmPickup)
router.put("/:id/delivery-confirm", validateObjectId("id"), uploadPodPhoto(), confirmDelivery)
router.post("/:id/rating", validateObjectId("id"), submitRating)



export default router