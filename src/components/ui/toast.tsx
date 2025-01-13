import React from 'react';
import ReactDOM from 'react-dom/client';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000 }) => {
  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        'bg-blue-500'
      }`}
    >
      {message}
    </div>
  );
};

let toastTimeout: NodeJS.Timeout;
let root: ReactDOM.Root | null = null;

export const toast = {
  success: (message: string, duration = 3000) => {
    clearTimeout(toastTimeout);
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    if (!root) {
      root = ReactDOM.createRoot(container);
    }

    root.render(<Toast message={message} type="success" duration={duration} />);
    
    toastTimeout = setTimeout(() => {
      root?.render(null);
    }, duration);
  },
  
  error: (message: string, duration = 3000) => {
    clearTimeout(toastTimeout);
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    if (!root) {
      root = ReactDOM.createRoot(container);
    }

    root.render(<Toast message={message} type="error" duration={duration} />);
    
    toastTimeout = setTimeout(() => {
      root?.render(null);
    }, duration);
  },
  
  info: (message: string, duration = 3000) => {
    clearTimeout(toastTimeout);
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    if (!root) {
      root = ReactDOM.createRoot(container);
    }

    root.render(<Toast message={message} type="info" duration={duration} />);
    
    toastTimeout = setTimeout(() => {
      root?.render(null);
    }, duration);
  }
}; 