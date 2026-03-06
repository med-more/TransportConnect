import express from "express"
import {
  createDocument,
  listDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "../controllers/documents.controller.js"
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js"
import { validateObjectId } from "../middleware/validation.js"
import { uploadDocument } from "../middleware/upload.middleware.js"

const router = express.Router()

router.use(authenticateToken)

// Driver: upload document
router.post(
  "/",
  authorizeRoles("conducteur"),
  uploadDocument(),
  createDocument
)

// User: list own; Admin: list all (optional ?status=pending&userId=...)
router.get("/", listDocuments)

// Get one (owner or admin)
router.get("/:id", validateObjectId("id"), getDocumentById)

// Admin: approve/reject
router.patch(
  "/:id",
  validateObjectId("id"),
  authorizeRoles("admin"),
  updateDocument
)

// User: delete own document
router.delete("/:id", validateObjectId("id"), deleteDocument)

export default router
