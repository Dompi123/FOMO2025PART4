'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, Clock, Sparkles, ChevronRight, ChevronLeft, ChevronDown, Ticket, CreditCard, Apple } from 'lucide-react';

interface SkipLineCheckoutProps {
  venue: any;
  onComplete: () => void;
  onBack: () => void;
}

export const SkipLineCheckout: React.FC<SkipLineCheckoutProps> = ({ 
  venue, 
  onComplete,
  onBack 
}) => {
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  const handleAddCard = () => {
    console.log('Adding card:', { cardNumber, expiryDate, cvv });
    if (cardNumber && expiryDate && cvv) {
      setHasPaymentMethod(true);
      setIsPaymentOpen(false);
    }
  };

  const handleSkipLineNow = () => {
    console.log('Skip Line Now clicked');
    if (hasPaymentMethod) {
      console.log('Payment method verified, calling onComplete');
      onComplete();
    } else {
      console.log('No payment method selected, opening payment modal');
      setIsPaymentOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* Premium Gradient */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(157,92,255,0.08),_transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#070707]/90 backdrop-blur-xl z-40 border-b border-white/5 safe-top">
        <div className="container-narrow py-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-white/5"
              onClick={onBack}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <h1 className="text-xl font-bold">Skip the Line</h1>
          </div>
        </div>
      </header>

      {/* Main Content - Reduced spacing */}
      <main className="relative pt-16 pb-20 max-w-md mx-auto px-4 space-y-3 z-10">
        {/* Pass Card - More compact */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#9D5CFF]/20 to-[#FF3B7F]/20 border border-white/5 backdrop-blur-sm p-4"
        >
          <div className="space-y-3">
            <div>
              <h2 className="text-2xl font-bold">Neon Lounge</h2>
              <div className="flex items-center gap-2 mt-1">
                <motion.div
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="px-3 py-0.5 rounded-full bg-gradient-to-r from-[#9D5CFF]/40 to-[#FF3B7F]/40 text-sm font-medium"
                >
                  🔥 Peak Hours
                </motion.div>
                <div className="px-3 py-0.5 rounded-full bg-black/20 text-sm">
                  Live DJ Set
                </div>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <div className="text-white/60">Passholder</div>
                <span>dom lhr</span>
              </div>
              <div>
                <div className="text-white/60">Expires at</div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF3B7F]" />
                  <span>4:00 AM</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-6 h-6 rounded-full bg-gradient-to-r from-[#9D5CFF]/20 to-[#FF3B7F]/20 border-2 border-[#070707]"
                  />
                ))}
              </div>
              <span className="text-white/60 text-sm">+189 skipped today</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Info */}
        <div className="flex items-center gap-2 text-[#FF3B7F] text-sm">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>Instant access to front of line. Active until 4:00 AM.</span>
        </div>

        {/* Price & Quantity */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-transparent bg-clip-text">
              $40.00
            </div>
            <motion.div
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm text-[#FF3B7F]"
            >
              2X FOMO Points
            </motion.div>
          </div>
          <div className="flex items-center gap-px">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 text-white px-4 py-1.5 rounded-l-full"
            >
              -
            </motion.button>
            <div className="bg-white/5 text-white px-6 py-1.5">1</div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 text-white px-4 py-1.5 rounded-r-full"
            >
              +
            </motion.button>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="space-y-2">
          <motion.button
            onClick={() => setIsPaymentOpen(!isPaymentOpen)}
            whileHover={{ scale: 1.02 }}
            className="w-full bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] p-3 rounded-2xl font-medium"
          >
            + Add Payment Method
          </motion.button>

          <AnimatePresence>
            {isPaymentOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-3 rounded-2xl bg-white/5 space-y-3">
                  {/* Apple Pay Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 bg-black p-3 rounded-xl"
                  >
                    <Apple className="w-5 h-5" />
                    <span className="font-medium">Pay with Apple Pay</span>
                  </motion.button>

                  <div className="relative flex items-center">
                    <div className="flex-grow border-t border-white/10" />
                    <span className="flex-shrink-0 mx-4 text-white/40 text-sm">or pay with card</span>
                    <div className="flex-grow border-t border-white/10" />
                  </div>

                  {/* Card Input Fields */}
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        placeholder="Card number"
                        className="w-full bg-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#9D5CFF] transition-all"
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                        placeholder="MM/YY"
                        className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#9D5CFF] transition-all"
                      />
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        maxLength={3}
                        placeholder="CVV"
                        className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#9D5CFF] transition-all"
                      />
                    </div>
                  </div>

                  {/* Add Card Button */}
                  <motion.button
                    onClick={handleAddCard}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] p-2 rounded-xl font-medium text-sm"
                    disabled={!cardNumber || !expiryDate || !cvv}
                  >
                    Add Card
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Promo Code Section */}
        <div className="space-y-2">
          <motion.button
            onClick={() => setIsPromoOpen(!isPromoOpen)}
            whileHover={{ scale: 1.02 }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9D5CFF]" />
              <span>Got a promo code?</span>
            </div>
            <motion.div
              animate={{ rotate: isPromoOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-white/40" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isPromoOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-3 rounded-2xl bg-white/5 space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter promo code"
                      className="w-full bg-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#9D5CFF] transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-sm font-medium"
                    >
                      Apply
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Total Breakdown */}
        <div className="space-y-2 bg-white/5 p-3 rounded-2xl">
          <div className="flex justify-between text-white/80">
            <span>Skip Line Pass</span>
            <span>$40.00</span>
          </div>
          <div className="flex justify-between text-white/80">
            <div className="flex items-center gap-1">
              <span>Service Fee</span>
              <Info className="w-4 h-4 text-[#9D5CFF]" />
            </div>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between text-white/80">
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#9D5CFF]" />
              <span>FOMO Points</span>
            </div>
            <span>+80</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/10">
            <span className="font-bold">Total</span>
            <span className="font-bold bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-transparent bg-clip-text">
              $40.00
            </span>
          </div>
        </div>

        {/* Skip Line Now Button */}
        <motion.button
          onClick={handleSkipLineNow}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full p-4 rounded-2xl font-bold text-lg ${
            hasPaymentMethod 
              ? 'bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F]' 
              : 'bg-gradient-to-r from-[#9D5CFF]/50 to-[#FF3B7F]/50'
          }`}
        >
          Skip Line Now • ${venue?.price || '40.00'}
        </motion.button>
      </main>

      {/* Payment Method Modal */}
      <AnimatePresence>
        {false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute inset-x-0 bottom-0 bg-[#070707] rounded-t-3xl p-6 space-y-6"
            >
              {/* Modal content */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};