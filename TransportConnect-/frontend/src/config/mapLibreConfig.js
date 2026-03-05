/**
 * MapLibre GL tracking map configuration.
 * Free default: Carto Voyager (street names, quartiers, POIs). No API key required.
 * Optional: VITE_MAPTILER_API_KEY → MapTiler Streets (more detail, 3D, traffic-aware style).
 * Optional: VITE_MAP_TRAFFIC_TILES_URL → raster traffic overlay (e.g. TomTom/HERE tile URL with {z}/{x}/{y}).
 */
const CARTO_VOYAGER =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
const CARTO_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"

const MAPTILER_KEY = typeof import.meta !== "undefined" && import.meta.env?.VITE_MAPTILER_API_KEY
  ? import.meta.env.VITE_MAPTILER_API_KEY
  : ""
const MAPTILER_STREETS =
  MAPTILER_KEY
    ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`
    : null
const MAPTILER_DARK =
  MAPTILER_KEY
    ? `https://api.maptiler.com/maps/darkmatter-v2/style.json?key=${MAPTILER_KEY}`
    : null

/** Optional traffic overlay: tile URL template with {z},{x},{y} or {z}/{x}/{y} (e.g. TomTom Traffic Flow). */
export const TRAFFIC_TILES_URL =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_MAP_TRAFFIC_TILES_URL
    ? import.meta.env.VITE_MAP_TRAFFIC_TILES_URL
    : ""

export function hasTrafficLayer() {
  return Boolean(TRAFFIC_TILES_URL)
}

export function getMapStyle(theme) {
  const dark = theme === "dark"
  if (dark && MAPTILER_DARK) return MAPTILER_DARK
  if (!dark && MAPTILER_STREETS) return MAPTILER_STREETS
  return dark ? CARTO_DARK : CARTO_VOYAGER
}

export const MAPLIBRE_STYLES = {
  day: MAPTILER_STREETS || CARTO_VOYAGER,
  night: MAPTILER_DARK || CARTO_DARK,
}

export const TRACKING_MAP_VIEW = {
  zoom: 16,
  pitch: 45,
  minZoom: 8,
  maxZoom: 19,
}

/** Main route line: high-contrast orange, readable on all basemaps */
export const ROUTE_LINE_PAINT = {
  "line-color": "#ff8200",
  "line-width": 6,
  "line-opacity": 1,
}

/** Outline behind route on light basemaps — dark so orange pops */
export const ROUTE_LINE_OUTLINE_PAINT = {
  "line-color": "#1a1a1a",
  "line-width": 12,
  "line-opacity": 0.85,
}

/** Outline on dark basemaps — subtle so route stays readable */
export const ROUTE_LINE_OUTLINE_PAINT_DARK = {
  "line-color": "rgba(0,0,0,0.6)",
  "line-width": 12,
  "line-opacity": 0.9,
}
