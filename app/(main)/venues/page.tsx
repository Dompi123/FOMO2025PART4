'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { VenueList } from '../../../src/components/features/venues/VenueList'
import dynamic from 'next/dynamic'
import type { Venue } from '../../../src/types'
import { List, Map as MapIcon, Search } from 'lucide-react'

const VenueMap = dynamic(
  () => import('../../../src/components/features/venues/VenueMap'),
  { 
    loading: () => <MapSkeleton />,
    ssr: false
  }
)

function MapSkeleton() {
  return (
    <div className="w-full h-full bg-gray-900 animate-pulse rounded-lg" />
  )
}

// Fixed timestamps to avoid re-renders
const NOW = new Date().toISOString()

const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Neon Lounge',
    description: 'Modern nightclub with great music and atmosphere',
    latitude: 44.6488,
    longitude: -63.5752,
    rating: 4.8,
    reviews: 128,
    status: 'open',
    waitTime: 15,
    capacity: 85,
    music: 'House',
    price: 40,
    boost: 435,
    vibes: 892,
    imageUrl: '/images/venues/neon-lounge.jpg',
    updatedAt: NOW
  },
  {
    id: '2', 
    name: "Rick's Bar",
    description: 'Classic pub with live music and great drinks',
    latitude: 44.6461,
    longitude: -63.5738,
    rating: 4.6,
    reviews: 289,
    status: 'open',
    waitTime: 10,
    capacity: 65,
    music: 'Live Band',
    price: 20,
    boost: 312,
    vibes: 756,
    imageUrl: '/images/venues/ricks-bar.jpg',
    updatedAt: NOW
  }
]

export default function VenuesPage() {
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
      venue.music.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const handleVenueSelect = async (venue: Venue) => {
    try {
      setIsNavigating(true)
      setSelectedVenueId(venue.id)
      await router.push(`/venues/${venue.id}`)
    } catch (error) {
      console.error('Failed to navigate to venue:', error)
      // Reset selection if navigation fails
      setSelectedVenueId(undefined)
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
            />
          </div>
        )}
      </main>
    </div>
  )
} 