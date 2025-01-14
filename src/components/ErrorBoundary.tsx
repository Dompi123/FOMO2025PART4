'use client'

import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  maxRetries?: number
  resetKeys?: any[]
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  retryCount: number
}

const isDev = process.env.NODE_ENV === 'development'

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { 
      hasError: false,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Update state with error info for development
    if (isDev) {
      this.setState({ errorInfo })
    }

    // Call error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const currentKeys = this.props.resetKeys
    const prevKeys = prevProps.resetKeys

    // Reset error state if resetKeys change
    if (
      this.state.hasError &&
      currentKeys &&
      prevKeys &&
      currentKeys.length === prevKeys.length &&
      currentKeys.some((key, i) => key !== prevKeys[i])
    ) {
      this.reset()
    }
  }

  reset = () => {
    const { maxRetries = 3 } = this.props
    const nextRetryCount = this.state.retryCount + 1

    if (nextRetryCount > maxRetries) {
      this.setState({ 
        hasError: true,
        error: new Error(`Maximum retry attempts (${maxRetries}) exceeded`)
      })
      return
    }

    this.setState({ 
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: nextRetryCount
    })
  }

  render() {
    const { hasError, error, errorInfo, retryCount } = this.state
    const { maxRetries = 3 } = this.props

    if (hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4 text-center">
            <h2 className="text-xl font-bold text-red-500">Something went wrong</h2>
            <p className="text-white/60">{error?.message}</p>

            {/* Show detailed error in development */}
            {isDev && errorInfo && (
              <div className="mt-4 p-4 rounded-lg bg-white/5 text-left overflow-auto max-h-64">
                <pre className="text-xs text-white/80">
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}

            {/* Show retry count */}
            {retryCount > 0 && (
              <p className="text-sm text-white/40">
                Retry attempt {retryCount} of {maxRetries}
              </p>
            )}

            <div className="flex items-center justify-center gap-4">
              {/* Retry button */}
              {retryCount < maxRetries && (
                <button
                  onClick={this.reset}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] font-medium transition-transform hover:scale-105 active:scale-95"
                >
                  Try again
                </button>
              )}

              {/* Reload button */}
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg bg-white/10 font-medium transition-transform hover:scale-105 active:scale-95"
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 