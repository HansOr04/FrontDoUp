'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

// Define the user interface based on your backend model
interface User {
  id: string;
  walletAddress: string;
  name: string;
  worldUsername?: string;
  avatar?: string;
  verificationLevel?: 'device' | 'phone' | 'orb';
  walletAuthorized: boolean;
  isProvider?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

// Default context value
const defaultContextValue: AuthContextType = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  refreshUser: async () => {},
  logout: async () => {},
};

// Create the auth context
const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Props interface for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
function AuthProvider(props: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch current user data
  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated
          setUser(null);
          setIsAuthenticated(false);
          return;
        }
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setUser(data.data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to fetch user data');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Call backend to logout
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      // Clear user state
      setUser(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      console.error('Error logging out:', err);
      setError(err.message || 'Failed to logout');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user data on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Create context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    error,
    refreshUser,
    logout,
  };

  // Create element
  const element = React.createElement(
    AuthContext.Provider, 
    { value: contextValue }, 
    props.children
  );
  
  return element;
}

// Hook to use the auth context
function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export { AuthProvider, useAuth };