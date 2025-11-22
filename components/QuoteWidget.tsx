import React, { useState, useRef, useEffect } from 'react';
import { GlassPanel } from './GlassPanel';
import { Play, Pause, SkipForward, SkipBack, Disc, Volume2 } from 'lucide-react';

export const QuoteWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // A royalty-free lofi track
  const audioSrc = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3";

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <GlassPanel className="p-6 flex flex-col justify-between h-full min-h-[160px] group relative overflow-hidden">
        <audio 
            ref={audioRef} 
            src={audioSrc} 
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            loop
        />

        {/* Animated Background Gradient for Vibe */}
        <div className={`absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>

      <div className="flex items-start gap-4 z-10">
        <div className="relative shrink-0">
             <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg transition-transform duration-700 ${isPlaying ? 'rotate-[360deg]' : 'rotate-0'}`} style={{ animation: isPlaying ? 'spin 8s linear infinite' : 'none' }}>
                <Disc size={28} className="text-white/90" />
             </div>
        </div>
        <div className="overflow-hidden">
             <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-bold tracking-wider">NOW PLAYING</span>
             </div>
            <h3 className="text-lg font-bold truncate leading-tight" style={{ color: 'var(--text-main)' }}>Lofi Study</h3>
            <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>Relaxing Beats</p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 z-10">
        <div className="flex items-center justify-between mb-3 px-1">
             <div className="flex gap-4">
                <SkipBack size={20} className="cursor-pointer hover:scale-110 transition-transform" style={{ color: 'var(--text-secondary)' }} />
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    style={{ color: 'var(--text-main)' }}
                >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5"/>}
                </button>
                <SkipForward size={20} className="cursor-pointer hover:scale-110 transition-transform" style={{ color: 'var(--text-secondary)' }} />
             </div>
             <Volume2 size={16} style={{ color: 'var(--text-secondary)' }} />
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 bg-black/10 rounded-full overflow-hidden cursor-pointer group-hover:h-2 transition-all">
            <div 
                className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full relative"
                style={{ width: `${progress}%` }}
            >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100"></div>
            </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </GlassPanel>
  );
};