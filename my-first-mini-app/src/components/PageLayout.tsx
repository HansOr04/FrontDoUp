// src/components/PageLayout.tsx
import React from 'react';

type PageProps = {
  children: React.ReactNode;
};

export function Page({ children }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

Page.Main = function PageMain({ children, className = '' }: PageProps & { className?: string }) {
  return <div className={className}>{children}</div>;
};
