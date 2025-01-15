'use client'

import { useState, useEffect, Suspense } from 'react'
import { Star } from 'lucide-react'
import { api } from '@/services/api'

function PassesPageInner() {
  const [passes, setPasses] = useState<Array<{
    id: string;
    venueId: string;
    validUntil: string;
    status: 'active' | 'expired' | 'used';
    createdAt: string;
  }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPasses() {
      try {
        const data = await api.passes.list()
        setPasses(data)
      } catch (err) {
        console.error('Failed to load passes:', err)
        setError('Failed to load passes. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPasses()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#070707] text-white">
        <div className="safe-top px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Passes</h1>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
              <Star className="w-4 h-4 text-[#9D5CFF]" />
              <span className="font-bold text-sm">0</span>
              <span className="text-[#FF3B7F]">FOMO</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Star className="w-8 h-8 text-white/20" />
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-white/60 max-w-xs mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (passes.length === 0) {
    return (
      <div className="min-h-screen bg-[#070707] text-white">
        <div className="safe-top px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Passes</h1>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
              <Star className="w-4 h-4 text-[#9D5CFF]" />
              <span className="font-bold text-sm">0</span>
              <span className="text-[#FF3B7F]">FOMO</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Star className="w-8 h-8 text-white/20" />
          </div>
          <h2 className="text-xl font-bold mb-2">No Passes Yet</h2>
          <p className="text-white/60 max-w-xs">
            Skip the line at your favorite venues by purchasing passes
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <div className="safe-top px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Passes</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
            <Star className="w-4 h-4 text-[#9D5CFF]" />
            <span className="font-bold text-sm">{passes.length}</span>
            <span className="text-[#FF3B7F]">FOMO</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {passes.map(pass => (
          <div
            key={pass.id}
            className="p-4 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Pass #{pass.id}</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                pass.status === 'active' ? 'bg-green-500/20 text-green-400' :
                pass.status === 'expired' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {pass.status}
              </span>
            </div>
            <div className="text-sm text-white/60">
              Valid until: {new Date(pass.validUntil).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PassesPage() {
  return (
    <Suspense>
      <PassesPageInner />
    </Suspense>
  )
} 