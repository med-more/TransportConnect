import { useRef, useEffect, useMemo } from "react"
import Map, { Marker, ScaleControl, NavigationControl } from "react-map-gl/maplibre"
import "maplibre-gl/src/css/maplibre-gl.css"
import { useTheme } from "../../contexts/ThemeContext"
import { getMapStyle, ROUTE_LINE_PAINT, ROUTE_LINE_OUTLINE_PAINT, ROUTE_LINE_OUTLINE_PAINT_DARK } from "../../config/mapLibreConfig"
import RouteLineMapbox from "./RouteLineMapbox"
import { routeToGeoJSONLineString } from "../../utils/route"

const DEFAULT_CENTER = [-6.5, 33.5]
const DEFAULT_ZOOM = 6
const FIT_PADDING = 80
const MIN_ZOOM = 5
const MAX_ZOOM = 18

/**
 * waypoints: [{ lat, lng, label? }]
 * routeGeometry: optional [lng, lat][] from OSRM (GeoJSON order)
 */
export default function RouteStepsMap({ waypoints = [], routeGeometry = null, className = "", height = "320px" }) {
  const mapRef = useRef(null)
  const { theme } = useTheme()
  const mapStyle = getMapStyle(theme)

  const routePoints = useMemo(() => {
    if (routeGeometry?.length) {
      return routeGeometry.map(([lng, lat]) => [lat, lng])
    }
    if (waypoints.length >= 2) {
      return waypoints.map((w) => [Number(w.lat), Number(w.lng)])
    }
    return []
  }, [routeGeometry, waypoints])

  const bounds = useMemo(() => {
    if (waypoints.length < 2) return null
    const lats = waypoints.map((w) => Number(w.lat))
    const lngs = waypoints.map((w) => Number(w.lng))
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    const pad = 0.015
    return [
      [minLng - pad, minLat - pad],
      [maxLng + pad, maxLat + pad],
    ]
  }, [waypoints])

  useEffect(() => {
    if (!bounds || !mapRef.current?.getMap) return
    const map = mapRef.current.getMap()
    map.fitBounds(bounds, { padding: FIT_PADDING, maxZoom: 15, duration: 800 })
  }, [bounds])

  if (!waypoints?.length) return null

  const outlinePaint = theme === "dark" ? ROUTE_LINE_OUTLINE_PAINT_DARK : ROUTE_LINE_OUTLINE_PAINT

  return (
    <div className={`relative rounded-xl overflow-hidden border border-border bg-muted/20 ${className}`} style={{ height }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: DEFAULT_CENTER[0],
          latitude: DEFAULT_CENTER[1],
          zoom: DEFAULT_ZOOM,
        }}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        reuseMaps
        dragPan
        scrollZoom
        doubleClickZoom
        touchZoomRotate
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
      >
        <ScaleControl position="bottom-left" maxWidth={100} unit="metric" />
        <NavigationControl position="top-right" showCompass={false} showZoom />
        {routePoints.length >= 2 && (
          <RouteLineMapbox
            routePoints={routePoints}
            paint={ROUTE_LINE_PAINT}
            outlinePaint={outlinePaint}
            showOutline
          />
        )}
        {waypoints.map((wp, index) => {
          const lat = Number(wp.lat)
          const lng = Number(wp.lng)
          if (Number.isNaN(lat) || Number.isNaN(lng)) return null
          const isFirst = index === 0
          const isLast = index === waypoints.length - 1
          const label = wp.label || (isFirst ? "Start" : isLast ? "End" : `Stop ${index}`)
          const pinColor = isFirst ? "#10b981" : isLast ? "#f43f5e" : "#ff8200"
          return (
            <Marker key={`${lat}-${lng}-${index}`} longitude={lng} latitude={lat} anchor="bottom">
              <div className="flex flex-col items-center cursor-default" title={label}>
                {/* Pin shape: circle + stem */}
                <div className="flex flex-col items-center drop-shadow-lg">
                  <div
                    className="flex items-center justify-center min-w-[32px] h-8 px-2 rounded-full font-bold text-sm border-2 border-white dark:border-gray-800"
                    style={{ backgroundColor: pinColor }}
                  >
                    {isFirst ? "A" : isLast ? "B" : index}
                  </div>
                  <div
                    className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] -mt-0.5"
                    style={{ borderTopColor: pinColor }}
                  />
                </div>
                {/* Label under every stop */}
                <span className="text-[11px] font-medium text-foreground bg-white/95 dark:bg-gray-900/95 px-2 py-1 rounded shadow-sm border border-border/50 mt-1 max-w-[100px] truncate text-center">
                  {label}
                </span>
              </div>
            </Marker>
          )
        })}
      </Map>
      {/* Step list overlay */}
      {waypoints.length > 0 && (
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 justify-center pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5 bg-background/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border pointer-events-auto">
            {waypoints.map((wp, i) => {
              const isFirst = i === 0
              const isLast = i === waypoints.length - 1
              const lbl = wp.label || (isFirst ? "Departure" : isLast ? "Destination" : `Stop ${i}`)
              return (
                <span key={i} className="flex items-center gap-1 text-xs">
                  <span
                    className={`
                      flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]
                      ${isFirst ? "bg-emerald-500 text-white" : ""}
                      ${isLast ? "bg-rose-500 text-white" : ""}
                      ${!isFirst && !isLast ? "bg-[#ff8200] text-white" : ""}
                    `}
                  >
                    {isFirst ? "A" : isLast ? "B" : i}
                  </span>
                  <span className="text-muted-foreground truncate max-w-[100px]">{lbl}</span>
                  {i < waypoints.length - 1 && (
                    <span className="text-muted-foreground/60">→</span>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
