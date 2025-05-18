'use client';

import React from 'react';
import { VerifyButton } from '@/worldid/components/VerifyButton';

export default function Home() {
  const handleVerify = async () => {
    // Aquí puedes implementar la lógica de verificación con World ID
    console.log('Verifying...');
    // await yourVerifyFunction();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <VerifyButton onVerify={handleVerify} />
    </div>
  );
}
