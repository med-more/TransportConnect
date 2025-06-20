const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const createTransporter = () => {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  return transporter;
};

const sendEmail = async (to, subject, html, text = '') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createTransporter,
  sendEmail
};