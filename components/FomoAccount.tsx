import React from 'react'
import { ChevronRight } from 'lucide-react'

export const FomoAccount = () => {
  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* Premium Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(157,92,255,0.08),_transparent_70%)]" />
      </div>

      {/* Main Content */}
      <main className="relative pt-20 pb-32 max-w-md mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] flex items-center justify-center text-2xl font-bold">
            DK
          </div>
          <div>
            <h1 className="text-xl font-bold">Dom Khr</h1>
            <div className="flex items-center gap-2">
              <div className="text-sm text-white/60">@domkhr</div>
              <div className="w-2 h-2 rounded-full bg-[#FF3B7F] animate-ping" />
              <div className="text-sm text-[#FF3B7F]">VIP Member</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Visits", value: "24" },
            { label: "Skips", value: "12" },
            { label: "Level", value: "VIP" }
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
              <div className="font-bold">{stat.value}</div>
              <div className="text-xs text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Settings Menu */}
        <div className="space-y-2">
          {[
            { label: "Payment Methods", value: "Visa •••• 4242" },
            { label: "Order History", value: "12 orders" },
            { label: "Notifications", value: "On" },
            { label: "Help & Support", value: "" }
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 transition-transform hover:scale-101 active:scale-99"
            >
              <span>{item.label}</span>
              <div className="flex items-center gap-2 text-white/60">
                <span>{item.value}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}