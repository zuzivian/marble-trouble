
import React from 'react';
import { UI_MODAL, UI_COMMON } from '../data/uiTexts';
import { RANK_REQUIREMENTS } from '../data/config';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentXp: number;
}

const RankModal: React.FC<Props> = ({ isOpen, onClose, currentXp }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="glass-premium w-full max-w-lg rounded-[2.5rem] border border-amber-500/20 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-amber-500/10 flex justify-between items-center bg-black/40">
          <div>
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em]">{UI_MODAL.RANK_SUBTITLE}</span>
            <h2 className="text-2xl font-outfit font-black text-slate-100 uppercase tracking-tighter">{UI_MODAL.RANK_TITLE}</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full glass flex items-center justify-center text-xl border border-white/10">
            {UI_COMMON.CLOSE}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
          {RANK_REQUIREMENTS.map((rank) => {
            const isUnlocked = currentXp >= rank.xp;
            return (
              <div 
                key={rank.name} 
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  isUnlocked 
                    ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]' 
                    : 'bg-black/20 border-white/5 opacity-50 grayscale'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${isUnlocked ? rank.bgClass : 'bg-slate-800 opacity-50'}`}>
                    {rank.icon}
                  </div>
                  <div>
                    <h3 className={`font-black uppercase text-sm ${isUnlocked ? 'text-amber-100' : 'text-slate-500'}`}>{rank.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{rank.xp.toLocaleString()} XP REQUIRED</p>
                  </div>
                </div>
                {isUnlocked && <span className="text-amber-500 text-xl">✔️</span>}
              </div>
            );
          })}
        </div>
        
        <div className="p-4 bg-black/60 border-t border-amber-500/10 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Current XP: <span className="text-amber-400">{currentXp.toLocaleString()}</span></p>
        </div>
      </div>
    </div>
  );
};

export default RankModal;
