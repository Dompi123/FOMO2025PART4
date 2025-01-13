'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, ChevronLeft, Plus, Minus, Heart, ChevronRight, Info, Sparkles, Gift } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function DrinkCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const quantities = [1, 2, 3, 4, 5];

  const handleCheckout = () => {
    setIsProcessing(true);
    // Add checkout logic
  };

  const handleAddToOrder = () => {
    // Add to order logic
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <div className="sticky top-0 z-10 bg-[#0A0A0B] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button className="rounded-full bg-[#1A1A1D] p-2">
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Go back</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 space-y-4">
        <Button 
          className="w-full bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-white"
          onClick={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Checkout'}
        </Button>

        <Button 
          className="flex items-center justify-between w-full bg-white/5"
          onClick={handleAddToOrder}
        >
          <span>Add to Order</span>
          <Plus className="h-5 w-5" />
        </Button>

        <div className="flex gap-2">
          {quantities.map((quantity, index) => (
            <Button
              key={index}
              className={`px-4 py-2 rounded-full ${
                selectedQuantity === quantity ? 'bg-white/20' : 'bg-white/5'
              }`}
              onClick={() => setSelectedQuantity(quantity)}
            >
              {quantity}x
            </Button>
          ))}
        </div>

        <Button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
          <Gift className="h-5 w-5" />
          <span>Add Note</span>
        </Button>
      </div>
    </div>
  );
}

