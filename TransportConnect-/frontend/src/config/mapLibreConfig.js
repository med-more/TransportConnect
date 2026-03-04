/**
 * MapLibre GL tracking map configuration.
 * Free and open-source: no API key required.
 * Voyager: full street names, neighborhoods (quartiers), POIs.
 * Dark Matter: dark theme with same detail level.
 * Note: Live traffic layers require a separate provider (e.g. Google/TomTom) and are not included here.
 */
const CARTO_VOYAGER =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
const CARTO_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"

export const MAPLIBRE_STYLES = {
  day: CARTO_VOYAGER,
  night: CARTO_DARK,
}

export const TRACKING_MAP_VIEW = {
  zoom: 16,
  pitch: 45,
  minZoom: 14,
  maxZoom: 18,
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
