import { useNetworkState } from './network-state'

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  try {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    return false
  }
}

export async function subscribeToPushNotifications(
  serverPublicKey: string
): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications are not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(serverPublicKey)
    })

    return subscription
  } catch (error) {
    console.error('Error subscribing to push notifications:', error)
    return null
  }
}

export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    
    if (subscription) {
      await subscription.unsubscribe()
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error)
    return false
  }
}

export async function getExistingPushSubscription(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator)) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    return subscription
  } catch (error) {
    console.error('Error getting push subscription:', error)
    return null
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
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

// Helper function to show a notification
export async function showNotification(
  title: string,
  options: NotificationOptions = {}
): Promise<void> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return
  }

  if (Notification.permission === 'granted') {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(title, {
        badge: '/icons/notification-badge.png',
        icon: '/icons/notification-icon.png',
        ...options
      })
    } catch (error) {
      console.error('Error showing notification:', error)
    }
  }
} 