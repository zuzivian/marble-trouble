
import React, { useEffect } from 'react';
import { Marble } from '../types';
import { UI_HOME } from '../data/uiTexts';
import { RARITY_COLORS } from '../data/constants';
import MarbleVisual from './MarbleVisual';

interface Props {
  marble: Marble | null;
  onDismiss: () => void;
}

const CatchRevealModal: React.FC<Props> = ({ marble, onDismiss }) => {
  useEffect(() => {
    if (!marble) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [marble, onDismiss]);

  if (!marble) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
      onClick={onDismiss}
    >
      <div 
        className="glass-premium w-full max-w-md rounded-[2.5rem] p-8 md:p-12 border border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 flex flex-col items-center text-center relative"
      >
        {/* Background Radial Glow based on Rarity */}
        <div className={`absolute -inset-20 opacity-20 blur-[100px] pointer-events-none bg-gradient-to-br from-blue-500 to-transparent`} />
        
        <span className="text-[10px] md:text-xs font-black text-emerald-400 uppercase tracking-[0.4em] mb-6 animate-pulse">
          {UI_HOME.CATCH_REVEAL_HEADER}
        </span>

        {/* The Marble Showcase */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-10 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="scale-[1.8] md:scale-[2.5] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-float">
            <MarbleVisual marble={marble} size="md" />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 mt-4">
          <p className={`text-[12px] md:text-lg font-black uppercase tracking-widest ${RARITY_COLORS[marble.rarity]}`}>
            {marble.rarity}
          </p>
          <h3 className="text-2xl md:text-4xl font-black font-outfit tracking-tighter text-slate-100 uppercase">
            {marble.name}
          </h3>
          <div className="max-w-[280px] mx-auto pt-4">
            <p className="text-[11px] md:text-sm text-slate-400 italic leading-relaxed">
              "{marble.description}"
            </p>
          </div>
        </div>

        {/* Dismiss Instruction */}
        <div className="mt-10 flex items-center space-x-2 opacity-30">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Tap to Dismiss</span>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        </div>
      </div>
    </div>
  );
};

export default CatchRevealModal;
