'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function AnalyticsInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`
      // Track page view
      console.log('Page view:', url)
    }
  }, [pathname, searchParams])

  return null
}

export function Analytics() {
  return (
    <Suspense>
      <AnalyticsInner />
    </Suspense>
  )
} 