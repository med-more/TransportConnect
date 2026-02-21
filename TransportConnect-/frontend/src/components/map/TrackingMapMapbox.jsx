import { useRef, useState, useEffect, useCallback } from "react"
import Map from "react-map-gl/maplibre"
import "maplibre-gl/src/css/maplibre-gl.css"
import { useTheme } from "../../contexts/ThemeContext"
import { MAPLIBRE_STYLES, TRACKING_MAP_VIEW } from "../../config/mapLibreConfig"
import { useCameraFollowMapbox } from "../../hooks/useCameraFollowMapbox"
import RouteLineMapbox from "./RouteLineMapbox"
import VehicleMarkerMapbox from "./VehicleMarkerMapbox"
import StartMarkerMapbox from "./StartMarkerMapbox"
import DestinationMarkerMapbox from "./DestinationMarkerMapbox"

const DEFAULT_CENTER = [-5, 32]

/**
 * MapLibre GL tracking map (free, no API key): pitch 45°, zoom 15–17,
 * route line, start/destination/vehicle markers, smooth camera follow.
 */
export default function TrackingMapMapbox({
  routePoints = [],
  startCoords,
  endCoords,
  vehiclePosition,
  vehicleBearing = 0,
  cameraFollow = true,
  className = "",
  style = {},
}) {
  const mapRef = useRef(null)
  const [mapInstance, setMapInstance] = useState(null)
  const { theme } = useTheme()
  const mapStyle = theme === "dark" ? MAPLIBRE_STYLES.night : MAPLIBRE_STYLES.day

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
          { padding: 48, maxZoom: 16, duration: 800 }
        )
      }
    },
    [routePoints]
  )

  const [followEnabled, setFollowEnabled] = useState(false)
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
    >
      <RouteLineMapbox routePoints={routePoints} />
      {startCoords?.length === 2 && <StartMarkerMapbox position={startCoords} />}
      {endCoords?.length === 2 && (
        <DestinationMarkerMapbox position={endCoords} />
      )}
      <VehicleMarkerMapbox position={vehiclePosition} bearing={vehicleBearing} />
    </Map>
  )
}
