'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function Analytics() {
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