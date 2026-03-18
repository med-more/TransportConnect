import { useState, useEffect, useRef, useCallback } from "react"
import { MapPin } from "../../utils/icons"
import { searchPlaces, reverseGeocode } from "../../utils/geocode"
import clsx from "clsx"

const DEBOUNCE_MS = 400
const MAX_SUGGESTIONS = 8

function formatPlaceLabel(label) {
  const s = (label || "").trim()
  if (!s) return ""
  // Nominatim display_name often comes as: "City, Subregion, Region, Country"
  // For UX, show only the first segment (usually the city).
  return s.split(",")[0]?.trim() || s
}

/**
 * Place autocomplete for Morocco: suggestions as user types + "Ma position" (GPS).
 * Fills two form fields: city and address. Use with react-hook-form setValue + register.
 * Optional coordFields: { lat: 'fieldNameLat', lng: 'fieldNameLng' } to also set coordinates when a place is selected (for route/distance estimate).
 */
export default function PlaceAutocompleteInput({
  label,
  cityField,
  addressField,
  setValue,
  register,
  watch,
  error,
  placeholder = "Rechercher un lieu au Maroc...",
  cityRules,
  addressRules,
  coordFields,
  className,
}) {
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [myLocationLoading, setMyLocationLoading] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const wrapperRef = useRef(null)
  const debounceRef = useRef(null)

  const city = watch?.(cityField) ?? ""
  const address = watch?.(addressField) ?? ""

  // Sync visible input when form values change externally
  useEffect(() => {
    if (address && !open) setInputValue(formatPlaceLabel(address))
    else if (city && !address && !open) setInputValue(formatPlaceLabel(city))
  }, [city, address, open])

  const fetchSuggestions = useCallback(async (q) => {
    if (!q || q.length < 2) {
      setSuggestions([])
      return
    }
    setLoading(true)
    try {
      const list = await searchPlaces(q, MAX_SUGGESTIONS)
      setSuggestions(list)
      setOpen(true)
      setHighlightIndex(-1)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = inputValue.trim()
    if (q.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(q), DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [inputValue, fetchSuggestions])

  const handleSelect = (place) => {
    setValue(cityField, place.city)
    setValue(addressField, place.address)
    if (coordFields?.lat && place.lat != null) setValue(coordFields.lat, place.lat)
    if (coordFields?.lng && place.lng != null) setValue(coordFields.lng, place.lng)
    setInputValue(formatPlaceLabel(place.display_name || place.address))
    setSuggestions([])
    setOpen(false)
  }

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      return
    }
    setMyLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const result = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
            if (result) {
              setValue(cityField, result.city)
              setValue(addressField, result.address)
              if (coordFields?.lat) setValue(coordFields.lat, pos.coords.latitude)
              if (coordFields?.lng) setValue(coordFields.lng, pos.coords.longitude)
              setInputValue(formatPlaceLabel(result.display_name || result.address))
              setSuggestions([])
              setOpen(false)
            }
          } finally {
            setMyLocationLoading(false)
          }
        },
      () => setMyLocationLoading(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightIndex((i) => (i < suggestions.length - 1 ? i + 1 : i))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightIndex((i) => (i > 0 ? i - 1 : -1))
    } else if (e.key === "Enter" && highlightIndex >= 0 && suggestions[highlightIndex]) {
      e.preventDefault()
      handleSelect(suggestions[highlightIndex])
    } else if (e.key === "Escape") {
      setOpen(false)
      setHighlightIndex(-1)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={clsx("space-y-2 relative", className)} ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-foreground">{label}</label>
      )}
      <div className="relative flex gap-2">
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={clsx(
              "input-field w-full pr-10",
              error && "border-destructive focus:ring-destructive"
            )}
            aria-expanded={open}
            aria-autocomplete="list"
            aria-controls="place-suggestions"
          />
          {loading && (
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin"
              aria-hidden
            />
          )}
          {/* Hidden inputs for form registration */}
          <input type="hidden" {...register(cityField, cityRules)} />
          <input type="hidden" {...register(addressField, addressRules)} />
          {open && suggestions.length > 0 && (
            <ul
              id="place-suggestions"
              role="listbox"
              className="absolute left-0 right-0 top-full z-50 mt-1 py-1 rounded-lg border border-border bg-popover shadow-lg max-h-60 overflow-auto"
            >
              {suggestions.map((place, i) => (
                <li
                  key={`${place.lat}-${place.lng}-${i}`}
                  role="option"
                  aria-selected={highlightIndex === i}
                  className={clsx(
                    "px-3 py-2.5 text-sm cursor-pointer transition-colors truncate",
                    highlightIndex === i ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => handleSelect(place)}
                >
                  {formatPlaceLabel(place.display_name || place.address)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={handleMyLocation}
          disabled={myLocationLoading || !navigator.geolocation}
          title="Utiliser ma position actuelle"
          className={clsx(
            "flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg border border-border bg-muted/50 hover:bg-muted text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50",
            myLocationLoading && "pointer-events-none"
          )}
        >
          {myLocationLoading ? (
            <span className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin block" />
          ) : (
            <MapPin className="w-5 h-5 text-primary" />
          )}
        </button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
