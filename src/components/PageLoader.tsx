
import React from 'react';

const PageLoader = () => (
  <div className="h-[60vh] w-full flex flex-col items-center justify-center text-kala-400">
    <div className="relative">
       <div className="w-16 h-16 border-4 border-kala-800 border-t-kala-secondary rounded-full animate-spin"></div>
       <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-kala-secondary rounded-full"></div>
       </div>
    </div>
    <p className="text-sm font-bold mt-6 tracking-widest uppercase animate-pulse">Loading Module...</p>
  </div>
);

export default PageLoader;
