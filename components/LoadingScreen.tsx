import React from 'react';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#070707] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Logo animation */}
        <div
          className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] animate-pulse"
        />
        
        {/* Loading text */}
        <p
          className="text-white/60 text-sm font-medium animate-pulse"
        >
          Loading FOMO...
        </p>
      </div>
    </div>
  );
}; 