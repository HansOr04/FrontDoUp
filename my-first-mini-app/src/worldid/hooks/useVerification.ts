'use client';

import { useState, useCallback } from 'react';
import { useWorldID } from './useWorldId';

// Verification levels from your backend
export type VerificationLevel = 'device' | 'phone' | 'orb';

export interface VerificationResult {
  success: boolean;
  verified?: boolean;
  verificationLevel?: VerificationLevel;
  nullifier_hash?: string;
  error?: string;
}

/**
 * Hook for World ID verification functionality
 */
export function useVerification() {
  const { config, getActionId, isSimulationEnabled } = useWorldID();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Verify identity with World ID
   * @param action The action to verify
   * @param requiredLevel Required verification level
   */
  const verify = useCallback(async (
    action: string = 'login',
    requiredLevel: VerificationLevel = 'device'
  ): Promise<VerificationResult> => {
    try {
      setIsVerifying(true);
      clearError();

      if (!config) {
        throw new Error('World ID configuration not loaded');
      }

      // In a real implementation, this would use the World App SDK or MiniKit
      // to get a World ID proof
      
      let proofPayload;
      
      if (isSimulationEnabled) {
        // Simulate a proof payload for development/testing
        proofPayload = {
          merkle_root: `0x${Math.random().toString(36).substring(2, 15)}`,
          nullifier_hash: `0x${Math.random().toString(36).substring(2, 15)}`,
          proof: `0x${Math.random().toString(36).substring(2, 30)}`,
          verification_level: requiredLevel
        };
      } else {
        // In production, this would use the actual World ID SDK
        // This is a placeholder for the actual implementation
        // worldweb3.verifyProof(getActionId(action), requiredLevel);
        
        // This would be replaced with actual proof data from the SDK
        throw new Error('Production World ID verification not implemented');
      }

      // Verify proof with backend
      const response = await fetch('/api/worldid/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          payload: proofPayload
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Verification failed');
      }

      const result = await response.json();
      
      if (result.success && result.data?.verified) {
        // Update verification level
        setVerificationLevel(result.data.verification_level);
        
        setIsVerifying(false);
        return {
          success: true,
          verified: true,
          verificationLevel: result.data.verification_level,
          nullifier_hash: result.data.nullifier_hash
        };
      } else {
        throw new Error(result.error?.message || 'Verification failed');
      }
    } catch (err: any) {
      console.error('Error verifying with World ID:', err);
      setError(err.message || 'Failed to verify with World ID');
      setIsVerifying(false);
      
      return {
        success: false,
        error: err.message || 'Failed to verify with World ID'
      };
    }
  }, [clearError, config, getActionId, isSimulationEnabled]);

  return {
    isVerifying,
    verificationLevel,
    error,
    clearError,
    verify
  };
}