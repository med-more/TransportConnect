import { Marker } from "react-map-gl/maplibre"
import { MAP_ICONS } from "../../config/mapIcons"

/**
 * Destination (arrivée) marker - visually distinct red pin.
 * position: [lat, lng] (will be converted to lng, lat for Mapbox).
 */
export default function DestinationMarkerMapbox({ position }) {
  if (!position?.length) return null
  const [lat, lng] = position

  return (
    <Marker longitude={lng} latitude={lat} anchor="bottom" title="Arrivée (destination)">
      <img
        src={MAP_ICONS.pinEnd}
        alt="Arrivée"
        style={{
          width: 44,
          height: 52,
          objectFit: "contain",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
        }}
      />
    </Marker>
  )
}
