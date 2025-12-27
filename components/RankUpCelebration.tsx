
import React from 'react';
import { UI_MODAL, UI_COMMON } from '../data/uiTexts';

interface Props {
  rank: { rank: number; name: string; icon?: string };
  onClose: () => void;
}

const RankUpCelebration: React.FC<Props> = ({ rank, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500 overflow-hidden">
      {/* Fireworks Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i}
            className="absolute animate-fireworks w-2 h-2 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              backgroundColor: ['#FFD700', '#B22222', '#00A86B', '#FF8C00'][i % 4],
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="glass-premium w-full max-w-md rounded-[3rem] p-10 border border-amber-500/30 shadow-[0_0_100px_rgba(251,191,36,0.2)] text-center animate-in zoom-in-75 duration-700 relative z-10">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-amber-500/20 blur-3xl animate-pulse rounded-full" />
          <div className="relative text-7xl md:text-8xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            {rank.icon || '🎖️'}
          </div>
        </div>

        <span className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-[0.5em] mb-2 block animate-pulse">
          {UI_MODAL.CELEBRATION_TITLE}
        </span>
        
        <h2 className="text-3xl md:text-5xl font-outfit font-black text-slate-100 uppercase tracking-tighter mb-4">
          {rank.name}
        </h2>
        
        <p className="text-slate-400 italic text-sm md:text-base mb-8 leading-relaxed">
          "The Emperor has noticed your dedication. Your standing in the Dynasty grows with every soul bound."
        </p>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl border border-amber-400/30 text-[10px] md:text-xs"
        >
          Accept Promotion
        </button>
      </div>
    </div>
  );
};

export default RankUpCelebration;
