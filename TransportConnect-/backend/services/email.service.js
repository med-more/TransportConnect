import nodemailer from "nodemailer"
import User from "../models/User.js"

// Create reusable transporter
const createTransporter = () => {
  // Check if we're using Gmail or custom SMTP
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // App password for Gmail
      },
    })
  }

  // Custom SMTP configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

export const sendPasswordResetEmail = async (email, resetToken, firstName) => {
  try {
    const transporter = createTransporter()

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5174"}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: `"TransportConnect" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - TransportConnect",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">TransportConnect</h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px;">Hello ${firstName || "User"},</h2>
                        <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          We received a request to reset your password for your TransportConnect account.
                        </p>
                        <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          Click the button below to reset your password. This link will expire in 1 hour.
                        </p>
                        
                        <!-- Button -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td align="center" style="padding: 20px 0;">
                              <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; text-align: center;">Reset Password</a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                          If the button doesn't work, copy and paste this link into your browser:
                        </p>
                        <p style="margin: 10px 0 0; color: #ef4444; font-size: 14px; word-break: break-all;">
                          <a href="${resetUrl}" style="color: #ef4444; text-decoration: underline;">${resetUrl}</a>
                        </p>
                        
                        <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                          If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                        <p style="margin: 0; color: #6b7280; font-size: 12px;">
                          © ${new Date().getFullYear()} TransportConnect. All rights reserved.
                        </p>
                        <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px;">
                          This is an automated email, please do not reply.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Password reset email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending password reset email:", error)
    throw error
  }
}

/**
 * Send a notification email (e.g. request accepted, delivered, etc.)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} body - Plain or HTML body
 * @param {string} [html] - Optional HTML body (if provided, body is used as fallback)
 */
export const sendNotificationEmail = async (to, subject, body, html = null) => {
  try {
    const transporter = createTransporter()
    const mailOptions = {
      from: `"TransportConnect" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: body,
      html:
        html ||
        `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5;">
            <table role="presentation" style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:40px 20px;" align="center">
                <table role="presentation" style="max-width:600px;width:100%;background:#fff;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                  <tr><td style="padding:24px 40px;text-align:center;background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);border-radius:8px 8px 0 0;">
                    <h1 style="margin:0;color:#fff;font-size:24px;font-weight:bold;">TransportConnect</h1>
                  </td></tr>
                  <tr><td style="padding:32px 40px;">
                    <p style="margin:0;color:#374151;font-size:16px;line-height:1.6;">${body.replace(/\n/g, "<br>")}</p>
                  </td></tr>
                  <tr><td style="padding:24px 40px;background:#f9fafb;border-radius:0 0 8px 8px;text-align:center;">
                    <p style="margin:0;color:#6b7280;font-size:12px;">© ${new Date().getFullYear()} TransportConnect.</p>
                  </td></tr>
                </table>
              </td></tr>
            </table>
          </body>
        </html>
      `,
    }
    const info = await transporter.sendMail(mailOptions)
    console.log("Notification email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending notification email:", error)
    throw error
  }
}

/**
 * Send notification email only if user has email notifications enabled.
 * @param {string} userId - Recipient user _id
 * @param {string} subject - Email subject
 * @param {string} body - Plain text body
 * @param {string} [html] - Optional HTML body
 */
export const sendNotificationEmailToUser = async (userId, subject, body, html = null) => {
  try {
    const user = await User.findById(userId).select("email notificationPreferences").lean()
    if (!user?.email) return
    if (user.notificationPreferences?.email === false) return
    await sendNotificationEmail(user.email, subject, body, html)
  } catch (error) {
    console.error("Error sending notification email to user:", error)
  }
}
