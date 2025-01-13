'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
        >
          Try again
        </button>
        <button
          onClick={() => router.push('/venues')}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
        >
          Return home
        </button>
      </div>
    </div>
  )
} 