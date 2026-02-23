// Must be a full URL (e.g. https://your-backend.up.railway.app/api). No trailing slash after /api.
const rawApi = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000/api"
export const API_BASE_URL =
  rawApi.startsWith("http://") || rawApi.startsWith("https://")
    ? rawApi.replace(/\/$/, "")
    : rawApi.startsWith("/")
      ? "http://localhost:7000/api"
      : `https://${rawApi.replace(/\/$/, "")}`

const rawSocket = import.meta.env.VITE_SOCKET_URL || "http://localhost:7000"
export const SOCKET_URL =
  rawSocket.startsWith("http://") || rawSocket.startsWith("https://")
    ? rawSocket.replace(/\/$/, "")
    : rawSocket.startsWith("/")
      ? "http://localhost:7000"
      : `https://${rawSocket.replace(/\/$/, "")}`

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
}

export const CARGO_TYPES = [
  { value: "fragile", label: "Fragile" },
  { value: "liquide", label: "Liquide" },
  { value: "dangereux", label: "Dangereux" },
  { value: "alimentaire", label: "Alimentaire" },
  { value: "electronique", label: "Électronique" },
  { value: "textile", label: "Textile" },
  { value: "mobilier", label: "Mobilier" },
  { value: "autre", label: "Autre" },
]

export const VEHICLE_TYPES = [
  { value: "camion", label: "Camion" },
  { value: "camionnette", label: "Camionnette" },
  { value: "voiture", label: "Voiture" },
  { value: "moto", label: "Moto" },
]

export const REQUEST_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
}

export const TRIP_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
}

export const USER_ROLES = {
  DRIVER: "conducteur",
  SENDER: "expediteur",
  ADMIN: "admin",
}
