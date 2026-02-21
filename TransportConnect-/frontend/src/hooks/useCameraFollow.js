import { useEffect, useRef } from "react"

const LERP = 0.06
const MIN_MOVE = 0.0001

/**
 * Smoothly moves the map camera to follow a position (e.g. vehicle).
 * Uses continuous easing so the map doesn't jump; works independently of update frequency.
 * @param {L.Map | null} map - Leaflet map instance (from useMap())
 * @param {[number, number] | null} position - [lat, lng] to follow
 * @param {{ enabled?: boolean }} options - enabled: whether to follow (default true)
 */
export function useCameraFollow(map, position, options = {}) {
  const { enabled = true } = options
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

      const center = map.getCenter()
      const lat = center.lat + (target[0] - center.lat) * LERP
      const lng = center.lng + (target[1] - center.lng) * LERP

      if (Math.abs(lat - center.lat) > MIN_MOVE || Math.abs(lng - center.lng) > MIN_MOVE) {
        map.setView([lat, lng], map.getZoom(), { animate: false })
      }

      rafRef.current = requestAnimationFrame(follow)
    }

    rafRef.current = requestAnimationFrame(follow)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [map, enabled])
}
