import { createContext, useContext, useEffect, useState } from "react"

const STORAGE_KEY = "transportconnect-theme"

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: false,
})

function getInitialTheme() {
  if (typeof window === "undefined") return "light"
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "dark" || stored === "light") return stored
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark"
  return "light"
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setThemeState(getInitialTheme())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme, mounted])

  const setTheme = (value) => {
    if (value === "dark" || value === "light") setThemeState(value)
  }

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}

export default ThemeContext
