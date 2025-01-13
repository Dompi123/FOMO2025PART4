'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Users, Heart, Music, Flame, Sparkles, Trophy } from 'lucide-react';

// Fibonacci-based spacing
const fib = {
  xxs: '8px',    // 8
  xs: '13px',    // 13
  sm: '21px',    // 21
  md: '34px',    // 34
  lg: '55px',    // 55
  xl: '89px'     // 89
};

export default function FomoVenueScreen() {
  const [activeTab, setActiveTab] = useState('hot');
  const [swipeProgress, setSwipeProgress] = useState(0);

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* Spotify-inspired gradient background */}
      <div className="fixed inset-0">
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(157,92,255,0.08), transparent 70%)',
              'radial-gradient(circle at 100% 100%, rgba(255,59,127,0.08), transparent 70%)',
              'radial-gradient(circle at 0% 0%, rgba(157,92,255,0.08), transparent 70%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Achievement Banner */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] py-[13px]">
          <div className="max-w-md mx-auto px-[21px] flex items-center justify-center gap-[13px]">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity }}
              className="w-[34px] h-[34px] rounded-full bg-black/20 flex items-center justify-center"
            >
              ⚡️
            </motion.div>
            <div className="flex items-center gap-[13px]">
              <span className="font-bold">2X FOMO WEEKEND</span>
              <motion.span
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="px-[13px] py-[8px] rounded-full bg-black/20 text-sm"
              >
                6h left
              </motion.span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <header className="fixed top-[55px] left-0 right-0 bg-[#070707]/90 backdrop-blur-xl z-40 border-b border-white/5">
        <div className="max-w-md mx-auto p-[21px]">
          <div className="flex items-center justify-between">
            <motion.span 
              className="text-xl font-bold bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-transparent bg-clip-text"
            >
              Halifax
            </motion.span>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-[13px] px-[21px] py-[13px] rounded-full bg-white/5"
            >
              <Star className="w-[21px] h-[21px] text-[#9D5CFF]" />
              <span className="font-bold">420</span>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[144px] pb-[34px] max-w-md mx-auto px-[21px] space-y-[21px]">
      </main>
    </div>
  );
}