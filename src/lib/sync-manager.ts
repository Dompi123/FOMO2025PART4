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

export interface SyncOperation {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: 'order' | 'profile'
  data: OrderData | Partial<Profile>
  timestamp: number
  retryCount: number
  version?: number
  conflictResolution?: 'client' | 'server'
}

interface ApiResponse<T> {
  data: T
  version?: number
}

export class SyncManager {
  private syncQueue: SyncOperation[] = []
  private isSyncing = false
  private syncInterval: ReturnType<typeof setInterval> | null = null
  private maxRetries = 5
  private retryDelay = 1000 // Start with 1 second

  async init() {
    // Load pending operations from storage
    const storedQueue = await offlineStorage.getSyncQueue()
    if (storedQueue) {
      this.syncQueue = storedQueue
    }

    // Start periodic sync with exponential backoff
    this.startPeriodicSync()

    // Listen for network changes
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.startPeriodicSync()
        this.sync() // Try immediate sync when coming online
      })
      window.addEventListener('offline', () => {
        if (this.syncInterval) {
          clearInterval(this.syncInterval)
          this.syncInterval = null
        }
      })
    }
  }

  private startPeriodicSync() {
    if (this.syncInterval) return

    this.syncInterval = setInterval(() => {
      if (useNetworkState.getState().isOnline) {
        this.sync()
      }
    }, 60000) // Every minute when online
  }

  async queueOperation(operation: Omit<SyncOperation, 'timestamp' | 'retryCount' | 'version'>) {
    const syncOp: SyncOperation = {
      ...operation,
      timestamp: Date.now(),
      retryCount: 0,
      version: await this.getCurrentEntityVersion(operation.entity, operation.data)
    }

    this.syncQueue.push(syncOp)
    await this.persistQueue()

    // Try to sync immediately if online
    if (useNetworkState.getState().isOnline) {
      await this.sync()
    }

    // Store operation in IndexedDB for offline resilience
    await offlineStorage.saveOperation(syncOp)
  }

  private async getCurrentEntityVersion(entity: string, data: any): Promise<number> {
    try {
      switch (entity) {
        case 'order':
          const order = await offlineStorage.getOrder((data as OrderData).venueId)
          return order?.version || 0
        case 'profile':
          const profile = await offlineStorage.getUserData()
          return profile?.version || 0
        default:
          return 0
      }
    } catch {
      return 0
    }
  }

  private async persistQueue() {
    await offlineStorage.saveSyncQueue(this.syncQueue)
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
      await this.persistQueue()

      for (const operation of operations) {
        try {
          await this.processSyncOperation(operation)
        } catch (error) {
          const shouldRetry = this.handleSyncError(operation, error)
          if (shouldRetry) {
            // Add back to queue with incremented retry count
            operation.retryCount++
            this.syncQueue.push(operation)
            await this.persistQueue()
          }
          analytics.trackError({
            message: 'Sync operation failed',
            operation,
            error,
          })
        }
      }

      // Sync venue data from server with conflict resolution
      await this.syncVenues()

      // Sync user profile with conflict resolution
      await this.syncProfile()

    } catch (error) {
      analytics.trackError({
        message: 'Sync failed',
        error,
      })
    } finally {
      this.isSyncing = false
    }
  }

  private async syncVenues() {
    try {
      const response = await apiClient.getVenues()
      const localVenues = await offlineStorage.getVenues()
      
      // Compare versions and resolve conflicts
      if (this.needsConflictResolution(localVenues[0], response.data[0])) {
        const resolvedVenues = await this.resolveVenueConflicts(localVenues, response.data)
        await offlineStorage.saveVenues(resolvedVenues)
      } else {
        await offlineStorage.saveVenues(response.data)
      }
    } catch (error) {
      console.error('Failed to sync venues:', error)
      // Continue with local data
    }
  }

  private async syncProfile() {
    try {
      const response = await apiClient.getProfile()
      const localProfile = await offlineStorage.getUserData()
      
      if (localProfile && this.needsConflictResolution(localProfile, response.data)) {
        const resolvedProfile = await this.resolveProfileConflicts(localProfile, response.data)
        await offlineStorage.saveUserData(resolvedProfile)
      } else {
        await offlineStorage.saveUserData(response.data)
      }
    } catch (error) {
      console.error('Failed to sync profile:', error)
      // Continue with local data
    }
  }

  private needsConflictResolution(localData: { version?: number } | undefined, serverData: { version?: number } | undefined): boolean {
    return (localData?.version || 0) !== (serverData?.version || 0)
  }

  private async resolveVenueConflicts(localVenues: Venue[], serverVenues: Venue[]): Promise<Venue[]> {
    // Implement venue-specific conflict resolution
    // For now, server wins for venues as they're mostly read-only
    return serverVenues
  }

  private async resolveProfileConflicts(localProfile: Profile, serverProfile: Profile): Promise<Profile> {
    // Merge strategy: Keep local changes for certain fields, take server data for others
    return {
      ...serverProfile,
      // Keep local preferences if they exist
      preferences: localProfile?.preferences || serverProfile.preferences,
    }
  }

  private handleSyncError(operation: SyncOperation, error: any): boolean {
    // Determine if we should retry based on error type and retry count
    if (operation.retryCount >= this.maxRetries) {
      return false
    }

    // Calculate exponential backoff delay
    const delay = Math.min(this.retryDelay * Math.pow(2, operation.retryCount), 60000)
    setTimeout(() => this.sync(), delay)

    return true
  }

  private async processSyncOperation(operation: SyncOperation) {
    try {
      switch (operation.entity) {
        case 'order':
          const orderData = operation.data as OrderData
          await apiClient.createOrder(orderData.venueId, orderData.items, operation.version)
          break
        case 'profile':
          const profileData = operation.data as Partial<Profile>
          await apiClient.updateProfile(profileData, operation.version)
          break
      }

      // Remove from offline storage after successful sync
      await offlineStorage.removeOperation(operation.id)
    } catch (error) {
      if (this.isConflictError(error)) {
        await this.handleConflict(operation)
      }
      throw error
    }
  }

  private isConflictError(error: any): boolean {
    return error?.status === 409 || error?.message?.includes('conflict')
  }

  private async handleConflict(operation: SyncOperation) {
    // Implement conflict resolution strategy
    if (operation.conflictResolution === 'client') {
      // Force client changes
      await apiClient.forceSyncOperation({
        type: operation.type,
        entity: operation.entity,
        data: operation.data,
        version: operation.version || 0
      })
    } else {
      // Default to server version
      await this.acceptServerChanges(operation)
    }
  }

  private async acceptServerChanges(operation: SyncOperation) {
    // Fetch and apply server version
    switch (operation.entity) {
      case 'profile':
        const { data: profile } = await apiClient.getProfile()
        await offlineStorage.saveUserData(profile)
        break
      // Add other entities as needed
    }
  }

  cleanup() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.sync)
    }
  }
}

export const syncManager = new SyncManager() 