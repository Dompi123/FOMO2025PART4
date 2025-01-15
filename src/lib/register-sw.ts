export async function register() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
        updateViaCache: 'none' // Don't cache service worker file
      })
      
      // Immediately check for updates
      registration.update()
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content is available, show update notification
              const event = new CustomEvent('serviceWorkerUpdateAvailable')
              window.dispatchEvent(event)
            }
          }
        })
      })

      // Check for updates every 30 minutes
      setInterval(async () => {
        try {
          await registration.update()
        } catch (error) {
          console.error('Error checking for service worker updates:', error)
        }
      }, 30 * 60 * 1000)

      // Handle service worker errors
      navigator.serviceWorker.addEventListener('error', (error) => {
        console.error('Service Worker error:', error)
        // Attempt to unregister and re-register on critical errors
        unregister().then(() => register())
      })

      return registration
    } catch (error) {
      console.error('Error registering service worker:', error)
      return null
    }
  }
  return null
}

export async function unregister() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      const success = await registration.unregister()
      if (success) {
        console.log('Service Worker unregistered successfully')
      }
    } catch (error) {
      console.error('Error unregistering service worker:', error)
    }
  }
} 