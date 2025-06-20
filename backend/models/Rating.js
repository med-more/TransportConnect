const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rating from user is required']
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rating to user is required']
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: [true, 'Request reference is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating value is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  criteria: {
    punctuality: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    packageCondition: {
      type: Number,
      min: 1,
      max: 5
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  wouldRecommend: {
    type: Boolean,
    default: true
  },
  response: {
    text: {
      type: String,
      maxlength: [300, 'Response cannot exceed 300 characters']
    },
    date: Date
  }
}, {
  timestamps: true
});

// Ensure one rating per request per user
ratingSchema.index({ from: 1, request: 1 }, { unique: true });

// Update user's average rating after saving a new rating
ratingSchema.post('save', async function() {
  const User = mongoose.model('User');
  const user = await User.findById(this.to);
  if (user) {
    await user.calculateAverageRating();
  }
});

module.exports = mongoose.model('Rating', ratingSchema);