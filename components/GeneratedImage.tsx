import React from 'react';
import { Download, Maximize2 } from 'lucide-react';

interface GeneratedImageProps {
  imageUrl: string | null;
  isLoading: boolean;
  onDownload: () => void;
}

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageUrl, isLoading, onDownload }) => {
  if (isLoading) {
    return (
      <div className="w-full h-96 bg-slate-800 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-700 animate-pulse">
        <div className="text-slate-500 text-sm">Generating...</div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full h-96 bg-slate-800/50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-700 text-slate-500">
        <Maximize2 className="w-12 h-12 mb-4 opacity-50" />
        <p>Your creation will appear here</p>
      </div>
    );
  }

  return (
    <div className="relative group rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-700/50">
      <img 
        src={imageUrl} 
        alt="Generated Art" 
        className="w-full h-auto object-contain max-h-[70vh] bg-slate-950"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
        <button
          onClick={onDownload}
          className="flex items-center gap-2 bg-white text-slate-900 px-6 py-2 rounded-full font-semibold hover:bg-slate-200 transition-colors shadow-lg active:scale-95 transform"
        >
          <Download className="w-4 h-4" />
          Download Image
        </button>
      </div>
    </div>
  );
};