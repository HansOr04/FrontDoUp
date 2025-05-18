'use client';

import { useState, useCallback } from 'react';
import { VerificationLevel } from './useVerification';

interface CheckLevelResult {
  success: boolean;
  verified?: boolean;
  currentLevel?: VerificationLevel;
  requiredLevel?: VerificationLevel;
  nextSteps?: string[];
  error?: string;
}

/**
 * Hook for checking World ID verification levels
 */
export function useVerificationLevel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check if the user has the required verification level
   * @param requiredLevel Required verification level
   */
  const checkLevel = useCallback(async (
    requiredLevel: VerificationLevel = 'device'
  ): Promise<CheckLevelResult> => {
    try {
      setLoading(true);
      clearError();
      
      const response = await fetch(`/api/worldid/check-level?level=${requiredLevel}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to check verification level');
      }
      
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          verified: result.data.verified,
          currentLevel: result.data.currentLevel,
          requiredLevel: result.data.requiredLevel,
          nextSteps: result.data.nextSteps
        };
      } else {
        throw new Error(result.error?.message || 'Failed to check verification level');
      }
    } catch (err: any) {
      console.error('Error checking verification level:', err);
      setError(err.message || 'Failed to check verification level');
      
      return {
        success: false,
        error: err.message || 'Failed to check verification level'
      };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Determines if a verification level meets the required minimum level
   * @param currentLevel Current verification level
   * @param requiredLevel Required verification level
   */
  const hasRequiredLevel = useCallback((
    currentLevel: VerificationLevel | undefined | null,
    requiredLevel: VerificationLevel = 'device'
  ): boolean => {
    if (!currentLevel) return false;
    
    const levelPriority = {
      'device': 1,
      'phone': 2,
      'orb': 3
    };
    
    return levelPriority[currentLevel] >= levelPriority[requiredLevel];
  }, []);

  /**
   * Gets the display name for a verification level
   * @param level Verification level
   */
  const getLevelDisplayName = useCallback((level: VerificationLevel | undefined | null): string => {
    if (!level) return 'None';
    
    const displayNames = {
      'device': 'Device',
      'phone': 'Phone',
      'orb': 'Orb'
    };
    
    return displayNames[level] || 'Unknown';
  }, []);

  return {
    loading,
    error,
    clearError,
    checkLevel,
    hasRequiredLevel,
    getLevelDisplayName
  };
}