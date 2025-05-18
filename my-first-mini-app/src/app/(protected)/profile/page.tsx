'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [unlockedServices, setUnlockedServices] = useState([]);
  
  useEffect(() => {
    if (user) {
      setNameInput(user.name);
      
      // Fetch user's transaction history
      fetchTransactions();
      
      // Fetch user's unlocked services
      fetchUnlockedServices();
    }
  }, [user]);
  
  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/payment/history');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTransactions(data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching transaction history:', err);
    }
  };
  
  const fetchUnlockedServices = async () => {
    try {
      const response = await fetch('/api/services/unlocked');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUnlockedServices(data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching unlocked services:', err);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nameInput.trim() === user?.name) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nameInput
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update profile');
      }
      
      await refreshUser();
      setSuccess(true);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-semibold border border-blue-200 mb-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600 text-sm mt-1 break-all">{user.walletAddress}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Verification Level</h3>
                  <p className="text-sm text-gray-600">{user.verificationLevel}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Wallet Status</h3>
                  <p className="text-sm text-gray-600">{user.walletAuthorized ? 'Authorized' : 'Not Authorized'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            
            {success && (
              <Alert variant="success" className="mb-4">
                Profile updated successfully
              </Alert>
            )}
            
            {error && (
              <Alert variant="error" className="mb-4">
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading || nameInput.trim() === user.name}
              >
                Save Changes
              </Button>
            </form>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Unlocked Services</h2>
            
            {unlockedServices.length > 0 ? (
              <div className="space-y-4">
                {unlockedServices.map((service: any) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{service.title}</h3>
                      <span className="text-sm text-gray-600">
                        Unlocked on {new Date(service.unlockedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Expires: {new Date(service.expiresAt).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/services/${service.serviceId}`)}
                      >
                        View Service
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">You haven't unlocked any services yet.</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => router.push('/services')}
                >
                  Browse Services
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}