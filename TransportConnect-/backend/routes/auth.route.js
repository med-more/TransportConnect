import express from "express"
import passport from "../config/passport.js"
import { register , login , getMyProfile, forgotPassword, resetPassword, googleCallback} from "../controllers/auth.controller.js"
import {authenticateToken} from "../middleware/auth.middleware.js"
import {validateRegister , validateLogin} from "../middleware/validation.js"

const router = express.Router()

router.post("/register",validateRegister, register);
router.post("/login" ,validateLogin, login)
router.get("/me" ,authenticateToken, getMyProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Google OAuth routes (only if configured)
const isGoogleOAuthConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET

if (isGoogleOAuthConfigured) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"
  
  router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  router.get(
    "/google/callback",
    (req, res, next) => {
      passport.authenticate("google", { session: false }, (err, user, info) => {
        if (err) {
          console.error("❌ Google OAuth authentication error:", err)
          console.error("   Error code:", err.code)
          console.error("   Error message:", err.message)
          if (err.code === 'invalid_grant') {
            console.error("⚠️  This usually means:")
            console.error("   1. The redirect URI in Google Cloud Console doesn't match the callback URL")
            console.error("   2. The authorization code has already been used or expired")
            console.error("   3. Check your Google Cloud Console -> APIs & Services -> Credentials")
            console.error("   4. Ensure the authorized redirect URI is exactly:", process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL || "http://localhost:7000"}/api/auth/google/callback`)
          }
          return res.redirect(`${frontendUrl}/login?error=google_auth_failed`)
        }
        if (!user) {
          console.error("❌ Google OAuth: No user returned")
          console.error("   Info:", info)
          return res.redirect(`${frontendUrl}/login?error=google_auth_failed`)
        }
        req.user = user
        next()
      })(req, res, next)
    },
    googleCallback
  );
} else {
  // Fallback routes that redirect to login with error message if Google OAuth is not configured
  router.get("/google", (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"
    res.redirect(`${frontendUrl}/login?error=google_oauth_not_configured`)
  });
  router.get("/google/callback", (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"
    res.redirect(`${frontendUrl}/login?error=google_oauth_not_configured`)
  });
}

export default router
