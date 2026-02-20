/**
 * Geocode a place name (city, address) to coordinates using Nominatim (OpenStreetMap).
 * Free, no API key. Use sparingly (max 1 req/sec).
 */
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

export async function geocode(query, country = "Morocco") {
  const q = `${query}, ${country}`.trim()
  try {
    const res = await fetch(
      `${NOMINATIM_URL}?q=${encodeURIComponent(q)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
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

/** Default center for Morocco */
export const MOROCCO_CENTER = [32.0, -5.0]
