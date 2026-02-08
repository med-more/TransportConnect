import User from "../models/User.js"
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail } from "../services/email.service.js";


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

// Forgot Password - Send reset email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "Email is required" 
      })
    }

    // Find user by email
    const user = await User.findOne({ email })
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')
    
    // Set token and expiration (1 hour)
    user.resetPasswordToken = resetTokenHash
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000 // 1 hour
    await user.save()

    // Send email
    const emailResult = await sendPasswordResetEmail(
      user.email,
      resetToken, // Send unhashed token to user
      user.firstName
    )

    if (!emailResult.success) {
      // If email fails, clear the token
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()
      
      return res.status(500).json({
        success: false,
        message: "Error sending email. Please try again later."
      })
    }

    res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent."
    })
  } catch (error) {
    console.error("Error in forgotPassword:", error)
    res.status(500).json({
      success: false,
      message: "Error processing password reset request"
    })
  }
}

// Reset Password - Verify token and update password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required"
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      })
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex')

    // Find user with valid token and not expired
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      })
    }

    // Update password
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    // Send success email
    await sendPasswordResetSuccessEmail(user.email, user.firstName)

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully"
    })
  } catch (error) {
    console.error("Error in resetPassword:", error)
    res.status(500).json({
      success: false,
      message: "Error resetting password"
    })
  }
}
