import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react"
import Map, { ScaleControl, NavigationControl } from "react-map-gl/maplibre"
import "maplibre-gl/src/css/maplibre-gl.css"
import { useTheme } from "../../contexts/ThemeContext"
import {
  getMapStyle,
  hasTrafficLayer,
  TRACKING_MAP_VIEW,
  ROUTE_LINE_PAINT,
  ROUTE_LINE_OUTLINE_PAINT,
  ROUTE_LINE_OUTLINE_PAINT_DARK,
} from "../../config/mapLibreConfig"
import { useCameraFollowMapbox } from "../../hooks/useCameraFollowMapbox"
import RouteLineMapbox from "./RouteLineMapbox"
import VehicleMarkerMapbox from "./VehicleMarkerMapbox"
import DestinationMarkerMapbox from "./DestinationMarkerMapbox"
import TrafficOverlayMapbox from "./TrafficOverlayMapbox"

const DEFAULT_CENTER = [-5, 32]
const FLY_DURATION = 800
/** Padding pour fitBounds : départ et destination restent proches de la route (flèche), pas chacun dans un coin */
const FIT_BOUNDS_PADDING = 100
/** En plein écran : gros padding horizontal pour garder la route + les deux villes au centre (machi whda left wehda right) */
function getFullscreenPadding() {
  if (typeof window === "undefined") return { left: 400, right: 400, top: 140, bottom: 140 }
  const w = window.innerWidth
  const h = window.innerHeight
  return { left: Math.round(w * 0.22), right: Math.round(w * 0.22), top: Math.round(h * 0.12), bottom: Math.round(h * 0.12) }
}

/**
 * MapLibre GL tracking map: Carto basemap (streets, roads, labels),
 * route line, start/destination/vehicle markers, camera follow.
 * Exposes flyToCurrentLocation(), flyToDestination(), fitRoute() via ref.
 */
const MOBILE_BREAKPOINT = 640

