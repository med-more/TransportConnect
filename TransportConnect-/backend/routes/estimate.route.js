import express from "express"
import { getRouteEstimate, getRouteEstimateMulti } from "../controllers/estimate.controller.js"

const router = express.Router()

router.post("/route", getRouteEstimate)
router.post("/route-multi", getRouteEstimateMulti)

export default router
