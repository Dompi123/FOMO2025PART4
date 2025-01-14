'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Info, Minus, Plus, Trophy, Sparkles } from 'lucide-react';
import type { Drink, Venue, OrderItem } from '@/types'

const MAX_QUANTITY = 10;
const MIN_QUANTITY = 0;

export interface DrinkOrderCheckoutProps {
  items: Drink[]
  venue: Venue
  onComplete: () => void
  onBack: () => void
  disabled?: boolean
}

export function DrinkOrderCheckout({ 
  items: initialItems, 
  venue, 
  onComplete, 
  onBack,
  disabled 
}: DrinkOrderCheckoutProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>(
    initialItems.map(item => ({ 
      ...item, 
      quantity: 1
    }))
  )
  const [tipPercentage, setTipPercentage] = useState(20)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsLoading(false)
      setError(null)
    }
  }, [])

  // Remove items with zero quantity
  useEffect(() => {
    setOrderItems(prev => prev.filter(item => item.quantity > 0))
  }, [])

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tip = (subtotal * tipPercentage) / 100;
  const taxAndFees = subtotal * 0.05;
  const total = subtotal + tip + taxAndFees;
  const totalPoints = orderItems.reduce((sum, item) => sum + (item.points || 0) * item.quantity, 0);

  const handleQuantityChange = useCallback((itemId: string, delta: number) => {
    if (isLoading || disabled) return;

    setOrderItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      const newQuantity = item.quantity + delta;
      if (newQuantity < MIN_QUANTITY || newQuantity > MAX_QUANTITY) return item;
      
      return { ...item, quantity: newQuantity };
    }));
  }, [isLoading, disabled]);

  const handlePlaceOrder = useCallback(async () => {
    if (isLoading || disabled) return;
    if (orderItems.length === 0) {
      setError('Please add items to your order');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onComplete();
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Order placement error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [orderItems, onComplete, isLoading, disabled]);

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* Premium Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(157,92,255,0.08),_transparent_70%)]" />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#070707]/90 backdrop-blur-xl z-40 border-b border-white/5">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/5 disabled:opacity-50"
                onClick={onBack}
                disabled={isLoading || disabled}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <h1 className="text-xl font-bold">Your Order</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#9D5CFF]/20 to-[#FF3B7F]/20 border border-white/10 disabled:opacity-50"
              onClick={onBack}
              disabled={isLoading || disabled}
            >
              <Sparkles className="w-4 h-4 text-[#9D5CFF]" />
              <span className="text-sm font-medium">Add More</span>
            </motion.button>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
              {error}
            </div>
          )}
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
        {orderItems.map((item) => (
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
                    onClick={() => handleQuantityChange(item.id, -1)}
                    disabled={item.quantity <= MIN_QUANTITY || isLoading || disabled}
                    className="p-2 rounded-full bg-white/10 disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="w-4 text-center">{item.quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(item.id, 1)}
                    disabled={item.quantity >= MAX_QUANTITY || isLoading || disabled}
                    className="p-2 rounded-full bg-white/10 disabled:opacity-50"
                    aria-label="Increase quantity"
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

        {/* Empty State */}
        {orderItems.length === 0 && (
          <div className="text-center py-8 text-white/60">
            <p>Your order is empty</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={onBack}
              disabled={isLoading || disabled}
              className="mt-4 px-6 py-2 rounded-full bg-white/10 text-white font-medium disabled:opacity-50"
            >
              Add items
            </motion.button>
          </div>
        )}

        {orderItems.length > 0 && (
          <>
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
                    onClick={() => !isLoading && !disabled && setTipPercentage(percent)}
                    disabled={isLoading || disabled}
                    className={`
                      relative px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50
                      ${tipPercentage === percent 
                        ? 'bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F]' 
                        : 'bg-white/5'
                      }
                    `}
                    aria-pressed={tipPercentage === percent}
                  >
                    {percent}%
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              disabled={isLoading || disabled}
              className="w-full p-4 rounded-2xl bg-white/5 flex items-center justify-between disabled:opacity-50"
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
          </>
        )}
      </main>

      {/* Place Order Button */}
      {orderItems.length > 0 && (
        <div className="fixed bottom-24 left-0 right-0 p-4 bg-[#070707]/80 backdrop-blur-xl border-t border-white/5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePlaceOrder}
            disabled={isLoading || disabled}
            className="w-full bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] p-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {isLoading ? 'Placing Order...' : `Place Order • $${total.toFixed(2)}`}
          </motion.button>
        </div>
      )}
    </div>
  );
}