const TrackingMapMapbox = forwardRef(function TrackingMapMapbox(
  {
    routePoints = [],
    startCoords,
    endCoords,
    vehiclePosition,
    vehicleBearing = 0,
    cameraFollow = true,
    isFullscreen = false,
    showTraffic = false,
    className = "",
    style = {},
  },
  ref
) {
  const mapRef = useRef(null)
  const [mapInstance, setMapInstance] = useState(null)
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  )
  const { theme } = useTheme()
  const mapStyle = getMapStyle(theme)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(mql.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  const routePointsRef = useRef(routePoints)
  const vehiclePositionRef = useRef(vehiclePosition)
  const endCoordsRef = useRef(endCoords)
  const startCoordsRef = useRef(startCoords)
  const isFullscreenRef = useRef(isFullscreen)
  routePointsRef.current = routePoints
  vehiclePositionRef.current = vehiclePosition
  endCoordsRef.current = endCoords
  startCoordsRef.current = startCoords
  isFullscreenRef.current = isFullscreen

  const fitPadding = isFullscreen ? getFullscreenPadding() : FIT_BOUNDS_PADDING
  const [followEnabled, setFollowEnabled] = useState(false)

  const getMapInstance = useCallback(() => {
    const refVal = mapRef.current
    if (refVal?.getMap) return refVal.getMap()
    return mapInstance
  }, [mapInstance])

  useImperativeHandle(
    ref,
    () => {
      const runFitRoute = () => {
        setFollowEnabled(false)
        const points = routePointsRef.current
        const start = startCoordsRef.current
        const end = endCoordsRef.current
        const list = Array.isArray(points) && points.length >= 2
          ? points
          : start?.length === 2 && end?.length === 2
            ? [start, end]
            : null
        if (!list?.length) return
        const all = [...list]
        if (start?.length === 2 && !all.some((p) => p[0] === start[0] && p[1] === start[1])) all.push(start)
        if (end?.length === 2 && !all.some((p) => p[0] === end[0] && p[1] === end[1])) all.push(end)
        const lngs = all.map((p) => Number(p[1]))
        const lats = all.map((p) => Number(p[0]))
        let minLng = Math.min(...lngs)
        let maxLng = Math.max(...lngs)
        let minLat = Math.min(...lats)
        let maxLat = Math.max(...lats)
        const minDelta = 0.01
        if (maxLng - minLng < minDelta) {
          minLng -= minDelta
          maxLng += minDelta
        }
        if (maxLat - minLat < minDelta) {
          minLat -= minDelta
          maxLat += minDelta
        }
        const padding = isFullscreenRef.current ? getFullscreenPadding() : FIT_BOUNDS_PADDING
        const paddingWithMargin =
          typeof padding === "number"
            ? Math.max(padding, 80)
            : {
                left: Math.max(padding.left ?? 0, 80),
                right: Math.max(padding.right ?? 0, 80),
                top: Math.max(padding.top ?? 0, 80),
                bottom: Math.max(padding.bottom ?? 0, 80),
              }
        const bounds = [
          [minLng, minLat],
          [maxLng, maxLat],
        ]
        const opts = { padding: paddingWithMargin, maxZoom: 18, duration: FLY_DURATION }
        const map = getMapInstance()
        const mapRefVal = mapRef.current
        const target = mapRefVal?.fitBounds ? mapRefVal : map
        if (target?.fitBounds) {
          if (typeof target.resize === "function") target.resize()
          target.fitBounds(bounds, opts)
        } else if (map) {
          if (typeof map.resize === "function") map.resize()
          map.fitBounds(bounds, opts)
        }
      }
      return {
        getMap: getMapInstance,
        flyToCurrentLocation: () => {
          setFollowEnabled(true)
          const map = getMapInstance()
          const pos = vehiclePositionRef.current
          if (!map || !pos || !Array.isArray(pos)) return
          const [lat, lng] = pos
          map.flyTo({
            center: [lng, lat],
            zoom: TRACKING_MAP_VIEW.zoom,
            pitch: TRACKING_MAP_VIEW.pitch,
            duration: FLY_DURATION,
          })
        },
        flyToDestination: () => {
          setFollowEnabled(false)
          const map = getMapInstance()
          const end = endCoordsRef.current
          if (!map || !end?.length) return
          map.flyTo({
            center: [end[1], end[0]],
            zoom: TRACKING_MAP_VIEW.zoom,
            pitch: TRACKING_MAP_VIEW.pitch,
            duration: FLY_DURATION,
          })
        },
        fitRoute: () => {
          runFitRoute()
        },
      }
    },
    [mapInstance, getMapInstance]
  )

  const fitDoneRef = useRef(false)
  const onLoad = useCallback(
    (e) => {
      const map = e.target
      setMapInstance(map)
      if (!fitDoneRef.current && routePoints?.length >= 2) {
        fitDoneRef.current = true
        const lngs = routePoints.map((p) => p[1])
        const lats = routePoints.map((p) => p[0])
        map.fitBounds(
          [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
          ],
          { padding: fitPadding, maxZoom: 16, duration: 800 }
        )
      }
    },
    [routePoints, fitPadding]
  )

  useEffect(() => {
    if (!vehiclePosition || !cameraFollow) return
    const t = setTimeout(() => setFollowEnabled(true), 1200)
    return () => clearTimeout(t)
  }, [vehiclePosition, cameraFollow])

  const center = useRef(null)
  if (routePoints?.length >= 2) {
    const mid = Math.floor(routePoints.length / 2)
    center.current = [
      routePoints[mid][1],
      routePoints[mid][0],
    ]
  } else if (startCoords?.length && endCoords?.length) {
    center.current = [
      (startCoords[1] + endCoords[1]) / 2,
      (startCoords[0] + endCoords[0]) / 2,
    ]
  }
  const initialViewState = {
    longitude: center.current?.[0] ?? DEFAULT_CENTER[0],
    latitude: center.current?.[1] ?? DEFAULT_CENTER[1],
    zoom: TRACKING_MAP_VIEW.zoom,
    pitch: TRACKING_MAP_VIEW.pitch,
    minZoom: TRACKING_MAP_VIEW.minZoom,
    maxZoom: TRACKING_MAP_VIEW.maxZoom,
  }

  const vehicleLngLat =
    vehiclePosition && Array.isArray(vehiclePosition)
      ? [vehiclePosition[1], vehiclePosition[0]]
      : null

  useCameraFollowMapbox(
    followEnabled && vehicleLngLat ? mapInstance : null,
    vehicleLngLat,
    {
      enabled: followEnabled && !!vehicleLngLat && cameraFollow,
      zoom: TRACKING_MAP_VIEW.zoom,
      pitch: TRACKING_MAP_VIEW.pitch,
    }
  )

  return (
    <Map
      ref={mapRef}
      onLoad={onLoad}
      initialViewState={initialViewState}
      mapStyle={mapStyle}
      style={{ width: "100%", height: "100%", ...style }}
      className={className}
      reuseMaps
      dragPan
      touchZoomRotate
      scrollZoom
      doubleClickZoom
    >
      <ScaleControl position="bottom-left" maxWidth={120} unit="metric" />
      <NavigationControl position="top-right" showCompass showZoom visualizePitch={false} />
      {hasTrafficLayer() && <TrafficOverlayMapbox visible={showTraffic} />}
      <RouteLineMapbox
        routePoints={routePoints}
        paint={
          isMobile
            ? { ...ROUTE_LINE_PAINT, "line-width": 7 }
            : ROUTE_LINE_PAINT
        }
        outlinePaint={
          isMobile
            ? {
                ...(theme === "dark"
                  ? ROUTE_LINE_OUTLINE_PAINT_DARK
                  : ROUTE_LINE_OUTLINE_PAINT),
                "line-width": 14,
              }
            : theme === "dark"
              ? ROUTE_LINE_OUTLINE_PAINT_DARK
              : ROUTE_LINE_OUTLINE_PAINT
        }
      />
      {endCoords?.length === 2 && (
        <DestinationMarkerMapbox position={endCoords} />
      )}
      <VehicleMarkerMapbox position={vehiclePosition} bearing={vehicleBearing} />
    </Map>
  )
})

export default TrackingMapMapbox
