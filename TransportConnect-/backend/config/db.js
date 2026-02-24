import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URL || process.env.MONGODB_URI;

export const connectDB = async () => {
  if (!mongoUri) {
    console.error("Missing MONGO_URL or MONGODB_URI in environment")
    process.exit(1)
  }
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    })
    console.log("Database connected")
  } catch (error) {
    console.error("Error connecting to database:", error.message)
    process.exit(1)
  }
}

