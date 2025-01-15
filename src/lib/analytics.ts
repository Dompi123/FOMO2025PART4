export type EventName = 
  | 'page_view'
  | 'error'
  | 'sync_started'
  | 'sync_completed'
  | 'sync_failed'
  | 'order_created'
  | 'order_updated'
  | 'venue_viewed'
  | 'menu_viewed'
  | 'install_prompt_shown'
  | 'install_prompt_response'
  | 'install_prompt_dismissed'
  | 'app_installed'
  | 'image_loaded';

export interface AnalyticsEvent {
  name: EventName;
  data?: {
    page?: string;
    error?: {
      message: string;
      code?: string;
      stack?: string;
    };
    entityId?: string;
    duration?: number;
    status?: string;
    properties?: Record<string, any>;
  };
  timestamp: number;
}

export class Analytics {
  private initialized = false
  private queue: AnalyticsEvent[] = []

  init() {
    if (this.initialized) return
    this.initialized = true
    this.processQueue()
  }

  trackEvent(event: { name: EventName; properties?: Record<string, any> }) {
    this.trackError(event.name, { properties: event.properties })
  }

  trackError(event: EventName, data: AnalyticsEvent['data']) {
    if (!this.initialized) {
      this.queue.push({ 
        name: event, 
        data,
        timestamp: Date.now()
      });
      return;
    }

    // Process queue
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        this.trackError(item.name, item.data);
      }
    }
  }

  private processQueue() {
    while (this.queue.length > 0) {
      const item = this.queue.shift()
      if (item) {
        this.trackError(item.name, item.data)
      }
    }
  }
}

export const analytics = new Analytics() 