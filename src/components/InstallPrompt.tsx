'use client'

import { useEffect, useState } from 'react'
import { analytics } from '@/lib/analytics'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)

      analytics.trackEvent({
        name: 'install_prompt_shown'
      })
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    analytics.trackEvent({
      name: 'install_prompt_response',
      properties: { outcome }
    })

    if (outcome === 'accepted') {
      analytics.trackEvent({
        name: 'app_installed'
      })
    }

    // Clear the saved prompt since it can't be used again
    setDeferredPrompt(null)
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    analytics.trackEvent({
      name: 'install_prompt_dismissed'
    })
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-sm">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex-1 mr-4">
          <h3 className="text-lg font-medium">Install FOMO</h3>
          <p className="text-sm text-gray-400">
            Add FOMO to your home screen for quick access
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="px-4 py-2 text-sm bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
} 