'use client';

import React from 'react';
import { useWorldPay } from '../hooks/useWorldPay';

interface PayButtonProps {
  serviceId: string;
  amount: number;
  token?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  onPaymentInitiated?: (data: any) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const PayButton: React.FC<PayButtonProps> = ({
  serviceId,
  amount,
  token = 'WLD',
  onSuccess,
  onError,
  onPaymentInitiated,
  size = 'md',
  className = '',
  children,
}) => {
  const { initiatePayment, loading, error, clearError } = useWorldPay();

  const handleClick = async () => {
    try {
      clearError();
      const result = await initiatePayment({ serviceId });
      
      if (result.success) {
        onPaymentInitiated?.(result);
      } else {
        onError?.(result.error || 'Failed to initiate payment');
      }
    } catch (err: any) {
      onError?.(err.message || 'Failed to initiate payment');
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
    bg-blue-600 hover:bg-blue-700
    text-white font-semibold rounded-lg
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
    ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={buttonClasses}
      data-service-id={serviceId}
      data-amount={amount}
      data-token={token}
    >
      {loading ? (
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
          Initiating...
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
              d="M3 10H21M7 15H8M12 15H13M6 5H18C19.1046 5 20 5.89543 20 7V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7C4 5.89543 4.89543 5 6 5Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          Pay {amount} {token}
        </div>
      )}
    </button>
  );
};