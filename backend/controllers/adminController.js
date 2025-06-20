const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Request = require('../models/Request');
const Rating = require('../models/Rating');
const logger = require('../utils/logger');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getStats = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const conductors = await User.countDocuments({ role: 'conductor' });
    const senders = await User.countDocuments({ role: 'sender' });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const activeUsers = await User.countDocuments({ isActive: true });

    // Announcement statistics
    const totalAnnouncements = await Announcement.countDocuments();
    const activeAnnouncements = await Announcement.countDocuments({ status: 'active' });
    const completedAnnouncements = await Announcement.countDocuments({ status: 'completed' });

    // Request statistics
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const acceptedRequests = await Request.countDocuments({ status: 'accepted' });
    const deliveredRequests = await Request.countDocuments({ status: 'delivered' });

    // Rating statistics
    const totalRatings = await Rating.countDocuments();
    const averageRatingResult = await Rating.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const averageRating = averageRatingResult[0]?.avgRating || 0;

    // Monthly growth data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyUsers = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyAnnouncements = await Announcement.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyRequests = await Request.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top rated users
    const topRatedUsers = await User.find({ totalRatings: { $gte: 1 } })
      .select('firstName lastName averageRating totalRatings role')
      .sort({ averageRating: -1, totalRatings: -1 })
      .limit(10);

    // Popular routes
    const popularRoutes = await Announcement.aggregate([
      {
        $group: {
          _id: {
            departure: '$departure.city',
            destination: '$destination.city'
          },
          count: { $sum: 1 },
          totalViews: { $sum: '$views' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          conductors,
          senders,
          verifiedUsers,
          activeUsers,
          totalAnnouncements,
          activeAnnouncements,
          completedAnnouncements,
          totalRequests,
          pendingRequests,
          acceptedRequests,
          deliveredRequests,
          totalRatings,
          averageRating: Math.round(averageRating * 10) / 10
        },
        growth: {
          users: monthlyUsers,
          announcements: monthlyAnnouncements,
          requests: monthlyRequests
        },
        topRatedUsers,
        popularRoutes
      }
    });
  } catch (error) {
    logger.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};

// @desc    Get all users for admin management
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;

    let filter = {};

    if (role) {
      filter.role = role;
    }

    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: users.length,
          totalDocuments: total
        }
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// @desc    Verify user
// @route   PUT /api/admin/users/:id/verify
// @access  Private (Admin only)
const verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User verified successfully',
      data: { user }
    });
  } catch (error) {
    logger.error('Verify user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying user'
    });
  }
};

// @desc    Suspend/Activate user
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin only)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify admin users'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'suspended'} successfully`,
      data: { user: { ...user.toJSON(), password: undefined } }
    });
  } catch (error) {
    logger.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status'
    });
  }
};

// @desc    Get all announcements for admin
// @route   GET /api/admin/announcements
// @access  Private (Admin only)
const getAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    let filter = {};
    if (status) {
      filter.status = status;
    }

    const announcements = await Announcement.find(filter)
      .populate('conductor', 'firstName lastName email isVerified')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments(filter);

    res.json({
      success: true,
      data: {
        announcements,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: announcements.length,
          totalDocuments: total
        }
      }
    });
  } catch (error) {
    logger.error('Get announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching announcements'
    });
  }
};

// @desc    Delete announcement (admin)
// @route   DELETE /api/admin/announcements/:id
// @access  Private (Admin only)
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check for active requests
    const activeRequests = await Request.find({
      announcement: req.params.id,
      status: { $in: ['pending', 'accepted', 'in_transit'] }
    });

    if (activeRequests.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete announcement with active requests'
      });
    }

    await announcement.deleteOne();

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    logger.error('Delete announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting announcement'
    });
  }
};

module.exports = {
  getStats,
  getUsers,
  verifyUser,
  toggleUserStatus,
  getAnnouncements,
  deleteAnnouncement
};