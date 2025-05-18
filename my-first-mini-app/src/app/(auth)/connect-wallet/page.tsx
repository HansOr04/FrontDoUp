'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// You'll need to create these components and hooks
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { ConnectWalletButton } from '../../../wallet/components/ConnectWalletButton';
import { useAuth } from '@/hooks/useAuth';
import { useWalletAuth } from '../../../wallet/hooks/useWalletAuth';
import { useVerification } from '../../../worldid/hooks/useVerification';

export default function ConnectWalletPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { verificationLevel } = useVerification();
  const { 
    connect, 
    authorizeWallet, 
    isConnecting, 
    isAuthorizing, 
    walletAddress, 
    error: walletError, 
    clearError 
  } = useWalletAuth();
  
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'connect' | 'authorize'>('connect');
  
  // Check if verified before allowing wallet connection
  useEffect(() => {
    if (!authLoading && !verificationLevel) {
      // User is not verified, redirect to login
      router.push('/login');
    }
  }, [authLoading, verificationLevel, router]);

  // If fully authenticated with wallet, redirect to home
  useEffect(() => {
    if (isAuthenticated && user?.walletAuthorized) {
      router.push('/home');
    }
  }, [isAuthenticated, user, router]);

  // Progress to authorization step after connection
  useEffect(() => {
    if (walletAddress && step === 'connect') {
      setStep('authorize');
    }
  }, [walletAddress, step]);

  // Display wallet errors
  useEffect(() => {
    if (walletError) {
      setError(walletError);
    }
  }, [walletError]);

  const handleConnect = async () => {
    try {
      setError(null);
      clearError();
      
      // Connect to the wallet
      await connect();
      
      // Step will automatically progress to 'authorize' via the useEffect above
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError('Failed to connect to your wallet. Please try again.');
    }
  };

  const handleAuthorize = async () => {
    try {
      setError(null);
      clearError();
      
      // Authorize the wallet
      const result = await authorizeWallet();
      
      if (result.success) {
        // The authorize process should handle authentication through the backend
        // Wait a moment before redirecting to ensure the auth state is updated
        setTimeout(() => {
          router.push('/home');
        }, 1000);
      } else {
        setError(result.error || 'Wallet authorization failed');
      }
    } catch (err) {
      console.error('Wallet authorization error:', err);
      setError('An error occurred during wallet authorization. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image 
            src="/logo.svg" 
            alt="Marketplace Logo" 
            width={120} 
            height={120} 
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h1>
          <p className="text-gray-600 mt-2">
            {step === 'connect' 
              ? 'Connect your World App wallet to continue' 
              : 'Authorize your wallet to access the marketplace'}
          </p>
        </div>

        <Card className="p-6 shadow-lg">
          {error && (
            <Alert variant="error" className="mb-4" onClose={() => {
              setError(null);
              clearError();
            }}>
              {error}
            </Alert>
          )}

          <div className="space-y-4">
            {step === 'connect' ? (
              <>
                <h2 className="text-xl font-semibold text-center">Connect World Wallet</h2>
                <p className="text-sm text-gray-500 text-center">
                  Connecting your wallet allows you to access premium services and make payments
                </p>
                
                <div className="flex justify-center mt-6">
                  <ConnectWalletButton 
                    onClick={handleConnect} 
                    loading={isConnecting}
                    disabled={isConnecting}
                  />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-center">Authorize Your Wallet</h2>
                <p className="text-sm text-gray-500 text-center">
                  Allow the marketplace to use your wallet for payments and identity verification
                </p>
                
                <div className="my-4 p-3 bg-gray-100 rounded-md">
                  <p className="text-sm font-medium text-gray-700">Connected Wallet</p>
                  <p className="text-xs font-mono truncate">{walletAddress}</p>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={handleAuthorize}
                    loading={isAuthorizing}
                    disabled={isAuthorizing}
                    size="lg"
                    variant="primary"
                  >
                    {isAuthorizing ? 'Authorizing...' : 'Authorize Wallet'}
                  </Button>
                </div>
              </>
            )}

            {(isConnecting || isAuthorizing) && (
              <div className="flex justify-center mt-4">
                <Spinner size="md" />
                <span className="ml-2 text-gray-600">
                  {isConnecting ? 'Connecting...' : 'Authorizing...'}
                </span>
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              By connecting your wallet, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Button 
            variant="text" 
            onClick={() => router.push('/login')}
            disabled={isConnecting || isAuthorizing}
          >
            ← Back to Verification
          </Button>
        </div>
      </div>
    </div>
  );
}