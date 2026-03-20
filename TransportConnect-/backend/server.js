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
import { Server as SocketServer } from "socket.io"
import authRoutes from "./routes/auth.route.js"
import tripsRoutes from "./routes/trips.route.js"
import usersRoutes from "./routes/users.route.js"
import requestRoutes from "./routes/requests.route.js"
import adminRoutes from "./routes/admin.route.js"
import notificationsRoutes from "./routes/notifications.route.js"
import chatsRoutes from "./routes/chats.route.js"
import configRoutes from "./routes/config.route.js"
import estimateRoutes from "./routes/estimate.route.js"
import recurringTripsRoutes from "./routes/recurringTrips.route.js"
import documentsRoutes from "./routes/documents.route.js"
import contactRoutes from "./routes/contact.route.js"
import { runRecurringTripsJob } from "./services/recurringTrip.service.js"

const app = express()
const PORT = process.env.PORT || 7000


const frontendOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
]
if (process.env.FRONTEND_URL) {
  frontendOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""))
}
// Allow any *.vercel.app (production + preview deployments)
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (frontendOrigins.some((allowed) => origin === allowed)) return cb(null, true)
    if (origin.endsWith(".vercel.app")) return cb(null, true)
    return cb(null, false)
  },
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
const podPath = path.join(uploadsPath, "pod")
if (!fs.existsSync(podPath)) {
  fs.mkdirSync(podPath, { recursive: true })
  console.log("✅ Created POD uploads directory:", podPath)
}
const documentsPath = path.join(uploadsPath, "documents")
if (!fs.existsSync(documentsPath)) {
  fs.mkdirSync(documentsPath, { recursive: true })
  console.log("✅ Created documents uploads directory:", documentsPath)
}

app.use("/uploads", express.static(uploadsPath))
console.log("📁 Serving static files from:", uploadsPath)

app.use("/api/auth", authRoutes)
app.use("/api/trips", tripsRoutes)
app.use("/api/requests", requestRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/notifications", notificationsRoutes)
app.use("/api/chats", chatsRoutes)
app.use("/api/config", configRoutes)
app.use("/api/estimate", estimateRoutes)
app.use("/api/recurring-trips", recurringTripsRoutes)
app.use("/api/documents", documentsRoutes)
app.use("/api/contact", contactRoutes)

app.get("/api/health", (_, res) => res.status(200).json({ ok: true }))

const server = http.createServer(app)

const io = new SocketServer(server, {
  cors: {
    origin: corsOptions.origin,
    credentials: true,
  },
})
app.set("io", io)

io.on("connection", (socket) => {
  socket.on("join_user", (userId) => {
    if (userId) socket.join(`user_${userId}`)
  })
  socket.on("join_conversation", (conversationId) => {
    if (conversationId) socket.join(`conv_${conversationId}`)
  })
  socket.on("leave_conversation", (conversationId) => {
    if (conversationId) socket.leave(`conv_${conversationId}`)
  })
})

// Increase timeout for file uploads (30 seconds)
server.timeout = 30000
server.keepAliveTimeout = 30000
server.headersTimeout = 31000

// Connect to DB first, then start accepting requests (avoids buffering timeout on Railway)
const start = async () => {
  try {
    await connectDB()
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Serveur en marche sur le port ${PORT}`)
      console.log(`⏱️  Server timeout set to ${server.timeout}ms for file uploads`)
      const runJob = () => runRecurringTripsJob().catch((err) => console.error("Recurring trips job:", err))
      setTimeout(runJob, 5000)
      setInterval(runJob, 24 * 60 * 60 * 1000)
    })
  } catch (err) {
    console.error("Failed to start server:", err)
    process.exit(1)
  }
}
start()
