/// <reference lib="webworker" />
/// <reference lib="dom" />

import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare let self: ServiceWorkerGlobalScope

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST)

// Cache page navigations (HTML) with network-first strategy
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages-cache',
    networkTimeoutSeconds: 3,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
)

// Cache static assets with stale-while-revalidate strategy
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
)

// Cache images with cache-first strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
      }),
    ],
  })
)

// Cache API requests with network-first strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
)

// Handle offline fallback
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open('offline-fallback').then((cache) => {
      return cache.add('/offline.html')
    })
  )
})

self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html').then(response => {
          return response || new Response('Offline page not found', {
            status: 404,
            statusText: 'Not Found'
          })
        })
      })
    )
  }
})

// Handle push notifications
self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json()
  if (data) {
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.message,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
      })
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0]
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i]
          }
        }
        return client.focus()
      }
      return self.clients.openWindow('/')
    })
  )
}) 