import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface Point {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  scale: number;
}

interface AnimatingPaw {
  id: number;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  angle: number;
  color: string;
}

interface CatEasterEggProps {
  isActive: boolean;
  onClose: () => void;
}

// Cat colors for variety
const PAW_COLORS = ['#4D4D4D', '#3E2723', '#E65100', '#795548', '#BF360C'];

export const CatEasterEgg: React.FC<CatEasterEggProps> = ({ isActive, onClose }) => {
  const [prints, setPrints] = useState<Point[]>([]);
  const [paws, setPaws] = useState<AnimatingPaw[]>([]);

  // Clear prints when closed or re-opened
  useEffect(() => {
    if (!isActive) {
      setPrints([]);
      setPaws([]);
    }
  }, [isActive]);

  const spawnPaw = useCallback((e: React.MouseEvent) => {
    if (!isActive) return;
    
    // Click position
    const { clientX, clientY } = e;
    
    // Random properties
    const id = Date.now() + Math.random();
    const color = PAW_COLORS[Math.floor(Math.random() * PAW_COLORS.length)];
    const rotation = Math.random() * 30 - 15; // Slight random rotation for the print
    const scale = 0.8 + Math.random() * 0.4;
    
    // Determine start position (off-screen)
    // Logic: Choose a side (bottom, left, right) closest to the click but with randomness
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let startX, startY;
    
    // Randomly decide if it comes from bottom or sides
    const side = Math.random();
    
    if (side < 0.6) {
        // From bottom (most common)
        startY = viewportHeight + 400;
        startX = clientX + (Math.random() * 400 - 200); 
    } else if (clientX < viewportWidth / 2) {
        // From left
        startX = -400;
        startY = clientY + (Math.random() * 400 - 200);
    } else {
        // From right
        startX = viewportWidth + 400;
        startY = clientY + (Math.random() * 400 - 200);
    }

    // Calculate angle for the arm
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // Add to animating paws
    const newPaw: AnimatingPaw = { id, targetX: clientX, targetY: clientY, startX, startY, angle, color };
    setPaws(prev => [...prev, newPaw]);

    // Schedule cleanup and print deposition
    // Impact time: ~350ms (half of animation)
    setTimeout(() => {
      setPrints(prev => [...prev, { id, x: clientX, y: clientY, rotation: angle + 90, color, scale }]);
    }, 350);

    // Remove arm after animation (1s)
    setTimeout(() => {
      setPaws(prev => prev.filter(p => p.id !== id));
    }, 1000);

  }, [isActive]);

  if (!isActive) return null;

  return (
    <div 
        className="fixed inset-0 z-[100] overflow-hidden cursor-pointer"
        onClick={spawnPaw}
        style={{ cursor: 'none' }} // Hide default cursor to enhance effect
    >
        {/* Close Button */}
        <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-8 right-8 p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all z-[110] shadow-lg border border-white/20"
        >
            <X size={32} />
        </button>

        {/* Prints Layer */}
        {prints.map(print => (
            <div
                key={print.id}
                className="absolute pointer-events-none opacity-80 mix-blend-multiply dark:mix-blend-normal"
                style={{
                    left: print.x,
                    top: print.y,
                    transform: `translate(-50%, -50%) rotate(${print.rotation}deg) scale(${print.scale})`,
                    color: print.color
                }}
            >
                 {/* Paw Print SVG */}
                 <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 35C40 35 32 42 32 50C32 58 40 65 50 65C60 65 68 58 68 50C68 42 60 35 50 35ZM25 40C18 40 12 46 12 54C12 62 18 68 25 68C32 68 38 62 38 54C38 46 32 40 25 40ZM75 40C68 40 62 46 62 54C62 62 68 68 75 68C82 68 88 62 88 54C88 46 82 40 75 40ZM50 70C35 70 22 78 18 88C16 92 20 98 35 95C40 94 45 98 50 98C55 98 60 94 65 95C80 98 84 92 82 88C78 78 65 70 50 70Z" />
                 </svg>
            </div>
        ))}

        {/* Animating Paws Layer */}
        {paws.map(paw => (
            <div
                key={paw.id}
                className="absolute pointer-events-none flex flex-col items-center"
                style={{
                    left: paw.startX,
                    top: paw.startY,
                    transformOrigin: 'top center',
                    // We animate using a keyframe defined in styles below, but for simplicity in React we can use transitions or just a one-off CSS class
                    animation: `pawSwipe 0.8s ease-in-out forwards`,
                    '--target-x': `${paw.targetX - paw.startX}px`,
                    '--target-y': `${paw.targetY - paw.startY}px`,
                    '--angle': `${paw.angle + 90}deg`,
                    color: paw.color
                } as React.CSSProperties}
            >
                {/* The Arm */}
                <div 
                    className="w-24 h-[800px] rounded-full -mt-[20px]"
                    style={{ backgroundColor: 'currentColor' }}
                ></div>
                 {/* The Paw Hand (Solid) */}
                <div className="absolute top-0 transform -translate-y-1/2 rotate-180">
                     <svg width="110" height="110" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M50 35C40 35 32 42 32 50C32 58 40 65 50 65C60 65 68 58 68 50C68 42 60 35 50 35ZM25 40C18 40 12 46 12 54C12 62 18 68 25 68C32 68 38 62 38 54C38 46 32 40 25 40ZM75 40C68 40 62 46 62 54C62 62 68 68 75 68C82 68 88 62 88 54C88 46 82 40 75 40ZM50 70C35 70 22 78 18 88C16 92 20 98 35 95C40 94 45 98 50 98C55 98 60 94 65 95C80 98 84 92 82 88C78 78 65 70 50 70Z" />
                     </svg>
                </div>
            </div>
        ))}

        <style>{`
            @keyframes pawSwipe {
                0% {
                    transform: translate(0, 0) rotate(var(--angle)) translate(0, 0);
                }
                40% {
                    transform: translate(var(--target-x), var(--target-y)) rotate(var(--angle)) translate(0, 30px);
                }
                60% {
                    transform: translate(var(--target-x), var(--target-y)) rotate(var(--angle)) translate(0, 30px);
                }
                100% {
                    transform: translate(0, 0) rotate(var(--angle)) translate(0, 0);
                }
            }
        `}</style>
    </div>
  );
};
