'use client';

import { useState, useCallback } from 'react';

interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
}

/**
 * Hook for World Wallet integration
 * Provides functions to connect and use the wallet
 */
export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    chainId: null,
    balance: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Connect to the wallet
   */
  const connect = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      // In a real implementation, this would use the World App SDK
      // to connect to the wallet
      
      // For development/demo, we'll simulate a wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const simulatedAddress = `0x${Math.random().toString(36).substring(2, 12)}`;
      
      setWallet({
        connected: true,
        address: simulatedAddress,
        chainId: 1, // Ethereum Mainnet
        balance: '10.0'
      });
      
      return {
        success: true,
        address: simulatedAddress
      };
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      
      return {
        success: false,
        error: err.message || 'Failed to connect wallet'
      };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Disconnect the wallet
   */
  const disconnect = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      // In a real implementation, this would use the World App SDK
      // to disconnect the wallet
      
      // For development/demo, we'll simulate wallet disconnection
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setWallet({
        connected: false,
        address: null,
        chainId: null,
        balance: null
      });
      
      return {
        success: true
      };
    } catch (err: any) {
      console.error('Error disconnecting wallet:', err);
      setError(err.message || 'Failed to disconnect wallet');
      
      return {
        success: false,
        error: err.message || 'Failed to disconnect wallet'
      };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Get wallet balance
   */
  const getBalance = useCallback(async () => {
    if (!wallet.connected || !wallet.address) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }
    
    try {
      setLoading(true);
      clearError();
      
      // In a real implementation, this would use the World App SDK
      // to get the wallet balance
      
      // For development/demo, we'll simulate wallet balance
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const simulatedBalance = (Math.random() * 20).toFixed(2);
      
      setWallet(prev => ({
        ...prev,
        balance: simulatedBalance
      }));
      
      return {
        success: true,
        balance: simulatedBalance
      };
    } catch (err: any) {
      console.error('Error getting wallet balance:', err);
      setError(err.message || 'Failed to get wallet balance');
      
      return {
        success: false,
        error: err.message || 'Failed to get wallet balance'
      };
    } finally {
      setLoading(false);
    }
  }, [wallet, clearError]);

  /**
   * Sign a message with the wallet
   * @param message Message to sign
   */
  const signMessage = useCallback(async (message: string) => {
    if (!wallet.connected || !wallet.address) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }
    
    try {
      setLoading(true);
      clearError();
      
      // In a real implementation, this would use the World App SDK
      // to sign a message with the wallet
      
      // For development/demo, we'll simulate message signing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const simulatedSignature = `0x${Math.random().toString(36).substring(2, 30)}`;
      
      return {
        success: true,
        signature: simulatedSignature,
        message
      };
    } catch (err: any) {
      console.error('Error signing message:', err);
      setError(err.message || 'Failed to sign message');
      
      return {
        success: false,
        error: err.message || 'Failed to sign message'
      };
    } finally {
      setLoading(false);
    }
  }, [wallet, clearError]);

  return {
    wallet,
    loading,
    error,
    clearError,
    connect,
    disconnect,
    getBalance,
    signMessage,
    isConnected: wallet.connected,
    address: wallet.address
  };
}