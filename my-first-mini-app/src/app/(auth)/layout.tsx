'use client';

import React from 'react';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-center items-center">
          <Image 
            src="/logo.svg" 
            alt="Marketplace Logo" 
            width={40} 
            height={40}
          />
          <h1 className="ml-2 text-xl font-semibold text-gray-900">Services Marketplace</h1>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        {children}
      </main>
      
      <footer className="bg-white py-4 px-6 text-center text-sm text-gray-600">
        <div className="container mx-auto">
          <p>Powered by World ID | &copy; {new Date().getFullYear()} Services Marketplace</p>
        </div>
      </footer>
    </div>
  );
}