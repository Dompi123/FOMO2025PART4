import { openDB, IDBPDatabase, IDBPObjectStore, IDBPCursorWithValue, StoreNames, IDBPTransaction } from 'idb'
import type { SyncOperation } from './sync-manager'
import type { Venue, Profile, Order } from '@/types'

interface FomoDB {
  venues: {
    key: string
    value: Venue
  }
  orders: {
    key: string
    value: Order
  }
  user: {
    key: 'profile'
    value: Profile
  }
  syncQueue: {
    key: string
    value: SyncOperation
  }
  pendingOperations: {
    key: string
    value: SyncOperation
  }
}

const DB_NAME = 'fomo-db'
const DB_VERSION = 2

export class OfflineStorage {
  private db: IDBPDatabase<FomoDB> | null = null

  async init() {
    if (this.db) return

    this.db = await openDB<FomoDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // Create stores if they don't exist
        if (!db.objectStoreNames.contains('venues')) {
          db.createObjectStore('venues', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('orders')) {
          db.createObjectStore('orders', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('user')) {
          db.createObjectStore('user', { keyPath: 'id' })
        }
        // New stores for sync support
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('pendingOperations')) {
          db.createObjectStore('pendingOperations', { keyPath: 'id' })
        }

        // Add version field to existing stores if upgrading from v1
        if (oldVersion < 2) {
          const stores = ['venues', 'orders', 'user'] as const
          stores.forEach(async (storeName) => {
            const tx = db.transaction(storeName, 'readwrite')
            const store = tx.objectStore(storeName)
            
            try {
              let cursor = await store.openCursor()
              while (cursor) {
                const value = cursor.value
                if (!value.version) {
                  value.version = 1
                  await cursor.update(value)
                }
                cursor = await cursor.continue()
              }
              await tx.done
            } catch (error) {
              console.error(`Failed to upgrade store ${storeName}:`, error)
            }
          })
        }
      },
    })
  }

  // Sync Queue Methods
  async getSyncQueue(): Promise<SyncOperation[]> {
    try {
      await this.init()
      return await this.db!.getAll('syncQueue')
    } catch (error) {
      console.error('Failed to get sync queue:', error)
      return []
    }
  }

  async saveSyncQueue(queue: SyncOperation[]): Promise<void> {
    try {
      await this.init()
      const tx = this.db!.transaction('syncQueue', 'readwrite')
      await tx.objectStore('syncQueue').clear()
      await Promise.all(queue.map(op => tx.store.add(op)))
      await tx.done
    } catch (error) {
      console.error('Failed to save sync queue:', error)
    }
  }

  // Pending Operations Methods
  async saveOperation(operation: SyncOperation): Promise<void> {
    try {
      await this.init()
      await this.db!.add('pendingOperations', operation)
    } catch (error) {
      console.error('Failed to save operation:', error)
    }
  }

  async removeOperation(operationId: string): Promise<void> {
    try {
      await this.init()
      await this.db!.delete('pendingOperations', operationId)
    } catch (error) {
      console.error('Failed to remove operation:', error)
    }
  }

  async getPendingOperations(): Promise<SyncOperation[]> {
    try {
      await this.init()
      return await this.db!.getAll('pendingOperations')
    } catch (error) {
      console.error('Failed to get pending operations:', error)
      return []
    }
  }

  // Enhanced Venue Methods
  async saveVenues(venues: Venue[]): Promise<void> {
    try {
      await this.init()
      const tx = this.db!.transaction('venues', 'readwrite')
      await Promise.all(venues.map(venue => tx.store.put(venue)))
      await tx.done
    } catch (error) {
      console.error('Failed to save venues:', error)
      throw new Error('Failed to save venues to offline storage')
    }
  }

  async getVenues(): Promise<Venue[]> {
    try {
      await this.init()
      return await this.db!.getAll('venues')
    } catch (error) {
      console.error('Failed to get venues:', error)
      throw new Error('Failed to retrieve venues from offline storage')
    }
  }

  // Enhanced Order Methods
  async saveOrder(order: Order): Promise<void> {
    try {
      await this.init()
      await this.db!.put('orders', order)
    } catch (error) {
      console.error('Failed to save order:', error)
      throw new Error('Failed to save order to offline storage')
    }
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    try {
      await this.init()
      return await this.db!.get('orders', orderId)
    } catch (error) {
      console.error('Failed to get order:', error)
      throw new Error('Failed to retrieve order from offline storage')
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      await this.init()
      return await this.db!.getAll('orders')
    } catch (error) {
      console.error('Failed to get orders:', error)
      throw new Error('Failed to retrieve orders from offline storage')
    }
  }

  // Enhanced User Data Methods
  async saveUserData(data: Profile): Promise<void> {
    try {
      await this.init()
      await this.db!.put('user', {
        ...data,
        lastSyncedAt: new Date().toISOString(),
        version: (data.version || 0) + 1
      })
    } catch (error) {
      console.error('Failed to save user data:', error)
      throw new Error('Failed to save user data to offline storage')
    }
  }

  async getUserData(): Promise<Profile | undefined> {
    try {
      await this.init()
      return await this.db!.get('user', 'profile')
    } catch (error) {
      console.error('Failed to get user data:', error)
      throw new Error('Failed to retrieve user data from offline storage')
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await this.init()
      const tx = this.db!.transaction(
        ['venues', 'orders', 'user', 'syncQueue', 'pendingOperations'],
        'readwrite'
      )
      await Promise.all([
        tx.objectStore('venues').clear(),
        tx.objectStore('orders').clear(),
        tx.objectStore('user').clear(),
        tx.objectStore('syncQueue').clear(),
        tx.objectStore('pendingOperations').clear()
      ])
      await tx.done
    } catch (error) {
      console.error('Failed to clear data:', error)
      throw new Error('Failed to clear offline storage')
    }
  }
}

export const offlineStorage = new OfflineStorage() 