/* Service worker for Web Push – TransportConnect */
self.addEventListener("push", (event) => {
  if (!event.data) return
  let data = { title: "TransportConnect", body: "", url: "/" }
  try {
    data = { ...data, ...event.data.json() }
  } catch (_) {}
  const options = {
    body: data.body,
    icon: "/icons/map-pin-start.svg",
    badge: "/icons/map-pin-start.svg",
    data: { url: data.url || "/" },
    tag: "transportconnect-" + Date.now(),
    renotify: true,
  }
  event.waitUntil(self.registration.showNotification(data.title || "TransportConnect", options))
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = event.notification.data?.url || "/"
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      if (clients.openWindow) return clients.openWindow(self.location.origin + (url.startsWith("/") ? url : "/" + url))
    })
  )
})
