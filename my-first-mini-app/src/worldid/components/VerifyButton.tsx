'use client';

import React from 'react';
import { useVerification, VerificationLevel } from '../hooks/useVerification';

interface VerifyButtonProps {
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  action?: string;
  level?: VerificationLevel;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const VerifyButton: React.FC<VerifyButtonProps> = ({
  onSuccess,
  onError,
  action = 'login',
  level = 'device',
  size = 'md',
  className = '',
  children,
}) => {
  const { verify, isVerifying, error, clearError } = useVerification();

  const handleClick = async () => {
    try {
      clearError();
      const result = await verify(action, level);
      
      if (result.success && result.verified) {
        onSuccess?.(result);
      } else {
        onError?.(result.error || 'Verification failed');
      }
    } catch (err: any) {
      onError?.(err.message || 'Verification failed');
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-2.5 px-5 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  // Button classes
  const buttonClasses = `
    flex items-center justify-center
    bg-green-600 hover:bg-green-700
    text-white font-semibold rounded-lg
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
    ${isVerifying ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isVerifying}
      className={buttonClasses}
      data-action={action}
      data-level={level}
    >
      {isVerifying ? (
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
          Verifying...
        </div>
      ) : children || (
        <div className="flex items-center">
          <svg 
            className="mr-2 h-5 w-5" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          Verify with World ID
        </div>
      )}
    </button>
  );
};