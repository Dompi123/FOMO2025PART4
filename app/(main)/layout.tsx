'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { BottomNav } from '@/components/BottomNav'
import type { Screen } from '@/types'

const pathToScreen: Record<string, Screen> = {
  '/venues': 'venues',
  '/passes': 'passes',
  '/profile': 'profile'
}

const screenToPath: Record<Screen, string> = {
  venues: '/venues',
  venue: '/venues',
  passes: '/passes',
  profile: '/profile',
  menu: '/venues',
  checkout: '/venues'
}

const getInitialScreen = (pathname: string): Screen => {
  // Handle dynamic venue routes
  if (pathname.startsWith('/venues/')) {
    return 'menu'
  }
  return pathToScreen[pathname] || 'venues'
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => 
    getInitialScreen(pathname)
  )

  // Sync screen state with URL and handle browser navigation
  const syncScreenState = useCallback(() => {
    const screen = getInitialScreen(pathname)
    const currentState = window.history.state

    // Update screen state if it differs from current
    if (screen && screen !== currentScreen) {
      setCurrentScreen(screen)
      
      // Update history state to include screen info
      if (!currentState?.screen || currentState.screen !== screen) {
        window.history.replaceState(
          { ...currentState, screen },
          '',
          window.location.href
        )
      }
    }
  }, [pathname, currentScreen])

  useEffect(() => {
    syncScreenState()

    // Handle browser back/forward
    const handlePopState = () => {
      syncScreenState()
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [syncScreenState, pathname, searchParams])

  const handleScreenChange = (screen: Screen) => {
    setCurrentScreen(screen)
    const path = screenToPath[screen]
    if (path) {
      // Store screen in history state before navigation
      const currentState = window.history.state
      window.history.replaceState(
        { ...currentState, screen },
        '',
        window.location.href
      )
      router.push(path)
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#070707]">
      <main className="flex-1">
        {children}
      </main>
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={handleScreenChange}
      />
    </div>
  )
} 