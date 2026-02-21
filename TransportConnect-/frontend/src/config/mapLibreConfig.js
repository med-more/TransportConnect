/**
 * MapLibre GL tracking map configuration.
 * Free and open-source: no API key required.
 * Uses MapLibre demo tiles (or optional free MapTiler/OSM styles).
 */
// Free styles (no token). MapLibre demo tiles work out of the box.
const DEMO_STYLE = "https://demotiles.maplibre.org/style.json"

export const MAPLIBRE_STYLES = {
  day: DEMO_STYLE,
  night: DEMO_STYLE,
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
