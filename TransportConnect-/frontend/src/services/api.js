import axios from "axios"
import { API_BASE_URL } from "../config/constants"
import toast from "react-hot-toast"
console.log("✅ API_BASE_URL used by axios:", API_BASE_URL)


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect if it's not a login request (to avoid redirecting during login errors)
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      // Token expiré ou invalide
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
      toast.error("Session expirée, veuillez vous reconnecter")
    }
    return Promise.reject(error)
  },
)

// API d'authentification
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/me"),
  refreshToken: () => api.post("/auth/refresh"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.post("/auth/reset-password", { token, password }),
}

// API des trajets
export const tripsAPI = {
  getTrips: (params) => api.get("/trips", { params }).then((r) => r.data),
  getMyTrips: (params) => api.get("/trips/my-trips", { params }).then((r) => r.data),
  getTripById: (id) => api.get(`/trips/${id}`).then((r) => r.data),
  createTrip: (tripData) => api.post("/trips", tripData),
  updateTrip: (id, tripData) => api.put(`/trips/${id}`, tripData),
  deleteTrip: (id) => api.delete(`/trips/${id}`),
  completeTrip: (id) => api.post(`/trips/${id}/complete`),
}

// API des trajets récurrents
export const recurringTripsAPI = {
  list: () => api.get("/recurring-trips").then((r) => r.data?.recurringTrips ?? []),
  getById: (id) => api.get(`/recurring-trips/${id}`).then((r) => r.data?.recurringTrip),
  create: (data) => api.post("/recurring-trips", data).then((r) => r.data?.recurringTrip),
  update: (id, data) => api.patch(`/recurring-trips/${id}`, data).then((r) => r.data?.recurringTrip),
  delete: (id) => api.delete(`/recurring-trips/${id}`),
}

