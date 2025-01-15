import React from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: React.ReactNode
}

interface State {
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class AppErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })
    // Log error to your error tracking service here
    console.error('Error caught by AppErrorBoundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ error: null, errorInfo: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {this.state.error.message || 'An unexpected error occurred'}
          </p>
          <Button 
            onClick={this.handleRetry}
            className="bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-white hover:opacity-90"
          >
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
} 