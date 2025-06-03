import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f0e6]">
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-black animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-light">
            C
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm font-light">Loading Clara...</p>
    </div>
  );
}

