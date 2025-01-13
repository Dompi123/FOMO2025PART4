import { openDB, IDBPDatabase } from 'idb'

interface FomoDB {
  venues: {
    key: string
    value: {
      id: string
      name: string
      description: string
      latitude: number
      longitude: number
      rating: number
      status: 'open' | 'closed'
      waitTime: number
      imageUrl: string
      updatedAt: string
    }
  }
  orders: {
    key: string
    value: {
      id: string
      venueId: string
      items: Array<{
        id: string
        name: string
        quantity: number
        price: number
      }>
      status: 'pending' | 'confirmed' | 'ready' | 'completed'
      total: number
      createdAt: string
    }
  }
  user: {
    key: 'profile'
    value: {
      id: string
      name: string
      email: string
      preferences: Record<string, any>
      lastSyncedAt: string
    }
  }
}

const DB_NAME = 'fomo-db'
const DB_VERSION = 1

export class OfflineStorage {
  private db: IDBPDatabase<FomoDB> | null = null

  async init() {
    if (this.db) return

    this.db = await openDB<FomoDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
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
      },
    })
  }

  async saveVenues(venues: FomoDB['venues']['value'][]) {
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

  async getVenues() {
    try {
      await this.init()
      return await this.db!.getAll('venues')
    } catch (error) {
      console.error('Failed to get venues:', error)
      throw new Error('Failed to retrieve venues from offline storage')
    }
  }

  async saveOrder(order: FomoDB['orders']['value']) {
    try {
      await this.init()
      await this.db!.put('orders', order)
    } catch (error) {
      console.error('Failed to save order:', error)
      throw new Error('Failed to save order to offline storage')
    }
  }

  async getOrders() {
    try {
      await this.init()
      return await this.db!.getAll('orders')
    } catch (error) {
      console.error('Failed to get orders:', error)
      throw new Error('Failed to retrieve orders from offline storage')
    }
  }

  async saveUserData(data: FomoDB['user']['value']) {
    try {
      await this.init()
      await this.db!.put('user', { ...data, lastSyncedAt: new Date().toISOString() })
    } catch (error) {
      console.error('Failed to save user data:', error)
      throw new Error('Failed to save user data to offline storage')
    }
  }

  async getUserData() {
    try {
      await this.init()
      return await this.db!.get('user', 'profile')
    } catch (error) {
      console.error('Failed to get user data:', error)
      throw new Error('Failed to retrieve user data from offline storage')
    }
  }

  async clearAllData() {
    try {
      await this.init()
      const tx = this.db!.transaction(['venues', 'orders', 'user'], 'readwrite')
      await Promise.all([
        tx.objectStore('venues').clear(),
        tx.objectStore('orders').clear(),
        tx.objectStore('user').clear()
      ])
      await tx.done
    } catch (error) {
      console.error('Failed to clear data:', error)
      throw new Error('Failed to clear offline storage')
    }
  }
}

export const offlineStorage = new OfflineStorage() 