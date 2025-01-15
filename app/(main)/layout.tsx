'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense, useState } from 'react'
import { BottomNav } from '@/components/BottomNav'
import { Analytics } from '@/components/Analytics'
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
  checkout: '/venues',
  settings: '/settings'
}

const getInitialScreen = (pathname: string): Screen => {
  // Handle dynamic venue routes
  if (pathname.startsWith('/venues/')) {
    return 'menu'
  }
  return pathToScreen[pathname] || 'venues'
}

function NavigationWrapper() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => 
    getInitialScreen(pathname)
  )

  useEffect(() => {
    const screen = getInitialScreen(pathname)
    if (screen !== currentScreen) {
      setCurrentScreen(screen)
    }
  }, [pathname, currentScreen])

  const handleScreenChange = (screen: Screen) => {
    setCurrentScreen(screen)
    const path = screenToPath[screen]
    if (path) {
      router.push(path)
    }
  }

  return <BottomNav currentScreen={currentScreen} onNavigate={handleScreenChange} />
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <Suspense>
        <Analytics />
      </Suspense>
      <Suspense>
        <NavigationWrapper />
      </Suspense>
      {children}
    </div>
  )
} 