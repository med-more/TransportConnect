import webPush from "web-push"
import User from "../models/User.js"

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY

let configured = false
if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webPush.setVapidDetails(
    "mailto:support@transportconnect.com",
    VAPID_PUBLIC,
    VAPID_PRIVATE
  )
  configured = true
} else {
  console.warn("⚠️ Web Push: VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY not set. Run: npx web-push generate-vapid-keys")
}

/**
 * Send Web Push to all subscriptions of a user (if push preference is on).
 * @param {string} recipientId - User _id
 * @param {{ title: string, body: string, url?: string }} payload
 */
export async function sendWebPush(recipientId, { title, body, url }) {
  if (!configured) return
  try {
    const user = await User.findById(recipientId)
      .select("notificationPreferences pushSubscriptions")
      .lean()
    if (!user?.notificationPreferences?.push) return
    const subs = user.pushSubscriptions || []
    if (subs.length === 0) return
    const payload = JSON.stringify({
      title: title || "TransportConnect",
      body: body || "",
      url: url || "/",
    })
    for (const sub of subs) {
      try {
        await webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
          },
          payload,
          { TTL: 60 * 60 * 24 }
        )
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription expired or invalid – could remove from user here
        }
        console.warn("Web Push send failed for one subscription:", err.message)
      }
    }
  } catch (error) {
    console.error("sendWebPush error:", error)
  }
}

export function isWebPushConfigured() {
  return configured
}
