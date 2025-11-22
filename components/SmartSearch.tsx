import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, ArrowRight, Globe, X, Command } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { performSmartSearch } from '../services/geminiService';
import { SearchResult } from '../types';

interface SmartSearchProps {
    onActivateEasterEgg?: () => void;
    className?: string;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({ onActivateEasterEgg, className = '' }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showPawButton = ['cat', 'kitten', 'neko', '猫', 'kitty'].some(keyword => query.toLowerCase().includes(keyword));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!loading && !query) {
            setIsExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [loading, query]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    const data = await performSmartSearch(query);
    setResult(data);
    setLoading(false);
  };

  const handleGoogleRedirect = () => {
    if (!query.trim()) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div ref={containerRef} className={`w-full transition-all duration-500 ease-out z-50 ${isExpanded ? 'scale-[1.01]' : 'scale-100'} ${className}`}>
      <GlassPanel className={`flex flex-col transition-all duration-500 ${isExpanded ? "bg-opacity-80 shadow-2xl ring-1 ring-white/10" : "bg-opacity-40 hover:bg-opacity-60"}`}>
        
        {/* Input Area */}
        <form onSubmit={handleSearch} className="relative flex items-center p-1">
            <div className="pl-4 flex items-center justify-center w-10 h-10">
                {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-pink-400 border-t-transparent rounded-full"></div>
                ) : (
                   <Sparkles size={20} className="text-pink-400" />
                )}
            </div>
            
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                placeholder="Ask Gemini anything..."
                className="w-full bg-transparent border-none outline-none px-3 py-4 text-lg placeholder-opacity-40 font-light"
                style={{ color: 'var(--text-main)', '::placeholder': { color: 'var(--text-secondary)' } } as React.CSSProperties}
            />

            <div className="flex items-center gap-1 pr-2">
                {/* Easter Egg */}
                {showPawButton && onActivateEasterEgg && (
                    <button type="button" onClick={onActivateEasterEgg} className="p-2 text-orange-400 hover:scale-110 transition-transform animate-bounce"><span className="text-xl">🐾</span></button>
                )}

                {query && (
                    <button type="button" onClick={() => { setQuery(''); setResult(null); inputRef.current?.focus(); }} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/40 hover:text-white/80">
                        <X size={18} />
                    </button>
                )}
                
                <div className="h-6 w-px bg-white/10 mx-1"></div>

                <button type="button" onClick={handleGoogleRedirect} className="p-2.5 rounded-xl hover:bg-white/10 transition-colors group" title="Google Search">
                    <Globe size={18} className="text-blue-400/80 group-hover:text-blue-400 transition-colors" />
                </button>
                <button type="submit" disabled={loading || !query} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all ml-1">
                    <ArrowRight size={18} style={{ color: 'var(--text-main)' }} />
                </button>
            </div>
        </form>

        {/* Results Panel */}
        {(result || loading) && isExpanded && (
            <div className="border-t border-white/5 p-0 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="space-y-4 opacity-50">
                            <div className="h-3 bg-white/20 rounded w-3/4 animate-pulse"></div>
                            <div className="h-3 bg-white/20 rounded w-1/2 animate-pulse delay-75"></div>
                            <div className="h-3 bg-white/20 rounded w-5/6 animate-pulse delay-150"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="prose prose-invert prose-sm max-w-none leading-relaxed" style={{ color: 'var(--text-main)' }}>
                                {result?.text.split('\n').map((line, i) => (
                                    <p key={i} className="mb-2 opacity-90 font-light">{line}</p>
                                ))}
                            </div>
                            
                            {result?.sources && result.sources.length > 0 && (
                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-3" style={{ color: 'var(--text-secondary)' }}>Reference Sources</p>
                                    <div className="flex flex-wrap gap-2">
                                        {result.sources.map((source, idx) => (
                                            <a 
                                                key={idx}
                                                href={source.uri}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-all truncate max-w-[240px]"
                                                style={{ color: 'var(--accent-color)' }}
                                            >
                                                <Globe size={12} />
                                                <span className="truncate">{source.title}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )}
      </GlassPanel>
    </div>
  );
};