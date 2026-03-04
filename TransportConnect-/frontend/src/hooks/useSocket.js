import { useContext, useCallback } from "react"
import { SocketContext } from "../contexts/SocketContext"

/**
 * Hook to access socket and subscribe to driverLocation events.
 * Returns { socket, connected, onDriverLocation }.
 * onDriverLocation(callback) subscribes to "driverLocation" and returns an unsubscribe function.
 */
export function useSocket() {
  const ctx = useContext(SocketContext)

  const onDriverLocation = useCallback(
    (callback) => {
      if (typeof callback !== "function") return () => {}
      const socket = ctx?.socket
      if (!socket) return () => {}
      socket.on("driverLocation", callback)
      return () => socket.off("driverLocation", callback)
    },
    [ctx?.socket]
  )

  return {
    socket: ctx?.socket,
    connected: ctx?.connected ?? false,
    onDriverLocation,
  }
}
