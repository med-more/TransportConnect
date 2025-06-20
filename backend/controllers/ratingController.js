const Rating = require('../models/Rating');
const Request = require('../models/Request');
const User = require('../models/User');
const logger = require('../utils/logger');

// @desc    Create rating
// @route   POST /api/ratings
// @access  Private
const createRating = async (req, res) => {
  try {
    const { requestId, rating, comment, criteria } = req.body;

    const request = await Request.findById(requestId)
      .populate('sender conductor');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed deliveries'
      });
    }

    // Determine who is being rated
    let ratedUser;
    if (request.sender._id.toString() === req.user.id) {
      ratedUser = request.conductor._id;
    } else if (request.conductor._id.toString() === req.user.id) {
      ratedUser = request.sender._id;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this request'
      });
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      from: req.user.id,
      request: requestId
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this request'
      });
    }

    const newRating = await Rating.create({
      from: req.user.id,
      to: ratedUser,
      request: requestId,
      rating,
      comment,
      criteria
    });

    await newRating.populate([
      { path: 'from', select: 'firstName lastName' },
      { path: 'to', select: 'firstName lastName' }
    ]);

    // Update user's average rating
    const user = await User.findById(ratedUser);
    await user.calculateAverageRating();

    res.status(201).json({
      success: true,
      message: 'Rating created successfully',
      data: { rating: newRating }
    });
  } catch (error) {
    logger.error('Create rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating rating'
    });
  }
};

// @desc    Get user ratings
// @route   GET /api/ratings/user/:id
// @access  Public
const getUserRatings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const ratings = await Rating.find({ to: req.params.id })
      .populate('from', 'firstName lastName')
      .populate('request', 'packageDetails.description')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Rating.countDocuments({ to: req.params.id });

    // Calculate rating statistics
    const stats = await Rating.aggregate([
      { $match: { to: mongoose.Types.ObjectId(req.params.id) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    const ratingStats = stats[0] || {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: []
    };

    // Count ratings by star
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingStats.ratingDistribution.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        ratings,
        stats: {
          ...ratingStats,
          distribution
        },
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: ratings.length,
          totalDocuments: total
        }
      }
    });
  } catch (error) {
    logger.error('Get user ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ratings'
    });
  }
};

// @desc    Get my ratings (given and received)
// @route   GET /api/ratings/my
// @access  Private
const getMyRatings = async (req, res) => {
  try {
    const { type = 'received' } = req.query;

    let filter = {};
    if (type === 'received') {
      filter.to = req.user.id;
    } else {
      filter.from = req.user.id;
    }

    const ratings = await Rating.find(filter)
      .populate('from', 'firstName lastName')
      .populate('to', 'firstName lastName')
      .populate('request', 'packageDetails.description trackingNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { ratings }
    });
  } catch (error) {
    logger.error('Get my ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ratings'
    });
  }
};

// @desc    Respond to rating
// @route   PUT /api/ratings/:id/respond
// @access  Private
const respondToRating = async (req, res) => {
  try {
    const { responseText } = req.body;

    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    if (rating.to.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this rating'
      });
    }

    rating.response = {
      text: responseText,
      date: new Date()
    };

    await rating.save();

    res.json({
      success: true,
      message: 'Response added successfully',
      data: { rating }
    });
  } catch (error) {
    logger.error('Respond to rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Error responding to rating'
    });
  }
};

module.exports = {
  createRating,
  getUserRatings,
  getMyRatings,
  respondToRating
};