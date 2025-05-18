'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({
  children,
  className = '',
  onClick,
}: CardProps) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};