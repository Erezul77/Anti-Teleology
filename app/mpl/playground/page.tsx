'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the real MPL playground to avoid SSR issues
const MPLPlayground = dynamic(() => import('./src/App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🎮</div>
        <div className="text-xl">Loading REAL MPL Playground...</div>
        <div className="text-gray-400 mt-2">Initializing Stage 3-4 features with actual MPL core...</div>
      </div>
    </div>
  )
});

export default function MPLPlaygroundPage() {
  return <MPLPlayground />;
}