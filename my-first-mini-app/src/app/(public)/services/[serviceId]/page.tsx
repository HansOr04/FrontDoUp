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
  images: string[];
  requirements: string;
  deliveryTime: string | null;
  tags: string[];
  rating: number;
  ratingCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  provider: {
    id: string;
    name: string;
    avatar: string;
    walletAddress: string;
    verificationLevel?: string;
  };
  isUnlocked: boolean;
  unlockCost: number | null;
  contactInfo: string | null;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const serviceId = params.serviceId as string;
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  }, [serviceId]);

  const handleUnlockService = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    router.push(`/services/${serviceId}/unlock`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading service details...</p>
      </div>
    );
  }

  if (error) {
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/services" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to All Services
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Link href={`/categories/${service.category.id}`}>
                <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded">
                  {service.category.name}
                </span>
              </Link>
              
              {service.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs py-1 px-2 rounded">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold border border-blue-200">
                  {service.provider.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{service.provider.name}</p>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.round(service.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-1">({service.ratingCount} reviews)</span>
                  </div>
                </div>
              </div>
              
              {service.provider.verificationLevel && (
                <div className="ml-auto">
                  <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {service.provider.verificationLevel} Verified
                  </span>
                </div>
              )}
            </div>
            
            {service.isUnlocked && service.contactInfo && (
              <Alert variant="success" className="mb-6">
                <div className="font-medium">You've unlocked this service!</div>
                <div className="mt-2">
                  <div className="font-medium">Contact Information:</div>
                  <p className="text-sm">{service.contactInfo}</p>
                </div>
              </Alert>
            )}
            
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 mb-6">{service.description}</p>
              
              {service.requirements && (
                <>
                  <h2 className="text-xl font-semibold mb-2">Requirements</h2>
                  <p className="text-gray-700 mb-6">{service.requirements}</p>
                </>
              )}
              
              {service.deliveryTime && (
                <div className="flex items-center text-gray-700 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Delivery time: {service.deliveryTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {service.price} {service.token}
            </div>
            
            {service.isUnlocked ? (
              <div className="mb-4">
                <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Service Unlocked</span>
                </div>
                
                <div className="mt-4">
                  <Link href={`/services/${service.id}/contact`}>
                    <Button variant="primary" size="lg" className="w-full">
                      Contact Provider
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <p className="text-gray-600 mb-4">
                  Unlock this service to get the provider's contact information and start working together.
                </p>
                
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="flex justify-between text-sm text-gray-700 mb-2">
                    <span>Unlock Cost</span>
                    <span>{service.unlockCost} WLD</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    This is a one-time fee to access the provider's contact information.
                  </div>
                </div>
                
                <Button 
                  onClick={handleUnlockService} 
                  variant="primary" 
                  size="lg" 
                  className="w-full"
                >
                  Unlock With World ID
                </Button>
                
                {!isAuthenticated && (
                  <div className="text-xs text-gray-500 text-center mt-2">
                    You need to sign in first to unlock this service.
                  </div>
                )}
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-medium text-gray-900 mb-2">Secured by</h3>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">World ID verification</span>
              </div>
              <div className="flex items-center mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Secure WLD payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}