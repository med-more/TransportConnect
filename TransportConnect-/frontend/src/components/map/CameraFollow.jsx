import { useMap } from "react-leaflet"
import { useCameraFollow } from "../../hooks/useCameraFollow"

/**
 * Smoothly moves the map camera to follow the given position (e.g. vehicle).
 * Must be rendered inside a Leaflet MapContainer.
 */
export default function CameraFollow({ position, enabled = true }) {
  const map = useMap()
  useCameraFollow(map, position, { enabled })
  return null
}
