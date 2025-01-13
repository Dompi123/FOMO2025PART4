'use client'

import React from 'react'
import { Star, Clock, Users, Share2, ChevronRight, QrCode, Trophy } from 'lucide-react'

export default function UserPasses() {
  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* Premium Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(157,92,255,0.08),_transparent_70%)]" />
      </div>

      {/* Main Content */}
      <main className="relative pt-20 pb-32 max-w-md mx-auto p-4 space-y-6">
        {/* Active Pass */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#9D5CFF]/20 to-[#FF3B7F]/20 border border-white/5 backdrop-blur-sm opacity-0 translate-y-4 animate-fade-in-up">
          {/* Pass Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">The Dome</h2>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 text-[#9D5CFF]" />
                <span className="text-white/60">4.8 • 342 reviews</span>
              </div>
            </div>
            <button className="p-2 rounded-full bg-white/10 transition-transform hover:scale-110 active:scale-90">
              <QrCode className="w-5 h-5" />
            </button>
          </div>

          {/* Pass Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Clock className="w-4 h-4" />
                <span>Valid Until</span>
              </div>
              <div className="mt-1 font-bold">4:00 AM</div>
            </div>

            <div className="p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Users className="w-4 h-4" />
                <span>Venue Status</span>
              </div>
              <div className="mt-1 font-bold">95% Full</div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-6 h-6 rounded-full bg-gradient-to-r from-[#9D5CFF]/20 to-[#FF3B7F]/20 border-2 border-[#070707]"
                  />
                ))}
              </div>
              <span className="text-white/60 text-sm">+189 attending</span>
            </div>
            <button className="p-2 rounded-full bg-white/10 transition-transform hover:scale-110 active:scale-90">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Achievement Banner */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#9D5CFF]" aria-hidden="true" />
                <div className="text-sm">
                  <span className="text-white/60">Earned </span>
                  <span className="text-[#FF3B7F] font-bold animate-pulse">+80 FOMO</span>
                </div>
              </div>
              <button className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-white/90 text-sm font-medium transition-transform hover:scale-105 active:scale-95">
                Share Stats
              </button>
            </div>
          </div>
        </div>

        {/* More Options */}
        <div className="space-y-2">
          {[
            { label: "Get Another Pass", desc: "Skip more lines" },
            { label: "Pass History", desc: "View previous passes" }
          ].map((option) => (
            <button
              key={option.label}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 transition-transform hover:scale-102 active:scale-98"
            >
              <div>
                <div className="font-medium text-left">{option.label}</div>
                <div className="text-sm text-white/60">{option.desc}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" aria-hidden="true" />
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

