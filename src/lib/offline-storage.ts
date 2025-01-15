import { openDB, deleteDB, IDBPDatabase, IDBPObjectStore, IDBPTransaction } from 'idb'

interface Venue {
  id: string
  name: string
  category: string
  latitude: number
  longitude: number
  // Add other venue properties as needed
}

interface Order {
  id: string
  createdAt: string
  status: string
  // Add other order properties as needed
}

interface Profile {
  id: string
  // Add other profile properties as needed
}

interface SyncOperation {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  endpoint: string
  payload: any
  timestamp: string
  retryCount: number
}

interface FomoDB {
  venues: Venue
  orders: Order
  user: Profile
  sync: SyncOperation
  metadata: any
}

class OfflineStorage {
  private db: IDBPDatabase<FomoDB> | null = null
  private readonly DB_NAME = 'fomo-db'
  private readonly DB_VERSION = 2 // Increment for schema changes
  private readonly STORES = {
    VENUES: 'venues',
    ORDERS: 'orders',
    USER: 'user',
    SYNC: 'sync',
    METADATA: 'metadata' // New store for versioning
  }

  async init(): Promise<void> {
    if (this.db) return

    try {
      this.db = await openDB<FomoDB>(this.DB_NAME, this.DB_VERSION, {
        upgrade: (db, oldVersion, newVersion) => this.handleUpgrade(db, oldVersion ?? 0, newVersion ?? this.DB_VERSION),
        blocked: () => {
          console.warn('Database upgrade blocked. Please close other tabs of this app.')
        },
        blocking: () => {
          if (this.db) {
            this.db.close()
          }
        },
        terminated: () => {
          console.error('Database connection terminated unexpectedly')
          this.db = null
        }
      })

      // Set initial metadata if not exists
      const metadata = await this.db.get(this.STORES.METADATA, 'version')
      if (!metadata) {
        await this.db.put(this.STORES.METADATA, {
          version: this.DB_VERSION,
          lastSync: new Date().toISOString()
        }, 'version')
      }
    } catch (error) {
      console.error('Failed to initialize database:', error)
      await this.deleteDatabase()
      return this.init()
    }
  }

  private async handleUpgrade(db: IDBPDatabase<FomoDB>, oldVersion: number, newVersion: number) {
    if (oldVersion < 1) {
      // Initial schema
      this.createInitialStores(db)
    }
    
    if (oldVersion < 2) {
      // Add metadata store in version 2
      if (!db.objectStoreNames.contains(this.STORES.METADATA)) {
        db.createObjectStore(this.STORES.METADATA)
      }
      
      // Add new indices or modify existing stores
      if (db.objectStoreNames.contains(this.STORES.VENUES)) {
        const tx = db.transaction(this.STORES.VENUES, 'readwrite')
        const store = tx.objectStore(this.STORES.VENUES) as unknown as IDBObjectStore
        const indexNames = store.indexNames
        const hasCategoryIndex = Array.from(indexNames).includes('by-category')
        
        if (!hasCategoryIndex) {
          store.createIndex('by-category', 'category')
        }
        await tx.done
      }
    }
  }

  private createInitialStores(db: IDBPDatabase<FomoDB>) {
    // Venues store with indices
    const venueStore = db.createObjectStore(this.STORES.VENUES, { keyPath: 'id' })
    venueStore.createIndex('by-location', ['latitude', 'longitude'])
    venueStore.createIndex('by-category', 'category')

    // Orders store with indices
    const orderStore = db.createObjectStore(this.STORES.ORDERS, { keyPath: 'id' })
    orderStore.createIndex('by-date', 'createdAt')
    orderStore.createIndex('by-status', 'status')

    // User store
    db.createObjectStore(this.STORES.USER, { keyPath: 'id' })

    // Sync operations store with indices
    const syncStore = db.createObjectStore(this.STORES.SYNC, { keyPath: 'id' })
    syncStore.createIndex('by-type', 'type')
    syncStore.createIndex('by-timestamp', 'timestamp')
  }

