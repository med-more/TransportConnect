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

// Initialize immediately
const uploadMiddleware = initializeUpload().catch(err => {
  console.error("Failed to initialize upload middleware:", err)
  // Return a basic multer instance as fallback
  return multer({ dest: "uploads/" })
})

// Export middleware function
export default async function uploadSingle(fieldName) {
  const uploadInstance = await uploadMiddleware
  return uploadInstance.single(fieldName)
}

// For direct use in routes
export { uploadMiddleware, cloudinary }
