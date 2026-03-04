import { routeToGeoJSONLineString } from "../../services/mapService"

const ROUTE_SOURCE_ID = "live-map-route-source"
const ROUTE_LAYER_ID = "live-map-route-layer"
const ROUTE_LINE_PAINT = {
  "line-color": "#3b82f6",
  "line-width": 5,
  "line-opacity": 0.9,
}

/**
 * Updates or adds the route line on a MapLibre map.
 * Uses OSRM-style blue line (Uber-like).
 * @param {maplibregl.Map} map
 * @param {[number, number][]} routePoints - [lat, lng][]
 */
export function updateRouteLayer(map, routePoints) {
  if (!map) return

  const geojson = routeToGeoJSONLineString(routePoints)
  if (!geojson?.geometry?.coordinates?.length) {
    removeRouteLayer(map)
    return
  }

  const source = map.getSource(ROUTE_SOURCE_ID)
  if (source) {
    source.setData(geojson)
  } else {
    map.addSource(ROUTE_SOURCE_ID, {
      type: "geojson",
      data: geojson,
    })
    map.addLayer(
      {
        id: ROUTE_LAYER_ID,
        type: "line",
        source: ROUTE_SOURCE_ID,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: ROUTE_LINE_PAINT,
      },
      getFirstSymbolLayerId(map)
    )
  }
}

/**
 * Removes the route layer and source.
 */
export function removeRouteLayer(map) {
  if (!map) return
  if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID)
  if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID)
}

function getFirstSymbolLayerId(map) {
  const layers = map.getStyle().layers
  if (!layers?.length) return undefined
  for (const layer of layers) {
    if (layer.type === "symbol") return layer.id
  }
  return undefined
}
