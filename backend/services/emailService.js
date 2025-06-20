const { sendEmail } = require('../config/email');
const logger = require('../utils/logger');

class EmailService {
  // Welcome email template
  static async sendWelcomeEmail(user) {
    const subject = 'Welcome to TransportConnect!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .button { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to TransportConnect!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName} ${user.lastName},</h2>
            <p>Thank you for joining TransportConnect, the premier logistics platform in Morocco!</p>
            <p>Your account has been successfully created as a <strong>${user.role}</strong>.</p>
            
            ${user.role === 'conductor' ? 
              '<p>As a conductor, you can now start posting your transport announcements and connect with senders who need your services.</p>' :
              '<p>As a sender, you can now browse available transport options and send requests to conductors.</p>'
            }
            
            <p>Get started by exploring the platform:</p>
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
            
            <p>If you have any questions, our support team is here to help!</p>
            
            <p>Best regards,<br>The TransportConnect Team</p>
          </div>
          <div class="footer">
            <p>TransportConnect - Connecting Morocco Through Smart Logistics</p>
            <p>This email was sent to ${user.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await sendEmail(user.email, subject, html);
  }

  // Request notification emails
  static async sendRequestNotification(request, type) {
    let subject, html, recipient;

    switch (type) {
      case 'new_request':
        recipient = request.conductor.email;
        subject = 'New Transport Request Received';
        html = this.generateNewRequestEmail(request);
        break;
      
      case 'request_accepted':
        recipient = request.sender.email;
        subject = 'Your Transport Request Has Been Accepted!';
        html = this.generateRequestAcceptedEmail(request);
        break;
      
      case 'request_rejected':
        recipient = request.sender.email;
        subject = 'Transport Request Update';
        html = this.generateRequestRejectedEmail(request);
        break;
      
      case 'pickup_confirmed':
        recipient = request.sender.email;
        subject = 'Package Picked Up - In Transit';
        html = this.generatePickupConfirmedEmail(request);
        break;
      
      case 'delivery_confirmed':
        recipient = request.sender.email;
        subject = 'Package Delivered Successfully!';
        html = this.generateDeliveryConfirmedEmail(request);
        break;
      
      default:
        throw new Error('Invalid email type');
    }

    return await sendEmail(recipient, subject, html);
  }

  static generateNewRequestEmail(request) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #28a745; }
          .button { background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚚 New Transport Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${request.conductor.firstName},</h2>
            <p>You have received a new transport request for your announcement.</p>
            
            <div class="info-box">
              <h3>Trip Details:</h3>
              <p><strong>Route:</strong> ${request.announcement.departure.city} → ${request.announcement.destination.city}</p>
              <p><strong>Departure:</strong> ${new Date(request.announcement.departureDate).toLocaleDateString()}</p>
            </div>
            
            <div class="info-box">
              <h3>Package Details:</h3>
              <p><strong>Type:</strong> ${request.packageDetails.type}</p>
              <p><strong>Weight:</strong> ${request.packageDetails.weight} kg</p>
              <p><strong>Dimensions:</strong> ${request.packageDetails.dimensions.length}×${request.packageDetails.dimensions.width}×${request.packageDetails.dimensions.height} cm</p>
              <p><strong>Description:</strong> ${request.packageDetails.description}</p>
              ${request.proposedPrice ? `<p><strong>Proposed Price:</strong> ${request.proposedPrice} MAD</p>` : ''}
            </div>
            
            <div class="info-box">
              <h3>Sender Information:</h3>
              <p><strong>Name:</strong> ${request.sender.firstName} ${request.sender.lastName}</p>
              <p><strong>Rating:</strong> ⭐ ${request.sender.averageRating || 'New user'}</p>
            </div>
            
            <p>Please review the request and respond within 24 hours:</p>
            <a href="${process.env.FRONTEND_URL}/requests/${request._id}" class="button">View Request</a>
            
            <p>Best regards,<br>The TransportConnect Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static generateRequestAcceptedEmail(request) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .success-box { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; }
          .tracking { background: #e3f2fd; padding: 15px; border-radius: 5px; text-align: center; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Request Accepted!</h1>
          </div>
          <div class="content">
            <div class="success-box">
              <h2>Great news, ${request.sender.firstName}!</h2>
              <p>Your transport request has been accepted by the conductor.</p>
            </div>
            
            <div class="info-box">
              <h3>Trip Information:</h3>
              <p><strong>Route:</strong> ${request.announcement.departure.city} → ${request.announcement.destination.city}</p>
              <p><strong>Conductor:</strong> ${request.conductor.firstName} ${request.conductor.lastName}</p>
              <p><strong>Final Price:</strong> ${request.finalPrice} MAD</p>
            </div>
            
            <div class="tracking">
              <h3>📦 Tracking Number</h3>
              <h2 style="color: #007bff; margin: 10px 0;">${request.trackingNumber}</h2>
              <p>Save this number to track your package</p>
            </div>
            
            <div class="info-box">
              <h3>Next Steps:</h3>
              <ul>
                <li>The conductor will contact you soon to arrange pickup details</li>
                <li>Prepare your package according to the agreed specifications</li>
                <li>Be available at the pickup location at the scheduled time</li>
                <li>You'll receive updates as your package moves through transit</li>
              </ul>
            </div>
            
            <p>Thank you for using TransportConnect!</p>
            
            <p>Best regards,<br>The TransportConnect Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static generateRequestRejectedEmail(request) {
    return `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #6c757d; color: white; padding: 20px; text-align: center;">
            <h1>Request Update</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h2>Hello ${request.sender.firstName},</h2>
            <p>We wanted to update you on your recent transport request.</p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p>Unfortunately, your request for transport from ${request.announcement.departure.city} to ${request.announcement.destination.city} was not accepted by the conductor.</p>
            </div>
            
            <p><strong>Don't worry!</strong> There are many other transport options available on our platform:</p>
            <ul>
              <li>Browse similar routes from other conductors</li>
              <li>Adjust your package specifications if needed</li>
              <li>Consider different dates for more options</li>
              <li>Contact our support team for assistance</li>
            </ul>
            
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/search" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
                Find New Transport Options
              </a>
            </p>
            
            <p>Keep searching for the perfect match for your transport needs!</p>
            
            <p>Best regards,<br>The TransportConnect Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static generatePickupConfirmedEmail(request) {
    return `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #fd7e14; color: white; padding: 20px; text-align: center;">
            <h1>📦 Package In Transit</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h2>Hello ${request.sender.firstName},</h2>
            
            <div style="background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p>✅ Your package has been picked up and is now in transit!</p>
            </div>
            
            <div style="background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #fd7e14;">
              <p><strong>Tracking Number:</strong> ${request.trackingNumber}</p>
              <p><strong>Pickup Time:</strong> ${new Date(request.actualPickupTime).toLocaleString()}</p>
              <p><strong>Estimated Delivery:</strong> ${request.preferredDeliveryTime ? new Date(request.preferredDeliveryTime).toLocaleDateString() : 'As scheduled'}</p>
            </div>
            
            <p>Your package is now on its way to the destination. You'll receive another notification when it's delivered.</p>
            
            <p>Thank you for using TransportConnect!</p>
            
            <p>Best regards,<br>The TransportConnect Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static generateDeliveryConfirmedEmail(request) {
    return `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #28a745; color: white; padding: 20px; text-align: center;">
            <h1>🎉 Package Delivered!</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h2>Congratulations ${request.sender.firstName}!</h2>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p>✅ Your package has been successfully delivered!</p>
            </div>
            
            <div style="background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #28a745;">
              <p><strong>Tracking Number:</strong> ${request.trackingNumber}</p>
              <p><strong>Delivery Time:</strong> ${new Date(request.actualDeliveryTime).toLocaleString()}</p>
              <p><strong>Conductor:</strong> ${request.conductor.firstName} ${request.conductor.lastName}</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3>Help Us Improve! 🌟</h3>
              <p>Please take a moment to rate your experience with the conductor. Your feedback helps maintain our high-quality service.</p>
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/requests/${request._id}/rate" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Rate This Experience
                </a>
              </p>
            </div>
            
            <p>Thank you for choosing TransportConnect for your logistics needs!</p>
            
            <p>Best regards,<br>The TransportConnect Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = EmailService;