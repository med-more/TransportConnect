import { useMemo } from "react"
import { Source, Layer } from "react-map-gl/maplibre"
import { routeToGeoJSONLineString } from "../../utils/route"
import { ROUTE_LINE_PAINT } from "../../config/mapLibreConfig"

/**
 * Draws the route line on the MapLibre map (inDrive-style orange line).
 * Updates dynamically when route coordinates change.
 */
export default function RouteLineMapbox({ routePoints }) {
  const geojson = useMemo(
    () => routeToGeoJSONLineString(routePoints),
    [routePoints]
  )

  if (!geojson?.geometry?.coordinates?.length) return null

  return (
    <Source id="route-line" type="geojson" data={geojson}>
      <Layer
        id="route-line-layer"
        type="line"
        layout={{
          "line-cap": "round",
          "line-join": "round",
        }}
        paint={ROUTE_LINE_PAINT}
      />
    </Source>
  )
}
