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
  router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    googleCallback
  );
} else {
  // Fallback routes that redirect to login with error message if Google OAuth is not configured
  router.get("/google", (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5174"
    res.redirect(`${frontendUrl}/login?error=google_oauth_not_configured`)
  });
  router.get("/google/callback", (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5174"
    res.redirect(`${frontendUrl}/login?error=google_oauth_not_configured`)
  });
}

export default router
