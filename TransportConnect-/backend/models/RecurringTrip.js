import mongoose from "mongoose"

const recurringTripSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    frequency: {
      type: String,
      enum: ["weekly", "monthly"],
      required: true,
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
      required: function () {
        return this.frequency === "weekly"
      },
    },
    dayOfMonth: {
      type: Number,
      min: 1,
      max: 31,
      required: function () {
        return this.frequency === "monthly"
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    nextRunAt: {
      type: Date,
      required: true,
      index: true,
    },
    lastGeneratedAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    template: {
      departure: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        coordinates: { lat: Number, lng: Number },
      },
      destination: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        coordinates: { lat: Number, lng: Number },
      },
      availableCapacity: {
        weight: { type: Number, required: true, min: 1 },
        dimensions: { length: Number, width: Number, height: Number },
      },
      acceptedCargoTypes: [
        { type: String, enum: ["fragile", "liquide", "dangereux", "alimentaire", "electronique", "textile", "mobilier", "autre"] },
      ],
      otherCargoType: { type: String, maxlength: 200 },
      pricePerKg: { type: Number, required: true, min: 0 },
      description: { type: String, maxlength: 500 },
      departureTime: { type: String, default: "08:00" },
      durationHours: { type: Number, default: 8 },
    },
  },
  { timestamps: true }
)

recurringTripSchema.index({ driver: 1, isActive: 1 })

const RecurringTrip = mongoose.model("RecurringTrip", recurringTripSchema)
export default RecurringTrip
