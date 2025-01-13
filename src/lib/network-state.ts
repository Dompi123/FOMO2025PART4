import { create } from 'zustand'

interface NetworkState {
  isOnline: boolean
  lastChecked: number | null
  checkConnection: () => Promise<boolean>
  setOnline: (status: boolean) => void
}

export const useNetworkState = create<NetworkState>((set, get) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  lastChecked: null,

  checkConnection: async () => {
    try {
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache',
      })
      const isOnline = response.ok
      set({ isOnline, lastChecked: Date.now() })
      return isOnline
    } catch (error) {
      set({ isOnline: false, lastChecked: Date.now() })
      return false
    }
  },

  setOnline: (status: boolean) => {
    set({ isOnline: status, lastChecked: Date.now() })
  },
}))

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useNetworkState.getState().setOnline(true)
  })

  window.addEventListener('offline', () => {
    useNetworkState.getState().setOnline(false)
  })

  // Check connection status periodically
  setInterval(() => {
    useNetworkState.getState().checkConnection()
  }, 30000) // Every 30 seconds
} 