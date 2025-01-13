'use client'

import { useEffect, useState } from 'react'
import type { Venue } from '@/types'
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface VenueMapProps {
  venues: Venue[]
  selectedVenueId?: string
  onVenueSelect?: (venue: Venue) => void
}

export default function VenueMap({ venues, selectedVenueId, onVenueSelect }: VenueMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)

  useEffect(() => {
    if (!mapLoaded) return
    // Map is ready
  }, [mapLoaded])

  return (
    <div className="w-full h-full">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: -63.5752,
          latitude: 44.6488,
          zoom: 14
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        onLoad={() => setMapLoaded(true)}
      >
        {venues.map((venue) => (
          <Marker
            key={venue.id}
            longitude={venue.longitude}
            latitude={venue.latitude}
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              setSelectedVenue(venue)
              onVenueSelect?.(venue)
            }}
          >
            <button
              className={`w-6 h-6 rounded-full transition-transform hover:scale-125 ${
                selectedVenueId === venue.id
                  ? 'bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] shadow-lg'
                  : 'bg-white'
              }`}
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
    </div>
  )
} 