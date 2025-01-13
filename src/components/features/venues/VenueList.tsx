'use client'

import { motion } from 'framer-motion'
import type { Venue } from '@/types'
import { Star, Clock, Users, Music, DollarSign, Sparkles, Flame } from 'lucide-react'

interface VenueListProps {
  venues: Venue[]
  selectedVenueId?: string
  onVenueSelect?: (venue: Venue) => void
}

export function VenueList({ venues, selectedVenueId, onVenueSelect }: VenueListProps) {
  return (
    <div className="p-4 space-y-4">
      {venues.map((venue) => (
        <motion.button
          key={venue.id}
          onClick={() => onVenueSelect?.(venue)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full p-4 rounded-2xl text-left transition-colors ${
            selectedVenueId === venue.id
              ? 'bg-gradient-surface border border-white/5'
              : 'bg-surface-light hover:bg-surface-lighter'
          }`}
        >
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{venue.name}</h3>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  venue.status === 'open' 
                    ? 'bg-gradient-primary'
                    : 'bg-surface-light'
                }`}>
                  {venue.status}
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{venue.rating}</span>
                </div>
                <span>•</span>
                <span>{venue.reviews} reviews</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/40" />
                <span>{venue.waitTime} wait</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-white/40" />
                <span>{venue.capacity} full</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-white/40" />
                <span>{venue.music}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-white/40" />
                <span>{venue.price} cover</span>
              </div>
              <div className="flex items-center gap-2 text-primary-start">
                <Sparkles className="w-4 h-4 opacity-40" />
                <span>{venue.boost}</span>
              </div>
              <div className="flex items-center gap-2 text-primary-end">
                <Flame className="w-4 h-4 opacity-40" />
                <span>{venue.vibes} vibes</span>
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  )
}