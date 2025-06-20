const Announcement = require('../models/Announcement');
const Request = require('../models/Request');
const logger = require('../utils/logger');

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private (Conductor only)
const createAnnouncement = async (req, res) => {
  try {
    const announcementData = {
      ...req.body,
      conductor: req.user.id
    };

    const announcement = await Announcement.create(announcementData);
    
    await announcement.populate('conductor', 'firstName lastName averageRating totalRatings');

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: { announcement }
    });
  } catch (error) {
    logger.error('Create announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating announcement'
    });
  }
};

// @desc    Get all announcements with filters
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      departure,
      destination,
      departureDate,
      maxWeight,
      cargoType,
      vehicleType,
      sortBy = 'departureDate',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };

    if (departure) {
      filter['departure.city'] = new RegExp(departure, 'i');
    }

    if (destination) {
      filter['destination.city'] = new RegExp(destination, 'i');
    }

    if (departureDate) {
      const date = new Date(departureDate);
      filter.departureDate = {
        $gte: date,
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
      };
    }

    if (maxWeight) {
      filter.maxWeight = { $gte: parseInt(maxWeight) };
    }

    if (cargoType) {
      filter.acceptedCargoTypes = { $in: [cargoType] };
    }

    if (vehicleType) {
      filter.vehicleType = vehicleType;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const announcements = await Announcement.find(filter)
      .populate('conductor', 'firstName lastName averageRating totalRatings isVerified')
      .sort(sort)
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

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('conductor', 'firstName lastName averageRating totalRatings isVerified')
      .populate({
        path: 'requests',
        populate: {
          path: 'sender',
          select: 'firstName lastName averageRating'
        }
      });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Increment views
    announcement.views += 1;
    await announcement.save();

    res.json({
      success: true,
      data: { announcement }
    });
  } catch (error) {
    logger.error('Get announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching announcement'
    });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Conductor only - own announcements)
const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check if user owns the announcement
    if (announcement.conductor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this announcement'
      });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('conductor', 'firstName lastName averageRating totalRatings');

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: { announcement: updatedAnnouncement }
    });
  } catch (error) {
    logger.error('Update announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating announcement'
    });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Conductor only - own announcements)
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check if user owns the announcement
    if (announcement.conductor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement'
      });
    }

    // Check if there are pending requests
    const pendingRequests = await Request.find({
      announcement: req.params.id,
      status: { $in: ['pending', 'accepted', 'in_transit'] }
    });

    if (pendingRequests.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete announcement with pending or active requests'
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

// @desc    Get conductor's announcements
// @route   GET /api/announcements/my
// @access  Private (Conductor only)
const getMyAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { conductor: req.user.id };
    if (status) {
      filter.status = status;
    }

    const announcements = await Announcement.find(filter)
      .populate({
        path: 'requests',
        populate: {
          path: 'sender',
          select: 'firstName lastName averageRating'
        }
      })
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
    logger.error('Get my announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching announcements'
    });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getMyAnnouncements
};