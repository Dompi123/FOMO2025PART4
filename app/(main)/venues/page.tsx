'use client'

import { useState, useMemo, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { VenueList } from '../../../src/components/features/venues/VenueList'
import dynamic from 'next/dynamic'
import type { Venue } from '../../../src/types'
import { List, Map as MapIcon, Search } from 'lucide-react'
import { MapSkeleton } from '../../../src/components/skeletons/MapSkeleton'

const VenueMap = dynamic(
  () => import('@/components/features/venues/VenueMap').then(mod => mod.VenueMap),
  { 
    loading: () => <MapSkeleton />,
    ssr: false
  }
)

// Fixed timestamps to avoid re-renders
const NOW = new Date().toISOString()

const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Neon Lounge',
    description: 'Premium nightclub experience',
    imageUrl: '/venues/neon-lounge.jpg',
    location: 'New York, NY',
    currentOccupancy: 85,
    maxCapacity: 150,
    openingHours: {
      open: '20:00',
      close: '04:00'
    },
    rating: 4.8,
    reviews: 342,
    waitTime: 45,
    capacity: 95,
    music: 'Live DJ Set',
    price: 40,
    boost: 2,
    vibes: 435,
    status: 'open',
    tags: ['Nightclub', 'Live Music', 'VIP'],
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    }
  },
  {
    id: '2',
    name: 'Sky Bar',
    description: 'Rooftop cocktail lounge',
    imageUrl: '/venues/sky-bar.jpg',
    location: 'New York, NY',
    currentOccupancy: 65,
    maxCapacity: 120,
    openingHours: {
      open: '18:00',
      close: '02:00'
    },
    rating: 4.5,
    reviews: 256,
    waitTime: 30,
    capacity: 75,
    music: 'Ambient House',
    price: 35,
    boost: 1,
    vibes: 380,
    status: 'open',
    tags: ['Rooftop', 'Cocktails', 'Views'],
    coordinates: {
      lat: 40.7589,
      lng: -73.9851
    }
  }
]

function VenuesPageInner() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [selectedVenueId, setSelectedVenueId] = useState<string | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [isNavigating, setIsNavigating] = useState(false)

  const filteredVenues = useMemo(() => {
    if (!searchQuery) return mockVenues
    const query = searchQuery.toLowerCase()
    return mockVenues.filter(venue => 
      venue.name.toLowerCase().includes(query) ||
      venue.description.toLowerCase().includes(query) ||
      (venue.music?.toLowerCase().includes(query) ?? false)
    )
  }, [searchQuery])

  const handleVenueSelect = async (venueIdOrVenue: string | Venue) => {
    if (isNavigating) return
    setIsNavigating(true)
    
    try {
      const venueId = typeof venueIdOrVenue === 'string' ? venueIdOrVenue : venueIdOrVenue.id
      await router.push(`/venues/${venueId}`)
    } finally {
      setIsNavigating(false)
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#070707]">
      <header className="sticky top-0 z-10 bg-[#070707]/90 backdrop-blur-xl px-4 pt-4 pb-2 border-b border-white/5">
        <h1 className="text-2xl font-bold mb-4">Tonight&apos;s Hottest Spots</h1>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode('list')}
            disabled={isNavigating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              viewMode === 'list' 
                ? 'bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-white' 
                : 'bg-white/5 text-white/80 hover:bg-white/10'
            } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <List className="w-5 h-5" /> List
          </button>
          <button
            onClick={() => setViewMode('map')}
            disabled={isNavigating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              viewMode === 'map'
                ? 'bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-white'
                : 'bg-white/5 text-white/80 hover:bg-white/10'
            } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <MapIcon className="w-5 h-5" /> Map
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find venues near you..."
            className="w-full px-4 py-2 pl-10 bg-white/5 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        </div>
      </header>

      <main className="flex-1">
        {viewMode === 'list' ? (
          <VenueList
            venues={filteredVenues}
            selectedVenueId={selectedVenueId}
            onVenueSelect={handleVenueSelect}
          />
        ) : (
          <div className="h-[calc(100dvh-200px)]">
            <VenueMap
              venues={filteredVenues}
              selectedVenueId={selectedVenueId}
              onVenueSelect={handleVenueSelect}
              disabled={isNavigating}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default function VenuesPage() {
  return (
    <Suspense>
      <VenuesPageInner />
    </Suspense>
  )
} 