import React, { useState, useEffect } from 'react';
import { GlassPanel } from './GlassPanel';
import { Code, Music, Cloud, Cpu, Github, Aperture, Plus, Trash2, X, Globe, Link as LinkIcon } from 'lucide-react';

// Types
type AppItem = {
  id: string;
  name: string;
  url: string;
  type: 'preset' | 'custom';
  iconKey?: string; // For presets e.g. 'github', 'music'
  color?: string; // Tailwind class for presets
};

// Icon Mapping for Presets
const iconMap: Record<string, React.ReactNode> = {
  'code': <Code />,
  'cloud': <Cloud />,
  'music': <Music />,
  'aperture': <Aperture />,
  'cpu': <Cpu />,
  'github': <Github />,
};

// Initial Data
const initialApps: AppItem[] = [
  { id: '1', name: 'CSDN', url: 'https://www.csdn.net/', type: 'preset', iconKey: 'code', color: 'text-red-500' },
  { id: '2', name: 'NetPan', url: '#', type: 'preset', iconKey: 'cloud', color: 'text-blue-500' },
  { id: '3', name: 'Music', url: '#', type: 'preset', iconKey: 'music', color: 'text-emerald-500' },
  { id: '4', name: 'Bing', url: 'https://www.bing.com', type: 'preset', iconKey: 'aperture', color: 'text-teal-500' },
  { id: '5', name: 'OpenAI', url: 'https://chat.openai.com', type: 'preset', iconKey: 'cpu', color: 'text-violet-500' },
  { id: '6', name: 'GitHub', url: 'https://github.com', type: 'preset', iconKey: 'github', color: 'text-gray-600' },
];

export const AppGrid: React.FC = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New App Form State
  const [newAppName, setNewAppName] = useState('');
  const [newAppUrl, setNewAppUrl] = useState('');

  // Load from LocalStorage
  useEffect(() => {
    const savedApps = localStorage.getItem('aura-dashboard-apps');
    if (savedApps) {
      try {
        setApps(JSON.parse(savedApps));
      } catch (e) {
        console.error("Failed to parse apps", e);
        setApps(initialApps);
      }
    } else {
      setApps(initialApps);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('aura-dashboard-apps', JSON.stringify(apps));
    }
  }, [apps, isLoaded]);

  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName || !newAppUrl) return;

    let formattedUrl = newAppUrl;
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const newApp: AppItem = {
      id: Date.now().toString(),
      name: newAppName,
      url: formattedUrl,
      type: 'custom'
    };

    setApps([...apps, newApp]);
    setNewAppName('');
    setNewAppUrl('');
    setIsModalOpen(false);
  };

  const handleDeleteApp = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    if (window.confirm("Remove this shortcut?")) {
      setApps(apps.filter(app => app.id !== id));
    }
  };

  // Helper to get icon
  const renderIcon = (app: AppItem) => {
    if (app.type === 'preset' && app.iconKey && iconMap[app.iconKey]) {
      return React.cloneElement(iconMap[app.iconKey] as React.ReactElement<any>, { size: 28 });
    }
    // For custom apps, try to fetch favicon
    try {
      const domain = new URL(app.url).hostname;
      return (
        <img 
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} 
            alt="icon" 
            className="w-7 h-7 rounded-sm"
            onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
            }}
        />
      );
    } catch (e) {
        return <Globe size={28} className="text-gray-400" />;
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-3 pt-4">
        {apps.map((app) => (
          <div key={app.id} className="relative group h-28">
             {/* Delete Button (Visible on Hover) */}
            <button
                onClick={(e) => handleDeleteApp(e, app.id)}
                className="absolute -top-2 -right-2 z-20 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 scale-75 group-hover:scale-100 shadow-lg cursor-pointer"
                title="Remove"
            >
                <Trash2 size={12} />
            </button>

            <a 
                href={app.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block h-full"
            >
            <div 
                className="h-full flex flex-col items-center justify-center gap-3 transition-all duration-300 relative rounded-3xl bg-[#f0f2f5] dark:bg-white/90 hover:scale-[1.05] hover:shadow-lg border border-white/50"
            >
                {/* Icon Container - No background, just icon */}
                <div className={`
                    p-2 
                    transition-all duration-300 
                    ${app.color || 'text-gray-600'}
                `}>
                    {renderIcon(app)}
                </div>
                
                <span className="text-[10px] font-bold tracking-wider uppercase opacity-60 truncate max-w-[90%] text-center text-gray-500 dark:text-gray-600">
                    {app.name}
                </span>
            </div>
            </a>
          </div>
        ))}

        {/* Add New Button */}
        <button 
            onClick={() => setIsModalOpen(true)}
            className="h-28 group block w-full"
        >
             <div className="h-full flex flex-col items-center justify-center gap-2 rounded-3xl border-dashed border-2 border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
                 <div className="p-3 rounded-full bg-white/10 group-hover:scale-110 transition-transform">
                    <Plus size={24} className="text-white" />
                 </div>
                 <span className="text-[10px] uppercase tracking-widest text-white/60">Add App</span>
             </div>
        </button>
      </div>

      {/* Add App Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <GlassPanel className="w-full max-w-md p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
                
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                    <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400"><Plus size={20}/></div>
                    Add Shortcut
                </h3>

                <form onSubmit={handleAddApp} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1 opacity-70" style={{ color: 'var(--text-secondary)' }}>Name</label>
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={newAppName}
                                onChange={(e) => setNewAppName(e.target.value)}
                                placeholder="e.g. YouTube"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all text-sm"
                                style={{ color: 'var(--text-main)' }}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1 opacity-70" style={{ color: 'var(--text-secondary)' }}>URL</label>
                        <div className="relative group">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                                <LinkIcon size={16} />
                             </div>
                            <input 
                                type="text" 
                                value={newAppUrl}
                                onChange={(e) => setNewAppUrl(e.target.value)}
                                placeholder="google.com"
                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all text-sm"
                                style={{ color: 'var(--text-main)' }}
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-3 rounded-xl font-medium text-sm hover:bg-white/10 transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={!newAppName || !newAppUrl}
                            className="flex-1 py-3 rounded-xl font-medium text-sm bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                        >
                            Add Shortcut
                        </button>
                    </div>
                </form>
            </GlassPanel>
        </div>
      )}
    </>
  );
};
