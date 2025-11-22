import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className = '', 
  hoverEffect = false,
  intensity = 'medium'
}) => {
  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl
        transition-all duration-500 ease-out
        ${hoverEffect ? 'hover:scale-[1.01] hover:shadow-2xl' : ''}
        ${className}
      `}
      style={{
        backgroundColor: 'var(--glass-bg)',
        borderColor: 'var(--glass-border)',
        borderWidth: '1px',
        boxShadow: 'var(--glass-shadow)',
        backdropFilter: `blur(var(--glass-blur)) saturate(var(--glass-saturate))`,
        WebkitBackdropFilter: `blur(var(--glass-blur)) saturate(var(--glass-saturate))`,
        color: 'var(--text-main)'
      }}
    >
      {/* Subtle Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};