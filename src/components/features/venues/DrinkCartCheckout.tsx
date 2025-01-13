import React, { useState } from 'react';
import { Trophy, ChevronLeft, Plus, Minus, Heart, ChevronRight, Info, Sparkles, Gift } from 'lucide-react';

interface DrinkCartCheckoutProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function DrinkCartCheckout({ onBack, onComplete }: DrinkCartCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const totalPoints = 80;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#070707]/90 backdrop-blur-xl z-40 border-b border-white/5">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-full bg-white/5 transition-transform hover:scale-110 active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-lg font-bold">Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Order Items */}
      <main className="pt-20 pb-32 max-w-md mx-auto p-4 space-y-4">
        {/* FOMO Points */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#9D5CFF]/20 to-[#FF3B7F]/20 border border-white/5 backdrop-blur-sm opacity-0 translate-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#9D5CFF]" />
              <span className="font-medium">FOMO Points</span>
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-transparent bg-clip-text animate-pulse">
              +{totalPoints}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="p-4 rounded-2xl bg-white/5 opacity-0 translate-y-4 animate-fade-in-up"
              style={{ animationDelay: `${item * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9D5CFF]/20 to-[#FF3B7F]/20" />
                  <div>
                    <div className="font-medium">Single Mixed Drink</div>
                    <div className="text-sm text-white/60">Regular • No Ice</div>
                  </div>
                </div>
                <div className="text-lg font-bold">$4.00</div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="p-4 rounded-2xl bg-white/5 space-y-3">
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>Subtotal</span>
            <span>$8.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>Service Fee</span>
            <span>$1.00</span>
          </div>
          <div className="pt-3 border-t border-white/10 flex items-center justify-between font-bold">
            <span>Total</span>
            <span>$9.00</span>
          </div>
        </div>

        {/* Payment Method */}
        <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 transition-transform hover:scale-102 active:scale-98">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9D5CFF]/20 to-[#FF3B7F]/20 flex items-center justify-center">
              💳
            </div>
            <div>
              <div className="font-medium">Credit Card</div>
              <div className="text-sm text-white/60">Visa •••• 4242</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/40" />
        </button>

        {/* Place Order Button */}
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="fixed bottom-8 left-4 right-4 max-w-md mx-auto p-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] transition-transform hover:scale-102 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            'Place Order • $9.00'
          )}
        </button>
      </main>
    </div>
  );
} 