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
  provider: {
    id: string;
    name: string;
    avatar: string;
    walletAddress: string;
    verificationLevel?: string;
  };
  contactInfo: string;
  category: {
    id: string;
    name: string;
  };
}

export default function ContactProviderPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const serviceId = params.serviceId as string;
  
  const [service, setService] = useState<Service | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        
        // Check if service is unlocked
        const unlockResponse = await fetch(`/api/services/${serviceId}/unlocked`);
        
        if (unlockResponse.ok) {
          const unlockData = await unlockResponse.json();
          
          if (!unlockData.success || !unlockData.data.unlocked) {
            // Service is not unlocked, redirect to service details
            router.push(`/services/${serviceId}`);
          }
        } else {
          // Error checking unlock status, redirect to service details
          router.push(`/services/${serviceId}`);
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
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }
    
    try {
      setSendingMessage(true);
      setError(null);
      
      // In a real app, this would send a message to the provider
      // Here, we'll just simulate a successful message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessageSent(true);
      setMessage('');
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'An error occurred while sending the message');
    } finally {
      setSendingMessage(false);
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href={`/services/${serviceId}`} className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Service Details
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Provider Information</h2>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-semibold border border-blue-200 mb-4">
                {service.provider.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-lg font-medium">{service.provider.name}</h3>
              
              {service.provider.verificationLevel && (
                <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full flex items-center mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {service.provider.verificationLevel} Verified
                </span>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4 break-words">
                {service.contactInfo}
              </div>
              
              <div className="text-xs text-gray-500">
                <p>Remember to mention that you found this service on our marketplace when contacting the provider.</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">About the Service</h2>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">{service.title}</h3>
              <p className="text-gray-700">{service.description}</p>
            </div>
            
            <div className="py-4 border-t border-gray-200">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">Category: <strong>{service.category.name}</strong></span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Send Message</h2>
            
            {error && (
              <Alert variant="error" className="mb-4">
                {error}
              </Alert>
            )}
            
            {messageSent && (
              <Alert variant="success" className="mb-4">
                <div className="font-medium">Message Sent!</div>
                <p>Your message has been sent to the provider. They will respond to you directly using the contact information in your profile.</p>
              </Alert>
            )}
            
            <form onSubmit={handleSendMessage}>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself and describe what you need..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                loading={sendingMessage}
                disabled={sendingMessage || !message.trim()}
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}