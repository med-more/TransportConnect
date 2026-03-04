import { Marker } from "react-map-gl/maplibre"
import { MAP_ICONS } from "../../config/mapIcons"

/**
 * Start (départ) marker - green pin.
 * position: [lat, lng]
 */
export default function StartMarkerMapbox({ position }) {
  if (!position?.length) return null
  const [lat, lng] = position

  return (
    <Marker longitude={lng} latitude={lat} anchor="bottom" title="Départ">
      <img
        src={MAP_ICONS.pinStart}
        alt="Départ"
        style={{
          width: 40,
          height: 48,
          objectFit: "contain",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
        }}
      />
    </Marker>
  )
}
