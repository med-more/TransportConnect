import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({

    
    firstName: {
        type: String,
        required: [true, "Le prénom est requis"],
        trim: true,
        maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"],
      },
      lastName: {
        type: String,
        required: [true, "Le nom est requis"],
        trim: true,
        maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
      },
      email: {
        type: String,
        required: [true, "L'email est requis"],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email invalide"],
        trim : true,
      },
      phone: {
        type: String,
        default: "",
        required: function() {
          // Phone not required for OAuth users or admin
          return !this.googleId && this.role !== "admin";
        },
        validate: {
          validator: function(v) {
            if (v == null || v === "") return true;
            return /^[0-9+\-\s()]+$/.test(v);
          },
          message: "Numéro de téléphone invalide",
        },
      },
      password: {
        type: String,
        required: function() {
          // Password is required only if user is not using OAuth
          return !this.googleId
        },
        minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
      },
      googleId: {
        type: String,
        default: null,
        sparse: true, // Allows multiple null values but unique when set
      },
      role: {
        type: String,
        enum: ["conducteur", "expediteur", "admin"],
        required: [true, "Le rôle est requis"],
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      avatar: {
        type: String,
        default: null,
      },
      address: {
        street: String,
        city: String,
        postalCode: String,
        country: { type: String, default: "Maroc" },
      },
      savedAddresses: {
        type: [
          {
            label: { type: String, required: true, trim: true, maxlength: [80, "Label max 80 chars"] },
            address: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
            postalCode: { type: String, default: "" },
            country: { type: String, default: "Maroc" },
            coordinates: {
              lat: { type: Number },
              lng: { type: Number },
            },
            type: { type: String, enum: ["home", "work", "other"], default: "other" },
          },
        ],
        default: [],
      },
      vehicleInfo: {
        type: {
          type: String,
          enum: ["camion", "camionnette", "voiture", "moto"],
        },
        capacity: Number,
        dimensions: {
          length: Number, 
          width: Number,
          height: Number,
        },
        licensePlate: String,
      },
      
      stats: {
        totalTrips: { type: Number, default: 0 },
        totalRequests: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
        totalRatings: { type: Number, default: 0 },
      },
      lastLogin: {
        type: Date,
        default: Date.now,
      },
      lastSeenAt: {
        type: Date,
        default: null,
      },
      resetPasswordToken: {
        type: String,
        default: null,
      },
      resetPasswordExpires: {
        type: Date,
        default: null,
      },
      notificationPreferences: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
      pushSubscriptions: {
        type: [
          {
            endpoint: { type: String, required: true },
            keys: {
              p256dh: { type: String, required: true },
              auth: { type: String, required: true },
            },
            createdAt: { type: Date, default: Date.now },
          },
        ],
        default: [],
        select: false,
      },
    },
    {
      timestamps: true,
    },
  )


  


 


   userSchema.pre("save", async function (next) {
    // Skip password hashing if password is not modified or user is using OAuth
    if (!this.isModified("password") || !this.password) return next()
  
    try {
      const salt = await bcrypt.genSalt(12)
      this.password = await bcrypt.hash(this.password, salt)
      next()
    } catch (error) {
      next(error)
    }
  })
  
  
  userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
  }
  
  
  userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`
  })
  
 

const User =    mongoose.model("User" , userSchema);
export default User ;