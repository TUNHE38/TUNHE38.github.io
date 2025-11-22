import React, { useState, useEffect } from 'react';
import { GlassPanel } from './GlassPanel';
import { CloudFog, MapPin } from 'lucide-react';

export const DateTimeWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(time);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <GlassPanel className="flex flex-col justify-between p-6 relative overflow-hidden group h-full min-h-[180px]">
       {/* Ambient Background */}
       <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[60px] group-hover:bg-blue-400/30 transition-colors duration-700"></div>

      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col">
            <span className="text-sm font-bold tracking-widest uppercase opacity-60 mb-1" style={{ color: 'var(--text-secondary)' }}>Today</span>
            <span className="text-xl font-medium tracking-wide" style={{ color: 'var(--text-main)' }}>{formatDate(time)}</span>
        </div>
        <div className="flex flex-col items-end" style={{ color: 'var(--text-secondary)' }}>
            <CloudFog size={24} className="mb-1" />
            <span className="text-xs font-medium opacity-80">24° Cloudy</span>
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 z-10 mt-auto select-none">
        <span className="text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60" style={{ color: 'var(--text-main)' }}>
            {hours}:{minutes}
        </span>
        <span className="text-2xl font-light font-mono opacity-60 mb-2" style={{ color: 'var(--text-main)' }}>
            {seconds}
        </span>
      </div>
    </GlassPanel>
  );
};