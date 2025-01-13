import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Heart, Info, 
  Minus, Plus, Trophy, Sparkles 
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  points?: number;
}

export default function FomoCheckout() {
  const [items, setItems] = useState<OrderItem[]>([
    { id: '1', name: 'Truly - Lime', price: 4.00, quantity: 1, points: 10 },
    { id: '2', name: 'Single Mixed Drink', price: 4.00, quantity: 1, points: 10 }
  ]);
  const [tipPercentage, setTipPercentage] = useState(20);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tip = (subtotal * tipPercentage) / 100;
  const taxAndFees = subtotal * 0.05;
  const total = subtotal + tip + taxAndFees;
  const totalPoints = items.reduce((sum, item) => sum + (item.points || 0) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* Premium Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(157,92,255,0.08),_transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#070707]/90 backdrop-blur-xl z-40 border-b border-white/5">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/5"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <h1 className="text-xl font-bold">Your Order</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#9D5CFF]/20 to-[#FF3B7F]/20 border border-white/10"
            >
              <Sparkles className="w-4 h-4 text-[#9D5CFF]" />
              <span className="text-sm font-medium">Add More</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Order Items */}
      <main className="pt-20 pb-32 max-w-md mx-auto p-4 space-y-4">
        {/* FOMO Points */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#9D5CFF]/20 to-[#FF3B7F]/20 border border-white/5 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#9D5CFF]" />
              <span className="font-medium">FOMO Points</span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl font-bold bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-transparent bg-clip-text"
            >
              +{totalPoints}
            </motion.div>
          </div>
        </motion.div>

        {/* Items */}
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {}}
                    className="p-2 rounded-full bg-white/10"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="w-4 text-center">{item.quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {}}
                    className="p-2 rounded-full bg-white/10"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-white/60">+{item.points} points</div>
                </div>
              </div>
              <div className="text-right font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Tip Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#FF3B7F]" />
            <h2 className="text-lg font-bold">Tip Your Bartender</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[15, 20, 25, 30].map((percent) => (
              <motion.button
                key={percent}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTipPercentage(percent)}
                className={`
                  relative px-4 py-2 rounded-xl text-sm font-medium
                  ${tipPercentage === percent 
                    ? 'bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F]' 
                    : 'bg-white/5'
                  }
                `}
              >
                {percent}%
              </motion.button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="w-full p-4 rounded-2xl bg-white/5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 rounded-lg bg-gradient-to-r from-[#9D5CFF]/20 to-[#FF3B7F]/20" />
            <span>•••• 4567</span>
          </div>
          <ChevronRight className="w-5 h-5 text-white/40" />
        </motion.button>

        {/* Order Summary */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-white/60">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-white/60">Tip</span>
            <span>${tip.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1">
            <div className="flex items-center gap-1 text-white/60">
              <span>Tax & Fees</span>
              <Info className="w-4 h-4" />
            </div>
            <span>${taxAndFees.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 text-lg font-bold">
            <span>Total</span>
            <span className="bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-transparent bg-clip-text">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </main>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#070707]/80 backdrop-blur-xl border-t border-white/5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] p-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/20"
        >
          Place Order • ${total.toFixed(2)}
        </motion.button>
      </div>
    </div>
  );
}