// API des demandes
export const requestsAPI = {
  getRequests: (params) => api.get("/requests", { params }),
  getReceivedRequests: (params) => api.get("/requests/received", { params }),
  getRequestById: (id) => api.get(`/requests/${id}`),
  createRequest: (requestData) => api.post("/requests", requestData),
  acceptRequest: (id, message) => api.put(`/requests/${id}/accept`, { message }),
  rejectRequest: (id, message) => api.put(`/requests/${id}/reject`, { message }),
  cancelRequest: (id) => api.put(`/requests/${id}/cancel`),
  confirmPickup: (id) => api.put(`/requests/${id}/pickup-confirm`),
  confirmDelivery: (id, data = {}) => {
    const { signature = "", podNotes = "", podPhoto } = data
    if (podPhoto instanceof File) {
      const form = new FormData()
      form.append("signature", signature)
      form.append("podNotes", podNotes)
      form.append("podPhoto", podPhoto)
      return api.put(`/requests/${id}/delivery-confirm`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    }
    return api.put(`/requests/${id}/delivery-confirm`, { signature, podNotes })
  },
  getPriceEstimate: (tripId, weight) => api.post("/requests/estimate", { tripId, weight }),
  submitRating: (id, rating, comment) => api.post(`/requests/${id}/rating`, { rating, comment }),
}

// API des évaluations
export const reviewsAPI = {
  getReviews: (userId) => api.get(`/reviews/user/${userId}`),
  createReview: (reviewData) => api.post("/reviews", reviewData),
  getMyReviews: () => api.get("/reviews/my-reviews"),
}

// API des utilisateurs
export const usersAPI = {
  updateProfile: (userData) => api.put("/users/profile", userData),
  updateLastSeen: () => api.put("/users/me/last-seen"),
  uploadAvatar: (formData) =>
    api.post("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getStats: () => api.get("/users/stats"),
  getSavedAddresses: () => api.get("/users/saved-addresses").then((r) => r.data?.data ?? []),
  addSavedAddress: (data) => api.post("/users/saved-addresses", data).then((r) => r.data?.data),
  updateSavedAddress: (id, data) => api.put(`/users/saved-addresses/${id}`, data).then((r) => r.data?.data),
  deleteSavedAddress: (id) => api.delete(`/users/saved-addresses/${id}`),
  getNotificationPreferences: () => api.get("/users/me/notification-preferences").then((r) => r.data?.data ?? { email: true, push: true }),
  updateNotificationPreferences: (prefs) => api.patch("/users/me/notification-preferences", prefs).then((r) => r.data?.data),
  addPushSubscription: (subscription) => api.post("/users/push-subscription", subscription),
  removePushSubscription: (endpoint) => api.delete("/users/push-subscription", { data: { endpoint } }),
}

// Config (e.g. for Web Push)
export const configAPI = {
  getVapidPublicKey: () => api.get("/config/vapid-public-key").then((r) => r.data?.vapidPublicKey ?? null),
}

// Route-based estimate (distance, duration, price) — no auth required
export const estimateAPI = {
  getRouteEstimate: (fromLat, fromLng, toLat, toLng, weight) =>
    api.post("/estimate/route", { fromLat, fromLng, toLat, toLng, weight }).then((r) => r.data),
  /** waypoints: [{ lat, lng }, ...] (at least 2 points) */
  getRouteEstimateMulti: (waypoints, weight) =>
    api.post("/estimate/route-multi", { waypoints, weight }).then((r) => r.data),
}

// API des notifications
export const notificationsAPI = {
  getNotifications: (params) => api.get("/notifications", { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/all/read"),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
}

// API des conversations (driver–shipper chat)
export const chatAPI = {
  getConversations: () => api.get("/chats"),
  getUnreadCount: () => api.get("/chats/unread-count"),
  getConversationByRequest: (requestId) => api.get(`/chats/by-request/${requestId}`),
  getMessages: (conversationId) => api.get(`/chats/${conversationId}/messages`),
  sendMessage: (conversationId, content) =>
    api.post(`/chats/${conversationId}/messages`, { content }),
  reactToMessage: (conversationId, messageId, emoji) =>
    api.put(`/chats/${conversationId}/messages/${messageId}/react`, { emoji }),
  markAsRead: (conversationId) => api.put(`/chats/${conversationId}/read`),
}

// Document verification (KYC) — drivers upload; admin approve/reject
export const documentsAPI = {
  list: (params) => api.get("/documents", { params }).then((r) => r.data?.documents ?? []),
  getById: (id) => api.get(`/documents/${id}`).then((r) => r.data?.document),
  upload: (formData) =>
    api.post("/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data?.document),
  update: (id, data) => api.patch(`/documents/${id}`, data).then((r) => r.data?.document),
  delete: (id) => api.delete(`/documents/${id}`),
}

// API d'administration
export const adminAPI = {
  getAllUsers: () => api.get("/admin/users").then(res => ({ data: res.data.users })),
  verifyUser: (userId) => api.post(`/admin/verifications/${userId}/validate`),
  suspendUser: (userId) => api.put(`/admin/users/${userId}/toggle-active`),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getAllTrips: () => api.get("/admin/trips").then(res => ({ data: res.data.trips })),
  updateTripStatus: (tripId, data) => api.patch(`/admin/trips/${tripId}/status`, data),
  deleteTrip: (tripId) => api.delete(`/admin/trips/${tripId}`),
  getAllRequests: () => api.get("/admin/requests").then(res => ({ data: res.data.requests })),
  updateRequestStatus: (requestId, data) => api.patch(`/admin/requests/${requestId}/status`, data),
  deleteRequest: (requestId) => api.delete(`/admin/requests/${requestId}`),
  getStats: () => api.get("/admin/stats").then(res => res.data),
  updateUserVehicle: (userId, vehicleInfo) =>
    api.patch(`/admin/users/${userId}/vehicle`, { vehicleInfo }).then(res => res.data),
}

export default api
