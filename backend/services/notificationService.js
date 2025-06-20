const EmailService = require('./emailService');
const logger = require('../utils/logger');

class NotificationService {
  static async sendWelcomeNotification(user) {
    try {
      await EmailService.sendWelcomeEmail(user);
      logger.info(`Welcome email sent to ${user.email}`);
    } catch (error) {
      logger.error('Failed to send welcome email:', error);
    }
  }

  static async sendRequestNotification(request, type) {
    try {
      await EmailService.sendRequestNotification(request, type);
      logger.info(`${type} notification sent for request ${request._id}`);
    } catch (error) {
      logger.error(`Failed to send ${type} notification:`, error);
    }
  }

  static async notifyNewRequest(request) {
    await this.sendRequestNotification(request, 'new_request');
  }

  static async notifyRequestAccepted(request) {
    await this.sendRequestNotification(request, 'request_accepted');
  }

  static async notifyRequestRejected(request) {
    await this.sendRequestNotification(request, 'request_rejected');
  }

  static async notifyPickupConfirmed(request) {
    await this.sendRequestNotification(request, 'pickup_confirmed');
  }

  static async notifyDeliveryConfirmed(request) {
    await this.sendRequestNotification(request, 'delivery_confirmed');
  }
}

module.exports = NotificationService;