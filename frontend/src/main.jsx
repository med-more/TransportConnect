import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import App from "./App.jsx"
import "./index.css"
import { AuthProvider } from "./contexts/AuthContext.jsx"
import { SocketProvider } from "./contexts/SocketContext.jsx"

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
        <SocketProvider>
          <BrowserRouter>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#fff",
                  color: "#523E8C",
                  fontFamily: "Poppins",
                },
                success: {
                  className: "toast-success",
                  iconTheme: {
                    primary: "#fff",
                    secondary: "#4CAF50",
                  },
                },
                error: {
                  className: "toast-error",
                  iconTheme: {
                    primary: "#fff",
                    secondary: "#F44336",
                  },
                },
              }}
            />
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
