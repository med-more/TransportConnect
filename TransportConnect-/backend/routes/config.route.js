import express from "express"

const router = express.Router()

router.get("/vapid-public-key", (_req, res) => {
  const key = process.env.VAPID_PUBLIC_KEY
  res.json({ vapidPublicKey: key || null })
})

export default router
