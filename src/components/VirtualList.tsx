'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { useCleanup } from '@/hooks/useCleanup'
import debounce from 'lodash/debounce'

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  containerHeight?: number;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
  className?: string;
}

interface VirtualListState {
  scrollTop: number;
  containerHeight: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  containerHeight: initialContainerHeight = 400,
  overscan = 3,
  onScroll,
  className
}: VirtualListProps<T>) {
  const [state, setState] = useState<VirtualListState>({
    scrollTop: 0,
    containerHeight: initialContainerHeight
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const totalHeight = items.length * itemHeight;

  const visibleStartIndex = Math.max(0, Math.floor(state.scrollTop / itemHeight) - overscan);
  const visibleEndIndex = Math.min(
    items.length - 1,
    Math.ceil((state.scrollTop + state.containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(visibleStartIndex, visibleEndIndex + 1);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    setState(prev => ({ ...prev, scrollTop }));
    onScroll?.(scrollTop);
  }, [onScroll]);

  const handleResize = useCallback(() => {
    if (containerRef.current) {
      setState(prev => ({
        ...prev,
        containerHeight: containerRef.current?.clientHeight || initialContainerHeight
      }));
    }
  }, [initialContainerHeight]);

  useEffect(() => {
    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [handleResize]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={className}
      style={{ 
        height: initialContainerHeight,
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={visibleStartIndex + index}
            style={{
              position: 'absolute',
              top: (visibleStartIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, visibleStartIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
} 