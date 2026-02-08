import dotenv from "dotenv"
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import User from "../models/User.js"
import jwt from "jsonwebtoken"

// Load environment variables (in case this module is imported before dotenv.config() in server.js)
dotenv.config()

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  })
}

// Debug: Check if environment variables are loaded
console.log("🔍 Checking Google OAuth configuration...")
console.log("   GOOGLE_CLIENT_ID exists:", !!process.env.GOOGLE_CLIENT_ID)
console.log("   GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET)

// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // Build full callback URL
  // If GOOGLE_CALLBACK_URL is provided, use it as-is (should be full URL)
  // Otherwise, construct it from BACKEND_URL or default to localhost
  let callbackURL = process.env.GOOGLE_CALLBACK_URL
  if (!callbackURL || !callbackURL.startsWith("http")) {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:7000"
    callbackURL = `${backendUrl}/api/auth/google/callback`
  }
  
  console.log("🔧 Google OAuth Configuration:")
  console.log("   Client ID:", process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + "...")
  console.log("   Callback URL:", callbackURL)
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL,
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user information from Google profile
        const { id, displayName, emails, photos } = profile
        const email = emails?.[0]?.value
        const name = displayName?.split(" ") || []
        const firstName = name[0] || ""
        const lastName = name.slice(1).join(" ") || ""
        
        // Get avatar - Google provides photos array with value property
        let avatar = null
        if (photos && photos.length > 0) {
          avatar = photos[0].value || photos[0] || null
        }

        console.log("🔍 Google OAuth Profile Data:")
        console.log("   Email:", email)
        console.log("   Name:", displayName)
        console.log("   Photos object:", JSON.stringify(photos, null, 2))
        console.log("   Avatar URL extracted:", avatar)

        if (!email) {
          return done(new Error("Email not provided by Google"), null)
        }

        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: id })

        if (user) {
          // User exists, update last login and avatar if needed
          user.lastLogin = new Date()
          // Always update avatar from Google if available (in case user changed their Google profile picture)
          if (avatar) {
            user.avatar = avatar
            console.log("✅ Updated existing user avatar:", avatar)
          }
          await user.save()
          console.log("✅ Existing Google user logged in:")
          console.log("   User ID:", user._id)
          console.log("   Avatar:", user.avatar)
          return done(null, user)
        }

        // Check if user exists with this email (but different auth method)
        user = await User.findOne({ email: email.toLowerCase() })

        if (user) {
          // User exists with email but no Google ID, link the accounts
          user.googleId = id
          user.lastLogin = new Date()
          // Update avatar from Google if available
          if (avatar) {
            user.avatar = avatar
            console.log("✅ Linked account and updated avatar:", avatar)
          }
          await user.save()
          console.log("✅ Linked Google account to existing user:")
          console.log("   User ID:", user._id)
          console.log("   Avatar:", user.avatar)
          return done(null, user)
        }

        // Create new user
        // For OAuth users, default role is "expediteur" (shipper)
        // Users can change their role later in profile settings if needed
        user = new User({
          googleId: id,
          email: email.toLowerCase(),
          firstName: firstName || "User",
          lastName: lastName || "Name",
          avatar: avatar, // Google profile picture
          phone: "", // Will be required later if user wants to create trips/requests
          role: "expediteur", // Default role: shipper (can be changed later by admin or in profile)
          isVerified: true, // Google accounts are considered verified
          password: undefined, // No password for OAuth users
        })

        await user.save()
        console.log("✅ New Google user created:")
        console.log("   User ID:", user._id)
        console.log("   Avatar saved:", user.avatar)
        return done(null, user)
      } catch (error) {
        console.error("Error in Google OAuth strategy:", error)
        return done(error, null)
      }
    }
  )
  )
  console.log("✅ Google OAuth strategy configured")
} else {
  console.warn("⚠️ Google OAuth credentials not found. Google login will be disabled.")
  console.warn("   To enable Google OAuth, add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file")
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id)
})

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password")
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

export default passport

