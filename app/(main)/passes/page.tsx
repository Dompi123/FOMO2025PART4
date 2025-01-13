'use client'

import { Star } from 'lucide-react'

export default function PassesPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* Header */}
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
      
      {/* Empty State */}
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