import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl border border-slate-700">
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
        <Sparkles className="w-12 h-12 text-yellow-400 animate-spin-slow" />
      </div>
      <p className="mt-4 text-slate-200 font-medium animate-pulse">Dreaming up your image...</p>
    </div>
  );
};