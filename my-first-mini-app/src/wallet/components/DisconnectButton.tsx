'use client';

import React from 'react';

interface DisconnectButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
  children?: React.ReactNode;
}

export const DisconnectButton: React.FC<DisconnectButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  size = 'md',
  variant = 'secondary',
  className = '',
  children,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2.5 px-5 text-base',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500',
    text: 'text-red-600 hover:text-red-700 hover:underline',
  };
  
  // Button classes
  const buttonClasses = `
    flex items-center justify-center
    font-medium rounded-lg
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    ${variant !== 'text' ? 'shadow-sm' : ''}
    ${disabled || loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {loading ? (
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Disconnecting...
        </div>
      ) : children || (
        <div className="flex items-center">
          <svg 
            className="mr-2 h-4 w-4" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M17 16L21 12M21 12L17 8M21 12H9M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          Disconnect
        </div>
      )}
    </button>
  );
};