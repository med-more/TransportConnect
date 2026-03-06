/**
 * Route-based price estimate using OSRM (distance/duration) and configurable pricing rules.
 */

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving"

const PRICE_BASE = Number(process.env.PRICE_ESTIMATE_BASE_MAD) || 0
const PRICE_PER_KM = Number(process.env.PRICE_ESTIMATE_PER_KM_MAD) || 2
const PRICE_PER_KG = Number(process.env.PRICE_ESTIMATE_PER_KG_MAD) || 0.5

export const getRouteEstimate = async (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng, weight } = req.body
    const lat1 = Number(fromLat)
    const lng1 = Number(fromLng)
    const lat2 = Number(toLat)
    const lng2 = Number(toLng)
    if (Number.isNaN(lat1) || Number.isNaN(lng1) || Number.isNaN(lat2) || Number.isNaN(lng2)) {
      return res.status(400).json({
        message: "fromLat, fromLng, toLat, toLng are required and must be numbers",
      })
    }
    const coords = `${lng1},${lat1};${lng2},${lat2}`
    const url = `${OSRM_BASE}/${coords}?overview=full&geometries=geojson`
    const response = await fetch(url)
    const data = await response.json()
    if (data?.code !== "Ok" || !data?.routes?.[0]) {
      return res.status(400).json({
        message: "Could not compute route between these points",
      })
    }
    const route = data.routes[0]
    const distanceMeters = route.distance ?? 0
    const durationSeconds = route.duration ?? 0
    const distanceKm = Math.round((distanceMeters / 1000) * 100) / 100
    const durationMinutes = Math.round(durationSeconds / 60)
    const w = weight != null && weight > 0 ? Number(weight) : 0
    const estimatedPrice = Math.round((PRICE_BASE + PRICE_PER_KM * distanceKm + PRICE_PER_KG * w) * 100) / 100
    const geometry = route.geometry?.coordinates || null
    res.json({
      distanceKm,
      durationMinutes,
      durationSeconds,
      estimatedPrice,
      currency: "MAD",
      weight: w || undefined,
      geometry,
    })
  } catch (error) {
    console.error("getRouteEstimate error:", error)
    res.status(500).json({ message: "Erreur lors du calcul de l'estimation" })
  }
}

/**
 * Multi-stop route estimate. Body: { waypoints: [{ lat, lng }, ...], weight? }.
 * waypoints must have at least 2 points (start + end).
 */
export const getRouteEstimateMulti = async (req, res) => {
  try {
    const { waypoints = [], weight } = req.body
    if (!Array.isArray(waypoints) || waypoints.length < 2) {
      return res.status(400).json({
        message: "waypoints must be an array of at least 2 points { lat, lng }",
      })
    }
    const coords = waypoints
      .map((wp) => {
        const lat = Number(wp.lat)
        const lng = Number(wp.lng)
        if (Number.isNaN(lat) || Number.isNaN(lng)) return null
        return `${lng},${lat}`
      })
      .filter(Boolean)
    if (coords.length !== waypoints.length) {
      return res.status(400).json({
        message: "Each waypoint must have numeric lat and lng",
      })
    }
    const coordsStr = coords.join(";")
    const url = `${OSRM_BASE}/${coordsStr}?overview=full&geometries=geojson`
    const response = await fetch(url)
    const data = await response.json()
    if (data?.code !== "Ok" || !data?.routes?.[0]) {
      return res.status(400).json({
        message: "Could not compute route through these points",
      })
    }
    const route = data.routes[0]
    const distanceMeters = route.distance ?? 0
    const durationSeconds = route.duration ?? 0
    const distanceKm = Math.round((distanceMeters / 1000) * 100) / 100
    const durationMinutes = Math.round(durationSeconds / 60)
    const legs = (route.legs || []).map((leg) => ({
      distanceKm: Math.round((leg.distance / 1000) * 100) / 100,
      durationMinutes: Math.round(leg.duration / 60),
    }))
    const w = weight != null && weight > 0 ? Number(weight) : 0
    const estimatedPrice = Math.round((PRICE_BASE + PRICE_PER_KM * distanceKm + PRICE_PER_KG * w) * 100) / 100
    const geometry = route.geometry?.coordinates || null
    res.json({
      distanceKm,
      durationMinutes,
      durationSeconds,
      legs,
      estimatedPrice,
      currency: "MAD",
      weight: w || undefined,
      geometry,
    })
  } catch (error) {
    console.error("getRouteEstimateMulti error:", error)
    res.status(500).json({ message: "Erreur lors du calcul de l'estimation" })
  }
}
