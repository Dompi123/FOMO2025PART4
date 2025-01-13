'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => 
    getInitialScreen(pathname)
  )

  // Keep navigation state in sync with URL
  useEffect(() => {
    const screen = getInitialScreen(pathname)
    if (screen) {
      setCurrentScreen(screen)
    }
  }, [pathname])

  const handleScreenChange = (screen: Screen) => {
    setCurrentScreen(screen)
    const path = screenToPath[screen]
    if (path) {
      router.push(path)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#070707] text-white flex flex-col">
      <main className="flex-1 pb-[72px]">
        {children}
      </main>
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={handleScreenChange}
      />
    </div>
  )
} 