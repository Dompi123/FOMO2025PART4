'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Screen } from '@/types'
import { DrinkMenu } from '@/components/features/venues/DrinkMenu'
import { DrinkOrderCheckout } from '@/components/features/venues/DrinkOrderCheckout'
import type { Drink } from '@/types'

export default function VenueDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu')
  const [selectedDrinks, setSelectedDrinks] = useState<Drink[]>([])

  const handleNavigate = (screen: Screen, data?: any) => {
    console.log('handleNavigate called with screen:', screen, 'data:', data)
    if (screen === 'checkout' && data?.items) {
      setSelectedDrinks(data.items)
    }
    setCurrentScreen(screen)
  }

  const handleComplete = () => {
    console.log('handleComplete called, currentScreen:', currentScreen)
    if (currentScreen === 'menu') {
      console.log('Transitioning from menu to checkout')
      setCurrentScreen('checkout')
    } else if (currentScreen === 'checkout') {
      console.log('Order completed, returning to venues')
      router.push('/venues')
    }
  }

  const mockVenue = {
    id: params.id,
    name: 'Neon Lounge',
    rating: 4.8,
    reviews: 342,
    waitTime: '45min',
    capacity: '95%',
    music: 'Live DJ Set',
    price: 40,
    boost: '2X FOMO',
    vibes: 435,
    status: 'PEAK HOURS 🔥'
  }

  return (
    <div className="min-h-screen bg-[#070707]">
      {currentScreen === 'menu' && (
        <DrinkMenu
          venue={mockVenue}
          onNavigate={handleNavigate}
          onBack={() => router.push('/venues')}
        />
      )}

      {currentScreen === 'checkout' && (
        <DrinkOrderCheckout
          items={selectedDrinks}
          venue={mockVenue}
          onComplete={handleComplete}
          onBack={() => setCurrentScreen('menu')}
        />
      )}
    </div>
  )
} 