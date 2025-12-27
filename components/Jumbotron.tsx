
import React, { useState } from 'react';
import { UI_JUMBOTRON, UI_COMMON, UI_HOME } from '../data/uiTexts';
import { RANK_REQUIREMENTS, getRankData, LOCATIONS } from '../data/config';
import RankModal from './RankModal';
import { useGame } from '../context/GameContext';

interface Props {
  currency: number;
  totalLuck: number;
  totalYield: number;
  activeCoverName: string;
  activeJarName: string;
  marblesCount: number;
  jarCapacity: number;
  isJarFull: boolean;
  totalCatches: number;
  xp: number;
  currentLocationId: string;
}

const YuanbaoIcon = () => (
  <svg viewBox="0 0 100 100" className="w-6 h-6 md:w-8 md:h-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    <path d="M10 60 C 10 30, 90 30, 90 60 L 80 85 L 20 85 Z" fill="#fbbf24" stroke="#92400e" strokeWidth="2"/>
    <path d="M30 40 C 30 15, 70 15, 70 40" fill="#fcd34d" stroke="#92400e" strokeWidth="1.5"/>
    <ellipse cx="50" cy="40" rx="15" ry="10" fill="#fbbf24" stroke="#92400e" strokeWidth="1"/>
  </svg>
);

const Jumbotron: React.FC<Props> = ({
  currency,
  totalLuck,
  totalYield,
  marblesCount,
  jarCapacity,
  isJarFull,
  xp,
  currentLocationId,
}) => {
  const { resetCooldown } = useGame();
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  const [devClicks, setDevClicks] = useState(0);
  const { name: rankName, palace: isPalaceMember, color: rankColor, progress: rankProgress, icon: rankIcon } = getRankData(xp);
  
  const currentLocation = LOCATIONS.find(l => l.id === currentLocationId) || LOCATIONS[0];

  const handleRankClick = () => {
    const newClicks = devClicks + 1;
    if (newClicks >= 3) {
      resetCooldown();
      setDevClicks(0);
    } else {
      setDevClicks(newClicks);
    }
    setIsRankModalOpen(true);
  };

  return (
    <header className={`w-full border-b shadow-2xl z-20 shrink-0 relative overflow-hidden transition-all duration-1000 ${isPalaceMember ? 'bg-gradient-to-r from-[#6a0a0a] via-[#a82222] to-[#6a0a0a] border-amber-500/50' : 'bg-red-950/98 border-amber-900/30'}`}>
      <div className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent`} />
      
      {isPalaceMember && (
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/gold-scale.png')]" />
      )}

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 md:py-5 flex flex-row items-center justify-between gap-3 md:gap-8 relative z-10">
        
        {/* Title & Rank */}
        <div className="flex flex-col shrink-0 group cursor-pointer" onClick={handleRankClick}>
          <div className="flex items-center space-x-1 md:space-x-4">
            <div className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 ${isPalaceMember ? 'bg-amber-300 opacity-60 animate-pulse' : 'bg-red-500 opacity-40'}`} />
              <div className="absolute inset-0 bg-black/50 rounded-full border-2 border-amber-500/30 backdrop-blur-md shadow-2xl" />
              <div className="relative z-10 text-2xl md:text-3xl drop-shadow-lg">{rankIcon}</div>
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="text-[14px] md:text-2xl font-black font-outfit tracking-tighter flex items-center leading-none">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-100 to-amber-400 uppercase">
                  MARBLE
                </span>
                <span className="ml-1 text-red-400 italic drop-shadow-lg">Trouble</span>
              </h1>
              <div className="flex flex-col mt-1">
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[8px] md:text-[11px] font-black uppercase tracking-widest ${rankColor}`}>
                    {rankName}
                  </span>
                  <span className="text-[7px] md:text-[10px] font-bold text-amber-200 ml-2">{Math.floor(rankProgress)}%</span>
                </div>
                {/* XP Progress Bar */}
                <div className="mt-1 w-24 md:w-40 h-1.5 bg-black/60 rounded-full overflow-hidden border border-amber-500/20">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500" 
                    style={{ width: `${rankProgress}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Imperial Tael (Currency) */}
        <div className="flex items-center bg-black/70 px-4 md:px-7 py-2 md:py-3 rounded-[1.5rem] border border-amber-400/30 shadow-[inset_0_2px_20px_rgba(0,0,0,0.9)] group transition-all hover:border-amber-400/60">
          <div className="mr-3 transform group-hover:scale-110 transition-transform">
            <YuanbaoIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] md:text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] leading-none mb-1">Imperial Tael</span>
            <span className="text-amber-300 font-black text-base md:text-2xl font-outfit leading-none tabular-nums tracking-tight">
              {currency.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right Stats: Location & Vessel Capacity */}
        <div className="flex items-center space-x-4 md:space-x-10 flex-grow justify-end">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1.5 flex items-center gap-1.5">
              <span>{currentLocation.icon}</span>
              <span className="text-amber-200">{currentLocation.name}</span>
            </span>
            <div className="flex items-center space-x-4">
               <div className="flex items-center space-x-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
                 <span className="text-[11px] font-black text-amber-200/80 uppercase">{UI_COMMON.LUCK_LABEL} +{totalLuck}</span>
               </div>
               <div className="flex items-center space-x-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                 <span className="text-[11px] font-black text-emerald-200/80 uppercase">{UI_COMMON.YIELD_LABEL} x{totalYield.toFixed(1)}</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
             <div className="flex items-center space-x-1 mb-2">
                <span className={`text-[11px] md:text-base font-black tracking-tighter tabular-nums ${isJarFull ? 'text-red-400 animate-pulse' : 'text-amber-100'}`}>
                  {marblesCount} / {jarCapacity}
                </span>
             </div>
             <div className="w-20 md:w-36 h-2 md:h-2.5 bg-black/70 rounded-full overflow-hidden border border-amber-900/40 relative">
                <div 
                  className={`h-full transition-all duration-700 ease-out relative z-10 ${isJarFull ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'}`} 
                  style={{ width: `${Math.min(100, (marblesCount / jarCapacity) * 100)}%` }} 
                />
             </div>
          </div>
        </div>
      </div>
      <RankModal isOpen={isRankModalOpen} onClose={() => setIsRankModalOpen(false)} currentXp={xp} />
    </header>
  );
};

export default Jumbotron;
