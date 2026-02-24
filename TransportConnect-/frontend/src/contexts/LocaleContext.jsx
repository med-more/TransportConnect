import { createContext, useContext, useEffect, useState } from "react"

const STORAGE_KEY = "transportconnect-locale"

export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇲🇦" },
]

export const CURRENCIES = [
  { code: "MAD", symbol: "د.م.", label: "Moroccan Dirham" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "USD", symbol: "$", label: "US Dollar" },
]

/** Base currency for stored prices (backend). Conversion rates to display currency. */
const RATES_FROM_EUR = { EUR: 1, MAD: 10.5, USD: 1.08 }

export function formatCurrency(amount, currencyCode, options = {}) {
  if (amount == null || amount === "" || Number.isNaN(Number(amount))) return options.fallback ?? "—"
  const num = Number(amount)
  const rate = RATES_FROM_EUR[currencyCode] ?? 1
  const converted = num * rate
  const decimals = options.decimals ?? 2
  const formatted = converted.toFixed(decimals)
  const curr = CURRENCIES.find((c) => c.code === currencyCode)
  const symbol = curr?.symbol ?? currencyCode
  if (currencyCode === "MAD") return `${formatted} ${symbol}`
  return `${formatted} ${symbol}`
}

const LocaleContext = createContext({
  language: "en",
  setLanguage: () => {},
  currency: "EUR",
  setCurrency: () => {},
})

function getStored() {
  if (typeof window === "undefined") return { language: "en", currency: "EUR" }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { language: "en", currency: "EUR" }
    const parsed = JSON.parse(raw)
    return {
      language: LANGUAGES.some((l) => l.code === parsed.language) ? parsed.language : "en",
      currency: CURRENCIES.some((c) => c.code === parsed.currency) ? parsed.currency : "EUR",
    }
  } catch {
    return { language: "en", currency: "EUR" }
  }
}

export function LocaleProvider({ children }) {
  const [language, setLanguageState] = useState("en")
  const [currency, setCurrencyState] = useState("EUR")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const { language: l, currency: c } = getStored()
    setLanguageState(l)
    setCurrencyState(c)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ language, currency }))
  }, [language, currency, mounted])

  useEffect(() => {
    if (typeof document === "undefined") return
    const root = document.documentElement
    root.lang = language === "ar" ? "ar" : language === "fr" ? "fr" : "en"
    root.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  const setLanguage = (code) => {
    if (LANGUAGES.some((l) => l.code === code)) setLanguageState(code)
  }

  const setCurrency = (code) => {
    if (CURRENCIES.some((c) => c.code === code)) setCurrencyState(code)
  }

  const formatPrice = (amount, opts) => formatCurrency(amount, currency, opts)

  return (
    <LocaleContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        formatCurrency: formatPrice,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}
