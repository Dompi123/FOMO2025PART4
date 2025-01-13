'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Users, Share2, ChevronRight, QrCode, Trophy, X } from 'lucide-react';

interface Ticket {
  id: number;
  title: string;
  venue: string;
  time: string;
  type: string;
  validUntil: string;
  status: string;
  usersNow: number;
  gradient: string;
}

const tickets = [
  {
    id: 1,
    title: "Late-Night Dance Party Extravaganza",
    venue: "Rhumerie la Plantation",
    time: "6:00 PM",
    type: "🎉 Standard Entry",
    validUntil: "4:00 AM",
    status: "95% Full",
    usersNow: 189,
    gradient: "from-orange-500/20 to-pink-500/20"
  },
  {
    id: 2,
    title: "Alsace Wine Tasting",
    venue: "Le Factory",
    time: "6:00 PM",
    type: "🍷 VIP Access",
    validUntil: "11:00 PM",
    status: "75% Full",
    usersNow: 142,
    gradient: "from-purple-500/20 to-blue-500/20"
  }
];

export function FomoTickets() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070707] to-[#0a0a0a] text-white">
      {/* Premium Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(157,92,255,0.08),_transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#070707]/90 backdrop-blur-xl z-40 border-b border-white/5">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">My Tickets</h1>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5"
            >
              <Star className="w-4 h-4 text-[#9D5CFF]" />
              <span className="font-bold">420</span>
              <motion.span
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[#FF3B7F]"
              >
                FOMO
              </motion.span>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Tickets List */}
      <main className="pt-28 pb-24 max-w-md mx-auto px-4 space-y-4">
        {tickets.map((ticket) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${ticket.gradient} border border-white/5 backdrop-blur-sm`}
          >
            <div className="absolute top-4 right-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedTicket(ticket)}
                className="p-2 rounded-full bg-white/10"
              >
                <QrCode className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="p-6 space-y-4">
              {/* Ticket Info */}
              <div>
                <h2 className="text-xl font-bold">{ticket.title}</h2>
                <p className="text-white/60 text-sm mt-1">{ticket.venue}</p>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#9D5CFF]/40 to-[#FF3B7F]/40 text-sm font-medium mt-2"
                >
                  {ticket.type}
                </motion.div>
              </div>

              {/* Ticket Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Valid Until</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FF3B7F]" />
                    <span>{ticket.validUntil}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Venue Status</span>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{ticket.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="p-4 border-t border-white/10">
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
                  <span className="text-white/60 text-sm">+{ticket.usersNow} attending</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-white/10"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </main>

      {/* QR Code Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed inset-0 bg-[#070707] z-50 flex flex-col items-center px-6 pt-12"
          >
            <div className="text-center space-y-2 mb-8">
              <p className="text-white/60">Today at {selectedTicket.time}</p>
              <h2 className="text-2xl font-bold">{selectedTicket.title}</h2>
              <p className="text-white/60">{selectedTicket.venue}</p>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-[#9D5CFF]/10 to-[#FF3B7F]/10 backdrop-blur-sm rounded-3xl p-8 w-full max-w-xs aspect-square flex items-center justify-center border border-white/5"
            >
              <QrCode className="w-full h-full" />
            </motion.div>

            <div className="text-center mt-8 space-y-1">
              <p className="font-medium">Cameron Williamson</p>
              <p className="text-sm text-white/60">Please present this QR code at the entrance</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTicket(null)}
              className="mt-auto mb-12 bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-white font-medium w-12 h-12 rounded-full flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}