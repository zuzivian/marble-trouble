
import React from 'react';
import { UI_JUMBOTRON, UI_COMMON, UI_HOME } from '../data/uiTexts';

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
}

const getRank = (catches: number) => {
  if (catches >= 1000) return { name: 'Rank 1: Grand Chancellor', palace: true, color: 'text-amber-400' };
  if (catches >= 750) return { name: 'Rank 2: Imperial Censor', palace: true, color: 'text-amber-500' };
  if (catches >= 500) return { name: 'Rank 3: Minister of War', palace: true, color: 'text-orange-400' };
  if (catches >= 250) return { name: 'Rank 4: High Scholar', palace: true, color: 'text-orange-500' };
  if (catches >= 150) return { name: 'Rank 5: Court Chamberlain', palace: false, color: 'text-red-400' };
  if (catches >= 100) return { name: 'Rank 6: Provincial Governor', palace: false, color: 'text-red-500' };
  if (catches >= 50) return { name: 'Rank 7: District Magistrate', palace: false, color: 'text-rose-400' };
  if (catches >= 20) return { name: 'Rank 8: Scribe', palace: false, color: 'text-rose-500' };
  if (catches >= 5) return { name: 'Rank 9: Village Elder', palace: false, color: 'text-slate-400' };
  return { name: 'Baixing (Commoner)', palace: false, color: 'text-slate-500' };
};

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
  activeJarName,
  marblesCount,
  jarCapacity,
  isJarFull,
  totalCatches,
}) => {
  const { name: rankName, palace: isPalaceMember, color: rankColor } = getRank(totalCatches);
  const location = isPalaceMember ? "Inner Daming Palace" : UI_HOME.DEFAULT_LOCATION;

  return (
    <header className={`w-full border-b shadow-2xl z-20 shrink-0 relative overflow-hidden transition-all duration-1000 ${isPalaceMember ? 'bg-gradient-to-r from-[#5a0505] via-[#8a1c1c] to-[#5a0505] border-amber-500/40' : 'bg-red-950/95 border-amber-900/20'}`}>
      <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent`} />
      
      {isPalaceMember && (
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/gold-scale.png')]" />
      )}

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-2.5 md:py-4 flex flex-row items-center justify-between gap-3 md:gap-8 relative z-10">
        
        {/* Title & Rank */}
        <div className="flex flex-col shrink-0 group cursor-default">
          <div className="flex items-center space-x-1 md:space-x-3">
            <div className="relative w-8 h-8 md:w-11 md:h-11 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full blur-lg transition-all duration-700 ${isPalaceMember ? 'bg-amber-400 opacity-50 animate-pulse' : 'bg-red-600 opacity-30'}`} />
              <div className="absolute inset-0 bg-black/40 rounded-full border border-amber-500/20 backdrop-blur-md shadow-inner" />
              <div className="relative z-10 text-xl md:text-2xl">{isPalaceMember ? '📜' : '🏮'}</div>
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="text-[12px] md:text-2xl font-black font-outfit tracking-tighter flex items-center leading-none">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-100 to-amber-500 uppercase">
                  MARBLE
                </span>
                <span className="ml-1 text-red-500 italic drop-shadow-md">Trouble</span>
              </h1>
              <div className="flex items-center space-x-1 mt-0.5 md:mt-1">
                <span className={`text-[7px] md:text-[10px] font-black uppercase tracking-widest ${rankColor}`}>
                  {rankName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Imperial Tael (Currency) */}
        <div className="flex items-center bg-black/60 px-3 md:px-6 py-1.5 md:py-2 rounded-2xl border border-amber-500/20 shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] group transition-all hover:border-amber-400/50">
          <div className="mr-2 md:mr-3 transform group-hover:scale-110 transition-transform">
            <YuanbaoIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-[6px] md:text-[8px] font-black text-amber-600 uppercase tracking-[0.2em] leading-none mb-0.5">Imperial Tael</span>
            <span className="text-amber-400 font-black text-sm md:text-2xl font-outfit leading-none tabular-nums tracking-tight">
              {currency.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right Stats: Location & Vessel Capacity */}
        <div className="flex items-center space-x-3 md:space-x-8 flex-grow justify-end">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest leading-none mb-1">{location}</span>
            <div className="flex items-center space-x-3">
               <div className="flex items-center space-x-1">
                 <div className="w-1 h-1 rounded-full bg-amber-500" />
                 <span className="text-[10px] font-black text-amber-200/60 uppercase">{UI_COMMON.LUCK_LABEL} +{totalLuck}</span>
               </div>
               <div className="flex items-center space-x-1">
                 <div className="w-1 h-1 rounded-full bg-emerald-500" />
                 <span className="text-[10px] font-black text-emerald-200/60 uppercase">{UI_COMMON.YIELD_LABEL} x{totalYield.toFixed(1)}</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
             <div className="flex items-center space-x-1 mb-1.5">
                <span className={`text-[10px] md:text-sm font-black tracking-tighter tabular-nums ${isJarFull ? 'text-red-400 animate-pulse' : 'text-amber-100/40'}`}>
                  {marblesCount} / {jarCapacity}
                </span>
             </div>
             <div className="w-16 md:w-32 h-1.5 md:h-2 bg-black/60 rounded-full overflow-hidden border border-amber-900/30 relative">
                <div 
                  className={`h-full transition-all duration-700 ease-out relative z-10 ${isJarFull ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-amber-600 to-amber-400'}`} 
                  style={{ width: `${Math.min(100, (marblesCount / jarCapacity) * 100)}%` }} 
                >
                  <div className="absolute inset-0 bg-white/10 mix-blend-overlay animate-[shimmer_2s_infinite]" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Jumbotron;
