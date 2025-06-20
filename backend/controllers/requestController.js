const Request = require('../models/Request');
const Announcement = require('../models/Announcement');
const User = require('../models/User');
const { sendEmail } = require('../config/email');
const logger = require('../utils/logger');

// @desc    Create new request
// @route   POST /api/requests
// @access  Private (Sender only)
const createRequest = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.body.announcementId)
      .populate('conductor', 'firstName lastName email');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    if (announcement.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This announcement is no longer active'
      });
    }

    // Check if sender already has a pending request for this announcement
    const existingRequest = await Request.findOne({
      sender: req.user.id,
      announcement: req.body.announcementId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request for this announcement'
      });
    }

    const requestData = {
      ...req.body,
      sender: req.user.id,
      announcement: req.body.announcementId,
      conductor: announcement.conductor._id
    };

    const request = await Request.create(requestData);
    
    // Add request to announcement
    announcement.requests.push(request._id);
    await announcement.save();

    await request.populate([
      { path: 'sender', select: 'firstName lastName email phone averageRating' },
      { path: 'conductor', select: 'firstName lastName email' },
      { path: 'announcement', select: 'title departure destination departureDate' }
    ]);

    // Send notification email to conductor
    const emailHtml = `
      <h2>New Transport Request</h2>
      <p>Hello ${announcement.conductor.firstName},</p>
      <p>You have received a new transport request for your announcement: ${announcement.title}</p>
      <p><strong>Sender:</strong> ${req.user.firstName} ${req.user.lastName}</p>
      <p><strong>Package:</strong> ${requestData.packageDetails.description}</p>
      <p><strong>Weight:</strong> ${requestData.packageDetails.weight} kg</p>
      <p>Please log in to your dashboard to view and respond to this request.</p>
    `;

    await sendEmail(
      announcement.conductor.email,
      'New Transport Request - TransportConnect',
      emailHtml
    );

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: { request }
    });
  } catch (error) {
    logger.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating request'
    });
  }
};

// @desc    Get user's requests (sender or conductor)
// @route   GET /api/requests
// @access  Private
const getRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type = 'sent' } = req.query;

    let filter = {};

    if (type === 'sent') {
      filter.sender = req.user.id;
    } else if (type === 'received') {
      filter.conductor = req.user.id;
    }

    if (status) {
      filter.status = status;
    }

    const requests = await Request.find(filter)
      .populate('sender', 'firstName lastName email phone averageRating')
      .populate('conductor', 'firstName lastName email phone averageRating')
      .populate('announcement', 'title departure destination departureDate vehicleType')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Request.countDocuments(filter);

    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: requests.length,
          totalDocuments: total
        }
      }
    });
  } catch (error) {
    logger.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching requests'
    });
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
const getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('sender', 'firstName lastName email phone averageRating')
      .populate('conductor', 'firstName lastName email phone averageRating')
      .populate('announcement', 'title departure destination departureDate vehicleType maxWeight');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is involved in this request
    if (request.sender._id.toString() !== req.user.id && 
        request.conductor._id.toString() !== req.user.id &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.json({
      success: true,
      data: { request }
    });
  } catch (error) {
    logger.error('Get request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching request'
    });
  }
};

// @desc    Accept request
// @route   PUT /api/requests/:id/accept
// @access  Private (Conductor only)
const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('sender', 'firstName lastName email')
      .populate('announcement', 'title departure destination');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.conductor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this request'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request is not in pending status'
      });
    }

    // Update request status
    request.status = 'accepted';
    request.finalPrice = req.body.finalPrice || request.proposedPrice;
    await request.save();

    // Send notification email to sender
    const emailHtml = `
      <h2>Request Accepted!</h2>
      <p>Hello ${request.sender.firstName},</p>
      <p>Great news! Your transport request has been accepted.</p>
      <p><strong>Trip:</strong> ${request.announcement.departure.city} → ${request.announcement.destination.city}</p>
      <p><strong>Final Price:</strong> ${request.finalPrice} MAD</p>
      <p><strong>Tracking Number:</strong> ${request.trackingNumber}</p>
      <p>The conductor will contact you soon to arrange pickup details.</p>
    `;

    await sendEmail(
      request.sender.email,
      'Request Accepted - TransportConnect',
      emailHtml
    );

    res.json({
      success: true,
      message: 'Request accepted successfully',
      data: { request }
    });
  } catch (error) {
    logger.error('Accept request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting request'
    });
  }
};

// @desc    Reject request
// @route   PUT /api/requests/:id/reject
// @access  Private (Conductor only)
const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('sender', 'firstName lastName email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.conductor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this request'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request is not in pending status'
      });
    }

    // Update request status
    request.status = 'rejected';
    await request.save();

    // Send notification email to sender
    const emailHtml = `
      <h2>Request Update</h2>
      <p>Hello ${request.sender.firstName},</p>
      <p>Unfortunately, your transport request has been declined.</p>
      <p>Don't worry! There are many other available trips on our platform.</p>
      <p>Keep searching for the perfect match for your transport needs.</p>
    `;

    await sendEmail(
      request.sender.email,
      'Request Update - TransportConnect',
      emailHtml
    );

    res.json({
      success: true,
      message: 'Request rejected',
      data: { request }
    });
  } catch (error) {
    logger.error('Reject request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting request'
    });
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private (Conductor only)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['in_transit', 'delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const request = await Request.findById(req.params.id)
      .populate('sender', 'firstName lastName email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.conductor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    // Update timestamps based on status
    if (status === 'in_transit' && !request.actualPickupTime) {
      request.actualPickupTime = new Date();
    }

    if (status === 'delivered') {
      request.actualDeliveryTime = new Date();
    }

    request.status = status;
    await request.save();

    // Send notification email
    let emailSubject = '';
    let emailContent = '';

    if (status === 'in_transit') {
      emailSubject = 'Package Picked Up - In Transit';
      emailContent = `
        <h2>Package In Transit</h2>
        <p>Hello ${request.sender.firstName},</p>
        <p>Your package has been picked up and is now in transit.</p>
        <p><strong>Tracking Number:</strong> ${request.trackingNumber}</p>
        <p>You'll receive another notification when it's delivered.</p>
      `;
    } else if (status === 'delivered') {
      emailSubject = 'Package Delivered Successfully';
      emailContent = `
        <h2>Package Delivered!</h2>
        <p>Hello ${request.sender.firstName},</p>
        <p>Great news! Your package has been successfully delivered.</p>
        <p><strong>Tracking Number:</strong> ${request.trackingNumber}</p>
        <p>Please consider leaving a rating for the conductor.</p>
      `;
    }

    await sendEmail(request.sender.email, emailSubject, emailContent);

    res.json({
      success: true,
      message: `Request status updated to ${status}`,
      data: { request }
    });
  } catch (error) {
    logger.error('Update request status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating request status'
    });
  }
};

// @desc    Cancel request
// @route   PUT /api/requests/:id/cancel
// @access  Private (Sender only)
const cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this request'
      });
    }

    if (!['pending', 'accepted'].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel request in current status'
      });
    }

    request.status = 'cancelled';
    await request.save();

    res.json({
      success: true,
      message: 'Request cancelled successfully',
      data: { request }
    });
  } catch (error) {
    logger.error('Cancel request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling request'
    });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequest,
  acceptRequest,
  rejectRequest,
  updateRequestStatus,
  cancelRequest
};