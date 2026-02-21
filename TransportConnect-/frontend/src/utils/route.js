/**
 * Fetch road route between two points using OSRM (public demo server).
 * Returns route geometry as [lat, lng][] and distance/duration.
 * No API key required. Falls back to null on failure.
 */
const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving"

export async function getRoute(start, end) {
  if (!start || start.lat == null || start.lng == null || !end || end.lat == null || end.lng == null) return null
  const [lng1, lat1] = [start.lng, start.lat]
  const [lng2, lat2] = [end.lng, end.lat]
  const coords = `${lng1},${lat1};${lng2},${lat2}`
  try {
    const res = await fetch(
      `${OSRM_BASE}/${coords}?overview=full&geometries=geojson`
    )
    const data = await res.json()
    if (data?.code !== "Ok" || !data?.routes?.[0]) return null
    const route = data.routes[0]
    // GeoJSON is [lng, lat]; Leaflet wants [lat, lng]
    const coordinates = (route.geometry?.coordinates || []).map(([lng, lat]) => [lat, lng])
    return {
      coordinates,
      distanceMeters: route.distance ?? 0,
      durationSeconds: route.duration ?? 0,
    }
  } catch (e) {
    console.warn("OSRM route failed:", e)
    return null
  }
}

/** Get [lat, lng] at progress [0, 1] along a polyline (linear interpolation). */
export function pointAlongRoute(routePoints, progress) {
  if (!routePoints?.length) return null
  const t = Math.max(0, Math.min(1, progress))
  if (t <= 0) return routePoints[0]
  if (t >= 1) return routePoints[routePoints.length - 1]
  const total = routePoints.length - 1
  const i = t * total
  const i0 = Math.floor(i)
  const i1 = Math.min(i0 + 1, routePoints.length - 1)
  const u = i - i0
  const a = routePoints[i0]
  const b = routePoints[i1]
  return [
    a[0] + (b[0] - a[0]) * u,
    a[1] + (b[1] - a[1]) * u,
  ]
}

/**
 * Bearing in degrees from point A to B (0 = North, 90 = East).
 * Used for vehicle icon rotation.
 */
export function bearingBetween(a, b) {
  if (!a || !b || (a[0] === b[0] && a[1] === b[1])) return 0
  const [lat1, lng1] = a
  const [lat2, lng2] = b
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const lat1Rad = (lat1 * Math.PI) / 180
  const lat2Rad = (lat2 * Math.PI) / 180
  const y = Math.sin(dLng) * Math.cos(lat2Rad)
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng)
  let bearing = (Math.atan2(y, x) * 180) / Math.PI
  return (bearing + 360) % 360
}

/** Convert [lat, lng][] to GeoJSON LineString for Mapbox (coordinates are [lng, lat]). */
export function routeToGeoJSONLineString(routePoints) {
  if (!routePoints?.length) return null
  const coordinates = routePoints.map(([lat, lng]) => [lng, lat])
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates,
    },
  }
}
