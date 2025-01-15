export type SyncEntityType = 'order' | 'profile' | 'venue'
export type SyncOperationType = 'create' | 'update' | 'delete'

export interface SyncOperation {
  id: string
  type: SyncOperationType
  entity: SyncEntityType
  data: any
  timestamp: number
  retryCount: number
  version?: number
}

export interface SyncState {
  isInitialized: boolean
  isSyncing: boolean
  isQueueLocked: boolean
  lastSyncTime: number | null
  pendingOperations: number
  errors: Array<{
    message: string
    timestamp: number
    operationId?: string
  }>
  syncStatus: {
    [K in SyncEntityType]?: {
      lastSync: number
      inProgress: boolean
      error?: string
    }
  }
} 