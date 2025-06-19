const mongoose = require('mongoose');

const locationSchema = {
  city: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  coordinates: {
    lat: {
      type: Number,
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      min: -180,
      max: 180
    }
  }
};

const announcementSchema = new mongoose.Schema({
  conductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Conductor is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  departure: {
    type: locationSchema,
    required: [true, 'Departure location is required']
  },
  destination: {
    type: locationSchema,
    required: [true, 'Destination location is required']
  },
  intermediateStops: [locationSchema],
  departureDate: {
    type: Date,
    required: [true, 'Departure date is required'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Departure date must be in the future'
    }
  },
  arrivalDate: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date > this.departureDate;
      },
      message: 'Arrival date must be after departure date'
    }
  },
  maxDimensions: {
    length: {
      type: Number,
      required: true,
      min: [1, 'Length must be positive']
    },
    width: {
      type: Number,
      required: true,
      min: [1, 'Width must be positive']
    },
    height: {
      type: Number,
      required: true,
      min: [1, 'Height must be positive']
    }
  },
  maxWeight: {
    type: Number,
    required: [true, 'Maximum weight is required'],
    min: [1, 'Weight must be positive']
  },
  availableCapacity: {
    type: Number,
    required: [true, 'Available capacity is required'],
    min: [1, 'Capacity must be positive']
  },
  acceptedCargoTypes: [{
    type: String,
    enum: ['fragile', 'electronics', 'furniture', 'clothing', 'food', 'books', 'automotive', 'other']
  }],
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  priceType: {
    type: String,
    enum: ['fixed', 'negotiable', 'per_kg'],
    default: 'negotiable'
  },
  vehicleType: {
    type: String,
    enum: ['car', 'van', 'truck', 'motorcycle'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'full'],
    default: 'active'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  specialInstructions: {
    type: String,
    maxlength: [300, 'Special instructions cannot exceed 300 characters']
  },
  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  }],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

announcementSchema.index({ 'departure.coordinates': '2dsphere' });
announcementSchema.index({ 'destination.coordinates': '2dsphere' });

announcementSchema.index({ departureDate: 1, status: 1 });
announcementSchema.index({ 'departure.city': 'text', 'destination.city': 'text' });

module.exports = mongoose.model('Announcement', announcementSchema);