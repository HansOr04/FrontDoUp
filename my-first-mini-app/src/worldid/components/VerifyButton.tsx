'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { VerifyIcon } from '../../components/icons/VerifyIcon';

export interface VerifyButtonProps {
  onVerify: () => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const VerifyButton: React.FC<VerifyButtonProps> = ({
  onVerify,
  loading = false,
  disabled = false,
  className = '',
}) => {
  return (
    <Button
      onClick={onVerify}
      disabled={disabled || loading}
      className={`flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors ${className}`}
    >
      <VerifyIcon className="w-5 h-5" />
      <span>{loading ? 'Verifying...' : 'Verify with World ID'}</span>
    </Button>
  );
};