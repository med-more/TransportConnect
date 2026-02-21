import { useState, useEffect, useRef } from "react"
import { pointAlongRoute, bearingBetween } from "../utils/route"

/** How fast the vehicle catches up to target (0–1). Higher = snappier. */
const LERP_FACTOR = 0.12

/**
 * Smoothly interpolates vehicle position and bearing along the route.
 * Animation runs in a single requestAnimationFrame loop; target progress
 * can be updated at any frequency (e.g. WebSocket or 200ms interval).
 */
export function useSmoothVehiclePosition(routePoints, progress) {
  const [position, setPosition] = useState(null)
  const [bearing, setBearing] = useState(0)
  const currentProgressRef = useRef(0)
  const currentPositionRef = useRef(null)
  const rafRef = useRef(null)
  const progressRef = useRef(progress)

  progressRef.current = progress

  useEffect(() => {
    if (!routePoints?.length) {
      currentPositionRef.current = null
      setPosition(null)
      return
    }

    const targetPos = pointAlongRoute(routePoints, progressRef.current)
    if (!targetPos) {
      setPosition(null)
      return
    }

    if (currentPositionRef.current == null) {
      currentPositionRef.current = targetPos
      currentProgressRef.current = progressRef.current
      setPosition(targetPos)
      const idx = Math.min(routePoints.length - 2, Math.floor(progressRef.current * (routePoints.length - 1)))
      setBearing(bearingBetween(routePoints[idx], routePoints[idx + 1]))
    }

    const animate = () => {
      const targetProgress = progressRef.current
      const targetPosition = pointAlongRoute(routePoints, targetProgress)
      if (!targetPosition) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

          const curr = currentPositionRef.current
      if (!curr) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }
      const lat = curr[0] + (targetPosition[0] - curr[0]) * LERP_FACTOR
      const lng = curr[1] + (targetPosition[1] - curr[1]) * LERP_FACTOR
      const next = [lat, lng]

      currentPositionRef.current = next
      currentProgressRef.current = currentProgressRef.current + (targetProgress - currentProgressRef.current) * LERP_FACTOR

      setPosition(next)

      const segmentIdx = Math.min(
        routePoints.length - 2,
        Math.max(0, Math.floor(currentProgressRef.current * (routePoints.length - 1)))
      )
      const segA = routePoints[segmentIdx]
      const segB = routePoints[segmentIdx + 1]
      if (segA && segB) setBearing(bearingBetween(segA, segB))

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [routePoints])

  return { position, bearing }
}
