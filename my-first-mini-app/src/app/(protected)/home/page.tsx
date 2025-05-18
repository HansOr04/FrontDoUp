'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Services Marketplace</h1>
            <p className="text-gray-600 mt-2">
              You are now authenticated with World ID
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Your Profile</h2>
            {user && (
              <div className="space-y-2">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Wallet:</strong> {user.walletAddress}</p>
                <p><strong>Verification Level:</strong> {user.verificationLevel}</p>
                <p><strong>Wallet Authorized:</strong> {user.walletAuthorized ? 'Yes' : 'No'}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/categories" className="block">
                <Card className="p-6 hover:shadow-md transition-shadow text-center">
                  <h3 className="text-lg font-semibold mb-2">Browse Categories</h3>
                  <p className="text-gray-600">Explore service categories</p>
                </Card>
              </Link>
              
              <Link href="/services/search" className="block">
                <Card className="p-6 hover:shadow-md transition-shadow text-center">
                  <h3 className="text-lg font-semibold mb-2">Search Services</h3>
                  <p className="text-gray-600">Find specific services</p>
                </Card>
              </Link>
              
              <Link href="/profile" className="block">
                <Card className="p-6 hover:shadow-md transition-shadow text-center">
                  <h3 className="text-lg font-semibold mb-2">Your Profile</h3>
                  <p className="text-gray-600">Manage your account</p>
                </Card>
              </Link>
              
              <Link href="/transactions" className="block">
                <Card className="p-6 hover:shadow-md transition-shadow text-center">
                  <h3 className="text-lg font-semibold mb-2">Transactions</h3>
                  <p className="text-gray-600">View your transaction history</p>
                </Card>
              </Link>
            </div>
            
            <div className="mt-8 text-center">
              <Button
                onClick={logout}
                variant="outline"
                size="lg"
              >
                Logout
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}