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
    if (error.response?.status === 401) {
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
}

// API des trajets
export const tripsAPI = {
  getTrips: (params) => api.get("/trips", { params }),
  getMyTrips: (params) => api.get("/trips/my-trips", { params }),
  getTripById: (id) => api.get(`/trips/${id}`),
  createTrip: (tripData) => api.post("/trips", tripData),
  updateTrip: (id, tripData) => api.put(`/trips/${id}`, tripData),
  deleteTrip: (id) => api.delete(`/trips/${id}`),
  completeTrip: (id) => api.post(`/trips/${id}/complete`),
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
  confirmDelivery: (id, signature) => api.put(`/requests/${id}/delivery-confirm`, { signature }),
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
  uploadAvatar: (formData) =>
    api.post("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getStats: () => api.get("/users/stats"),
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
}

export default api
