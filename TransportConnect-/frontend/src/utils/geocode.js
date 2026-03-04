/**
 * Geocode a place name (city, address) to coordinates using Nominatim (OpenStreetMap).
 * Free, no API key. Use sparingly (max 1 req/sec).
 */
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
const NOMINATIM_REVERSE = "https://nominatim.openstreetmap.org/reverse"

const NOMINATIM_HEADERS = { "Accept-Language": "fr,en", "Accept": "application/json" }

export async function geocode(query, country = "Morocco") {
  const q = `${query}, ${country}`.trim()
  try {
    const res = await fetch(
      `${NOMINATIM_URL}?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=ma`,
      { headers: NOMINATIM_HEADERS }
    )
    const data = await res.json()
    if (data?.[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
  } catch (e) {
    console.warn("Geocode failed:", e)
  }
  return null
}

/**
 * Search places in Morocco for autocomplete. Returns up to `limit` suggestions.
 * @param {string} query - User input (min 2 chars recommended)
 * @param {number} limit - Max results (default 8)
 * @returns {Promise<Array<{ display_name: string, lat: number, lng: number, city: string, address: string }>>}
 */
export async function searchPlaces(query, limit = 8) {
  const q = (query || "").trim()
  if (q.length < 2) return []
  try {
    const res = await fetch(
      `${NOMINATIM_URL}?q=${encodeURIComponent(q)}&format=json&limit=${limit}&countrycodes=ma`,
      { headers: NOMINATIM_HEADERS }
    )
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data.map((item) => {
      const addr = item.address || {}
      const city = addr.city || addr.town || addr.village || addr.municipality || addr.state || item.display_name?.split(",")?.[0] || ""
      return {
        display_name: item.display_name || "",
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        city: city.trim() || item.display_name,
        address: item.display_name || "",
      }
    })
  } catch (e) {
    console.warn("searchPlaces failed:", e)
    return []
  }
}

/**
 * Reverse geocode: coordinates → place name (for "Ma position").
 * @param {number} lat
 * @param {number} lng
 * @returns {Promise<{ display_name: string, city: string, address: string } | null>}
 */
export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `${NOMINATIM_REVERSE}?lat=${lat}&lon=${lng}&format=json`,
      { headers: NOMINATIM_HEADERS }
    )
    const data = await res.json()
    if (!data?.address) return null
    const addr = data.address
    const city = addr.city || addr.town || addr.village || addr.municipality || addr.state || ""
    return {
      display_name: data.display_name || "",
      city: city.trim() || data.display_name,
      address: data.display_name || "",
    }
  } catch (e) {
    console.warn("reverseGeocode failed:", e)
    return null
  }
}

/** Default center for Morocco */
export const MOROCCO_CENTER = [32.0, -5.0]
