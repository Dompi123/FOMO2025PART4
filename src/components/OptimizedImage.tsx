'use client'

import { useState } from 'react'
import Image from 'next/image'
import { analytics } from '@/lib/analytics'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  priority = false 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
    analytics.trackEvent({
      name: 'image_loaded',
      properties: { src }
    })
  }

  const handleError = () => {
    setHasError(true)
    analytics.trackError({
      message: 'Image failed to load',
      properties: { src }
    })
  }

  if (hasError) {
    return (
      <div 
        className={`bg-gray-900 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500">Failed to load image</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`
          duration-700 ease-in-out
          ${isLoaded ? 'scale-100 blur-0' : 'scale-110 blur-lg'}
        `}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        quality={90}
        sizes={`
          (max-width: 640px) 100vw,
          (max-width: 1024px) 50vw,
          33vw
        `}
      />

      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-900 animate-pulse"
          style={{ backdropFilter: 'blur(15px)' }}
        />
      )}
    </div>
  )
} 