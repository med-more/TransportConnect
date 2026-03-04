/**
 * Map services: OSRM routing, GeoJSON conversion.
 */

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving"

/**
 * Fetch road route between two points using OSRM (public demo server).
 * Returns route geometry as [lat, lng][] and distance/duration.
 * @param {{ lat: number, lng: number }} start
 * @param {{ lat: number, lng: number }} end
 * @returns {Promise<{ coordinates: [number,number][], distanceMeters: number, durationSeconds: number } | null>}
 */
export async function fetchRoute(start, end) {
  if (
    !start ||
    start.lat == null ||
    start.lng == null ||
    !end ||
    end.lat == null ||
    end.lng == null
  ) {
    return null
  }
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
    // OSRM GeoJSON is [lng, lat]; we normalize to [lat, lng] for consistency
    const coordinates = (route.geometry?.coordinates || []).map(([lng, lat]) => [
      lat,
      lng,
    ])
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

/** Convert [lat, lng][] to GeoJSON LineString (coordinates as [lng, lat]). */
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
