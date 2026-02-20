import { useEffect, useState, useMemo, useRef } from "react"
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useTheme } from "../contexts/ThemeContext"
import { geocode, MOROCCO_CENTER } from "../utils/geocode"
import { getRoute, pointAlongRoute } from "../utils/route"

// Modern basemaps: clear streets, buildings, and labels (CARTO – no API key)
const MAP_TILES = {
  light: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
}

function createDivIcon(html, className = "") {
  return L.divIcon({
    html,
    className: `shipment-map-icon ${className}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

const TRUCK_MARKER_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="display:block;width:100%;height:100%;">' +
  '<rect x="1" y="3" width="15" height="13" rx="1.2"/>' +
  '<path d="M16 8h4l3 3v5h-7V8z"/>' +
  '<circle cx="5.5" cy="18.5" r="2.5"/>' +
  '<circle cx="18.5" cy="18.5" r="2.5"/>' +
  '</svg>'

function createTruckIcon() {
  return L.divIcon({
    html:
      '<div class="truck-marker-pin" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:var(--primary);border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06);">' +
      '<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;color:white;">' +
      TRUCK_MARKER_SVG +
      '</span></div>',
    className: "shipment-map-icon truck-marker",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  })
}

function FitBounds({ points }) {
  const map = useMap()
  useEffect(() => {
    if (points.length < 2) return
    const bounds = L.latLngBounds(points)
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 16, minZoom: 4 })
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
}) {
  const [startCoords, setStartCoords] = useState(null)
  const [endCoords, setEndCoords] = useState(null)
  const [routePoints, setRoutePoints] = useState(null)
  const [routeInfo, setRouteInfo] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [, setRouteError] = useState(false)
  const progressRef = useRef(0)

  const dep = departure?.coordinates?.lat != null
    ? [departure.coordinates.lat, departure.coordinates.lng]
    : null
  const dest = destination?.coordinates?.lat != null
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
      const start = dep || (await geocode(departure?.city || departure?.address || "Casablanca"))
      const end = dest || (await geocode(destination?.city || destination?.address || "Rabat"))
      if (!cancelled) {
        setStartCoords(start ? [start.lat, start.lng] : MOROCCO_CENTER)
        setEndCoords(end ? [end.lat, end.lng] : MOROCCO_CENTER)
        setLoading(false)
      }
    }
    resolve()
    return () => { cancelled = true }
  }, [dep, dest, departure?.city, departure?.address, destination?.city, destination?.address])

  useEffect(() => {
    if (!startCoords || !endCoords) return
    setRouteError(false)
    let cancelled = false
    async function fetchRoute() {
      const start = { lat: startCoords[0], lng: startCoords[1] }
      const end = { lat: endCoords[0], lng: endCoords[1] }
      const result = await getRoute(start, end)
      if (cancelled) return
      if (result?.coordinates?.length >= 2) {
        setRoutePoints(result.coordinates)
        setRouteInfo({ distanceMeters: result.distanceMeters, durationSeconds: result.durationSeconds })
      } else {
        setRoutePoints([startCoords, endCoords])
        setRouteInfo(null)
        setRouteError(true)
      }
    }
    fetchRoute()
    return () => { cancelled = true }
  }, [startCoords, endCoords])

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
    const interval = setInterval(update, 200)
    return () => clearInterval(interval)
  }, [departureDate, arrivalDate])

  const displayPoints = routePoints && routePoints.length >= 2 ? routePoints : (startCoords && endCoords ? [startCoords, endCoords] : [])

  const truckPosition = useMemo(() => {
    if (!displayPoints.length) return null
    return pointAlongRoute(displayPoints, progress)
  }, [displayPoints, progress])

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

  if (loading || !startCoords || !endCoords) {
    return (
      <div
        className={`shipment-map-wrapper flex flex-col items-center justify-center rounded-xl border border-border bg-muted/20 ${className}`}
        style={height ? { height } : { minHeight: "200px" }}
      >
        <div className="w-full flex-1 min-h-[200px] sm:min-h-[280px] flex flex-col items-center justify-center gap-4 p-6">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground text-center">Loading map & route…</p>
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

  return (
    <div
      className={`shipment-map-wrapper relative rounded-xl overflow-hidden border border-border bg-background ${className}`}
      style={style}
    >
      {showRouteStrip && (fromLabel || toLabel) && (
        <div className="absolute top-0 left-0 right-0 z-[999] flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-b from-black/60 to-transparent pointer-events-none rounded-t-xl">
          <span className="text-white font-medium text-xs sm:text-sm truncate flex-1 min-w-0" title={fromLabel}>
            {fromLabel || "Start"}
          </span>
          <span className="text-white/80 shrink-0">→</span>
          <span className="text-white font-medium text-xs sm:text-sm truncate flex-1 min-w-0 text-right" title={toLabel}>
            {toLabel || "End"}
          </span>
        </div>
      )}

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
        {displayPoints.length >= 2 && <FitBounds points={displayPoints} />}
        <Polyline
          positions={displayPoints}
          pathOptions={{
            color: "hsl(var(--primary))",
            weight: 5,
            opacity: 0.9,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
        <Marker
          position={startCoords}
          icon={createDivIcon(
            '<div style="width:28px;height:28px;border-radius:50%;background:#22c55e;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>',
            "start-marker"
          )}
        />
        <Marker
          position={endCoords}
          icon={createDivIcon(
            '<div style="width:28px;height:28px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>',
            "end-marker"
          )}
        />
        {truckPosition && (
          <Marker position={truckPosition} icon={createTruckIcon()} />
        )}
      </MapContainer>

      {showLiveOverlay && (departureDate || arrivalDate) && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] p-3 sm:p-4 pb-3 sm:pb-4 safe-bottom bg-gradient-to-t from-black/75 via-black/40 to-transparent pointer-events-none rounded-b-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden />
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
                className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          {routeInfo && (
            <p className="text-white/80 text-[10px] sm:text-xs mt-2">
              {formatDistance(routeInfo.distanceMeters)} · ~{formatDuration(routeInfo.durationSeconds)}
            </p>
          )}
        </div>
      )}

      {showLegend && (
        <div className="absolute top-12 sm:top-14 left-3 sm:left-4 z-[998] flex flex-wrap items-center gap-2 sm:gap-3 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-white/95 drop-shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-white/80 shadow" />
            Start
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-white/95 drop-shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white/80 shadow" />
            End
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-white/95 drop-shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-primary border border-white/80 shadow" style={{ background: "var(--primary)" }} />
            Truck
          </span>
        </div>
      )}
    </div>
  )
}
