'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// You'll need to create these components and hooks
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { VerifyButton } from '../../../worldid/components/VerifyButton';
import { useAuth } from '../../../hooks/useAuth';
import { useVerification } from '../../../worldid/hooks/useVerification';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { verify, isVerifying, verificationLevel } = useVerification();
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to home
  if (isAuthenticated && !authLoading) {
    router.push('/home');
    return null;
  }

  const handleVerify = async () => {
    try {
      setError(null);
      // For 'login' action with device verification
      const result = await verify('login', 'device');
      
      if (result.success) {
        // The verify process should handle authentication through the backend
        // Refresh the auth state and navigate to the connect wallet page
        router.push('/connect-wallet');
      } else {
        setError(result.error || 'Verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('An error occurred during verification. Please try again.');
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Services Marketplace</h1>
          <p className="text-gray-600 mt-2">Sign in using World ID to access our platform</p>
        </div>

        <Card className="p-6 shadow-lg">
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Verify your identity</h2>
            <p className="text-sm text-gray-500 text-center">
              We use World ID to verify you are a unique human while preserving your privacy
            </p>
            
            <div className="flex justify-center mt-6">
              <VerifyButton 
                onVerify={handleVerify} 
                loading={isVerifying}
                disabled={isVerifying}
              />
            </div>

            {isVerifying && (
              <div className="flex justify-center mt-4">
                <Spinner size="md" />
                <span className="ml-2 text-gray-600">Verifying...</span>
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <Link href="/faq" className="text-blue-600 hover:underline">
              Visit our FAQ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}