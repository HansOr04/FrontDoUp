'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/home">
              <div className="flex items-center">
                <Image 
                  src="/logo.svg" 
                  alt="Marketplace Logo" 
                  width={40} 
                  height={40}
                />
                <h1 className="ml-2 text-xl font-semibold text-gray-900 hidden sm:block">Services Marketplace</h1>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/categories" className="text-gray-700 hover:text-blue-600">
              Categories
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-600">
              Services
            </Link>
            <Link href="/transactions" className="text-gray-700 hover:text-blue-600">
              Transactions
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center">
                <Link href="/profile">
                  <div className="flex items-center group">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold border border-blue-200">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-blue-600 hidden sm:block">
                      {user.name}
                    </span>
                  </div>
                </Link>
                <button 
                  onClick={logout}
                  className="ml-4 text-sm text-gray-500 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow p-4">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      
      <footer className="bg-white py-4 px-6 text-center text-sm text-gray-600">
        <div className="container mx-auto">
          <p>Powered by World ID | &copy; {new Date().getFullYear()} Services Marketplace</p>
        </div>
      </footer>
    </div>
  );
}