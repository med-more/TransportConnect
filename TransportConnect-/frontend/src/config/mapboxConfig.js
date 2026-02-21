/**
 * Mapbox tracking map configuration.
 * Requires VITE_MAPBOX_ACCESS_TOKEN in .env
 */
export const MAPBOX_STYLES = {
  day: "mapbox://styles/mapbox/navigation-day-v1",
  night: "mapbox://styles/mapbox/navigation-night-v1",
}

export const TRACKING_MAP_VIEW = {
  zoom: 16,
  pitch: 45,
  minZoom: 14,
  maxZoom: 18,
}

export const ROUTE_LINE_PAINT = {
  "line-color": "#ff8200",
  "line-width": 5,
  "line-opacity": 0.92,
}
