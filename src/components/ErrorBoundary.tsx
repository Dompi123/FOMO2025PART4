'use client'

import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode;
  resetKeys?: Array<string | number>;
  onReset?: () => void;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  fallback?: React.ReactNode | ((error: Error) => React.ReactNode);
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): React.ReactNode {
    const { error, errorInfo } = this.state;

    if (error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(error);
      }
      
      return this.props.fallback || (
        <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center p-4">
          <div className="max-w-lg w-full text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            
            <p className="text-white/60 mb-8">
              We encountered an error while rendering this page. Please try again or reload the page.
            </p>

            {process.env.NODE_ENV === 'development' && errorInfo && (
              <div className="mt-4 p-4 rounded-lg bg-white/5 text-left overflow-auto max-h-64">
                <pre className="text-xs text-white/80">
                  {error.toString()}
                  {'\n'}
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => this.reset()}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] font-medium transition-transform hover:scale-105 active:scale-95"
              >
                Try again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg bg-white/10 font-medium transition-transform hover:scale-105 active:scale-95"
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }

  reset = () => {
    this.setState({ error: null, errorInfo: null })
  }
} 