import { useEffect, useState } from 'react'
import { DataBoundary } from '@/components/error-boundaries/DataBoundary'
import { VenueSkeleton } from '@/components/ui/Skeleton'
import { apiClient } from '@/lib/api-client'
import type { Venue } from '@/types/api'

export function VenueList() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const response = await apiClient.getVenues()
        setVenues(response.data)
      } finally {
        setIsLoading(false)
      }
    }

    loadVenues()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <VenueSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <DataBoundary>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map(venue => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </DataBoundary>
  )
}

function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={venue.images.thumbnail}
          alt={venue.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{venue.name}</h3>
        <p className="text-gray-600 mt-1">{venue.description}</p>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            {venue.capacity.current}/{venue.capacity.total} capacity
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1">{venue.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 