'use client'

import { useEffect, useState } from 'react'
import { requestNotificationPermission } from '@/lib/push-notifications'
import { ServiceWorkerRegistration } from '@/components/service-worker-registration'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Analytics } from '@/components/Analytics'
import { ThemeProvider } from '@/components/ThemeProvider'

export function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false)

  useEffect(() => {
    // Request notification permission
    requestNotificationPermission()
      .catch(error => {
        console.error('Error requesting notification permission:', error)
      })

    // Handle service worker updates
    const handleServiceWorkerUpdate = () => {
      setShowUpdateNotification(true)
    }

    window.addEventListener('serviceWorkerUpdateAvailable', handleServiceWorkerUpdate)

    return () => {
      window.removeEventListener('serviceWorkerUpdateAvailable', handleServiceWorkerUpdate)
    }
  }, [])

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ServiceWorkerRegistration />
        {children}
        <Analytics />
        {showUpdateNotification && (
          <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg">
            <p className="mb-2">A new version is available</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
            >
              Update Now
            </button>
          </div>
        )}
      </ThemeProvider>
    </ErrorBoundary>
  )
} 