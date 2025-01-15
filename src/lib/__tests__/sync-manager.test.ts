import { syncManager } from '../sync-manager'
import { SyncStateMonitor, mockNetworkState } from '../test-helpers'
import { offlineStorage } from '../offline-storage'
import { apiClient } from '../api-client'
import { SyncOperation } from '../../types'

jest.mock('../api-client')

describe('SyncManager', () => {
  let stateMonitor: SyncStateMonitor

  beforeEach(async () => {
    // Reset everything before each test
    await syncManager.cleanup()
    await offlineStorage.clearAllData()
    stateMonitor = new SyncStateMonitor()
    stateMonitor.start()
  })

  afterEach(() => {
    stateMonitor.stop()
  })

  describe('Initialization', () => {
    it('should initialize with correct initial state', async () => {
      await syncManager.init()
      const state = stateMonitor.getLastState()
      
      expect(state).toBeDefined()
      expect(state?.isInitialized).toBe(true)
      expect(state?.isSyncing).toBe(false)
      expect(state?.pendingOperations).toBe(0)
    })

    it('should load pending operations on init', async () => {
      // Setup: Add some operations to storage
      const operation: SyncOperation = {
        id: '1',
        type: 'create',
        entity: 'order',
        data: {
          venueId: 'venue1',
          items: [{ id: 'item1', quantity: 1 }]
        },
        timestamp: Date.now(),
        retryCount: 0
      }
      await offlineStorage.saveOperation(operation)

      await syncManager.init()
      const state = stateMonitor.getLastState()
      
      expect(state?.pendingOperations).toBe(1)
    })
  })

  describe('State Management', () => {
    it('should notify subscribers of state changes', async () => {
      const states: any[] = []
      const unsubscribe = syncManager.subscribe(state => {
        states.push({ ...state })
      })

      await syncManager.init()
      const operation: Omit<SyncOperation, 'timestamp' | 'retryCount' | 'version'> = {
        id: '1',
        type: 'create',
        entity: 'order',
        data: {
          venueId: 'venue1',
          items: [{ id: 'item1', quantity: 1 }]
        }
      }
      await syncManager.queueOperation(operation)

      expect(states.length).toBeGreaterThan(1)
      expect(states[states.length - 1].pendingOperations).toBe(1)

      unsubscribe()
    })

    it('should track errors correctly', async () => {
      await syncManager.init()
      
      // Force an error by trying to queue an invalid operation
      try {
        const operation: Omit<SyncOperation, 'timestamp' | 'retryCount' | 'version'> = {
          id: '1',
          type: 'invalid' as any,
          entity: 'order',
          data: {
            venueId: 'venue1',
            items: [{ id: 'item1', quantity: 1 }]
          }
        }
        await syncManager.queueOperation(operation)
      } catch (error) {
        // Expected error
      }

      const state = stateMonitor.getLastState()
      expect(state?.errors.length).toBeGreaterThan(0)
      expect(state?.errors[0].message).toContain('Invalid operation type')
    })
  })

  describe('Network Handling', () => {
    it('should start sync when coming online', async () => {
      await syncManager.init()
      
      // Add an operation and go offline
      const operation: Omit<SyncOperation, 'timestamp' | 'retryCount' | 'version'> = {
        id: '1',
        type: 'create',
        entity: 'order',
        data: {
          venueId: 'venue1',
          items: [{ id: 'item1', quantity: 1 }]
        }
      }
      await syncManager.queueOperation(operation)
      
      mockNetworkState(false)
      
      // Wait a bit and then come online
      await new Promise(resolve => setTimeout(resolve, 100))
      mockNetworkState(true)

      // Wait for sync to start
      const syncingState = await stateMonitor.waitForState(
        state => state.isSyncing === true
      )
      expect(syncingState.isSyncing).toBe(true)
    })
  })

  describe('Error Recovery', () => {
    it('should handle sync failures gracefully', async () => {
      // Mock API failure
      jest.spyOn(apiClient, 'createOrder').mockRejectedValueOnce(new Error('API Error'))

      await syncManager.init()
      const operation: Omit<SyncOperation, 'timestamp' | 'retryCount' | 'version'> = {
        id: '1',
        type: 'create',
        entity: 'order',
        data: {
          venueId: 'venue1',
          items: [{ id: 'item1', quantity: 1 }]
        }
      }
      await syncManager.queueOperation(operation)

      // Wait for error state
      const errorState = await stateMonitor.waitForState(
        state => state.errors.length > 0
      )
      
      expect(errorState.errors[0].message).toContain('Operation failed')
      expect(errorState.pendingOperations).toBe(1) // Operation should be requeued
    })
  })

  describe('Data Sanitization', () => {
    it('should sanitize sensitive data', async () => {
      await syncManager.init()
      
      // Try to queue operation with sensitive data
      const testOperation: Omit<SyncOperation, 'timestamp' | 'retryCount' | 'version'> = {
        id: '1',
        type: 'update',
        entity: 'profile',
        data: {
          email: ' Test@Example.com ',
          name: '<script>alert("xss")</script>John',
          preferences: { theme: 'dark' }
        }
      }
      await syncManager.queueOperation(testOperation)

      // Get the queued operation from storage
      const operations = await offlineStorage.getPendingOperations()
      const savedOperation = operations[0]

      expect(savedOperation.data).toEqual({
        email: 'test@example.com',
        name: 'John',
        preferences: { theme: 'dark' }
      })
    })
  })
}) 