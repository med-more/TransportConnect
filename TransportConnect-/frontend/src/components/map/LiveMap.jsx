import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef, useState } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { useSocket } from "../../hooks/useSocket"
import { createThreeMarkerLayer } from "./ThreeMarker"
import { updateRouteLayer, removeRouteLayer } from "./RouteLayer"
import { fetchRoute } from "../../services/mapService"

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
const DEFAULT_CENTER = [-5.0033, 34.0331]
const DEFAULT_ZOOM = 6
const DEFAULT_PITCH = 0
const LERP_FACTOR = 0.15
const BEARING_LERP = 0.12

/**
 * Computes bearing in degrees from point A to B (0 = North, 90 = East).
 */
function bearingBetween(a, b) {
  if (!a || !b || (a[0] === b[0] && a[1] === b[1])) return 0
  const [lat1, lng1] = a
  const [lat2, lng2] = b
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const lat1Rad = (lat1 * Math.PI) / 180
  const lat2Rad = (lat2 * Math.PI) / 180
  const y = Math.sin(dLng) * Math.cos(lat2Rad)
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng)
  let bearing = (Math.atan2(y, x) * 180) / Math.PI
  return (bearing + 360) % 360
}

/**
 * Linear interpolation.
 */
function lerp(a, b, t) {
  return a + (b - a) * t
}

/**
 * Lerp for angles (shortest path).
 */
function lerpAngle(a, b, t) {
  let diff = ((b - a + 540) % 360) - 180
  return (a + diff * t + 360) % 360
}

/**
 * Uber/Glovo-style live tracking map with 3D GLB marker, Socket.io, and OSRM route.
 */
const LiveMap = forwardRef(
  (
    {
      startCoords = null,
      endCoords = null,
      initialCenter = DEFAULT_CENTER,
      initialZoom = DEFAULT_ZOOM,
      className = "",
      style = {},
    },
    ref
  ) => {
    const containerRef = useRef(null)
    const mapRef = useRef(null)
    const threeLayerRef = useRef(null)
    const rafRef = useRef(null)
    const targetRef = useRef({ lng: initialCenter[0], lat: initialCenter[1] })
    const displayRef = useRef({ lng: initialCenter[0], lat: initialCenter[1] })
    const bearingRef = useRef(0)
    const targetBearingRef = useRef(0)
    const routeRef = useRef(null)
    const [mapReady, setMapReady] = useState(false)
    const { onDriverLocation } = useSocket()

    useImperativeHandle(ref, () => ({
      getMap: () => mapRef.current,
      flyTo: (lng, lat, zoom = 16) => {
        mapRef.current?.flyTo({ center: [lng, lat], zoom, duration: 800 })
      },
    }))

    useEffect(() => {
      if (!containerRef.current) return
      if (mapRef.current) return

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: initialCenter,
        zoom: initialZoom,
        pitch: DEFAULT_PITCH,
        antialias: true,
      })

      map.addControl(new maplibregl.NavigationControl(), "top-right")

      const resizeObserver = new ResizeObserver(() => {
        map.resize()
      })
      resizeObserver.observe(containerRef.current)

      map.on("load", () => {
        const initialLng = initialCenter[0]
        const initialLat = initialCenter[1]
        targetRef.current = { lng: initialLng, lat: initialLat }
        displayRef.current = { lng: initialLng, lat: initialLat }

        const layer = createThreeMarkerLayer({
          position: [initialLng, initialLat],
          bearing: 0,
          map,
        })
        map.addLayer(layer)
        threeLayerRef.current = layer
        mapRef.current = map
        setMapReady(true)
      })

      return () => {
        rafRef.current && cancelAnimationFrame(rafRef.current)
        resizeObserver.disconnect()
        removeRouteLayer(map)
        if (threeLayerRef.current && map.getLayer?.(threeLayerRef.current.id)) {
          map.removeLayer(threeLayerRef.current.id)
        }
        map.remove()
        mapRef.current = null
        threeLayerRef.current = null
      }
    }, [])

    useEffect(() => {
      const unsub = onDriverLocation((data) => {
        const lat = data?.lat ?? data?.latitude
        const lng = data?.lng ?? data?.longitude
        if (typeof lat === "number" && typeof lng === "number") {
          const prev = { lat: displayRef.current.lat, lng: displayRef.current.lng }
          const next = { lat, lng }
          const bearing = bearingBetween([prev.lat, prev.lng], [lat, lng])
          targetRef.current = { lng, lat }
          targetBearingRef.current = bearing
        }
      })
      return unsub
    }, [onDriverLocation])

    useEffect(() => {
      if (!mapReady || !startCoords?.length || !endCoords?.length) return
      const start = { lat: startCoords[0], lng: startCoords[1] }
      const end = { lat: endCoords[0], lng: endCoords[1] }
      fetchRoute(start, end).then((result) => {
        if (result?.coordinates?.length) {
          routeRef.current = result.coordinates
          updateRouteLayer(mapRef.current, result.coordinates)
        }
      })
    }, [mapReady, startCoords, endCoords])

    const animate = useCallback(() => {
      const layer = threeLayerRef.current
      const map = mapRef.current
      if (!layer || !map) return

      const target = targetRef.current
      const display = displayRef.current

      display.lng = lerp(display.lng, target.lng, LERP_FACTOR)
      display.lat = lerp(display.lat, target.lat, LERP_FACTOR)
      bearingRef.current = lerpAngle(bearingRef.current, targetBearingRef.current, BEARING_LERP)

      layer._updatePosition(display.lng, display.lat)
      layer._updateBearing(bearingRef.current)

      map.triggerRepaint()
      rafRef.current = requestAnimationFrame(animate)
    }, [])

    useEffect(() => {
      if (!mapRef.current || !threeLayerRef.current) return
      rafRef.current = requestAnimationFrame(animate)
      return () => {
        rafRef.current && cancelAnimationFrame(rafRef.current)
      }
    }, [animate])

    return (
      <div
        ref={containerRef}
        className={`w-full h-[500px] min-h-[300px] rounded-xl overflow-hidden ${className}`}
        style={{ minHeight: 300, ...style }}
        role="application"
        aria-label="Live tracking map"
      />
    )
  }
)

LiveMap.displayName = "LiveMap"
export default LiveMap
