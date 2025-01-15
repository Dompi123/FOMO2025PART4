import { offlineStorage } from './offline-storage'
import type { SyncState } from '../types'

class NetworkError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = 'NetworkError'
  }
}

class SyncError extends Error {
  constructor(message: string, public operation: string, public originalError: Error) {
    super(message)
    this.name = 'SyncError'
  }
}

interface SyncableOperation {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  endpoint: string
  payload: any
  timestamp: string
  retryCount: number
}

class SyncManager {
  private readonly MAX_RETRIES = 3
  private readonly RETRY_DELAY = 1000 // 1 second
  private isSyncing = false
  private subscribers: ((state: SyncState) => void)[] = []
  private currentState: SyncState = {
    isOnline: navigator.onLine,
    isSyncing: false,
    pendingOperations: 0,
    lastSyncTime: undefined,
    error: undefined
  }

  constructor() {
    window.addEventListener('online', () => this.updateState({ isOnline: true }))
    window.addEventListener('offline', () => this.updateState({ isOnline: false }))
  }

  private updateState(partialState: Partial<SyncState>) {
    this.currentState = { ...this.currentState, ...partialState }
    this.notifySubscribers()
  }

  private notifySubscribers() {
    this.subscribers.forEach(subscriber => subscriber(this.currentState))
  }

  subscribe(callback: (state: SyncState) => void): () => void {
    this.subscribers.push(callback)
    callback(this.currentState) // Initial state
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback)
    }
  }

  async queueOperation(operation: Omit<SyncableOperation, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    const syncOp: SyncableOperation = {
      id: crypto.randomUUID(),
      ...operation,
      timestamp: new Date().toISOString(),
      retryCount: 0
    }

    try {
      await offlineStorage.saveOperation(syncOp)
      await this.attemptSync()
    } catch (error) {
      throw new SyncError(
        'Failed to queue operation',
        JSON.stringify(operation),
        error instanceof Error ? error : new Error(String(error))
      )
    }
  }

  async attemptSync(): Promise<void> {
    if (this.isSyncing) return

    this.updateState({ isSyncing: true })
    try {
      const operations = await offlineStorage.getPendingOperations()
      this.updateState({ pendingOperations: operations.length })
      
      for (const operation of operations) {
        try {
          await this.processSyncOperation(operation as SyncableOperation)
          await offlineStorage.removeOperation(operation.id)
          this.updateState({ 
            pendingOperations: this.currentState.pendingOperations - 1,
            error: undefined
          })
        } catch (error) {
          if (operation.retryCount < this.MAX_RETRIES) {
            const updatedOp = {
              ...operation,
              retryCount: operation.retryCount + 1
            }
            await offlineStorage.saveOperation(updatedOp)
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * updatedOp.retryCount))
          } else {
            console.error(`Operation ${operation.id} failed after ${this.MAX_RETRIES} retries:`, error)
            this.updateState({ 
              error: `Operation failed after ${this.MAX_RETRIES} retries: ${error instanceof Error ? error.message : String(error)}` 
            })
            await offlineStorage.removeOperation(operation.id)
          }
        }
      }
      
      this.updateState({ 
        lastSyncTime: new Date().toISOString(),
        error: undefined
      })
    } catch (error) {
      const syncError = new SyncError(
        'Sync attempt failed',
        'global',
        error instanceof Error ? error : new Error(String(error))
      )
      this.updateState({ error: syncError.message })
      throw syncError
    } finally {
      this.updateState({ isSyncing: false })
    }
  }

  private async processSyncOperation(operation: SyncableOperation): Promise<void> {
    const { endpoint, type, payload } = operation
    
    const response = await fetch(endpoint, {
      method: type === 'DELETE' ? 'DELETE' : type === 'CREATE' ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers here
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new NetworkError(
        `Failed to process operation: ${response.status} ${response.statusText}`,
        response.status
      )
    }
  }

  // Register for background sync if available
  async registerBackgroundSync(): Promise<void> {
    if (!('serviceWorker' in navigator)) return

    try {
      const registration = await navigator.serviceWorker.ready as ServiceWorkerRegistration & {
        sync?: { register(tag: string): Promise<void> }
      }
      if (registration.sync) {
        await registration.sync.register('sync-operations')
      }
    } catch (error) {
      console.error('Background sync registration failed:', error)
    }
  }
}

export const syncManager = new SyncManager() 