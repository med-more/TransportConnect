import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useAuth } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import Layout from "./components/Layout"

import WelcomePage from "./pages/auth/WelcomePage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import GoogleCallbackPage from "./pages/auth/GoogleCallbackPage"
import RoleSelectionPage from "./pages/auth/RoleSelectionPage"

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
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
      <Route path="/auth/google/callback" element={<PublicRoute><GoogleCallbackPage /></PublicRoute>} />
      <Route path="/auth/select-role" element={<PublicRoute><RoleSelectionPage /></PublicRoute>} />

      {/* Protected user routes with Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              {isAuthenticated && user?.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <DashboardPage />
              )}
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <Layout>
              <TripsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/create"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateTripPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <TripDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <Layout>
              <RequestsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/create"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateRequestPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/create/:tripId"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateRequestPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <RequestDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin routes with Layout */}
      {isAuthenticated && user?.role === "admin" && (
        <>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminDashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminUsersPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/trips"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminTripsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminRequestsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verifications"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminVerificationsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </>
      )}

      
    </Routes>
  )
}

function App() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <AppRoutes />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#111827",
            border: "1px solid #e5e7eb",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  )
}

export default App
