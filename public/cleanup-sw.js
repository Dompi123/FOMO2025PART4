// This script helps clean up service worker registrations
self.addEventListener('install', () => {
  // Skip waiting for old service workers to finish
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clear all caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      }),
      // Unregister all service workers
      self.registration.unregister()
    ])
  );
}); 