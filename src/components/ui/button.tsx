import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-md">
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
          </div>
        )}
        <span className={loading ? 'invisible' : 'visible'}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';