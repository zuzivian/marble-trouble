
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { UI_SETTINGS, UI_COMMON } from '../data/uiTexts';
import { getRankData } from '../data/config';

const SettingsTab: React.FC = () => {
  const { gameState, resetGame, resetCooldown } = useGame();
  const [devClicks, setDevClicks] = useState(0);
  const { name: rankName, icon: rankIcon, color: rankColor } = getRankData(gameState.xp);

  const handleReset = () => {
    if (window.confirm(UI_SETTINGS.RESET_CONFIRM)) {
      resetGame();
      window.location.reload();
    }
  };

  const handleDevClick = () => {
    const next = devClicks + 1;
    if (next >= 3) {
      resetCooldown();
      setDevClicks(0);
    } else {
      setDevClicks(next);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden px-4 py-8 max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl md:text-5xl font-outfit font-black tracking-tighter uppercase text-slate-100">{UI_SETTINGS.TITLE}</h2>
        <p className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-[0.4em] mt-2">{UI_SETTINGS.SUBTITLE}</p>
      </div>

      <div className="glass-premium p-8 rounded-[2.5rem] border border-amber-500/10 space-y-6">
        <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 border-b border-white/5 pb-2">
          {UI_SETTINGS.STATS}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Catches</span>
            <p className="text-xl font-black text-amber-400 font-outfit">{gameState.totalCatches.toLocaleString()}</p>
          </div>
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Imperial Shards Earned</span>
            <p className="text-xl font-black text-emerald-400 font-outfit">{gameState.xp.toLocaleString()}</p>
          </div>
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Unique Spirits</span>
            <p className="text-xl font-black text-blue-400 font-outfit">{Object.keys(gameState.catchHistory).length}</p>
          </div>
          <div 
            onClick={handleDevClick}
            className="bg-black/40 p-4 rounded-2xl border border-white/5 cursor-pointer active:scale-95 transition-transform"
          >
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Empire Rank</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xl">{rankIcon}</span>
              <p className={`text-sm md:text-xl font-black font-outfit truncate ${rankColor}`}>{rankName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-premium p-8 rounded-[2.5rem] border border-red-500/20 space-y-4">
        <div className="flex items-center space-x-4 text-red-500">
          <span className="text-4xl">⚠️</span>
          <p className="text-xs font-bold uppercase tracking-tight">Danger Zone: This action cannot be undone by any Imperial decree.</p>
        </div>
        <button 
          onClick={handleReset}
          className="w-full py-4 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-500 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl"
        >
          {UI_SETTINGS.RESET_BTN}
        </button>
      </div>

      <div className="text-center opacity-20">
         <p className="text-[8px] font-black uppercase tracking-widest">Imperial Version {gameState.version}</p>
      </div>
    </div>
  );
};

export default SettingsTab;
