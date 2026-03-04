import { useTranslation } from "../i18n/useTranslation"
import LiveMap from "../components/map/LiveMap"

// Default route: Casablanca → Rabat
const DEFAULT_START = [33.5731, -7.5898]
const DEFAULT_END = [34.0209, -6.8416]

export default function LiveMapPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none px-4 py-3 border-b border-border bg-card">
        <h1 className="text-lg font-semibold text-foreground">
          {t("liveMap.title", "Live Tracking")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t(
            "liveMap.subtitle",
            "Real-time 3D marker via Socket.io driverLocation. OSRM route shown."
          )}
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <LiveMap
          startCoords={DEFAULT_START}
          endCoords={DEFAULT_END}
          initialCenter={[-6.9, 33.8]}
          initialZoom={10}
          className="rounded-b-lg"
          style={{ minHeight: "400px" }}
        />
      </div>
    </div>
  )
}
