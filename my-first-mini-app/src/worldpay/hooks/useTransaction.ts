'use client';

import { useState, useEffect, useCallback } from 'react';

interface Transaction {
  id: string;
  reference: string;
  transactionId: string;
  serviceId: string;
  amount: number;
  token: string;
  status: 'pending' | 'mined' | 'completed' | 'failed';
  timestamp: string;
  service?: {
    id: string;
    title: string;
  };
}

interface TransactionHistoryResult {
  success: boolean;
  transactions?: Transaction[];
  error?: string;
}

/**
 * Hook for managing transactions
 */
export function useTransaction() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Fetch transaction history
   */
  const fetchTransactionHistory = useCallback(async (): Promise<TransactionHistoryResult> => {
    try {
      setLoading(true);
      clearError();
      
      const response = await fetch('/api/payment/history');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch transaction history');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setTransactions(result.data || []);
        
        return {
          success: true,
          transactions: result.data
        };
      } else {
        throw new Error(result.error?.message || 'Failed to fetch transaction history');
      }
    } catch (err: any) {
      console.error('Error fetching transaction history:', err);
      setError(err.message || 'Failed to fetch transaction history');
      
      return {
        success: false,
        error: err.message || 'Failed to fetch transaction history'
      };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Check if a service is unlocked
   * @param serviceId The service ID to check
   */
  const checkServiceUnlocked = useCallback(async (serviceId: string) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await fetch(`/api/services/${serviceId}/unlock-status`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to check service unlock status');
      }
      
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          unlocked: result.data.unlocked,
          expired: result.data.expired,
          expiresAt: result.data.expiresAt,
          unlockCost: result.data.unlockCost
        };
      } else {
        throw new Error(result.error?.message || 'Failed to check service unlock status');
      }
    } catch (err: any) {
      console.error('Error checking service unlock status:', err);
      setError(err.message || 'Failed to check service unlock status');
      
      return {
        success: false,
        unlocked: false,
        error: err.message || 'Failed to check service unlock status'
      };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Format date helper
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }, []);

  // Get status badge class helper
  const getStatusBadgeClass = useCallback((status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'mined':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  return {
    transactions,
    loading,
    error,
    clearError,
    fetchTransactionHistory,
    checkServiceUnlocked,
    formatDate,
    getStatusBadgeClass
  };
}