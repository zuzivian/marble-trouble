
import React from 'react';
import { useGame } from '../context/GameContext';
import { ACHIEVEMENTS } from '../data/config';
import { UI_ACHIEVEMENTS } from '../data/uiTexts';

const AchievementsTab: React.FC = () => {
  const { gameState } = useGame();

  return (
    <div className="flex flex-col h-full overflow-hidden px-4 py-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl md:text-5xl font-outfit font-black tracking-tighter uppercase text-slate-100">{UI_ACHIEVEMENTS.TITLE}</h2>
        <p className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-[0.4em] mt-2">{UI_ACHIEVEMENTS.SUBTITLE}</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map(achievement => {
            const isUnlocked = gameState.unlockedAchievementIds.includes(achievement.id);
            return (
              <div 
                key={achievement.id}
                className={`glass-premium p-6 rounded-[2.5rem] border flex items-center space-x-6 transition-all duration-700 ${
                  isUnlocked 
                    ? 'border-amber-500/30 bg-amber-500/5 shadow-[0_10px_30px_rgba(251,191,36,0.1)]' 
                    : 'border-white/5 opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
                }`}
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center text-3xl md:text-5xl border ${
                  isUnlocked ? 'bg-amber-500/10 border-amber-500/20 shadow-inner' : 'bg-black/40 border-white/5'
                }`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-black uppercase text-sm md:text-base tracking-tight truncate ${isUnlocked ? 'text-amber-100' : 'text-slate-500'}`}>
                    {achievement.name}
                  </h3>
                  <p className="text-[9px] md:text-xs text-slate-400 italic leading-snug">
                    {achievement.description}
                  </p>
                  {!isUnlocked && (
                    <span className="mt-1 block text-[7px] font-black text-amber-600 uppercase tracking-widest">{UI_ACHIEVEMENTS.LOCKED}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsTab;
