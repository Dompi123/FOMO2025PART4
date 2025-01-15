import { create } from 'zustand'

interface NetworkState {
  isOnline: boolean
  subscribe: (callback: (isOnline: boolean) => void) => () => void
  getState: () => { isOnline: boolean }
}

const useNetworkState = create<NetworkState>((set, get) => ({
  isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
  subscribe: (callback) => {
    const handleOnline = () => {
      set({ isOnline: true })
      callback(true)
    }
    const handleOffline = () => {
      set({ isOnline: false })
      callback(false)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  },
  getState: () => ({ isOnline: get().isOnline })
}))

export { useNetworkState } 