'use client'

import { Component, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { analytics } from '@/lib/analytics'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
  errorInfo: {
    componentStack: string
  } | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    analytics.trackError({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[100dvh] bg-[#070707] text-white flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4 text-center">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-gray-400">
              We apologize for the inconvenience. Please try again or return to the home screen.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="bg-white text-black font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-transparent border border-white text-white font-medium py-2 px-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                Return Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 p-4 bg-black/50 rounded-lg text-left text-sm overflow-auto">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 