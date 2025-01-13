import { Profile, Venue } from '@/types'
import { apiClient } from './api-client'
import { offlineStorage } from './offline-storage'
import { useNetworkState } from './network-state'
import { analytics } from './analytics'

interface OrderData {
  venueId: string
  items: Array<{
    id: string
    quantity: number
  }>
}

interface SyncOperation {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: 'order' | 'profile'
  data: OrderData | Partial<Profile>
  timestamp: number
  retryCount: number
}

class SyncManager {
  private syncQueue: SyncOperation[] = []
  private isSyncing = false
  private syncInterval: ReturnType<typeof setInterval> | null = null

  async init() {
    // Load pending operations from storage
    const storedQueue = localStorage.getItem('syncQueue')
    if (storedQueue) {
      this.syncQueue = JSON.parse(storedQueue)
    }

    // Start periodic sync
    this.syncInterval = setInterval(() => this.sync(), 60000) // Every minute

    // Listen for network changes
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.sync())
    }
  }

  async queueOperation(operation: Omit<SyncOperation, 'timestamp'>) {
    const syncOp: SyncOperation = {
      ...operation,
      timestamp: Date.now(),
    }

    this.syncQueue.push(syncOp)
    this.persistQueue()

    // Try to sync immediately if online
    if (useNetworkState.getState().isOnline) {
      await this.sync()
    }
  }

  private persistQueue() {
    localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue))
  }

  async sync() {
    if (this.isSyncing || !useNetworkState.getState().isOnline || this.syncQueue.length === 0) {
      return
    }

    this.isSyncing = true

    try {
      // Process queue in order
      const operations = [...this.syncQueue]
      this.syncQueue = []
      this.persistQueue()

      for (const operation of operations) {
        try {
          await this.processSyncOperation(operation)
        } catch (error) {
          // If operation fails, add it back to queue
          this.syncQueue.push(operation)
          this.persistQueue()
          analytics.trackError({
            message: 'Sync operation failed',
            operation,
            error,
          })
        }
      }

      // Sync venue data from server
      const { data: venues } = await apiClient.getVenues()
      await offlineStorage.saveVenues(venues as Venue[])

      // Sync user profile
      const { data: profile } = await apiClient.getProfile()
      await offlineStorage.saveUserData(profile as Profile)

    } catch (error) {
      analytics.trackError({
        message: 'Sync failed',
        error,
      })
    } finally {
      this.isSyncing = false
    }
  }

  private async processSyncOperation(operation: SyncOperation) {
    try {
      switch (operation.entity) {
        case 'order':
          const orderData = operation.data as OrderData
          await apiClient.createOrder(orderData.venueId, orderData.items)
          break
        case 'profile':
          const profileData = operation.data as Partial<Profile>
          await apiClient.updateProfile(profileData)
          break
      }
    } catch (error) {
      // If operation fails, add it back to queue
      this.syncQueue.push(operation)
      this.persistQueue()
      analytics.trackError({
        message: 'Sync operation failed',
        operation,
        error,
      })
    }
  }

  cleanup() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }
  }
}

export const syncManager = new SyncManager() 