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
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="x-apple-disable-message-reformatting" />
            <meta name="color-scheme" content="light" />
            <meta name="supported-color-schemes" content="light" />
            <title>Password reset</title>
          </head>
          <body style="margin:0;padding:0;background:#f5f5f5;">
            <!-- Preheader (hidden preview text) -->
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;visibility:hidden;mso-hide:all;">
              Reset your TransportConnect password. This link expires in 1 hour.
            </div>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f5f5f5;">
              <tr>
                <td align="center" style="padding:28px 12px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;max-width:640px;">
                    <tr>
                      <td style="padding:0 0 14px 0;text-align:left;">
                        <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-weight:800;font-size:16px;letter-spacing:0.2px;color:#111827;">
                          TransportConnect
                        </div>
                      </td>
                    </tr>

                    <!-- Main card -->
                    <tr>
                      <td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(17,24,39,0.08);">
                        <!-- Top accent -->
                        <div style="height:6px;background:linear-gradient(90deg,#ef4444 0%,#dc2626 50%,#ef4444 100%);"></div>

                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                          <tr>
                            <td style="padding:26px 22px 8px 22px;">
                              <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:22px;line-height:1.25;font-weight:800;color:#111827;">
                                Reset your password
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:0 22px 18px 22px;">
                              <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;line-height:1.6;color:#4b5563;">
                                Hi ${firstName || "there"}, we received a request to reset your TransportConnect password. Click the button below to continue.
                              </div>
                            </td>
                          </tr>

                          <!-- CTA button -->
                          <tr>
                            <td align="left" style="padding:0 22px 18px 22px;">
                              <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${resetUrl}" style="height:44px;v-text-anchor:middle;width:220px;" arcsize="18%" stroke="f" fillcolor="#ef4444">
                                  <w:anchorlock/>
                                  <center style="color:#ffffff;font-family:Segoe UI,Arial,sans-serif;font-size:14px;font-weight:bold;">
                                    Reset password
                                  </center>
                                </v:roundrect>
                              <![endif]-->
                              <!--[if !mso]><!-- -->
                              <a href="${resetUrl}" style="display:inline-block;background:#ef4444;color:#ffffff;text-decoration:none;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;font-weight:700;line-height:44px;height:44px;padding:0 18px;border-radius:10px;">
                                Reset password
                              </a>
                              <!--<![endif]-->
                            </td>
                          </tr>

                          <!-- Safety + fallback link -->
                          <tr>
                            <td style="padding:0 22px 22px 22px;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f9fafb;border:1px solid #eef2f7;border-radius:12px;">
                                <tr>
                                  <td style="padding:14px 14px;">
                                    <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.6;color:#6b7280;">
                                      <strong style="color:#111827;">Link not working?</strong> Copy and paste this URL into your browser (expires in 1 hour):
                                    </div>
                                    <div style="margin-top:8px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;line-height:1.5;word-break:break-all;">
                                      <a href="${resetUrl}" style="color:#ef4444;text-decoration:underline;">${resetUrl}</a>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:0 22px 22px 22px;">
                              <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.6;color:#6b7280;">
                                If you didn’t request this, you can safely ignore this email.
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding:14px 6px 0 6px;text-align:center;">
                        <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:11px;line-height:1.6;color:#9ca3af;">
                          © ${new Date().getFullYear()} TransportConnect · Automated message, please don’t reply.
                        </div>
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
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="x-apple-disable-message-reformatting" />
            <title>${subject}</title>
          </head>
          <body style="margin:0;padding:0;background:#f5f5f5;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f5f5f5;">
              <tr>
                <td align="center" style="padding:24px 12px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;max-width:640px;">
                    <tr>
                      <td style="padding:0 0 14px 0;text-align:left;">
                        <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-weight:800;font-size:16px;letter-spacing:0.2px;color:#111827;">
                          TransportConnect
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(17,24,39,0.08);">
                        <div style="height:6px;background:linear-gradient(90deg,#ef4444 0%,#dc2626 50%,#ef4444 100%);"></div>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                          <tr>
                            <td style="padding:22px 22px 10px 22px;">
                              <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:18px;line-height:1.35;font-weight:800;color:#111827;">
                                ${subject}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:0 22px 22px 22px;">
                              <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;line-height:1.7;color:#374151;">
                                ${body.replace(/\n/g, "<br>")}
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:14px 6px 0 6px;text-align:center;">
                        <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:11px;line-height:1.6;color:#9ca3af;">
                          © ${new Date().getFullYear()} TransportConnect · Automated message, please don’t reply.
                        </div>
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
