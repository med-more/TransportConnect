import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/auth.route.js"
import tripsRoutes from "./routes/trips.route.js"
import usersRoutes from "./routes/users.route.js"
import http from "http"
import requestRoutes from "./routes/requests.route.js"
import adminRoutes from "./routes/admin.route.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 9090


const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())


app.use("/api/auth", authRoutes)
app.use("/api/trips", tripsRoutes)
app.use("/api/requests", requestRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/admin", adminRoutes)

const server = http.createServer(app)


server.listen(PORT, async () => {
  await connectDB()
  console.log(`Serveur en marche sur le port ${PORT}`)
})
