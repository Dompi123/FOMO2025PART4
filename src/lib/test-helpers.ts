import { syncManager } from './sync-manager'
import type { SyncState } from '../types'

export class SyncStateMonitor {
  private stateChanges: SyncState[] = []
  private unsubscribe: (() => void) | null = null

  start() {
    this.stateChanges = []
    this.unsubscribe = syncManager.subscribe(state => {
      this.stateChanges.push({ ...state })
    })
  }

  stop() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }

  getStateChanges(): SyncState[] {
    return [...this.stateChanges]
  }

  getLastState(): SyncState | undefined {
    return this.stateChanges[this.stateChanges.length - 1]
  }

  clear() {
    this.stateChanges = []
  }

  async waitForState(predicate: (state: SyncState) => boolean, timeout = 5000): Promise<SyncState> {
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      const lastState = this.getLastState()
      if (lastState && predicate(lastState)) {
        return lastState
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    throw new Error('Timeout waiting for state condition')
  }
}

// Network state mock
export function mockNetworkState(online: boolean) {
  window.dispatchEvent(new Event(online ? 'online' : 'offline'))
} 