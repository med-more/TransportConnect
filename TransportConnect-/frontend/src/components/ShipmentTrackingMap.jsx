import { useEffect, useState, useMemo, useRef } from "react"
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useTheme } from "../contexts/ThemeContext"
import { geocode, MOROCCO_CENTER } from "../utils/geocode"
import { getRoute } from "../utils/route"
import { MAP_TILES } from "../config/mapConfig"
import { useSmoothVehiclePosition } from "../hooks/useSmoothVehiclePosition"
import VehicleMarker from "./map/VehicleMarker"
import CameraFollow from "./map/CameraFollow"
import TrackingMapMapbox from "./map/TrackingMapMapbox"
import { createStartPinIcon, createEndPinIcon, INDRIVE_ORANGE } from "./map/IndriveStyleMarkers"

function FitBoundsOnce({ points }) {
  const map = useMap()
  const doneRef = useRef(false)
  useEffect(() => {
    if (points.length < 2 || doneRef.current) return
    doneRef.current = true
    const bounds = L.latLngBounds(points)
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15, minZoom: 4 })
  }, [map, points])
  return null
}

function MapResizer() {
  const map = useMap()
  useEffect(() => {
    const onResize = () => map.invalidateSize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [map])
  return null
}

function formatDuration(seconds) {
  if (seconds == null || seconds <= 0) return "—"
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}min`
  return `${m} min`
}

function formatDistance(meters) {
  if (meters == null || meters <= 0) return "—"
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
  return `${Math.round(meters)} m`
}

export default function ShipmentTrackingMap({
  departure = {},
  destination = {},
  departureDate,
  arrivalDate,
  fromLabel,
  toLabel,
  className = "",
  height,
  showLiveOverlay = true,
  showLegend = true,
  showRouteStrip = true,
  cameraFollow = true,
}) {
  const [startCoords, setStartCoords] = useState(null)
  const [endCoords, setEndCoords] = useState(null)
  const [routePoints, setRoutePoints] = useState(null)
  const [routeInfo, setRouteInfo] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const progressRef = useRef(0)

  const dep =
    departure?.coordinates?.lat != null
      ? [departure.coordinates.lat, departure.coordinates.lng]
      : null
  const dest =
    destination?.coordinates?.lat != null
      ? [destination.coordinates.lat, destination.coordinates.lng]
      : null

  useEffect(() => {
    let cancelled = false
    async function resolve() {
      if (dep && dest) {
        setStartCoords(dep)
        setEndCoords(dest)
        setLoading(false)
        return
      }
      const start =
        dep ||
        (await geocode(departure?.city || departure?.address || "Casablanca"))
      const end =
        dest ||
        (await geocode(destination?.city || destination?.address || "Rabat"))
      if (!cancelled) {
        setStartCoords(start ? [start.lat, start.lng] : MOROCCO_CENTER)
        setEndCoords(end ? [end.lat, end.lng] : MOROCCO_CENTER)
        setLoading(false)
      }
    }
    resolve()
    return () => {
      cancelled = true
    }
  }, [dep, dest, departure?.city, departure?.address, destination?.city, destination?.address])

  useEffect(() => {
    if (!startCoords || !endCoords) return
    let cancelled = false
    async function fetchRoute() {
      const start = { lat: startCoords[0], lng: startCoords[1] }
      const end = { lat: endCoords[0], lng: endCoords[1] }
      const result = await getRoute(start, end)
      if (cancelled) return
      if (result?.coordinates?.length >= 2) {
        setRoutePoints(result.coordinates)
        setRouteInfo({
          distanceMeters: result.distanceMeters,
          durationSeconds: result.durationSeconds,
        })
      } else {
        setRoutePoints([startCoords, endCoords])
        setRouteInfo(null)
      }
    }
    fetchRoute()
    return () => {
      cancelled = true
    }
  }, [startCoords, endCoords])

  // Progress: time-based for ETA simulation. Replace with WebSocket/socket.io
  // for real-time GPS: subscribe to driver location and set progress from server.
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

  const displayPoints =
    routePoints && routePoints.length >= 2
      ? routePoints
      : startCoords && endCoords
        ? [startCoords, endCoords]
        : []

  const { position: vehiclePosition, bearing } = useSmoothVehiclePosition(
    displayPoints,
    progress
  )

  const etaMinutes = useMemo(() => {
    if (!departureDate || !arrivalDate) return null
    const end = new Date(arrivalDate).getTime()
    const now = Date.now()
    if (now >= end) return 0
    return Math.round((end - now) / (60 * 1000))
  }, [arrivalDate, progress])

  const progressPercent = Math.round(progress * 100)
  const { theme } = useTheme()
  const tiles = MAP_TILES[theme === "dark" ? "dark" : "light"]

  const [followEnabled, setFollowEnabled] = useState(false)
  useEffect(() => {
    if (!vehiclePosition || !cameraFollow) return
    const t = setTimeout(() => setFollowEnabled(true), 1200)
    return () => clearTimeout(t)
  }, [vehiclePosition, cameraFollow])

  if (loading || !startCoords || !endCoords) {
    return (
      <div
        className={`shipment-map-wrapper flex flex-col items-center justify-center rounded-xl border border-border bg-muted/20 ${className}`}
        style={height ? { height } : { minHeight: "200px" }}
      >
        <div className="w-full flex-1 min-h-[200px] sm:min-h-[280px] flex flex-col items-center justify-center gap-4 p-6">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground text-center">
            Loading map & route…
          </p>
          <div className="w-full max-w-[200px] h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-primary/50 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const center = [
    (startCoords[0] + endCoords[0]) / 2,
    (startCoords[1] + endCoords[1]) / 2,
  ]

  const style = height ? { height } : { minHeight: "200px" }
  // MapLibre GL map (free, no API key) is used by default
  const useGlMap = true

  return (
    <div
      className={`shipment-map-wrapper relative rounded-xl overflow-hidden border border-border bg-background ${className}`}
      style={style}
    >
      {showRouteStrip && (fromLabel || toLabel) && (
        <div className="absolute top-0 left-0 right-0 z-[999] flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-b from-black/60 to-transparent pointer-events-none rounded-t-xl">
          <span
            className="text-white font-medium text-xs sm:text-sm truncate flex-1 min-w-0"
            title={fromLabel}
          >
            {fromLabel || "Start"}
          </span>
          <span className="text-white/80 shrink-0">→</span>
          <span
            className="text-white font-medium text-xs sm:text-sm truncate flex-1 min-w-0 text-right"
            title={toLabel}
          >
            {toLabel || "End"}
          </span>
        </div>
      )}

      {useGlMap ? (
        <div className="h-full w-full rounded-xl" style={{ minHeight: "200px" }}>
          <TrackingMapMapbox
            routePoints={displayPoints}
            startCoords={startCoords}
            endCoords={endCoords}
            vehiclePosition={vehiclePosition}
            vehicleBearing={bearing}
            cameraFollow={cameraFollow}
          />
        </div>
      ) : (
      <MapContainer
        center={center}
        zoom={10}
        className="h-full w-full rounded-xl"
        style={{ height: "100%", minHeight: "200px" }}
        zoomControl={true}
        scrollWheelZoom={true}
        touchZoom={true}
        dragging={true}
      >
        <MapResizer />
        <TileLayer
          key={theme}
          url={tiles.url}
          attribution={tiles.attribution}
          subdomains="abcd"
          maxZoom={19}
          minZoom={2}
        />
        {displayPoints.length >= 2 && <FitBoundsOnce points={displayPoints} />}
        {cameraFollow && vehiclePosition && (
          <CameraFollow position={vehiclePosition} enabled={followEnabled} />
        )}
        <Polyline
          positions={displayPoints}
          pathOptions={{
            color: INDRIVE_ORANGE,
            weight: 5,
            opacity: 0.92,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
        <Marker position={startCoords} icon={createStartPinIcon()} />
        <Marker position={endCoords} icon={createEndPinIcon()} />
        <VehicleMarker position={vehiclePosition} bearing={bearing} />
      </MapContainer>
      )}

      {showLiveOverlay && (departureDate || arrivalDate) && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] p-3 sm:p-4 pb-3 sm:pb-4 safe-bottom bg-gradient-to-t from-black/75 via-black/40 to-transparent pointer-events-none rounded-b-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-semibold shadow-sm" style={{ backgroundColor: INDRIVE_ORANGE }}>
              <span
                className="w-2 h-2 rounded-full bg-white animate-pulse"
                aria-hidden
              />
              Live
            </span>
            {etaMinutes != null && (
              <span className="text-white text-xs sm:text-sm font-medium">
                {etaMinutes <= 0 ? "Arrived" : `ETA ${etaMinutes} min`}
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] sm:text-xs text-white/90">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/25 overflow-hidden backdrop-blur-sm">
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%`, backgroundColor: INDRIVE_ORANGE }}
              />
            </div>
          </div>
          {routeInfo && (
            <p className="text-white/80 text-[10px] sm:text-xs mt-2">
              {formatDistance(routeInfo.distanceMeters)} · ~
              {formatDuration(routeInfo.durationSeconds)}
            </p>
          )}
        </div>
      )}

      {showLegend && (
        <div className="absolute top-12 sm:top-14 left-3 sm:left-4 z-[998] flex flex-col gap-1.5 pointer-events-none">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-white/95 drop-shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full border border-white/80 shadow" style={{ background: "#00c853" }} />
              Départ
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-white/95 drop-shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full border border-white/80 shadow" style={{ background: "#e53935" }} />
              Arrivée
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-white/95 drop-shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full border border-white/80 shadow" style={{ background: INDRIVE_ORANGE }} />
              Véhicule
            </span>
          </div>
          <a
            href="https://www.flaticon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] text-white/60 hover:text-white/80 drop-shadow-sm w-fit pointer-events-auto"
            title="Truck &amp; destination icons by Freepik from Flaticon"
          >
            Icons by Freepik from flaticon.com
          </a>
        </div>
      )}
    </div>
  )
}
