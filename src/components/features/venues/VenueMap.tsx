'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl, { Map, Marker } from 'mapbox-gl'
import { Venue } from '@/types'
import { cn } from '@/lib/utils'

interface VenueMapProps {
  venues: Venue[]
  selectedVenueId?: string
  onVenueSelect: (venueId: string) => void
  disabled?: boolean
  className?: string
}

interface MapMarker extends Marker {
  venueId: string
}

export function VenueMap({ 
  venues, 
  selectedVenueId,
  onVenueSelect,
  disabled,
  className = ''
}: VenueMapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current) {
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: venues[0]?.coordinates || [-74.006, 40.7128],
        zoom: 12
      })
      mapRef.current = map
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add markers for each venue
    venues.forEach(venue => {
      const marker = new mapboxgl.Marker({
        color: venue.id === selectedVenueId ? '#10B981' : '#FFFFFF'
      })
        .setLngLat([venue.coordinates.lng, venue.coordinates.lat])
        .addTo(mapRef.current!)

      marker.getElement().addEventListener('click', () => {
        if (!disabled) {
          onVenueSelect(venue.id)
        }
      })

      markersRef.current.push(marker)
    })

    // Center on selected venue if exists
    const selectedVenue = venues.find(v => v.id === selectedVenueId)
    if (selectedVenue) {
      mapRef.current.flyTo({
        center: [selectedVenue.coordinates.lng, selectedVenue.coordinates.lat],
        zoom: 14,
        duration: 1000
      })
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [venues, selectedVenueId, onVenueSelect, disabled])

  return (
    <div id="map" className={cn("w-full h-[300px] rounded-lg", className)} />
  )
} 