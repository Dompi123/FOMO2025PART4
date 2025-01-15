'use client'

import { useEffect, useCallback } from 'react'
import debounce from 'lodash/debounce'

export function ViewportHeightFix() {
  // Create stable handler using useCallback and debounce
  const updateHeight = useCallback(
    debounce(() => {
      if (typeof window === 'undefined') return
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }, 100),
    []
  )

  useEffect(() => {
    // Initial update
    updateHeight()

    // Add event listeners
    window.addEventListener('resize', updateHeight)
    window.addEventListener('orientationchange', updateHeight)

    // Cleanup function
    return () => {
      window.removeEventListener('resize', updateHeight)
      window.removeEventListener('orientationchange', updateHeight)
      updateHeight.cancel() // Cancel any pending debounced calls
    }
  }, [updateHeight])

  return null
} 