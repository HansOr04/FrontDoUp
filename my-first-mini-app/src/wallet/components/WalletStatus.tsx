'use client';

import React from 'react';

interface WalletStatusProps {
  address?: string | null;
  connected?: boolean;
  balance?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WalletStatus: React.FC<WalletStatusProps> = ({
  address,
  connected = false,
  balance,
  size = 'md',
  className = '',
}) => {
  // No address, don't render
  if (!address) {
    return null;
  }
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  // Format the address for display
  const displayAddress = address.length > 12
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : address;
  
  // Status classes
  const statusClasses = connected
    ? 'bg-green-100 text-green-800'
    : 'bg-gray-100 text-gray-800';
  
  // Container classes
  const containerClasses = `
    inline-flex items-center rounded-lg border border-gray-200 px-3 py-2
    ${sizeClasses[size]}
    ${className}
  `;
  
  return (
    <div className={containerClasses}>
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <span className="font-mono">
          {displayAddress}
        </span>
      </div>
      
      {balance && (
        <div className="ml-3 pl-3 border-l border-gray-200">
          <span className="font-medium">{balance} WLD</span>
        </div>
      )}
    </div>
  );
};