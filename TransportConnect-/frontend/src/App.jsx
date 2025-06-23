import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useAuth } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import Layout from "./components/Layout"
import AdminLayout from "./components/AdminLayout"

import WelcomePage from "./pages/auth/WelcomePage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"

import DashboardPage from "./pages/dashboard/DashboardPage"
import TripsPage from "./pages/trips/TripsPage"
import TripDetailPage from "./pages/trips/TripDetailPage"
import CreateTripPage from "./pages/trips/CreateTripPage"
import RequestsPage from "./pages/requests/RequestsPage"
import RequestDetailPage from "./pages/requests/RequestDetailPage"
import CreateRequestPage from "./pages/requests/CreateRequestPage"
import ProfilePage from "./pages/ProfilePage"

import AdminDashboardPage from "./pages/admin/AdminDashboardPage"
import AdminUsersPage from "./pages/admin/AdminUsersPage"
import AdminTripsPage from "./pages/admin/AdminTripsPage"
import AdminRequestsPage from "./pages/admin/AdminRequestsPage"
import AdminVerificationsPage from "./pages/admin/AdminVerificationsPage"

function AppRoutes() {
  const { user, isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute><WelcomePage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

      {/* Protected user routes with Layout */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          {isAuthenticated && user?.role === "admin" ? <Navigate to="/admin" replace /> : <DashboardPage />}
        </ProtectedRoute>
      } />
      <Route path="/trips" element={<ProtectedRoute><TripsPage /></ProtectedRoute>} />
      <Route path="/trips/create" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />
      <Route path="/trips/:id" element={<ProtectedRoute><TripDetailPage /></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
      <Route path="/requests/create/:tripId" element={<ProtectedRoute><CreateRequestPage /></ProtectedRoute>} />
      <Route path="/requests/:id" element={<ProtectedRoute><RequestDetailPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Admin routes with AdminLayout */}
      {isAuthenticated && user?.role === "admin" && (
        <>
          <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/trips" element={<ProtectedRoute><AdminTripsPage /></ProtectedRoute>} />
          <Route path="/admin/requests" element={<ProtectedRoute><AdminRequestsPage /></ProtectedRoute>} />
          <Route path="/admin/verifications" element={<ProtectedRoute><AdminVerificationsPage /></ProtectedRoute>} />
        </>
      )}

      
    </Routes>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-background">
      <AppRoutes />
    </div>
  )
}

export default App
