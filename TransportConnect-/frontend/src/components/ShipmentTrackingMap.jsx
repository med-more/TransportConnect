import { useEffect, useState, useMemo, useRef } from "react"
import { createPortal } from "react-dom"
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useTheme } from "../contexts/ThemeContext"
import { geocode, MOROCCO_CENTER } from "../utils/geocode"
import { getRoute } from "../utils/route"
import { MAP_TILES } from "../config/mapConfig"
import { hasTrafficLayer } from "../config/mapLibreConfig"
import { useSmoothVehiclePosition } from "../hooks/useSmoothVehiclePosition"
import VehicleMarker from "./map/VehicleMarker"
import CameraFollow from "./map/CameraFollow"
import TrackingMapMapbox from "./map/TrackingMapMapbox"
import { createStartPinIcon, createEndPinIcon, INDRIVE_ORANGE } from "./map/IndriveStyleMarkers"
import { Target, MapPin, Route, ChevronDown, Fullscreen, FullscreenExit, Car } from "../utils/icons"

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

function formatEtaMinutes(minutes) {
  if (minutes == null || minutes <= 0) return "Arrived"
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}min` : `${m}min`
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
  showLegend = false,
  showRouteStrip = true,
  cameraFollow = true,
  onRouteLoaded,
}) {
  const [startCoords, setStartCoords] = useState(null)
  const [endCoords, setEndCoords] = useState(null)
  const [routePoints, setRoutePoints] = useState(null)
  const [routeInfo, setRouteInfo] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showTraffic, setShowTraffic] = useState(true)
  const progressRef = useRef(0)
  const canShowTraffic = hasTrafficLayer()

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
        const info = {
          distanceMeters: result.distanceMeters,
          durationSeconds: result.durationSeconds,
        }
        setRoutePoints(result.coordinates)
        setRouteInfo(info)
        onRouteLoaded?.(info)
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
  const [mobileOverlayExpanded, setMobileOverlayExpanded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const mapControlRef = useRef(null)

  useEffect(() => {
    if (!isFullscreen) return
    let cancelled = false
    const resizeAndFit = () => {
      const map = mapControlRef.current?.getMap?.()
      if (cancelled || !map) return
      map.resize()
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) mapControlRef.current?.fitRoute?.()
        })
      })
    }
    const t1 = setTimeout(resizeAndFit, 100)
    const t2 = setTimeout(resizeAndFit, 400)
    return () => {
      cancelled = true
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [isFullscreen])

  useEffect(() => {
    if (isFullscreen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [isFullscreen])
  useEffect(() => {
    if (!vehiclePosition || !cameraFollow) return
    const t = setTimeout(() => setFollowEnabled(true), 1200)
    return () => clearTimeout(t)
  }, [vehiclePosition, cameraFollow])

  if (loading || !startCoords || !endCoords) {
    return (
      <div
        className={`shipment-map-wrapper flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/20 ${className}`}
        style={height ? { height } : { minHeight: "280px" }}
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

  const style = height ? { height } : { minHeight: "280px" }
  const useGlMap = true

  const fullscreenWrapperClass = "fixed inset-0 z-[9999] w-full max-w-[100vw] h-[100dvh] max-h-[100dvh] overflow-hidden bg-black [&_.mapboxgl-canvas-container]:pointer-events-auto [&_.mapboxgl-map]:pointer-events-auto"
  const fullscreenWrapperStyle = { width: "100vw", height: "100dvh", minHeight: "100dvh" }

  const normalWrapperClass = `shipment-map-wrapper relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card shadow-sm ${className}`
  const wrapperClass = isFullscreen ? fullscreenWrapperClass : normalWrapperClass
  const wrapperStyle = isFullscreen ? fullscreenWrapperStyle : style

  const content = (
    <div className={wrapperClass} style={wrapperStyle}>
      {/* Back button: top-left, only in fullscreen (rendered first so it's on top) */}
      {isFullscreen && (
        <button
          type="button"
          onClick={() => setIsFullscreen(false)}
          className="absolute top-3 left-3 z-[10002] flex items-center justify-center w-12 h-12 rounded-full bg-black/80 hover:bg-black text-white backdrop-blur-sm border border-white/20 touch-manipulation shadow-lg min-w-[48px] min-h-[48px]"
          aria-label="Réduire la carte"
        >
          <FullscreenExit className="w-6 h-6" />
        </button>
      )}

      {/* Top bar: en agrandi = ville départ + flèche + ville arrivée au centre ; sinon spread */}
      {showRouteStrip && (fromLabel || toLabel) && (
        <div
          className={`absolute top-0 left-0 right-0 z-[999] flex items-center pointer-events-none rounded-t-xl sm:rounded-t-2xl
            ${isFullscreen
              ? "justify-center gap-3 pl-14 pr-4 py-3 bg-black/60 backdrop-blur-md"
              : "gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-black/60 backdrop-blur-md sm:bg-gradient-to-b sm:from-black/70 sm:to-transparent"
            }`}
        >
          <span
            className={`text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${isFullscreen ? "text-base sm:text-lg shrink-0" : "text-[13px] sm:text-sm truncate flex-1 min-w-0"}`}
            title={fromLabel}
          >
            {fromLabel || "Start"}
          </span>
          <span className={`text-white/90 shrink-0 font-medium ${isFullscreen ? "text-lg sm:text-xl" : "text-xs sm:text-sm"}`} aria-hidden>→</span>
          <span
            className={`text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${isFullscreen ? "text-base sm:text-lg shrink-0" : "text-[13px] sm:text-sm truncate flex-1 min-w-0 text-right"}`}
            title={toLabel}
          >
            {toLabel || "End"}
          </span>
        </div>
      )}

      {useGlMap && (
        <div
          className="absolute top-11 sm:top-14 right-2 sm:right-3 z-[1001] flex flex-col gap-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 p-2 shadow-xl pointer-events-auto"
          role="group"
          aria-label="Map controls"
        >
          <button
            type="button"
            onClick={() => mapControlRef.current?.flyToCurrentLocation?.()}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] w-10 h-10 rounded-lg text-white hover:bg-white/20 active:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 touch-manipulation"
            title="Center on current location"
            aria-label="Center on current location"
          >
            <Target className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => mapControlRef.current?.flyToDestination?.()}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] w-10 h-10 rounded-lg text-white hover:bg-white/20 active:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 touch-manipulation"
            title="Go to destination"
            aria-label="Go to destination"
          >
            <MapPin className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  mapControlRef.current?.fitRoute?.()
                })
              })
            }}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] w-10 h-10 rounded-lg text-white hover:bg-white/20 active:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 touch-manipulation"
            title="Fit route in view"
            aria-label="Fit route in view"
          >
            <Route className="w-5 h-5" />
          </button>
          {canShowTraffic && (
            <button
              type="button"
              onClick={() => setShowTraffic((v) => !v)}
              className={`flex items-center justify-center min-w-[44px] min-h-[44px] w-10 h-10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 touch-manipulation ${showTraffic ? "bg-white/25 text-white" : "text-white hover:bg-white/20 active:bg-white/30"}`}
              title={showTraffic ? "Hide traffic" : "Show traffic"}
              aria-label={showTraffic ? "Hide traffic" : "Show traffic"}
            >
              <Car className="w-5 h-5" />
            </button>
          )}
          {!isFullscreen && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsFullscreen(true)
              }}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] w-10 h-10 rounded-lg text-white hover:bg-white/20 active:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 touch-manipulation"
              title="Agrandir la carte"
              aria-label="Agrandir la carte en plein écran"
            >
              <Fullscreen className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {useGlMap ? (
        <div className={`absolute inset-0 top-11 sm:top-14 min-h-0 rounded-b-xl sm:rounded-b-2xl pointer-events-auto ${isFullscreen ? "z-[1000]" : ""}`}>
          <TrackingMapMapbox
            ref={mapControlRef}
            routePoints={displayPoints}
            startCoords={startCoords}
            endCoords={endCoords}
            vehiclePosition={vehiclePosition}
            vehicleBearing={bearing}
            cameraFollow={cameraFollow}
            isFullscreen={isFullscreen}
            showTraffic={showTraffic}
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
        <>
          {/* Mobile: compact bottom sheet — map-first; clear, readable strip */}
          <div
            className={`absolute bottom-0 left-0 right-0 z-[1000] safe-bottom pointer-events-auto sm:hidden ${
              mobileOverlayExpanded ? "hidden" : "block"
            }`}
          >
            <div
              className="mx-2 mb-2 rounded-t-2xl bg-gray-900/95 backdrop-blur-xl border border-white/10 border-b-0 shadow-2xl"
              onClick={() => setMobileOverlayExpanded(true)}
              onKeyDown={(e) => e.key === "Enter" && setMobileOverlayExpanded(true)}
              role="button"
              tabIndex={0}
              aria-label="Afficher les détails du trajet"
            >
              <div className="flex justify-center pt-2.5 pb-1" aria-hidden>
                <span className="w-10 h-1 rounded-full bg-white/30" />
              </div>
              <div className="px-4 pb-4 pt-1">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-white text-[13px] font-semibold" style={{ backgroundColor: INDRIVE_ORANGE }}>
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" aria-hidden />
                    En direct
                  </span>
                  {(routeInfo != null || etaMinutes != null) && (
                    <span className="text-white text-base font-semibold tabular-nums">
                      {routeInfo != null
                        ? formatDuration(routeInfo.durationSeconds)
                        : formatEtaMinutes(etaMinutes)}
                    </span>
                  )}
                  <ChevronDown className="w-6 h-6 text-white/80 shrink-0" aria-hidden />
                </div>
                <div className="flex justify-between items-center text-[13px] text-white/95 mb-2">
                  <span>Progression</span>
                  <span className="font-medium tabular-nums">{progressPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%`, backgroundColor: INDRIVE_ORANGE }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Full overlay: desktop = floating compact card (map stays visible); mobile when expanded = full card */}
          <div
            className={`absolute z-[1000] safe-bottom pointer-events-auto ${
              mobileOverlayExpanded ? "block bottom-0 left-0 right-0" : "hidden sm:block sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-[320px]"
            }`}
          >
            <div className="sm:rounded-xl sm:border sm:border-white/10 sm:bg-gray-900/90 sm:backdrop-blur-md sm:shadow-xl sm:overflow-hidden">
              {/* Mobile expanded: full-width card */}
              <div className="mx-2 mb-2 rounded-t-2xl bg-gray-900/95 backdrop-blur-xl border border-white/10 border-b-0 shadow-2xl sm:mx-0 sm:mb-0 sm:rounded-xl sm:border sm:border-white/10 sm:shadow-xl">
                <div className="flex justify-center pt-2.5 pb-1 sm:hidden" aria-hidden>
                  <span className="w-10 h-1 rounded-full bg-white/30" />
                </div>
                <div className="p-4 sm:p-3 sm:pt-3 pb-4 sm:pb-3">
                  {mobileOverlayExpanded && (
                    <button
                      type="button"
                      className="sm:hidden flex items-center justify-center gap-2 w-full text-white/90 text-[13px] font-medium py-2 -mt-1 mb-2 rounded-xl bg-white/5 touch-manipulation min-h-[44px]"
                      onClick={() => setMobileOverlayExpanded(false)}
                      aria-label="Réduire"
                    >
                      <ChevronDown className="w-5 h-5 rotate-180" />
                      Réduire
                    </button>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-2">
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-white text-[13px] sm:text-xs font-semibold" style={{ backgroundColor: INDRIVE_ORANGE }}>
                      <span className="w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse" aria-hidden />
                      En direct
                    </span>
                    {(routeInfo != null || etaMinutes != null) && (
                      <span className="text-white text-base sm:text-sm font-semibold tabular-nums">
                        {routeInfo != null
                          ? formatDuration(routeInfo.durationSeconds)
                          : formatEtaMinutes(etaMinutes)}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-1 sm:gap-1.5 mb-2 sm:mb-2 text-[13px] sm:text-xs text-white/95">
                    <p className="truncate sm:flex sm:items-center sm:gap-1.5">
                      <span className="text-white/70 font-medium shrink-0">Départ:</span>
                      <span className="truncate block sm:inline">{fromLabel || "—"}</span>
                    </p>
                    <p className="truncate sm:flex sm:items-center sm:gap-1.5">
                      <span className="text-white/70 font-medium shrink-0">Arrivée:</span>
                      <span className="truncate block sm:inline">{toLabel || "—"}</span>
                    </p>
                  </div>
                  <div className="space-y-1.5 sm:space-y-1.5">
                    <div className="flex justify-between text-[13px] sm:text-xs text-white/95">
                      <span>Progression</span>
                      <span className="font-medium tabular-nums">{progressPercent}%</span>
                    </div>
                    <div className="h-2 sm:h-1.5 rounded-full bg-white/20 sm:bg-white/25 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progressPercent}%`, backgroundColor: INDRIVE_ORANGE }}
                      />
                    </div>
                  </div>
                  {routeInfo && (
                    <p className="text-white/80 text-[13px] sm:text-[11px] mt-2 sm:mt-1.5">
                      {formatDistance(routeInfo.distanceMeters)} · ~{formatDuration(routeInfo.durationSeconds)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showLegend && (
        <div className="absolute top-11 sm:top-14 left-2 sm:left-4 z-[998] flex flex-col gap-1.5 pointer-events-none">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              <span className="w-2.5 h-2.5 rounded-full border border-white/90 shadow-sm" style={{ background: "#00c853" }} />
              Départ
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              <span className="w-2.5 h-2.5 rounded-full border border-white/90 shadow-sm" style={{ background: "#e53935" }} />
              Arrivée
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              <span className="w-2.5 h-2.5 rounded-full border border-white/90 shadow-sm" style={{ background: INDRIVE_ORANGE }} />
              Véhicule
            </span>
          </div>
          <a
            href="https://www.flaticon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] text-white/50 hover:text-white/70 drop-shadow-sm w-fit pointer-events-auto"
            title="Truck &amp; destination icons by Freepik from Flaticon"
          >
            Icons by Freepik from flaticon.com
          </a>
        </div>
      )}
    </div>
  )

  return isFullscreen ? createPortal(content, document.body) : content
}
