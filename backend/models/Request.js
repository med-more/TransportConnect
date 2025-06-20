const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  announcement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announcement',
    required: [true, 'Announcement is required']
  },
  conductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Conductor is required']
  },
  packageDetails: {
    weight: {
      type: Number,
      required: [true, 'Package weight is required'],
      min: [0.1, 'Weight must be positive']
    },
    dimensions: {
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
    type: {
      type: String,
      required: [true, 'Package type is required'],
      enum: ['fragile', 'electronics', 'furniture', 'clothing', 'food', 'books', 'automotive', 'other']
    },
    description: {
      type: String,
      required: [true, 'Package description is required'],
      maxlength: [300, 'Description cannot exceed 300 characters']
    },
    value: {
      type: Number,
      min: [0, 'Value cannot be negative']
    },
    photos: [String]
  },
  pickupLocation: {
    city: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    contactPerson: {
      name: String,
      phone: String
    }
  },
  deliveryLocation: {
    city: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    contactPerson: {
      name: String,
      phone: String
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  proposedPrice: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  finalPrice: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  specialInstructions: {
    type: String,
    maxlength: [300, 'Special instructions cannot exceed 300 characters']
  },
  preferredPickupTime: {
    type: Date
  },
  preferredDeliveryTime: {
    type: Date
  },
  actualPickupTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  trackingNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  responseDeadline: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    }
  }
}, {
  timestamps: true
});

// Generate tracking number when request is accepted
requestSchema.pre('save', function(next) {
  if (this.status === 'accepted' && !this.trackingNumber) {
    this.trackingNumber = 'TC' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Index for efficient queries
requestSchema.index({ sender: 1, status: 1 });
requestSchema.index({ conductor: 1, status: 1 });
requestSchema.index({ announcement: 1 });
requestSchema.index({ trackingNumber: 1 });

module.exports = mongoose.model('Request', requestSchema);