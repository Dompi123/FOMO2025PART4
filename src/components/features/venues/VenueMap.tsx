'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Venue } from '@/types'
import Map, { Marker, Popup, ViewState } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'

interface VenueMapProps {
  venues: Venue[]
  selectedVenueId?: string
  onVenueSelect?: (venue: Venue) => void
}

interface InitialViewState extends Partial<ViewState> {
  longitude: number
  latitude: number
  zoom: number
}

// Validate coordinates are within bounds
const isValidCoordinate = (lat: number, lng: number) => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

// Default coordinates if invalid or missing
const DEFAULT_COORDINATES = {
  longitude: -63.5752,
  latitude: 44.6488,
  zoom: 14
} as const

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export default function VenueMap({ venues, selectedVenueId, onVenueSelect }: VenueMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setSelectedVenue(null)
      setError(null)
    }
  }, [])

  // Validate Mapbox token on mount
  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      setError('Missing Mapbox token. Please check your environment variables.')
      setIsLoading(false)
    }
  }, [])

  // Filter out venues with invalid coordinates
  const validVenues = venues.filter(venue => 
    isValidCoordinate(venue.latitude, venue.longitude)
  )

  // Calculate initial view state based on valid venues
  const initialViewState = useCallback((): InitialViewState => {
    if (validVenues.length === 0) return DEFAULT_COORDINATES

    // Calculate bounds of all venues
    const bounds = validVenues.reduce(
      (acc, venue) => ({
        minLat: Math.min(acc.minLat, venue.latitude),
        maxLat: Math.max(acc.maxLat, venue.latitude),
        minLng: Math.min(acc.minLng, venue.longitude),
        maxLng: Math.max(acc.maxLng, venue.longitude),
      }),
      {
        minLat: 90,
        maxLat: -90,
        minLng: 180,
        maxLng: -180,
      }
    )

    // Center point
    return {
      latitude: (bounds.minLat + bounds.maxLat) / 2,
      longitude: (bounds.minLng + bounds.maxLng) / 2,
      zoom: 13,
    }
  }, [validVenues])

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true)
    setIsLoading(false)
  }, [])

  const handleVenueSelect = useCallback((venue: Venue) => {
    setSelectedVenue(venue)
    onVenueSelect?.(venue)
  }, [onVenueSelect])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center p-4">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center p-4">
            <p className="text-red-500 mb-4">Failed to load map</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
            >
              Retry
            </button>
          </div>
        </div>
      }
    >
      <div className="w-full h-full relative">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {!error && MAPBOX_TOKEN && (
          <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={initialViewState()}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            onLoad={handleMapLoad}
            onError={(e) => {
              console.error('Map error:', e)
              setError('Failed to load map. Please try again.')
            }}
          >
            {validVenues.map((venue) => (
              <Marker
                key={venue.id}
                longitude={venue.longitude}
                latitude={venue.latitude}
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  handleVenueSelect(venue)
                }}
              >
                <button
                  className={`w-6 h-6 rounded-full transition-transform hover:scale-125 ${
                    selectedVenueId === venue.id
                      ? 'bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] shadow-lg'
                      : 'bg-white'
                  }`}
                  aria-label={`Select ${venue.name}`}
                />
              </Marker>
            ))}

            {selectedVenue && (
              <Popup
                longitude={selectedVenue.longitude}
                latitude={selectedVenue.latitude}
                anchor="bottom"
                onClose={() => setSelectedVenue(null)}
                closeOnClick={false}
                className="max-w-sm"
              >
                <div className="p-3">
                  <h3 className="text-lg font-semibold mb-2">{selectedVenue.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedVenue.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm">{selectedVenue.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({selectedVenue.reviews} reviews)</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className={`font-medium ${selectedVenue.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedVenue.status.charAt(0).toUpperCase() + selectedVenue.status.slice(1)}
                    </span>
                    {selectedVenue.status === 'open' && (
                      <span className="text-gray-500 ml-2">• {selectedVenue.waitTime} min wait</span>
                    )}
                  </div>
                </div>
              </Popup>
            )}
          </Map>
        )}
      </div>
    </ErrorBoundary>
  )
} 