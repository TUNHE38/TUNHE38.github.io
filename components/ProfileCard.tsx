import React, { useState, useEffect } from 'react';
import { GlassPanel } from './GlassPanel';
import { Github, Twitter, Mail, MessageCircle } from 'lucide-react';

export const ProfileCard: React.FC = () => {
  const [name, setName] = useState('DROITE');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('profile_name');
    if (savedName) setName(savedName);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const saveName = () => {
    setIsEditing(false);
    localStorage.setItem('profile_name', name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveName();
  };

  return (
    <GlassPanel className="flex flex-col p-0 h-full relative group overflow-hidden">
      
      {/* Banner Area - Fixed Height */}
      <div className="w-full h-40 relative shrink-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
            style={{ 
                backgroundImage: 'url(https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop)' 
            }}
          ></div>
          <div className="absolute inset-0 bg-violet-600/20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      {/* Content Container - Takes remaining height */}
      <div className="flex flex-col px-8 pb-8 flex-1 relative w-full">
        
        {/* Avatar - Overlapping Banner, Centered */}
        <div className="-mt-16 mb-2 flex justify-center w-full relative z-10 shrink-0">
            <div className="relative group/avatar">
                <div className="absolute -inset-4 bg-black/20 rounded-full blur-xl opacity-40 transform translate-y-4"></div>
                <img 
                  src="https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka&backgroundColor=ffdfbf&clothing=hoodie&eyes=happy&mouth=smile" 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-[6px] border-[var(--glass-bg)] shadow-2xl object-cover bg-white/10 backdrop-blur-md transform transition-transform duration-500 group-hover/avatar:rotate-6 group-hover/avatar:scale-105"
                />
                {/* Floating sticker effect */}
                <div className="absolute -bottom-1 -right-1 text-2xl animate-bounce delay-1000 filter drop-shadow-lg cursor-default hover:scale-125 transition-transform">✨</div>
            </div>
        </div>

        {/* Main Content - Centered Vertically in remaining space */}
        <div className="flex-1 flex flex-col items-center justify-center w-full -mt-2 min-h-0">
            {/* Artistic Name: Handwritten, Smaller, Editable */}
            {isEditing ? (
                <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    onBlur={saveName}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="text-4xl md:text-5xl font-['Dancing_Script'] text-center bg-transparent border-b border-white/20 outline-none text-white mb-3 w-full"
                />
            ) : (
                <h1 
                    onDoubleClick={() => setIsEditing(true)}
                    title="Double click to edit"
                    className="text-4xl md:text-5xl font-['Dancing_Script'] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/80 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] mb-3 select-none transform hover:scale-[1.02] transition-transform duration-300 text-center cursor-pointer leading-tight py-1"
                >
                    {name}
                </h1>
            )}

            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner mb-6 group/tag hover:bg-white/10 transition-all hover:border-white/20 cursor-default">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_#ec4899]"></span>
                <span className="text-xs font-bold tracking-widest text-white/70 uppercase group-hover/tag:text-white transition-colors">Creative Developer</span>
            </div>

            {/* Quote */}
            <p className="text-sm leading-relaxed opacity-70 font-medium text-center px-4 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              "Code is poetry, and the screen is my canvas. Building dreams one pixel at a time."
            </p>
        </div>

        {/* Social Links - Anchored at bottom, shrink-0 to prevent crushing */}
        <div className="mt-auto pt-6 w-full grid grid-cols-4 gap-3 shrink-0 z-20">
            {[
            { icon: <Github size={20} />, href: "tunhe38.github.io", label: "GitHub" },
            { icon: <Twitter size={20} />, href: "https://x.com/tunhe245960", label: "Twitter" },
            { icon: <Mail size={20} />, href: "mailto:tunhe38@gmail.com", label: "Email" },
            { icon: <MessageCircle size={20} />, href: "https://x.com/tunhe245960", label: "Chat" }
            ].map((social, idx) => (
            <a 
                key={idx} 
                href={social.href} 
                className="aspect-square flex items-center justify-center rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group/icon relative overflow-hidden border border-white/5 hover:border-white/20"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity"></div>
                <div style={{ color: 'var(--text-main)' }} className="opacity-70 group-hover/icon:opacity-100 group-hover/icon:scale-110 transition-all duration-300">
                    {social.icon}
                </div>
            </a>
            ))}
        </div>
      </div>
    </GlassPanel>
  );
};
