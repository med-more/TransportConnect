import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Settings, Globe, Euro, DollarSign, Check, Bell } from "../utils/icons"
import Card from "../components/ui/Card"
import { useLocale, LANGUAGES, CURRENCIES } from "../contexts/LocaleContext"
import { useTranslation } from "../i18n/useTranslation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { usersAPI, configAPI } from "../services/api"
import toast from "react-hot-toast"
import clsx from "clsx"

function CurrencyIcon({ code }) {
  if (code === "EUR") return <Euro className="w-5 h-5 sm:w-6 sm:h-6" />
  if (code === "USD") return <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
  return (
    <span className="text-base sm:text-lg font-semibold text-foreground" aria-hidden>
      د.م.
    </span>
  )
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}

export default function SettingsPage() {
  const { language, setLanguage, currency, setCurrency } = useLocale()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [pushSubscribing, setPushSubscribing] = useState(false)

  const { data: notifPrefs = { email: true, push: true }, isLoading: notifPrefsLoading } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: () => usersAPI.getNotificationPreferences(),
  })

  const updatePrefsMutation = useMutation({
    mutationFn: (prefs) => usersAPI.updateNotificationPreferences(prefs),
    onSuccess: (data) => {
      queryClient.setQueryData(["notification-preferences"], data)
      toast.success(t("settings.notificationPrefsSaved") || "Preferences saved")
    },
    onError: () => toast.error(t("settings.errorSavingPrefs") || "Failed to save"),
  })

  const requestPushPermission = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      toast.error(t("settings.pushNotSupported") || "Browser does not support push notifications")
      return
    }
    setPushSubscribing(true)
    try {
      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" })
      await reg.ready
      const vapidKey = await configAPI.getVapidPublicKey()
      if (!vapidKey) {
        toast.error(t("settings.pushNotConfigured") || "Push notifications are not configured on the server")
        setPushSubscribing(false)
        return
      }
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        toast.error(t("settings.pushPermissionDenied") || "Permission denied")
        setPushSubscribing(false)
        return
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })
      const json = sub.toJSON()
      const subscription = { endpoint: json.endpoint, keys: json.keys }
      await usersAPI.addPushSubscription(subscription)
      toast.success(t("settings.pushEnabled") || "Browser notifications enabled")
    } catch (err) {
      console.error(err)
      toast.error(err.message || (t("settings.errorEnablingPush") || "Failed to enable push"))
    } finally {
      setPushSubscribing(false)
    }
  }, [t])

  return (
    <div className="w-full max-w-3xl mx-auto px-3 py-4 sm:px-4 sm:py-5 md:px-5 lg:px-6 space-y-6 sm:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl">
          <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t("settings.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("settings.subtitle")}</p>
        </div>
      </motion.div>

      {/* Language */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground">{t("settings.language")}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">{t("settings.languageHint")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.code
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={clsx(
                    "relative flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 min-h-[56px] sm:min-h-[64px]",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-card hover:border-primary/30 hover:bg-accent/50"
                  )}
                  aria-pressed={isSelected}
                  aria-label={`Select ${lang.label}`}
                >
                  <span className="text-2xl sm:text-3xl select-none" aria-hidden>
                    {lang.flag}
                  </span>
                  <span className="flex-1 font-medium text-foreground text-sm sm:text-base truncate">
                    {lang.label}
                  </span>
                  {isSelected && (
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </Card>
      </motion.section>

      {/* Currency */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <Euro className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground">{t("settings.currency")}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">{t("settings.currencyHint")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {CURRENCIES.map((curr) => {
              const isSelected = currency === curr.code
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => setCurrency(curr.code)}
                  className={clsx(
                    "relative flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 min-h-[56px] sm:min-h-[64px]",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-card hover:border-primary/30 hover:bg-accent/50"
                  )}
                  aria-pressed={isSelected}
                  aria-label={`Select ${curr.label} (${curr.symbol})`}
                >
                  <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent text-primary shrink-0">
                    <CurrencyIcon code={curr.code} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-foreground text-sm sm:text-base block truncate">
                      {curr.code}
                    </span>
                    <span className="text-xs text-muted-foreground truncate block">{curr.label}</span>
                  </div>
                  {isSelected && (
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </Card>
      </motion.section>

      {/* Notifications */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground">
                {t("settings.notifications") || "Notifications"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t("settings.notificationsHint") || "Choose how you want to be notified."}
              </p>
            </div>
          </div>
          {notifPrefsLoading ? (
            <div className="h-20 flex items-center justify-center text-muted-foreground text-sm">Loading…</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                <div>
                  <p className="font-medium text-foreground text-sm sm:text-base">
                    {t("settings.emailNotifications") || "Email notifications"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.emailNotificationsHint") || "Receive emails for requests and delivery updates"}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifPrefs.email}
                  onClick={() => updatePrefsMutation.mutate({ email: !notifPrefs.email })}
                  disabled={updatePrefsMutation.isPending}
                  className={clsx(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:opacity-50",
                    notifPrefs.email ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={clsx(
                      "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition",
                      notifPrefs.email ? "translate-x-5" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                <div>
                  <p className="font-medium text-foreground text-sm sm:text-base">
                    {t("settings.pushNotifications") || "Browser push notifications"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.pushNotificationsHint") || "Get notified even when the tab is in background"}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifPrefs.push}
                  onClick={() => updatePrefsMutation.mutate({ push: !notifPrefs.push })}
                  disabled={updatePrefsMutation.isPending}
                  className={clsx(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:opacity-50",
                    notifPrefs.push ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={clsx(
                      "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition",
                      notifPrefs.push ? "translate-x-5" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
              {notifPrefs.push && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={requestPushPermission}
                    disabled={pushSubscribing}
                    className="rounded-xl border border-primary bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                  >
                    {pushSubscribing
                      ? (t("settings.requestingPermission") || "Requesting…")
                      : (t("settings.allowBrowserNotifications") || "Allow browser notifications")}
                  </button>
                </div>
              )}
            </div>
          )}
        </Card>
      </motion.section>
    </div>
  )
}
