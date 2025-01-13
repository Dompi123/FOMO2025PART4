'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface VirtualListProps<T extends Record<string, any>> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number
  overscan?: number
  className?: string
  onEndReached?: () => void
  endReachedThreshold?: number
}

export function VirtualList<T extends Record<string, any>>({
  items,
  renderItem,
  itemHeight,
  overscan = 3,
  className = '',
  onEndReached,
  endReachedThreshold = 0.8
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 })
  const totalHeight = items.length * itemHeight

  // End reached detection
  const { ref: endRef } = useInView({
    threshold: endReachedThreshold,
    onChange: (inView: boolean) => {
      if (inView && onEndReached) {
        onEndReached()
      }
    },
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, clientHeight } = container
      const start = Math.floor(scrollTop / itemHeight)
      const end = Math.min(
        items.length,
        Math.ceil((scrollTop + clientHeight) / itemHeight) + overscan
      )

      setVisibleRange({ start: Math.max(0, start - overscan), end })
    }

    handleScroll() // Initial calculation
    container.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [items.length, itemHeight, overscan])

  const visibleItems = items.slice(visibleRange.start, visibleRange.end)

  return (
    <div
      ref={containerRef}
      className={`overflow-auto relative ${className}`}
      style={{ willChange: 'transform' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${visibleRange.start * itemHeight}px)`,
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={visibleRange.start + index} style={{ height: itemHeight }}>
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
      <div ref={endRef} style={{ height: 1 }} />
    </div>
  )
} 