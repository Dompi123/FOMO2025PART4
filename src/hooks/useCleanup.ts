import { useRef, useEffect } from 'react'

interface CleanupManager {
  addCleanup: (cleanup: () => void) => void
  runCleanup: () => void
}

export function useCleanup(): CleanupManager {
  const cleanupFns = useRef<Array<() => void>>([])

  useEffect(() => {
    return () => {
      cleanupFns.current.forEach(cleanup => cleanup())
      cleanupFns.current = []
    }
  }, [])

  return {
    addCleanup: (cleanup: () => void) => {
      cleanupFns.current.push(cleanup)
    },
    runCleanup: () => {
      cleanupFns.current.forEach(cleanup => cleanup())
      cleanupFns.current = []
    }
  }
} 