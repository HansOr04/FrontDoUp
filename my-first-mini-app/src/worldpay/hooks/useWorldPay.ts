'use client';

import { useState, useCallback } from 'react';

interface InitiatePaymentParams {
  serviceId: string;
}

interface InitiatePaymentResult {
  success: boolean;
  reference?: string;
  amount?: number;
  token?: string;
  recipient?: string;
  description?: string;
  serviceId?: string;
  simulationEnabled?: boolean;
  error?: string;
}

interface ConfirmPaymentParams {
  transactionId: string;
  reference: string;
}

interface ConfirmPaymentResult {
  success: boolean;
  transaction?: {
    id: string;
    status: string;
    amount: number;
    token: string;
    timestamp: string;
  };
  service?: {
    id: string;
    title: string;
    unlocked: boolean;
    expiresAt: string;
  };
  error?: string;
}

/**
 * Hook for World Pay functionality
 */
export function useWorldPay() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTransaction, setCurrentTransaction] = useState<{
    reference: string;
    amount: number;
    token: string;
    serviceId: string;
  } | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Initiate a payment
   * @param params Payment parameters
   */
  const initiatePayment = useCallback(async ({
    serviceId
  }: InitiatePaymentParams): Promise<InitiatePaymentResult> => {
    try {
      setLoading(true);
      clearError();
      
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to initiate payment');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Store the transaction details for later use
        setCurrentTransaction({
          reference: result.data.reference,
          amount: result.data.amount,
          token: result.data.token,
          serviceId: result.data.serviceId,
        });
        
        return {
          success: true,
          reference: result.data.reference,
          amount: result.data.amount,
          token: result.data.token,
          recipient: result.data.recipient,
          description: result.data.description,
          serviceId: result.data.serviceId,
          simulationEnabled: result.data.simulationEnabled,
        };
      } else {
        throw new Error(result.error?.message || 'Failed to initiate payment');
      }
    } catch (err: any) {
      console.error('Error initiating payment:', err);
      setError(err.message || 'Failed to initiate payment');
      
      return {
        success: false,
        error: err.message || 'Failed to initiate payment'
      };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Confirm a payment
   * @param params Confirmation parameters
   */
  const confirmPayment = useCallback(async ({
    transactionId,
    reference
  }: ConfirmPaymentParams): Promise<ConfirmPaymentResult> => {
    try {
      setLoading(true);
      clearError();
      
      const response = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transaction_id: transactionId, reference }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to confirm payment');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Clear the current transaction since it's now complete
        setCurrentTransaction(null);
        
        return {
          success: true,
          transaction: result.data.transaction,
          service: result.data.service,
        };
      } else {
        throw new Error(result.error?.message || 'Failed to confirm payment');
      }
    } catch (err: any) {
      console.error('Error confirming payment:', err);
      setError(err.message || 'Failed to confirm payment');
      
      return {
        success: false,
        error: err.message || 'Failed to confirm payment'
      };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Simulate a payment (for development only)
   */
  const simulatePayment = useCallback(async (): Promise<ConfirmPaymentResult> => {
    if (!currentTransaction) {
      return {
        success: false,
        error: 'No active transaction to simulate'
      };
    }
    
    try {
      setLoading(true);
      clearError();
      
      const response = await fetch('/api/payment/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: currentTransaction.serviceId,
          reference: currentTransaction.reference
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to simulate payment');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Clear the current transaction since it's now complete
        setCurrentTransaction(null);
        
        return {
          success: true,
          transaction: result.data.transaction,
          service: result.data.service,
        };
      } else {
        throw new Error(result.error?.message || 'Failed to simulate payment');
      }
    } catch (err: any) {
      console.error('Error simulating payment:', err);
      setError(err.message || 'Failed to simulate payment');
      
      return {
        success: false,
        error: err.message || 'Failed to simulate payment'
      };
    } finally {
      setLoading(false);
    }
  }, [clearError, currentTransaction]);

  return {
    loading,
    error,
    clearError,
    currentTransaction,
    initiatePayment,
    confirmPayment,
    simulatePayment
  };
}