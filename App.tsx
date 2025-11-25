import React, { useState, useCallback } from 'react';
import { Wand2, Image as ImageIcon, AlertCircle, Zap, Upload, X } from 'lucide-react';
import { ArtStyle, AspectRatio } from './types';
import { generateImage } from './services/geminiService';
import { LoadingOverlay } from './components/LoadingOverlay';
import { GeneratedImage } from './components/GeneratedImage';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<ArtStyle>(ArtStyle.Photorealistic);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.Square);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset the input so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleClearImage = () => {
    setSourceImage(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError(sourceImage ? "Please enter instructions for editing the image." : "Please enter a description for your image.");
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const result = await generateImage(prompt, style, aspectRatio, sourceImage);
      setImageUrl(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [prompt, style, aspectRatio, sourceImage]);

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `nanobanana-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500/10 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              NanoBanana Studio
            </h1>
          </div>
          <div className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded">
            gemini-2.5-flash-image
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Controls Section */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 shadow-xl">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-indigo-400" />
                Configuration
              </h2>

              <div className="space-y-6">
                
                {/* Image Upload Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-400">
                    Source Image <span className="text-slate-600 font-normal">(Optional)</span>
                  </label>
                  
                  {!sourceImage ? (
                    <div className="relative border-2 border-dashed border-slate-700 hover:border-yellow-500/50 hover:bg-slate-800/50 transition-all rounded-lg p-6 group cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-slate-500 group-hover:text-slate-400">
                        <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-xs font-medium">Click to upload an image to edit</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 group">
                      <img 
                        src={sourceImage} 
                        alt="Source" 
                        className="w-full h-40 object-contain bg-slate-900/50" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />
                      <button
                        onClick={handleClearImage}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/90 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-105"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-2">
                        <p className="text-xs text-center text-slate-300 font-medium">Image Loaded</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Prompt Input */}
                <div className="space-y-2">
                  <label htmlFor="prompt" className="block text-sm font-medium text-slate-400">
                    {sourceImage ? 'Instructions' : 'Description'}
                  </label>
                  <textarea
                    id="prompt"
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all resize-none placeholder-slate-600"
                    placeholder={sourceImage ? "Describe how you want to change the image... (e.g., Make it look like a sketch)" : "Describe your imagination... (e.g., A futuristic city on Mars)"}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                {/* Style Selector */}
                <div className="space-y-2">
                  <label htmlFor="style" className="block text-sm font-medium text-slate-400">
                    Artistic Style
                  </label>
                  <div className="relative">
                    <select
                      id="style"
                      value={style}
                      onChange={(e) => setStyle(e.target.value as ArtStyle)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 appearance-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all cursor-pointer"
                    >
                      {Object.values(ArtStyle).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* Aspect Ratio Selector */}
                <div className="space-y-2">
                  <label htmlFor="ratio" className="block text-sm font-medium text-slate-400">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(AspectRatio).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setAspectRatio(value)}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium border transition-all
                          ${aspectRatio === value 
                            ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'}
                        `}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]
                    ${loading || !prompt.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-orange-500/25 hover:from-yellow-400 hover:to-orange-500'}
                  `}
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      {sourceImage ? 'Editing...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5" />
                      {sourceImage ? 'Generate Edit' : 'Generate Image'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800/50 h-full min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-400" />
                  Result
                </h2>
                {imageUrl && (
                  <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">
                    {sourceImage ? 'Edit Complete' : 'Generation Complete'}
                  </span>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-center relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                {loading && <LoadingOverlay />}
                <GeneratedImage 
                  imageUrl={imageUrl} 
                  isLoading={loading} 
                  onDownload={handleDownload}
                />
              </div>
              
              {imageUrl && (
                 <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                      {sourceImage ? 'Instructions Used' : 'Prompt Used'}
                    </p>
                    <p className="text-sm text-slate-300 italic">
                       {prompt}, in the style of {style}
                    </p>
                 </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;