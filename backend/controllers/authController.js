const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { sendEmail } = require('../config/email');
const logger = require('../utils/logger');


const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role
    });

    // Generate JWT token
    const token = generateToken({ id: user._id, role: user.role });

    // Send welcome email
    const emailHtml = `
      <h1>Welcome to TransportConnect!</h1>
      <p>Hello ${firstName} ${lastName},</p>
      <p>Your account has been successfully created as a ${role}.</p>
      <p>Thank you for joining our logistics platform!</p>
    `;
    
    await sendEmail(email, 'Welcome to TransportConnect', emailHtml);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        },
        token
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user'
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is suspended. Contact support.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          averageRating: user.averageRating
        },
        token
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('ratings', 'rating comment from createdAt');

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};


const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout
};
