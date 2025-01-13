import { analytics } from './analytics'

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

class PushNotificationManager {
  private permission: NotificationPermission = 'default'
  private subscription: PushSubscription | null = null

  async init() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push notifications not supported')
    }

    try {
      this.permission = await this.getPermission()
      if (this.permission === 'granted') {
        await this.subscribe()
      }
    } catch (error) {
      analytics.trackError({
        message: 'Push notification initialization failed',
        error,
      })
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission()
      this.permission = permission
      
      if (permission === 'granted') {
        await this.subscribe()
        analytics.trackEvent({
          name: 'push_permission_granted',
        })
        return true
      } else {
        analytics.trackEvent({
          name: 'push_permission_denied',
        })
        return false
      }
    } catch (error) {
      analytics.trackError({
        message: 'Push permission request failed',
        error,
      })
      return false
    }
  }

  private async getPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied'
    }
    return Notification.permission
  }

  private async subscribe() {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      })

      this.subscription = subscription.toJSON() as PushSubscription

      // Send subscription to backend
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.subscription),
      })

      analytics.trackEvent({
        name: 'push_subscribed',
      })
    } catch (error) {
      analytics.trackError({
        message: 'Push subscription failed',
        error,
      })
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  async showNotification(title: string, options: NotificationOptions = {}) {
    if (this.permission !== 'granted') {
      throw new Error('Push permission not granted')
    }

    try {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options,
      })

      analytics.trackEvent({
        name: 'notification_shown',
        properties: { title },
      })
    } catch (error) {
      analytics.trackError({
        message: 'Show notification failed',
        error,
      })
    }
  }
}

export const pushNotifications = new PushNotificationManager() 