import User from "../models/User.js"
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendPasswordResetEmail } from "../services/email.service.js";


const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  })
}

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role, vehicleInfo } = req.body

   
    if (!firstName || !lastName || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

   
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" })
    }

   
    const userData = {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
    }

    if (role === "conducteur" && vehicleInfo) {
      userData.vehicleInfo = vehicleInfo
    }

    const user = new User(userData)
    await user.save()

 
    const token = generateToken(user._id)

    res.status(201).json({
      message: "Inscription réussie",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
      },
    })
  } catch (error) {
    console.error("Erreur inscription:", error)
    res.status(500).json({ message: "Erreur lors de l'inscription" })
  }
}
 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if this is an admin login from .env credentials
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Debug logging (remove in production)
    console.log("Login attempt:", { 
      email: email?.toLowerCase().trim(), 
      adminEmailConfigured: !!adminEmail,
      adminPasswordConfigured: !!adminPassword 
    });

    if (adminEmail && adminPassword && email?.toLowerCase().trim() === adminEmail.toLowerCase().trim()) {
      console.log("Admin login attempt detected");
      // Try to find existing admin user
      let adminUser = await User.findOne({ email: adminEmail.toLowerCase().trim(), role: "admin" }).select("+password");
      
      if (adminUser) {
        // Admin user exists - verify password using comparePassword
        const isPasswordValid = await adminUser.comparePassword(password);
        if (!isPasswordValid) {
          // Also check if password matches plain text from .env (fallback for password reset)
          if (password !== adminPassword) {
            return res.status(401).json({ msg: "Email ou mot de passe incorrect" });
          }
          // If plain text matches .env, update the password in DB (password might have been changed)
          adminUser.password = adminPassword; // Will be hashed on save
          await adminUser.save();
          console.log("Admin password updated from .env");
        }
      } else {
        // Admin user doesn't exist - check if password matches .env
        if (password === adminPassword) {
          // Create admin user
          adminUser = new User({
            firstName: process.env.ADMIN_FIRST_NAME || "Admin",
            lastName: process.env.ADMIN_LAST_NAME || "User",
            email: adminEmail.toLowerCase().trim(),
            password: adminPassword, // Will be hashed by User model pre-save hook
            role: "admin",
            phone: process.env.ADMIN_PHONE || "",
            isVerified: true,
            isActive: true,
          });
          await adminUser.save();
          console.log("Admin user created from .env credentials");
        } else {
          return res.status(401).json({ msg: "Email ou mot de passe incorrect" });
        }
      }

      // Check if admin user is active
      if (!adminUser.isActive) {
        return res.status(403).json({ msg: "Votre compte a été suspendu" });
      }

      // Update last login
      adminUser.lastLogin = new Date();
      await adminUser.save();

      // Generate token for admin
      const token = generateToken(adminUser._id);

      return res.status(200).json({
        msg: "Connexion réussie",
        token,
        user: {
          id: adminUser._id,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          email: adminUser.email,
          role: adminUser.role,
          isVerified: adminUser.isVerified,
          stats: adminUser.stats,
          avatar: adminUser.avatar,
          phone: adminUser.phone,
          address: adminUser.address,
        },
      });
    }

    // Regular user login
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ msg: "Email ou mot de passe incorrect" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Email ou mot de passe incorrect" });
    }

    if (!user.isActive) {
      return res.status(403).json({ msg: "Votre compte a été suspendu" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id); 

    res.status(200).json({
      msg: "Connexion réussie",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        stats: user.stats,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
      },
    });

  } catch (error) {
    console.error("Erreur connexion:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ msg: "Erreur lors de la connexion" });
  }
};

export const getMyProfile  = async(req , res)=>{
  try {
    const user = await User.findById(req.user._id).select("-password")
    res.json({
      user :{
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        address: user.address,
        vehicleInfo: user.vehicleInfo,
        stats: user.stats,
        lastLogin: user.lastLogin,
      }
    })

  } catch (error) {
    console.error("Erreur récupération profil:", error)
    res.status(500).json({ message: "Erreur lors de la récupération du profil" })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        message: "If an account with that email exists, a password reset link has been sent.",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour from now

    // Save token to user
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = new Date(resetTokenExpiry)
    await user.save({ validateBeforeSave: false })

    try {
      // Send email
      await sendPasswordResetEmail(user.email, resetToken, user.firstName)
      
      res.status(200).json({
        message: "If an account with that email exists, a password reset link has been sent.",
      })
    } catch (emailError) {
      // If email fails, remove the token
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save({ validateBeforeSave: false })

      console.error("Error sending email:", emailError)
      return res.status(500).json({
        message: "Error sending email. Please try again later.",
      })
    }
  } catch (error) {
    console.error("Error in forgotPassword:", error)
    res.status(500).json({ message: "Error processing request" })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" })
    }

    // Update password
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.status(200).json({
      message: "Password has been reset successfully",
    })
  } catch (error) {
    console.error("Error in resetPassword:", error)
    res.status(500).json({ message: "Error resetting password" })
  }
}

// Google OAuth callback handler
export const googleCallback = async (req, res) => {
  try {
    const user = req.user

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5174"}/login?error=google_auth_failed`)
    }

    // Generate JWT token
    const token = generateToken(user._id)

    // Check if this is a new Google user (created in the last 2 minutes)
    // This indicates they just signed up via Google and should select their role
    const isNewUser = user.googleId && 
      user.createdAt && 
      (Date.now() - new Date(user.createdAt).getTime()) < 2 * 60 * 1000 // 2 minutes

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5174"
    
    if (isNewUser && user.role === "expediteur") {
      // New Google user - redirect to role selection
      const redirectUrl = `${frontendUrl}/auth/select-role?token=${token}&userId=${user._id}`
      res.redirect(redirectUrl)
    } else {
      // Existing user or already selected role - normal callback
      const redirectUrl = `${frontendUrl}/auth/google/callback?token=${token}&userId=${user._id}`
      res.redirect(redirectUrl)
    }
  } catch (error) {
    console.error("Error in Google OAuth callback:", error)
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5174"
    res.redirect(`${frontendUrl}/login?error=google_auth_failed`)
  }
}
