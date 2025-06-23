import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import App from "./App.jsx"
import "./index.css"
import { AuthProvider } from "./contexts/AuthContext.jsx"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#f9fafb",
                color: "#222831",
                fontFamily: "Poppins, sans-serif",
                borderRadius: "14px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                padding: "16px 24px",
                fontSize: "1rem",
                border: "1px solid #e0e7ef",
                minWidth: "260px",
                maxWidth: "350px",
                animation: "slideIn 0.4s cubic-bezier(.4,2,.6,1)"
              },
              success: {
                style: {
                  background: "#e6f9f0",
                  color: "#256029",
                  border: "1px solid #b6e7d8",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#22c55e",
                },
              },
              error: {
                style: {
                  background: "#fff0f0",
                  color: "#b91c1c",
                  border: "1px solid #fca5a5",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#ef4444",
                },
              },
              loading: {
                style: {
                  background: "#e0e7ef",
                  color: "#222831",
                },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
