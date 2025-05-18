'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  token: string;
  unlockCost: number;
  provider: {
    id: string;
    name: string;
    walletAddress: string;
  };
  category: {
    id: string;
    name: string;
  };
}

interface TransactionDetails {
  reference: string;
  amount: number;
  token: string;
  recipient: string;
  description: string;
  serviceId: string;
}

export default function ServiceUnlockPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const serviceId = params.serviceId as string;
  
  const [service, setService] = useState<Service | null>(null);
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [initiatingPayment, setInitiatingPayment] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  
  // Fetch service details
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/services/${serviceId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch service details');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error?.message || 'Failed to fetch service details');
        }
        
        setService(data.data);
        
        // Check if service is already unlocked
        const unlockResponse = await fetch(`/api/services/${serviceId}/unlocked`);
        
        if (unlockResponse.ok) {
          const unlockData = await unlockResponse.json();
          
          if (unlockData.success && unlockData.data.unlocked) {
            // Service is already unlocked, redirect to service details
            router.push(`/services/${serviceId}`);
          }
        }
      } catch (err: any) {
        console.error('Error fetching service details:', err);
        setError(err.message || 'An error occurred while fetching service details');
      } finally {
        setLoading(false);
      }
    };
    
    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId, router]);
  
  const initiatePayment = async () => {
    try {
      setInitiatingPayment(true);
      setError(null);
      
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
      
      const data = await response.json();
      
      if (data.success) {
        setTransaction(data.data);
        
        // For demo/development: simulate transaction ID
        // In a real app, this would come from World App
        setTransactionId(`sim_${Date.now()}`);
      } else {
        throw new Error(data.error?.message || 'Failed to initiate payment');
      }
    } catch (err: any) {
      console.error('Error initiating payment:', err);
      setError(err.message || 'An error occurred while initiating payment');
    } finally {
      setInitiatingPayment(false);
    }
  };
  
  const confirmPayment = async () => {
    if (!transactionId || !transaction) {
      setError('Transaction ID is required');
      return;
    }
    
    try {
      setConfirmingPayment(true);
      setError(null);
      
      const response = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: transactionId,
          reference: transaction.reference
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to confirm payment');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentSuccess(true);
        
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push(`/services/${serviceId}`);
        }, 3000);
      } else {
        throw new Error(data.error?.message || 'Failed to confirm payment');
      }
    } catch (err: any) {
      console.error('Error confirming payment:', err);
      setError(err.message || 'An error occurred while confirming payment');
    } finally {
      setConfirmingPayment(false);
    }
  };
  
  const simulatePayment = async () => {
    try {
      setConfirmingPayment(true);
      setError(null);
      
      const response = await fetch('/api/payment/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          serviceId,
          reference: transaction?.reference
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to simulate payment');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentSuccess(true);
        
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push(`/services/${serviceId}`);
        }, 3000);
      } else {
        throw new Error(data.error?.message || 'Failed to simulate payment');
      }
    } catch (err: any) {
      console.error('Error simulating payment:', err);
      setError(err.message || 'An error occurred while simulating payment');
    } finally {
      setConfirmingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading service details...</p>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Error Loading Service</h2>
        <p className="text-gray-600">{error}</p>
        <Button 
          onClick={() => router.push('/services')} 
          variant="primary"
          className="mt-4"
        >
          Back to Services
        </Button>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-yellow-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Service Not Found</h2>
        <p className="text-gray-600">The service you're looking for doesn't exist or has been removed.</p>
        <Button 
          onClick={() => router.push('/services')} 
          variant="primary"
          className="mt-4"
        >
          Back to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href={`/services/${serviceId}`} className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Service Details
        </Link>
      </div>
      
      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-bold text-center mb-6">Unlock Service</h1>
        
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}
        
        {paymentSuccess && (
          <Alert variant="success" className="mb-6">
            <div className="font-medium">Payment Successful!</div>
            <p>You have successfully unlocked this service. Redirecting to service details...</p>
          </Alert>
        )}
        
        <div className="mb-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
            <div>
              <h2 className="font-medium">{service.title}</h2>
              <p className="text-sm text-gray-600">{service.category.name}</p>
            </div>
            <div className="text-right">
              <div className="font-bold">{service.price} {service.token}</div>
              <p className="text-sm text-gray-600">Service Price</p>
            </div>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Unlock Fee:</span>
              <span className="font-medium">{service.unlockCost} WLD</span>
            </div>
            <div className="text-xs text-gray-500">
              This is a one-time fee to access the provider's contact information. The fee is valid for 30 days.
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">What happens after payment?</h3>
                <p className="text-sm text-blue-700 mt-1">
                  After payment, you'll get access to the provider's contact information and can communicate directly to discuss the service details.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {!transaction ? (
          <Button 
            onClick={initiatePayment} 
            variant="primary" 
            size="lg" 
            loading={initiatingPayment}
            disabled={initiatingPayment}
            className="w-full"
          >
            Pay with World ID ({service.unlockCost} WLD)
          </Button>
        ) : (
          <div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2">Transaction Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span>{transaction.amount} {transaction.token}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipient:</span>
                  <span className="truncate max-w-[200px]">{transaction.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="truncate max-w-[200px]">{transaction.reference}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={confirmPayment} 
                variant="primary" 
                size="lg" 
                loading={confirmingPayment}
                disabled={confirmingPayment || !transactionId || paymentSuccess}
                className="w-full"
              >
                Confirm Payment
              </Button>
              
              {/* Simulation button for development */}
              <Button 
                onClick={simulatePayment} 
                variant="outline" 
                size="lg" 
                loading={confirmingPayment}
                disabled={confirmingPayment || paymentSuccess}
                className="w-full"
              >
                Simulate Payment
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      <div className="text-center text-sm text-gray-600">
        <p>Secured by World ID verification and safe payments with World Pay.</p>
      </div>
    </div>
  );
}