import { useState, useEffect, useRef } from "react"
import { useSocket } from "../contexts/SocketContext"

/**
 * Provides vehicle progress (0..1) for tracking.
 * 1) If tripId/driverId and socket emit "driver_location" with { lat, lng, progress }, use that.
 * 2) Else fallback to time-based progress from departureDate/arrivalDate.
 * Keeps existing logic working; plug in socket when backend sends driver_location.
 */
export function useVehicleLocation(options = {}) {
  const {
    departureDate,
    arrivalDate,
    tripId,
    driverId,
    routePoints,
  } = options

  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const socketContext = useSocket()

  // Time-based fallback
  useEffect(() => {
    if (!departureDate || !arrivalDate) return
    const start = new Date(departureDate).getTime()
    const end = new Date(arrivalDate).getTime()
    const update = () => {
      const now = Date.now()
      if (now <= start) progressRef.current = 0
      else if (now >= end) progressRef.current = 1
      else progressRef.current = (now - start) / (end - start)
      setProgress(progressRef.current)
    }
    update()
    const interval = setInterval(update, 150)
    return () => clearInterval(interval)
  }, [departureDate, arrivalDate])

  // Socket: when backend sends driver_location, override progress (optional)
  useEffect(() => {
    if (!socketContext?.socket || !tripId) return () => {}
    const socket = socketContext.socket
    const handler = (payload) => {
      if (payload?.progress != null && payload.progress >= 0 && payload.progress <= 1) {
        progressRef.current = payload.progress
        setProgress(payload.progress)
      }
    }
    socket.on("driver_location", handler)
    return () => socket.off("driver_location", handler)
  }, [socketContext?.socket, tripId])

  return progress
}
