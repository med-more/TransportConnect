/**
 * Map marker icon paths.
 * Vehicle: Flaticon "Box truck" - https://www.flaticon.com/free-icon/box-truck_1048329
 * Destination: Flaticon "Placeholder" - https://www.flaticon.com/free-icon/placeholder_854904
 * Attribution: Icons by Freepik from flaticon.com
 */
const BASE = "/icons"

/** Flaticon box truck (Freepik) */
export const FLATICON_BOX_TRUCK =
  "https://cdn-icons-png.flaticon.com/256/1048/1048329.png"

/** Destination pin: use local file (replace with Flaticon placeholder_854904 download if desired) */
export const MAP_ICONS = {
  pinStart: `${BASE}/map-pin-start.svg`,
  pinEnd: `${BASE}/map-pin-end.svg`,
  vehicle: FLATICON_BOX_TRUCK,
}
