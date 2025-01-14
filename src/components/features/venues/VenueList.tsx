'use client'

import { motion, Variants } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Venue } from '@/types'
import { Star, Clock, Users, Music, DollarSign, Sparkles, Flame } from 'lucide-react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

interface VenueListProps {
  venues: Venue[]
  selectedVenueId?: string
  onVenueSelect?: (venue: Venue) => void
  isLoading?: boolean
  disabled?: boolean
}

const venueItemVariants: Variants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  initial: { scale: 1 }
}

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function VenueList({ 
  venues, 
  selectedVenueId, 
  onVenueSelect,
  isLoading = false,
  disabled = false 
}: VenueListProps) {
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Set mounted on initial render
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Validate venue data
  useEffect(() => {
    if (!mounted) return

    try {
      venues.forEach(venue => {
        if (!venue.id || !venue.name) {
          throw new Error('Invalid venue data: missing required fields')
        }
      })
      setError(null)
    } catch (err) {
      setError('Failed to load venue data')
      console.error('Venue validation error:', err)
    }
  }, [venues, mounted])

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
        >
          Retry
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="w-full h-40 rounded-2xl bg-white/5 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (!venues.length) {
    return (
      <div className="p-4 text-center text-white/60">
        <p>No venues found</p>
      </div>
    )
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-center">
          <p className="text-red-500 mb-4">Failed to display venues</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Retry
          </button>
        </div>
      }
    >
      <motion.div 
        className="p-4 space-y-4"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {venues.map((venue) => (
          <motion.button
            key={venue.id}
            onClick={() => !disabled && onVenueSelect?.(venue)}
            variants={itemVariants}
            initial="initial"
            whileHover={disabled ? undefined : "hover"}
            whileTap={disabled ? undefined : "tap"}
            className={`w-full p-4 rounded-2xl text-left transition-colors ${
              selectedVenueId === venue.id
                ? 'bg-gradient-surface border border-white/5'
                : 'bg-surface-light hover:bg-surface-lighter'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
            aria-selected={selectedVenueId === venue.id}
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
      </motion.div>
    </ErrorBoundary>
  )
}