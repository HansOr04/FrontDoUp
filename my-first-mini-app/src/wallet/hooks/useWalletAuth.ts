'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from './useWallet';

/**
 * Hook for wallet authentication
 */
export function useWalletAuth() {
  const router = useRouter();
  const { connect: connectWallet, disconnect: disconnectWallet, signMessage, wallet, loading: walletLoading, error: walletError, clearError: clearWalletError } = useWallet();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const clearError = useCallback(() => {
    setError(null);
    clearWalletError();
  }, [clearWalletError]);

  /**
   * Connect to the wallet
   */
  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      clearError();
      
      // Connect to the wallet
      const result = await connectWallet();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to connect wallet');
      }
      
      return {
        success: true,
        address: result.address
      };
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      
      return {
        success: false,
        error: err.message || 'Failed to connect wallet'
      };
    } finally {
      setIsConnecting(false);
    }
  }, [connectWallet, clearError]);

  /**
   * Authorize the wallet with the backend
   */
  const authorizeWallet = useCallback(async () => {
    if (!wallet.connected || !wallet.address) {
      setError('No wallet connected. Please connect your wallet first.');
      return {
        success: false,
        error: 'No wallet connected'
      };
    }
    
    try {
      setIsAuthorizing(true);
      clearError();
      
      // 1. Request wallet authorization from backend
      const requestResponse = await fetch('/api/auth/wallet-auth/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: wallet.address }),
      });
      
      if (!requestResponse.ok) {
        const errorData = await requestResponse.json();
        throw new Error(errorData.error?.message || 'Failed to request wallet authorization');
      }
      
      const requestData = await requestResponse.json();
      
      if (!requestData.success) {
        throw new Error(requestData.error?.message || 'Failed to request wallet authorization');
      }
      
      // 2. Sign the nonce with the wallet
      const signResult = await signMessage(requestData.data.nonce);
      
      if (!signResult.success) {
        throw new Error(signResult.error || 'Failed to sign authorization message');
      }
      
      // 3. Complete the wallet authorization with the backend
      const completeResponse = await fetch('/api/auth/wallet-auth/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: requestData.data.requestId,
          signature: signResult.signature,
          walletAddress: wallet.address
        }),
      });
      
      if (!completeResponse.ok) {
        const errorData = await completeResponse.json();
        throw new Error(errorData.error?.message || 'Failed to complete wallet authorization');
      }
      
      const completeData = await completeResponse.json();
      
      if (!completeData.success) {
        throw new Error(completeData.error?.message || 'Failed to complete wallet authorization');
      }
      
      return {
        success: true,
        user: completeData.data.user,
        token: completeData.data.token
      };
    } catch (err: any) {
      console.error('Error authorizing wallet:', err);
      setError(err.message || 'Failed to authorize wallet');
      
      return {
        success: false,
        error: err.message || 'Failed to authorize wallet'
      };
    } finally {
      setIsAuthorizing(false);
    }
  }, [wallet, signMessage, clearError]);

  /**
   * Disconnect the wallet and logout
   */
  const logout = useCallback(async () => {
    try {
      // Disconnect the wallet
      await disconnectWallet();
      
      // Logout from the backend
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      // Redirect to login page
      router.push('/login');
      
      return {
        success: true
      };
    } catch (err: any) {
      console.error('Error logging out:', err);
      setError(err.message || 'Failed to logout');
      
      return {
        success: false,
        error: err.message || 'Failed to logout'
      };
    }
  }, [disconnectWallet, router]);

  return {
    connect,
    authorizeWallet,
    logout,
    isConnecting,
    isAuthorizing,
    walletAddress: wallet.address,
    isConnected: wallet.connected,
    loading: isConnecting || isAuthorizing || walletLoading,
    error: error || walletError,
    clearError
  };
}