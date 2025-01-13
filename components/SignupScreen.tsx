'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Phone, Mail, X } from 'lucide-react';

interface SignupScreenProps {
  onComplete: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onComplete }) => {
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const socialProofItems = [
    "4.9★ by party people 🎉",
    "trusted by 100+ venues 🤝",
    "10k+ passes used tonight",
    "342 people skipping lines 🎯",
    "VIP access in seconds ⚡️"
  ];

  const notifications = [
    "2 people just got VIP access 🎉",
    "19 minute wait without pass ⏰",
    "2 people just got VIP access 🎉"
  ];

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white relative overflow-hidden">
      {/* Live Counter */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 safe-top"
      >
        <div className="container-narrow">
          <div className="card-gradient p-3 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">342 people skipping lines right now</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6 text-center mb-12"
        >
          {/* Logo */}
          <h1 className="text-6xl font-black text-display bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-transparent bg-clip-text">
            FOMO
          </h1>
          <p className="text-xl text-white/60">
            instant vip access. no lines.
          </p>
        </motion.div>

        {/* Social Proof */}
        <div className="w-full overflow-hidden mb-12">
          <motion.div 
            className="flex gap-3"
            animate={{
              x: ["0%", "-50%"]
            }}
            transition={{
              x: {
                duration: 15,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
              }
            }}
          >
            {/* First set of items */}
            {socialProofItems.map((text, i) => (
              <div
                key={`first-${i}`}
                className="card-gradient px-4 py-2 rounded-full whitespace-nowrap text-sm flex-shrink-0"
              >
                {text}
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {socialProofItems.map((text, i) => (
              <div
                key={`second-${i}`}
                className="card-gradient px-4 py-2 rounded-full whitespace-nowrap text-sm flex-shrink-0"
              >
                {text}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Sign In Buttons */}
        <div className="w-full space-y-4 max-w-sm">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsPhoneModalOpen(true)}
            className="btn-lg w-full btn-gradient ios-click-fix"
          >
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              <span>Continue with Phone</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEmailModalOpen(true)}
            className="btn-lg w-full bg-white/10 backdrop-blur-sm ios-click-fix"
          >
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              <span>Continue with Email</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-lg w-full bg-black ios-click-fix"
          >
            <div className="flex items-center justify-center gap-2">
              <Apple className="w-5 h-5" />
              <span>Continue with Apple</span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Live Notifications */}
      <div className="fixed bottom-8 left-4 right-4">
        <div className="flex gap-2 overflow-x-auto ios-momentum-scroll">
          {notifications.map((notif, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-gradient px-4 py-2 rounded-full text-sm whitespace-nowrap"
            >
              {notif}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Phone Modal */}
      <AnimatePresence>
        {isPhoneModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#070707] rounded-3xl p-6 relative"
            >
              <button
                onClick={() => setIsPhoneModalOpen(false)}
                className="absolute right-4 top-4 p-2 rounded-full bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold mb-6">Enter your phone number</h2>
              
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                placeholder="(555) 555-5555"
                className="input-base w-full mb-4"
                maxLength={14}
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onComplete}
                className="btn-lg w-full btn-gradient"
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Modal */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#070707] rounded-3xl p-6 relative"
            >
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="absolute right-4 top-4 p-2 rounded-full bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold mb-6">Enter your email</h2>
              
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-base w-full mb-4"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onComplete}
                className="btn-lg w-full btn-gradient"
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 