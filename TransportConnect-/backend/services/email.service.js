import nodemailer from "nodemailer"
import User from "../models/User.js"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

// Create reusable transporter
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const LOGO_CID = "transportconnect-logo"

const resolveEmailLogoAttachment = () => {
  try {
    const logoPath = path.resolve(__dirname, "../../frontend/src/assets/logo2.svg")
    if (!fs.existsSync(logoPath)) return null
    return {
      filename: "transportconnect-logo.svg",
      path: logoPath,
      cid: LOGO_CID,
      contentType: "image/svg+xml",
    }
  } catch {
    return null
  }
}

const buildEmailHeaderLogo = () => `
  <div style="display:flex;align-items:center;gap:10px;">
    <img src="cid:${LOGO_CID}" alt="TransportConnect" style="display:block;width:34px;height:34px;border-radius:8px;" />
    <div style="font-family:Inter,system-ui,Arial,sans-serif;font-weight:800;font-size:16px;letter-spacing:0.2px;color:#f9fafb;">
      TransportConnect
    </div>
  </div>
`

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error("Email service is not configured: EMAIL_USER/EMAIL_PASSWORD missing")
  }
  const normalizedEmailUser = String(process.env.EMAIL_USER).trim()
  const normalizedEmailPassword = String(process.env.EMAIL_PASSWORD).replace(/\s+/g, "").trim()

  // Check if we're using Gmail or custom SMTP
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: normalizedEmailUser,
        pass: normalizedEmailPassword, // Gmail app password (normalized)
      },
    })
  }

  // Custom SMTP configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    connectionTimeout: parseInt(process.env.SMTP_CONNECTION_TIMEOUT_MS || "20000"),
    greetingTimeout: parseInt(process.env.SMTP_GREETING_TIMEOUT_MS || "15000"),
    socketTimeout: parseInt(process.env.SMTP_SOCKET_TIMEOUT_MS || "30000"),
    tls: {
      servername: process.env.SMTP_HOST || "smtp.gmail.com",
    },
    auth: {
      user: normalizedEmailUser,
      pass: normalizedEmailPassword,
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

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const CONTACT_INBOX_EMAIL = process.env.CONTACT_INBOX_EMAIL || "transportconnect.help@gmail.com"

export const sendContactAutoReplyEmail = async ({ to, name, subject, ticketId }) => {
  const normalizedTo = String(to || "").trim().toLowerCase()
  if (!normalizedTo) {
    throw new Error("Missing recipient email for contact auto-reply")
  }

  const safeName = escapeHtml(name || "there")
  const safeSubject = escapeHtml(subject || "Contact request")
  const safeTicket = escapeHtml(ticketId || "N/A")
  const transporter = createTransporter()

  const mailOptions = {
    from: `"TransportConnect Support" <${process.env.EMAIL_USER}>`,
    to: normalizedTo,
    replyTo: CONTACT_INBOX_EMAIL,
    subject: `Support request received (${safeTicket})`,
    text: `Hi ${name || "there"},

We have received your support request.
Ticket: ${ticketId || "N/A"}
Subject: ${subject || "Contact request"}
Status: In review
Estimated response: within 24 hours or less.

If needed, you can reply directly to this email.

TransportConnect Support`,
    headers: {
      "X-Auto-Response-Suppress": "OOF, AutoReply",
      AutoSubmitted: "auto-generated",
      Precedence: "bulk",
    },
    attachments: [resolveEmailLogoAttachment()].filter(Boolean),
    html: `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Contact confirmation</title>
        </head>
        <body style="margin:0;padding:0;background:#06070a;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:radial-gradient(circle at top,#111827 0%,#06070a 55%,#03040a 100%);">
            <tr>
              <td align="center" style="padding:24px 12px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;max-width:640px;">
                  <tr>
                    <td style="padding:0 0 12px 0;text-align:left;">
                      ${buildEmailHeaderLogo()}
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#0f172a;border:1px solid #1f2937;border-radius:16px;overflow:hidden;box-shadow:0 20px 45px rgba(0,0,0,0.45);">
                      <div style="height:6px;background:linear-gradient(90deg,#ef4444 0%,#dc2626 50%,#ef4444 100%);"></div>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                        <tr>
                          <td style="padding:22px 22px 8px 22px;font-family:Inter,system-ui,Arial,sans-serif;font-size:22px;font-weight:800;color:#f9fafb;">
                            Your request is in good hands
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:0 22px 12px 22px;font-family:Inter,system-ui,Arial,sans-serif;font-size:14px;line-height:1.7;color:#cbd5e1;">
                            Hi ${safeName}, thank you for contacting TransportConnect support. We have received your request successfully and assigned it to our support queue.
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:0 22px 12px 22px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#0b1220;border:1px solid #253246;border-radius:12px;">
                              <tr>
                                <td style="padding:14px;font-family:Inter,system-ui,Arial,sans-serif;font-size:13px;line-height:1.7;color:#94a3b8;">
                                  <strong style="color:#f8fafc;">Ticket:</strong> ${safeTicket}<br />
                                  <strong style="color:#f8fafc;">Subject:</strong> ${safeSubject}<br />
                                  <strong style="color:#f8fafc;">Status:</strong> In review<br />
                                  <strong style="color:#f8fafc;">Estimated response:</strong> within 24 hours or less
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:0 22px 22px 22px;font-family:Inter,system-ui,Arial,sans-serif;font-size:14px;line-height:1.7;color:#cbd5e1;">
                            A support specialist will reply by email within <strong>24 hours or less</strong>. We appreciate your trust and patience.
                          </td>
                        </tr>
                      </table>
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
  console.log("Contact auto-reply email sent:", info.messageId, "to:", normalizedTo)
  return info
}

export const sendContactAdminNotificationEmail = async ({ name, email, subject, message, ticketId }) => {
  const transporter = createTransporter()
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subject || "No subject")
  const safeTicket = escapeHtml(ticketId)
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />")

  return transporter.sendMail({
    from: `"TransportConnect Contact" <${process.env.EMAIL_USER}>`,
    to: CONTACT_INBOX_EMAIL,
    replyTo: email,
    subject: `New contact message (${safeTicket}) - ${safeSubject}`,
    html: `
      <div style="font-family:Inter,system-ui,Arial,sans-serif;max-width:700px;margin:0 auto;padding:20px;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;">
        <h2 style="margin:0 0 16px 0;color:#111827;">New Contact Message</h2>
        <p style="margin:0 0 8px 0;color:#374151;"><strong>Ticket:</strong> ${safeTicket}</p>
        <p style="margin:0 0 8px 0;color:#374151;"><strong>Name:</strong> ${safeName}</p>
        <p style="margin:0 0 8px 0;color:#374151;"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin:0 0 8px 0;color:#374151;"><strong>Subject:</strong> ${safeSubject}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
        <p style="margin:0;color:#111827;line-height:1.7;">${safeMessage}</p>
      </div>
    `,
  })
}

export const sendContactAdminReplyEmail = async ({ to, name, subject, replyMessage, ticketId }) => {
  const transporter = createTransporter()
  const safeName = escapeHtml(name || "there")
  const safeSubject = escapeHtml(subject || "Contact request")
  const safeTicket = escapeHtml(ticketId || "N/A")
  const safeReply = escapeHtml(replyMessage || "").replace(/\n/g, "<br />")
  const plainReply = String(replyMessage || "").trim()

  return transporter.sendMail({
    from: `"TransportConnect Support" <${process.env.EMAIL_USER}>`,
    to,
    replyTo: CONTACT_INBOX_EMAIL,
    subject: `Reply to your request (${safeTicket})`,
    text: `Hi ${name || "there"},

We reviewed your support request.
Ticket: ${ticketId || "N/A"}
Subject: ${subject || "Contact request"}

Support reply:
${plainReply}

If you need anything else, reply directly to this email.

TransportConnect Support`,
    attachments: [resolveEmailLogoAttachment()].filter(Boolean),
    html: `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="color-scheme" content="dark light" />
          <meta name="supported-color-schemes" content="dark light" />
        </head>
        <body style="margin:0;padding:0;background:#06070a;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:radial-gradient(circle at top,#111827 0%,#06070a 55%,#03040a 100%);">
            <tr><td align="center" style="padding:24px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;border-collapse:separate;">
                <tr><td style="padding:0 0 12px 0;">${buildEmailHeaderLogo()}</td></tr>
                <tr><td style="background:#0f172a;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
                  <div style="height:6px;background:linear-gradient(90deg,#ef4444 0%,#dc2626 50%,#ef4444 100%);"></div>
                  <div style="padding:22px;font-family:Inter,system-ui,Arial,sans-serif;">
                    <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;">TransportConnect Support</p>
                    <h2 style="margin:0 0 10px 0;color:#f8fafc;font-size:24px;line-height:1.2;">We have an update on your request</h2>
                    <p style="margin:0 0 16px 0;color:#cbd5e1;line-height:1.7;">Hi ${safeName}, our team reviewed your message and prepared the following response.</p>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#0b1220;border:1px solid #253246;border-radius:12px;">
                      <tr>
                        <td style="padding:12px 14px;font-size:12px;line-height:1.7;color:#94a3b8;font-family:Inter,system-ui,Arial,sans-serif;">
                          <strong style="color:#f8fafc;">Ticket:</strong> ${safeTicket}<br />
                          <strong style="color:#f8fafc;">Subject:</strong> ${safeSubject}<br />
                          <strong style="color:#f8fafc;">Status:</strong> Replied
                        </td>
                      </tr>
                    </table>

                    <div style="margin-top:14px;padding:16px;border:1px solid #334155;border-radius:12px;background:linear-gradient(180deg,#111827 0%,#0b1220 100%);color:#f8fafc;line-height:1.8;font-size:14px;">
                      ${safeReply}
                    </div>

                    <div style="margin-top:16px;padding:14px;border-radius:12px;background:#101828;border:1px dashed #334155;">
                      <p style="margin:0;color:#cbd5e1;line-height:1.7;font-size:13px;">
                        Need more help? Reply directly to this email and our support team will continue assisting you.
                      </p>
                    </div>
                  </div>
                </td></tr>
                <tr>
                  <td style="padding:12px 4px 0 4px;text-align:center;font-family:Inter,system-ui,Arial,sans-serif;font-size:11px;color:#64748b;">
                    © ${new Date().getFullYear()} TransportConnect · Professional logistics support
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
      </html>
    `,
  })
}
