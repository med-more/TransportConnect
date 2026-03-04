import { useMemo } from "react"
import { Marker } from "react-map-gl/maplibre"
import { MAP_ICONS } from "../../config/mapIcons"

/**
 * Top-view vehicle marker for Mapbox. Bearing = direction of travel (0=North, 90=East).
 * Offset so truck icon aligns with road: Flaticon cab points right (90°), so -90.
 * Position in [lng, lat] for Mapbox.
 */
const BEARING_OFFSET = -90

export default function VehicleMarkerMapbox({ position, bearing = 0 }) {
  const [lng, lat] = useMemo(() => {
    if (!position || !Array.isArray(position)) return [null, null]
    return [position[1], position[0]]
  }, [position])

  if (lng == null || lat == null) return null

  const rotation = ((bearing + BEARING_OFFSET) % 360 + 360) % 360

  return (
    <Marker longitude={lng} latitude={lat} anchor="center">
      <div
        className="vehicle-marker-mapbox"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "transform 0.2s ease-out",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
        }}
      >
        <img
          src={MAP_ICONS.vehicle}
          alt=""
          style={{
            width: 48,
            height: 48,
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>
    </Marker>
  )
}