  private async ensureConnection() {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) {
      throw new Error('Failed to establish database connection')
    }
  }

  // Venue operations with error handling and retries
  async saveVenues(venues: Venue[], retryCount = 3): Promise<void> {
    await this.ensureConnection()
    try {
      const tx = this.db!.transaction(this.STORES.VENUES, 'readwrite')
      await Promise.all(venues.map(venue => tx.store.put(venue)))
      await tx.done
    } catch (error) {
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return this.saveVenues(venues, retryCount - 1)
      }
      throw new Error(`Failed to save venues: ${error}`)
    }
  }

  async getVenues(): Promise<Venue[]> {
    await this.ensureConnection()
    return this.db!.getAll(this.STORES.VENUES)
  }

  async getVenuesByLocation(lat: number, lng: number, radius: number): Promise<Venue[]> {
    await this.ensureConnection()
    const venues = await this.getVenues()
    return venues.filter(venue => {
      const distance = this.calculateDistance(lat, lng, venue.latitude, venue.longitude)
      return distance <= radius
    })
  }

  // Order operations
  async saveOrders(orders: Order[], retryCount = 3): Promise<void> {
    await this.ensureConnection()
    try {
      const tx = this.db!.transaction(this.STORES.ORDERS, 'readwrite')
      await Promise.all(orders.map(order => tx.store.put(order)))
      await tx.done
    } catch (error) {
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return this.saveOrders(orders, retryCount - 1)
      }
      throw new Error(`Failed to save orders: ${error}`)
    }
  }

  async getOrders(): Promise<Order[]> {
    await this.ensureConnection()
    return this.db!.getAll(this.STORES.ORDERS)
  }

  // User operations
  async saveUserData(profile: Profile, retryCount = 3): Promise<void> {
    await this.ensureConnection()
    try {
      await this.db!.put(this.STORES.USER, profile)
    } catch (error) {
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return this.saveUserData(profile, retryCount - 1)
      }
      throw new Error(`Failed to save user data: ${error}`)
    }
  }

  async getUserData(): Promise<Profile | undefined> {
    await this.ensureConnection()
    const allUsers = await this.db!.getAll(this.STORES.USER)
    return allUsers[0]
  }

  // Sync operations
  async saveOperation(operation: SyncOperation, retryCount = 3): Promise<void> {
    await this.ensureConnection()
    try {
      await this.db!.put(this.STORES.SYNC, operation)
    } catch (error) {
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return this.saveOperation(operation, retryCount - 1)
      }
      throw new Error(`Failed to save sync operation: ${error}`)
    }
  }

  async removeOperation(id: string, retryCount = 3): Promise<void> {
    await this.ensureConnection()
    try {
      await this.db!.delete(this.STORES.SYNC, id)
    } catch (error) {
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return this.removeOperation(id, retryCount - 1)
      }
      throw new Error(`Failed to remove sync operation: ${error}`)
    }
  }

  async getPendingOperations(): Promise<SyncOperation[]> {
    await this.ensureConnection()
    return this.db!.getAll(this.STORES.SYNC)
  }

  // Helper methods
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1)
    const dLon = this.toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  async deleteDatabase(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
    }
    await deleteDB(this.DB_NAME)
  }

  async clearAllData(): Promise<void> {
    await this.ensureConnection()
    const tx = this.db!.transaction(
      [this.STORES.VENUES, this.STORES.ORDERS, this.STORES.USER, this.STORES.SYNC],
      'readwrite'
    )
    await Promise.all([
      tx.objectStore(this.STORES.VENUES).clear(),
      tx.objectStore(this.STORES.ORDERS).clear(),
      tx.objectStore(this.STORES.USER).clear(),
      tx.objectStore(this.STORES.SYNC).clear()
    ])
    await tx.done
  }
}

export const offlineStorage = new OfflineStorage() 