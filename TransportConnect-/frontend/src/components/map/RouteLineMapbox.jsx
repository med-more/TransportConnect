import { useMemo } from "react"
import { Source, Layer } from "react-map-gl/maplibre"
import { routeToGeoJSONLineString } from "../../utils/route"
import {
  ROUTE_LINE_PAINT,
  ROUTE_LINE_OUTLINE_PAINT,
} from "../../config/mapLibreConfig"

/**
 * Draws the route line on the MapLibre map (inDrive-style orange).
 * Outline layer makes the route clearly visible for the driver on any basemap.
 * Optional paint overrides for theme/variant.
 */
export default function RouteLineMapbox({
  routePoints,
  paint = ROUTE_LINE_PAINT,
  outlinePaint = ROUTE_LINE_OUTLINE_PAINT,
  showOutline = true,
}) {
  const geojson = useMemo(
    () => routeToGeoJSONLineString(routePoints),
    [routePoints]
  )

  if (!geojson?.geometry?.coordinates?.length) return null

  const layout = {
    "line-cap": "round",
    "line-join": "round",
  }

  return (
    <Source id="route-line" type="geojson" data={geojson}>
      {showOutline && (
        <Layer
          id="route-line-outline"
          type="line"
          layout={layout}
          paint={outlinePaint}
        />
      )}
      <Layer
        id="route-line-layer"
        type="line"
        layout={layout}
        paint={paint}
      />
    </Source>
  )
}
