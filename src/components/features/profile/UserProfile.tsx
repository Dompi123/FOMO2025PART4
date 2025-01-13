'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Heart, Share2, Settings, Award, User, Trophy, Sparkles, ChevronRight, MessageSquare } from 'lucide-react'

export default function FomoAccount() {
  const [totalPoints, setTotalPoints] = useState(420)

  return (
    <div className="min-h-screen bg-[#070707] text-white pb-20">
      {/* Premium Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(157,92,255,0.08),_transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-[#070707]/90 backdrop-blur-xl z-40 border-b border-white/5 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Your Profile</h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/5"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="m-4 p-6 rounded-3xl bg-gradient-to-br from-[#9D5CFF]/20 to-[#FF3B7F]/20 border border-white/5 backdrop-blur-sm"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9D5CFF] to-[#FF3B7F] flex items-center justify-center text-xl font-bold">
              DL
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF3B7F] flex items-center justify-center text-xs"
            >
              🔥
            </motion.div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-lg font-bold">dom lhr</h2>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 text-[#9D5CFF]" />
              <motion.span
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[#FF3B7F] font-bold"
              >
                {totalPoints} FOMO
              </motion.span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: "Visits", value: "24" },
            { label: "Skips", value: "12" },
            { label: "Level", value: "VIP" }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 rounded-xl p-3 text-center"
            >
              <div className="font-bold">{stat.value}</div>
              <div className="text-xs text-white/60">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {[
          { icon: Trophy, label: "Achievements", count: "6" },
          { icon: Heart, label: "Saved", count: "3" },
          { icon: Share2, label: "Share Profile", count: "2X" },
          { icon: Sparkles, label: "Rewards", count: "NEW" }
        ].map(({ icon: Icon, label, count }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/5 rounded-2xl p-4 text-left relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Icon className="w-6 h-6 mb-2 text-[#9D5CFF]" />
            <div className="font-medium">{label}</div>
            <motion.div
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-2 right-2 px-2 py-1 rounded-full bg-[#FF3B7F] text-xs font-bold"
            >
              {count}
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="space-y-2 p-4">
        {[
          { label: "Payment Methods", value: "Visa •••• 4242" },
          { label: "Order History", value: "12 orders" },
          { label: "Notifications", value: "On" },
          { label: "Help & Support", value: "" }
        ].map((item) => (
          <motion.button
            key={item.label}
            whileHover={{ scale: 1.01 }}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5"
          >
            <span>{item.label}</span>
            <div className="flex items-center gap-2 text-white/60">
              <span>{item.value}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

