import React from 'react'
import { Button } from '@/components/ui/button'
import { ApiErrorClass as ApiError } from '@/api'

interface Props {
  children: React.ReactNode
  onRetry?: () => void
}

interface State {
  error: ApiError | null
}

export class DataBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    if (error instanceof ApiError) {
      return { error }
    }
    return { error: null }
  }

  componentDidCatch(error: Error) {
    if (error instanceof ApiError) {
      console.error('API Error caught by DataBoundary:', {
        code: error.code,
        message: error.message,
        status: error.status,
        details: error.details
      })
    }
  }

  handleRetry = () => {
    this.setState({ error: null })
    this.props.onRetry?.()
  }

  render() {
    if (this.state.error) {
      const error = this.state.error
      return (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <h3 className="text-lg font-medium mb-2">
            {error.code === 'NETWORK_ERROR' ? 'Connection Error' : 'Error'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error.message}
          </p>
          {error.code === 'NETWORK_ERROR' && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Please check your internet connection and try again
            </p>
          )}
          <Button onClick={this.handleRetry}>
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
} 