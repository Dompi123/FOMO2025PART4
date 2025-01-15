'use client'

import { useEffect } from 'react'
import { requestNotificationPermission } from '@/lib/push-notifications'
import { ServiceWorkerRegistration } from '@/components/service-worker-registration'
import { ErrorBoundary } from '../src/components/ErrorBoundary'
import { Analytics } from '../src/components/Analytics'
import { ThemeProvider } from '../src/components/ThemeProvider'
import { ViewportHeightFix } from './components/viewport-fix'

export function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    requestNotificationPermission()
      .catch(error => {
        console.error('Error requesting notification permission:', error)
      })
  }, [])

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ViewportHeightFix />
        <ServiceWorkerRegistration />
        {children}
        <Analytics />
      </ThemeProvider>
    </ErrorBoundary>
  )
} 