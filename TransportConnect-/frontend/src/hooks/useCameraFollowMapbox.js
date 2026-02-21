import { useEffect, useRef } from "react"

const LERP = 0.08
const MIN_MOVE = 0.00002

/**
 * Smoothly moves the Mapbox camera to follow a position (e.g. vehicle).
 * Uses flyTo with smooth duration for premium feel.
 * @param {maplibregl.Map | null} map - MapLibre map instance (mapRef.current?.getMap())
 * @param {[number, number] | null} position - [lng, lat] to follow (Mapbox uses lng, lat)
 * @param {{ enabled?: boolean, zoom?: number, pitch?: number }} options
 */
export function useCameraFollowMapbox(map, position, options = {}) {
  const { enabled = true, zoom = 16, pitch = 45 } = options
  const targetRef = useRef(null)
  const rafRef = useRef(null)

  targetRef.current = position

  useEffect(() => {
    if (!map || !enabled) return

    const follow = () => {
      const target = targetRef.current
      if (!target) {
        rafRef.current = requestAnimationFrame(follow)
        return
      }

      const [lng, lat] = target
      const center = map.getCenter()
      const newLng = center.lng + (lng - center.lng) * LERP
      const newLat = center.lat + (lat - center.lat) * LERP

      if (
        Math.abs(newLng - center.lng) > MIN_MOVE ||
        Math.abs(newLat - center.lat) > MIN_MOVE
      ) {
        map.easeTo({
          center: [newLng, newLat],
          zoom: map.getZoom(),
          pitch: map.getPitch(),
          duration: 0,
        })
      }

      rafRef.current = requestAnimationFrame(follow)
    }

    rafRef.current = requestAnimationFrame(follow)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [map, enabled])
}
