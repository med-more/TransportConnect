import nodemailer from "nodemailer"

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Check if email credentials are provided
  const emailHost = process.env.EMAIL_HOST
  const emailPort = process.env.EMAIL_PORT
  const emailUser = process.env.EMAIL_USER
  const emailPassword = process.env.EMAIL_PASSWORD

  if (!emailHost || !emailPort || !emailUser || !emailPassword) {
    console.warn("⚠️ Email credentials not configured. Email functionality will be disabled.")
    return null
  }

  return nodemailer.createTransport({
    host: emailHost,
    port: parseInt(emailPort),
    secure: emailPort === "465", // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  })
}

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, firstName) => {
  try {
    const transporter = createTransporter()
    if (!transporter) {
      console.error("Email transporter not configured")
      return { success: false, message: "Email service not configured" }
    }

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`
    const appName = process.env.APP_NAME || "TransportConnect"

    const mailOptions = {
      from: `"${appName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${appName}</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; margin-top: 0;">Hello ${firstName || "User"},</h2>
            <p style="color: #4b5563; font-size: 16px;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: #ef4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                Reset Password
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Or copy and paste this link into your browser:
            </p>
            <p style="color: #ef4444; font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">
              ${resetUrl}
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              © ${new Date().getFullYear()} ${appName}. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Hello ${firstName || "User"},
        
        We received a request to reset your password. Click the link below to create a new password:
        
        ${resetUrl}
        
        This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
        
        © ${new Date().getFullYear()} ${appName}. All rights reserved.
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Password reset email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending password reset email:", error)
    return { success: false, message: error.message }
  }
}

// Send password reset success email
export const sendPasswordResetSuccessEmail = async (email, firstName) => {
  try {
    const transporter = createTransporter()
    if (!transporter) {
      console.error("Email transporter not configured")
      return { success: false, message: "Email service not configured" }
    }

    const appName = process.env.APP_NAME || "TransportConnect"
    const loginUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/login`

    const mailOptions = {
      from: `"${appName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Successful",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Successful</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${appName}</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; margin-top: 0;">Hello ${firstName || "User"},</h2>
            <p style="color: #4b5563; font-size: 16px;">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" 
                 style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                Go to Login
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              If you didn't make this change, please contact our support team immediately.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              © ${new Date().getFullYear()} ${appName}. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Password reset success email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending password reset success email:", error)
    return { success: false, message: error.message }
  }
}

