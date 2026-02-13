import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import http from "http"
import fs from "fs"

// Load environment variables FIRST, before importing any modules that use them
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, ".env") })

// Now import modules that depend on environment variables
import { connectDB } from "./config/db.js"
import passport from "./config/passport.js"
import authRoutes from "./routes/auth.route.js"
import tripsRoutes from "./routes/trips.route.js"
import usersRoutes from "./routes/users.route.js"
import requestRoutes from "./routes/requests.route.js"
import adminRoutes from "./routes/admin.route.js"
import notificationsRoutes from "./routes/notifications.route.js"

const app = express()
const PORT = process.env.PORT || 7000


const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize Passport (for Google OAuth)
app.use(passport.initialize())

// Serve uploaded files statically (for local storage fallback)
// Use absolute path to ensure it works correctly
const uploadsPath = path.join(__dirname, "uploads")
const avatarsPath = path.join(uploadsPath, "avatars")

// Ensure uploads directories exist
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
  console.log("✅ Created uploads directory:", uploadsPath)
}
if (!fs.existsSync(avatarsPath)) {
  fs.mkdirSync(avatarsPath, { recursive: true })
  console.log("✅ Created avatars directory:", avatarsPath)
}

app.use("/uploads", express.static(uploadsPath))
console.log("📁 Serving static files from:", uploadsPath)

app.use("/api/auth", authRoutes)
app.use("/api/trips", tripsRoutes)
app.use("/api/requests", requestRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/notifications", notificationsRoutes)

const server = http.createServer(app)

// Increase timeout for file uploads (30 seconds)
server.timeout = 30000
server.keepAliveTimeout = 30000
server.headersTimeout = 31000

server.listen(PORT, async () => {
  await connectDB()
  console.log(`Serveur en marche sur le port ${PORT}`)
  console.log(`⏱️  Server timeout set to ${server.timeout}ms for file uploads`)
})
