type EventName = 
  | 'page_view'
  | 'venue_view'
  | 'skip_line_start'
  | 'skip_line_complete'
  | 'drink_order_start'
  | 'drink_order_complete'
  | 'error'
  | 'performance'
  | 'push_permission_granted'
  | 'push_permission_denied'
  | 'push_subscribed'
  | 'notification_shown'
  | 'install_prompt_shown'
  | 'install_prompt_response'
  | 'app_installed'
  | 'install_prompt_dismissed'
  | 'map_loaded'
  | 'image_loaded'

interface AnalyticsEvent {
  name: EventName
  properties?: Record<string, any>
  timestamp?: number
}

interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
}

class Analytics {
  private queue: AnalyticsEvent[] = []
  private isInitialized = false
  private flushInterval: NodeJS.Timeout | null = null

  async init() {
    if (this.isInitialized) return
    this.isInitialized = true

    // Setup performance observers
    this.observePerformance()

    // Setup error tracking
    this.setupErrorTracking()

    // Start queue processing
    this.flushInterval = setInterval(() => this.flushQueue(), 5000)
  }

  private observePerformance() {
    if (typeof window === 'undefined') return

    // First Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      if (entries.length > 0) {
        const fcp = entries[0]
        this.trackPerformance({ fcp: fcp.startTime })
      }
    }).observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      if (entries.length > 0) {
        const lcp = entries[entries.length - 1]
        this.trackPerformance({ lcp: lcp.startTime })
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      if (entries.length > 0) {
        const entry = entries[0] as PerformanceEventTiming
        if (entry.processingStart) {
          this.trackPerformance({ fid: entry.processingStart - entry.startTime })
        }
      }
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      let cls = 0
      entryList.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cls += entry.value
        }
      })
      this.trackPerformance({ cls })
    }).observe({ entryTypes: ['layout-shift'] })

    // Time to First Byte
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      this.trackPerformance({
        ttfb: navigation.responseStart - navigation.requestStart
      })
    }
  }

  private setupErrorTracking() {
    if (typeof window === 'undefined') return

    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        source: event.filename,
        line: event.lineno,
        column: event.colno
      })
    })

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        type: 'unhandledrejection'
      })
    })
  }

  trackEvent(event: AnalyticsEvent) {
    this.queue.push({
      ...event,
      timestamp: Date.now()
    })
  }

  trackError(error: any) {
    this.trackEvent({
      name: 'error',
      properties: {
        ...error,
        url: window.location.href
      }
    })
  }

  trackPerformance(metrics: Partial<PerformanceMetrics>) {
    this.trackEvent({
      name: 'performance',
      properties: metrics
    })
  }

  private async flushQueue() {
    if (this.queue.length === 0) return

    const events = [...this.queue]
    this.queue = []

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      })
    } catch (error) {
      // If sending fails, add events back to queue
      this.queue.unshift(...events)
      console.error('Failed to send analytics:', error)
    }
  }

  cleanup() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
  }
}

export const analytics = new Analytics() 