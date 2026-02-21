import L from "leaflet"
import { MAP_ICONS } from "../../config/mapIcons"

/** inDrive-style colors */
export const INDRIVE_ORANGE = "#ff8200"
export const INDRIVE_GREEN = "#00c853"
export const INDRIVE_RED = "#e53935"

/**
 * Map pin using real icon from public/icons (replace with Flaticon download).
 * Anchor at bottom so pin tip is on the location.
 */
function createPinIcon(iconUrl, size = 34) {
  const height = size + 8
  const html = `
    <div style="
      width: ${size}px;
      height: ${height}px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));
    ">
      <img src="${iconUrl}" alt="" style="width:${size}px;height:${size}px;object-fit:contain;display:block;" />
    </div>
  `
  return L.divIcon({
    html,
    className: "indrive-pin",
    iconSize: [size, height],
    iconAnchor: [size / 2, height],
  })
}

export function createStartPinIcon() {
  return createPinIcon(MAP_ICONS.pinStart, 36)
}

export function createEndPinIcon() {
  return createPinIcon(MAP_ICONS.pinEnd, 36)
}
