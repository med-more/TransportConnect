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
