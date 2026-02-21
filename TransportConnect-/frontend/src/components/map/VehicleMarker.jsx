import { Marker } from "react-leaflet"
import L from "leaflet"
import { MAP_ICONS } from "../../config/mapIcons"

/**
 * Truck marker: icon only, no circle. Rotates with bearing.
 */
function createVehicleIcon(bearing = 0) {
  const html = `
    <div class="vehicle-marker" style="
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(${bearing}deg);
      transition: transform 0.2s ease-out;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
    ">
      <img src="${MAP_ICONS.vehicle}" alt="" style="width:48px;height:48px;object-fit:contain;display:block;" />
    </div>
  `
  return L.divIcon({
    html,
    className: "vehicle-marker-wrap",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  })
}

export default function VehicleMarker({ position, bearing = 0 }) {
  if (!position) return null
  return <Marker position={position} icon={createVehicleIcon(bearing)} zIndexOffset={1000} />
}
