'use client';

import { useState, useEffect } from 'react';

interface WorldIDConfig {
  appId: string;
  action: string;
  verificationLevels: string[];
  description: string;
  simulationEnabled: boolean;
}

/**
 * Hook for managing World ID integration
 * Provides access to World ID configuration and status
 */
export function useWorldID() {
  const [config, setConfig] = useState<WorldIDConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorldIDInfo = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/worldid/verify/info');
        
        if (!response.ok) {
          throw new Error('Failed to fetch World ID configuration');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setConfig(data.data);
        } else {
          throw new Error(data.error?.message || 'Failed to fetch World ID configuration');
        }
      } catch (err: any) {
        console.error('Error fetching World ID info:', err);
        setError(err.message || 'An error occurred while fetching World ID configuration');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorldIDInfo();
  }, []);

  const getActionId = (action: string) => {
    if (!config) {
      return '';
    }
    
    // Return the full action ID (appId:action)
    return `${config.appId}:${action}`;
  };

  return {
    config,
    loading,
    error,
    getActionId,
    isEnabled: !!config,
    isSimulationEnabled: config?.simulationEnabled || false
  };
}