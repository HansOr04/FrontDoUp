'use client';

import React from 'react';

interface TransactionStatusProps {
  status?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  status = 'pending',
  size = 'md',
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-1.5',
    md: 'text-sm py-1 px-2',
    lg: 'text-base py-1.5 px-3',
  };
  
  // Color classes based on status
  const colorClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    mined: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };
  
  // Status icons
  const icons = {
    pending: (
      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    mined: (
      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    completed: (
      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    failed: (
      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  };
  
  // Get the correct color class and icon
  const statusKey = status.toLowerCase() as keyof typeof colorClasses;
  const colorClass = colorClasses[statusKey] || colorClasses.pending;
  const icon = icons[statusKey] || icons.pending;
  
  // Format the status display
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  
  const badgeClasses = `
    inline-flex items-center rounded-full
    ${sizeClasses[size]}
    ${colorClass}
    ${className}
  `;
  
  return (
    <span className={badgeClasses}>
      {icon}
      {displayStatus}
    </span>
  );
};