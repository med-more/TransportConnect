const User = require('../models/User');
const Request = require('../models/Request');
const Announcement = require('../models/Announcement');
const logger = require('../utils/logger');


const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['firstName', 'lastName', 'phone', 'address', 'avatar'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};


const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-email -phone')
      .populate('ratings', 'rating comment from createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
};


const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let dashboardData = {
      user: req.user,
      stats: {}
    };

    if (userRole === 'conductor') {
      const announcements = await Announcement.find({ conductor: userId });
      const requests = await Request.find({ conductor: userId });

      dashboardData.stats = {
        totalAnnouncements: announcements.length,
        activeAnnouncements: announcements.filter(a => a.status === 'active').length,
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        acceptedRequests: requests.filter(r => r.status === 'accepted').length,
        completedTrips: requests.filter(r => r.status === 'delivered').length
      };
    } else if (userRole === 'sender') {
      const requests = await Request.find({ sender: userId });

      dashboardData.stats = {
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        acceptedRequests: requests.filter(r => r.status === 'accepted').length,
        inTransitRequests: requests.filter(r => r.status === 'in_transit').length,
        deliveredRequests: requests.filter(r => r.status === 'delivered').length
      };
    }

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    logger.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
};

module.exports = {
  updateProfile,
  getUserById,
  getDashboard
};