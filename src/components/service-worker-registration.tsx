'use client'

import { useEffect } from 'react'
import { register } from '@/lib/register-sw'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    register()
      .then((registration) => {
        if (registration) {
          console.log('Service Worker registered successfully')
        }
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  }, [])

  return null
} 