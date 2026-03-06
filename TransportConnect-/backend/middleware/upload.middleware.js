import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let upload = null
let cloudinary = null

// Initialize upload middleware
async function initializeUpload() {
  if (upload) return upload

  // Try Cloudinary first
  try {
    const { v2: cloudinaryV2 } = await import("cloudinary")
    const { CloudinaryStorage } = await import("multer-storage-cloudinary")
    
    cloudinary = cloudinaryV2

    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      })

      const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
          folder: "transportconnect/avatars",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
          transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
        },
      })

      upload = multer({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
          file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Only image files are allowed"))
        },
      })

      console.log("✅ Cloudinary storage configured")
      return upload
    }
  } catch (error) {
    console.warn("⚠️  Cloudinary not available, using local storage:", error.message)
  }

  // Fallback to local storage
  const uploadsDir = path.join(__dirname, "../uploads/avatars")
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      const userId = req.user?._id?.toString() || "unknown"
      cb(null, `avatar-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`)
    },
  })

  upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Only image files are allowed"))
    },
  })

  console.log("✅ Local storage configured (uploads/avatars)")
  return upload
}

// Initialize immediately with local storage (faster, no async Cloudinary check)
const uploadsDir = path.join(__dirname, "../uploads/avatars")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Create local storage instance immediately (no async wait)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const userId = req.user?._id?.toString() || "unknown"
    cb(null, `avatar-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`)
  },
})

// Start with local storage (always available)
let uploadMiddleware = multer({
  storage: localStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Only image files are allowed"))
  },
})

console.log("✅ Local storage multer initialized immediately")

// Try to upgrade to Cloudinary in background (non-blocking)
initializeUpload()
  .then((uploadInstance) => {
    if (uploadInstance) {
      uploadMiddleware = uploadInstance
      console.log("✅ Upgraded to Cloudinary storage")
    }
  })
  .catch((err) => {
    console.warn("⚠️  Cloudinary initialization failed, using local storage:", err.message)
  })

// Export middleware function (synchronous now - no async wait)
export default function uploadSingle(fieldName) {
  // uploadMiddleware is always available (local storage at minimum)
  return uploadMiddleware.single(fieldName)
}

// POD (proof of delivery) photo upload — local folder uploads/pod
const podUploadsDir = path.join(__dirname, "../uploads/pod")
if (!fs.existsSync(podUploadsDir)) {
  fs.mkdirSync(podUploadsDir, { recursive: true })
}
const podStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, podUploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const requestId = req.params?.id || "unknown"
    cb(null, `pod-${requestId}-${uniqueSuffix}${path.extname(file.originalname) || ".jpg"}`)
  },
})
const podUpload = multer({
  storage: podStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Only image files are allowed"))
  },
})

export function uploadPodPhoto() {
  return podUpload.single("podPhoto")
}

// KYC / Document verification uploads — uploads/documents (images + PDF)
const documentsUploadsDir = path.join(__dirname, "../uploads/documents")
if (!fs.existsSync(documentsUploadsDir)) {
  fs.mkdirSync(documentsUploadsDir, { recursive: true })
}
const documentsStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, documentsUploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const userId = req.user?._id?.toString() || "unknown"
    const ext = path.extname(file.originalname) || ".bin"
    cb(null, `doc-${userId}-${uniqueSuffix}${ext}`)
  },
})
const documentsUpload = multer({
  storage: documentsStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]
    if (allowed.includes(file.mimetype)) return cb(null, true)
    cb(new Error("Only images (JPEG, PNG, WebP, GIF) and PDF are allowed"))
  },
})

export function uploadDocument() {
  return documentsUpload.single("file")
}

// For direct use in routes
export { uploadMiddleware, cloudinary }
