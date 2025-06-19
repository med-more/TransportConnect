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

    const token = generateToken({ id: user._id, role: user.role });

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



module.exports = {
  register,
};