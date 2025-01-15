'use client'

import { Suspense } from 'react'

function NotFoundInner() {
  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-white/60">This page could not be found.</p>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense>
      <NotFoundInner />
    </Suspense>
  )
} 