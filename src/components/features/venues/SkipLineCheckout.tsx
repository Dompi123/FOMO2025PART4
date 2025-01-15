'use client'

import React, { useState } from 'react';
import { Venue, PaymentMethod } from '@/types';

interface SkipLineCheckoutProps {
  venue: Venue;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface CheckoutState {
  step: 'payment' | 'confirmation';
  selectedPaymentMethod: PaymentMethod | null;
  isProcessing: boolean;
  error: string | null;
}

export function SkipLineCheckout({ venue, onSuccess, onCancel }: SkipLineCheckoutProps) {
  const [state, setState] = useState<CheckoutState>({
    step: 'payment',
    selectedPaymentMethod: null,
    isProcessing: false,
    error: null
  });

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setState(prev => ({
      ...prev,
      selectedPaymentMethod: method,
      error: null
    }));
  };

  const handleConfirm = async () => {
    if (!state.selectedPaymentMethod) {
      setState(prev => ({
        ...prev,
        error: 'Please select a payment method'
      }));
      return;
    }

    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      // Process payment and create skip line pass
      // This would call your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess?.();
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to process payment'
      }));
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Skip the Line at {venue.name}</h2>
      
      {state.error && (
        <div className="mb-4 p-3 bg-red-500/10 text-red-500 rounded-lg">
          {state.error}
        </div>
      )}

      {state.step === 'payment' && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {/* Payment method selection */}
            {['credit_card', 'apple_pay', 'google_pay'].map(method => (
              <button
                key={method}
                onClick={() => handlePaymentMethodSelect(method as PaymentMethod)}
                className={`p-3 rounded-lg border ${
                  state.selectedPaymentMethod === method
                    ? 'border-[#9D5CFF] bg-[#9D5CFF]/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {method.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-white/10 font-medium transition-transform hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!state.selectedPaymentMethod || state.isProcessing}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] font-medium transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {state.isProcessing ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}