import { Source, Layer } from "react-map-gl/maplibre"
import { TRAFFIC_TILES_URL } from "../../config/mapLibreConfig"

/**
 * Optional traffic overlay: raster layer on top of the basemap.
 * Only renders when traffic tile URL is configured (VITE_MAP_TRAFFIC_TILES_URL)
 * and visible is true. URL must use {z}, {x}, {y} placeholders (e.g. TomTom/HERE).
 */
export default function TrafficOverlayMapbox({ visible = true }) {
  if (!TRAFFIC_TILES_URL || !visible) return null

  const tiles = [TRAFFIC_TILES_URL]

  return (
    <Source
      id="traffic-overlay"
      type="raster"
      tiles={tiles}
      tileSize={256}
      minzoom={0}
      maxzoom={22}
    >
      <Layer
        id="traffic-overlay-layer"
        type="raster"
        paint={{
          "raster-opacity": 0.75,
          "raster-fade-duration": 300,
        }}
      />
    </Source>
  )
}
