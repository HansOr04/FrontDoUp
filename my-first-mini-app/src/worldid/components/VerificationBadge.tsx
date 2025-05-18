'use client';

import React from 'react';
import { VerificationLevel } from '../hooks/useVerification';
import { useVerificationLevel } from '../hooks/useVerificationLevel';

interface VerificationBadgeProps {
  level?: VerificationLevel | null;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  level,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const { getLevelDisplayName } = useVerificationLevel();
  
  if (!level) return null;
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-1.5',
    md: 'text-sm py-1 px-2',
    lg: 'text-base py-1.5 px-3',
  };
  
  // Icon size classes
  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  
  // Color classes based on verification level
  const colorClasses = {
    device: 'bg-blue-100 text-blue-800',
    phone: 'bg-indigo-100 text-indigo-800',
    orb: 'bg-green-100 text-green-800',
  };
  
  // Badge classes
  const badgeClasses = `
    inline-flex items-center rounded-full
    ${sizeClasses[size]}
    ${colorClasses[level]}
    ${className}
  `;
  
  return (
    <span className={badgeClasses}>
      <svg 
        className={`${iconSizeClasses[size]} mr-1`} 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
          clipRule="evenodd" 
        />
      </svg>
      {showLabel && `${getLevelDisplayName(level)} Verified`}
    </span>
  );
};