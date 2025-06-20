const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const NotificationService = require('./notificationService');

class AuthService {
  static async createUser(userData) {
    const user = await User.create(userData);
    
    // Send welcome notification
    await NotificationService.sendWelcomeNotification(user);
    
    return user;
  }

  static async authenticateUser(email, password) {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !await user.comparePassword(password)) {
      throw new Error('Invalid credentials');
    }
    
    if (!user.isActive) {
      throw new Error('Account is suspended');
    }
    
    const token = generateToken({ id: user._id, role: user.role });
    
    return { user, token };
  }

  static async createAdminUser() {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: process.env.ADMIN_EMAIL || 'admin@transportconnect.com',
        phone: '+212600000000',
        password: process.env.ADMIN_PASSWORD || 'AdminPassword123!',
        role: 'admin',
        isVerified: true,
        isActive: true
      });
      
      console.log('Admin user created successfully');
      return adminUser;
    }
    
    return adminExists;
  }
}

module.exports = AuthService;