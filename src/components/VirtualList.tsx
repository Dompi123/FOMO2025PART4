'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useCleanup } from '@/hooks/useCleanup'
import debounce from 'lodash/debounce'

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
  const { addCleanup } = useCleanup()
  const handlersRef = useRef({
    scroll: null as null | ReturnType<typeof debounce>,
    resize: null as null | ReturnType<typeof debounce>
  })

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

    // Create stable handlers
    handlersRef.current.scroll = debounce(() => {
      const { scrollTop, clientHeight } = container
      const start = Math.floor(scrollTop / itemHeight)
      const end = Math.min(
        items.length,
        Math.ceil((scrollTop + clientHeight) / itemHeight) + overscan
      )
      setVisibleRange({ start: Math.max(0, start - overscan), end })
    }, 50)

    handlersRef.current.resize = debounce(() => {
      handlersRef.current.scroll?.()
    }, 100)

    // Initial calculation
    handlersRef.current.scroll()

    // Add listeners
    container.addEventListener('scroll', handlersRef.current.scroll)
    window.addEventListener('resize', handlersRef.current.resize)

    // Add cleanup
    addCleanup(() => {
      container.removeEventListener('scroll', handlersRef.current.scroll!)
      window.removeEventListener('resize', handlersRef.current.resize!)
      handlersRef.current.scroll?.cancel()
      handlersRef.current.resize?.cancel()
      handlersRef.current = { scroll: null, resize: null }
    })
  }, [items.length, itemHeight, overscan, addCleanup])

  const totalHeight = items.length * itemHeight
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