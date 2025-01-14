'use client'

import { useState, useCallback, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Screen, Venue, Drink } from '@/types'
import { DrinkMenu } from '@/components/features/venues/DrinkMenu'
import { DrinkOrderCheckout } from '@/components/features/venues/DrinkOrderCheckout'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Fixed timestamp to avoid re-renders
const NOW = new Date().toISOString()

export default function VenueDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu')
  const [selectedDrinks, setSelectedDrinks] = useState<Drink[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Cleanup transitions on unmount
  useEffect(() => {
    return () => {
      setIsTransitioning(false)
      setIsLoading(false)
    }
  }, [])

  // Set loading to false after initial render
  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleNavigate = useCallback(async (screen: Screen, data?: { items: Drink[] }) => {
    if (isTransitioning) return
    setIsTransitioning(true)

    try {
      if (screen === 'checkout' && data?.items) {
        setSelectedDrinks(data.items)
      }
      
      await new Promise<void>((resolve) => {
        startTransition(() => {
          setCurrentScreen(screen)
          resolve()
        })
      })
    } catch (error) {
      console.error('Navigation failed:', error)
      // Reset to menu on error
      setCurrentScreen('menu')
    } finally {
      setIsTransitioning(false)
    }
  }, [isTransitioning])

  const handleComplete = useCallback(async () => {
    if (isTransitioning) return
    setIsTransitioning(true)

    try {
      if (currentScreen === 'menu') {
        await handleNavigate('checkout')
      } else if (currentScreen === 'checkout') {
        await router.push('/venues')
      }
    } catch (error) {
      console.error('Failed to complete action:', error)
    } finally {
      setIsTransitioning(false)
    }
  }, [currentScreen, router, isTransitioning, handleNavigate])

  const mockVenue: Venue = {
    id: params.id,
    name: 'Neon Lounge',
    description: 'Premium nightclub experience',
    rating: 4.8,
    reviews: 342,
    waitTime: 45,
    capacity: 95,
    music: 'Live DJ Set',
    price: 40,
    boost: 2,
    vibes: 435,
    status: 'open',
    latitude: 40.7128,
    longitude: -74.0060,
    imageUrl: '/venues/neon-lounge.jpg',
    updatedAt: NOW
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070707]">
      {currentScreen === 'menu' && (
        <ErrorBoundary
          fallback={
            <div className="p-4 text-center">
              <h2 className="text-xl font-bold text-red-500">Failed to load drink menu</h2>
              <button
                onClick={() => router.push('/venues')}
                className="mt-4 px-4 py-2 rounded-lg bg-white/10 font-medium"
                disabled={isTransitioning}
              >
                Return to venues
              </button>
            </div>
          }
        >
          <DrinkMenu
            venue={mockVenue}
            onNavigate={handleNavigate}
            onBack={async () => {
              if (!isTransitioning) {
                setIsTransitioning(true)
                try {
                  await router.push('/venues')
                } finally {
                  setIsTransitioning(false)
                }
              }
            }}
            disabled={isPending || isTransitioning}
          />
        </ErrorBoundary>
      )}

      {currentScreen === 'checkout' && (
        <ErrorBoundary
          fallback={
            <div className="p-4 text-center">
              <h2 className="text-xl font-bold text-red-500">Failed to load checkout</h2>
              <button
                onClick={() => setCurrentScreen('menu')}
                className="mt-4 px-4 py-2 rounded-lg bg-white/10 font-medium"
                disabled={isTransitioning}
              >
                Return to menu
              </button>
            </div>
          }
        >
          <DrinkOrderCheckout
            items={selectedDrinks}
            venue={mockVenue}
            onComplete={handleComplete}
            onBack={async () => {
              if (!isTransitioning) {
                setIsTransitioning(true)
                try {
                  setCurrentScreen('menu')
                } finally {
                  setIsTransitioning(false)
                }
              }
            }}
            disabled={isPending || isTransitioning}
          />
        </ErrorBoundary>
      )}
    </div>
  )
} 