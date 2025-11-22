import React, { useState } from 'react';
import { ProfileCard } from './components/ProfileCard';
import { DateTimeWidget } from './components/DateTimeWidget';
import { QuoteWidget } from './components/QuoteWidget';
import { AppGrid } from './components/AppGrid';
import { SmartSearch } from './components/SmartSearch';
import { GlassPanel } from './components/GlassPanel';
import { CatEasterEgg } from './components/CatEasterEgg';
import { Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [showCatMode, setShowCatMode] = useState(false);
  
  // Aesthetic Galaxy/Nebula Wallpapers matching the screenshot vibe
  const darkBg = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop"; // Nebula space
  const lightBg = "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2894&auto=format&fit=crop"; // Fallback
  
  const currentBg = isDark ? darkBg : lightBg;

  return (
    <div 
        className="relative w-full min-h-screen font-sans selection:bg-pink-500/30 transition-colors duration-500"
        data-theme={isDark ? 'dark' : 'light'}
    >
      
      {/* Dynamic Background - Fixed to screen */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out transform scale-105"
        style={{
            backgroundImage: `url(${currentBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
      >
        {/* Gradient Overlay for readability */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${isDark ? 'bg-black/20' : 'bg-white/10'}`}></div>
        <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-black/60 via-transparent to-black/30' : 'from-white/40 via-transparent to-white/20'}`}></div>
      </div>

      <CatEasterEgg isActive={showCatMode} onClose={() => setShowCatMode(false)} />

      {/* Top Bar: Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 lg:top-6 lg:right-6 z-50">
            <button 
            onClick={() => setIsDark(!isDark)}
            className="p-3 rounded-full backdrop-blur-xl bg-white/10 hover:bg-white/20 transition-all shadow-lg border border-white/10 group active:scale-95"
            title="Toggle Theme"
            >
            {isDark ? (
                <Sun size={20} className="text-amber-300 group-hover:rotate-90 transition-transform duration-500" />
            ) : (
                <Moon size={20} className="text-indigo-500 group-hover:-rotate-12 transition-transform duration-500" />
            )}
            </button>
        </div>

      {/* Main Interface - Scrollable Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-10 justify-center">
        
        {/* Dashboard Grid */}
        {/* Mobile: Stacked, Auto Height. Desktop: 12 Cols, Fixed Height Viewport feel (85vh) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-[1600px] lg:h-[85vh] transition-all duration-500">
            
            {/* Mobile Search Bar (Visible only on mobile) */}
            <div className="lg:hidden w-full shrink-0 animate-in slide-in-from-top-4 duration-700 fade-in z-30">
                <SmartSearch onActivateEasterEgg={() => setShowCatMode(true)} />
            </div>

            {/* Left: Profile */}
            <div className="lg:col-span-3 flex flex-col h-auto lg:h-full animate-in slide-in-from-left-8 duration-700 delay-100 fade-in animate-float">
                {/* Flexible height on mobile, full height on desktop */}
                <div className="min-h-[500px] h-auto lg:h-full">
                    <ProfileCard />
                </div>
            </div>

            {/* Right: Widgets & Content */}
            <div className="lg:col-span-9 flex flex-col gap-5 h-auto lg:h-full">
                
                {/* Desktop Search Bar (Hidden on mobile) - Integrated into Right Column */}
                <div className="hidden lg:block w-full shrink-0 animate-in slide-in-from-top-4 duration-700 fade-in z-30">
                        <SmartSearch onActivateEasterEgg={() => setShowCatMode(true)} />
                </div>

                {/* Middle Widgets Row */}
                {/* Reduced desktop height to h-44 to give more space to apps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 shrink-0 animate-in slide-in-from-right-8 duration-700 delay-200 fade-in">
                    <div className="h-40 lg:h-44 animate-float delay-1000">
                            <QuoteWidget />
                    </div>
                    <div className="h-40 lg:h-44 animate-float delay-2000">
                        <DateTimeWidget />
                    </div>
                </div>

                {/* Lower Apps Panel */}
                <div className="flex-1 min-h-[400px] lg:min-h-0 animate-in slide-in-from-bottom-8 duration-700 delay-300 fade-in animate-float delay-3000">
                    <GlassPanel className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4 opacity-80 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
                                <h2 className="text-lg font-bold tracking-wide" style={{ color: 'var(--text-main)' }}>Applications</h2>
                            </div>
                        </div>
                        
                        {/* On mobile, this will just expand the container. On desktop, it scrolls inside the fixed height. */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                            <AppGrid />
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="w-full text-center py-4 text-[10px] font-medium tracking-widest uppercase opacity-40 mix-blend-overlay text-white mt-4 lg:mt-0 lg:absolute lg:bottom-2">
            Aura OS • v2.2 • Crafted with love
        </div>

      </div>
    </div>
  );
};

export default App;