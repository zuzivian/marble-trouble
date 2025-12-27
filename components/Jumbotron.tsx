
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
  location?: string;
}

const Jumbotron: React.FC<Props> = ({
  currency,
  totalLuck,
  totalYield,
  activeCoverName,
  activeJarName,
  marblesCount,
  jarCapacity,
  isJarFull,
  location = UI_HOME.DEFAULT_LOCATION
}) => {
  return (
    <header className="w-full bg-slate-900/95 border-b border-white/5 shadow-2xl z-20 shrink-0 relative overflow-hidden">
      {/* Subtle top edge glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 md:py-4 flex flex-row items-center justify-between gap-3 md:gap-8 relative z-10">
        
        {/* Logo and Location Section */}
        <div className="flex flex-col shrink-0 group cursor-default">
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="relative w-7 h-7 md:w-10 md:h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-full blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm shadow-inner" />
              
              <div className="relative z-10 w-4 h-4 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-500 transform-gpu">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                  <defs>
                    <radialGradient id="marbleGrad" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </radialGradient>
                    <filter id="marbleGlow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="url(#marbleGrad)" stroke="white" strokeWidth="2" strokeOpacity="0.2" />
                  <path d="M30 30Q50 20 70 30Q50 40 30 30Z" fill="white" fillOpacity="0.4" />
                  <circle cx="35" cy="35" r="10" fill="white" fillOpacity="0.3" filter="url(#marbleGlow)" />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="text-[13px] md:text-2xl font-black font-outfit tracking-tighter flex items-center leading-none">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                  MARBLE
                </span>
                <div className="ml-1 md:ml-1.5 px-2 py-0.5 md:px-2 md:py-1 rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white text-[8px] md:text-xs font-black italic shadow-lg shadow-blue-500/30 uppercase skew-x-[-12deg] border border-white/20">
                  <span className="skew-x-[12deg] inline-block">Trouble</span>
                </div>
              </h1>
              {/* Location Indicator */}
              <div className="flex items-center space-x-1 mt-0.5 md:mt-1">
                <span className="text-blue-500 text-[6px] md:text-[9px]">📍</span>
                <span className="text-[6px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-80">
                  {location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Currency Display */}
        <div className="flex items-center bg-slate-950/80 px-3 md:px-6 py-1.5 md:py-2.5 rounded-full border border-emerald-500/30 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] group hover:border-emerald-500 transition-colors">
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] mr-2 md:mr-3 animate-pulse" />
          <span className="text-emerald-400 font-black text-sm md:text-2xl font-outfit leading-none tabular-nums tracking-tight">
            {currency.toLocaleString()}
          </span>
        </div>

        {/* Status Area */}
        <div className="flex items-center space-x-3 md:space-x-8 flex-grow justify-end">
          {/* Active Gear Summary - Swapped Jar and Cover */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{activeJarName}</span>
            <div className="flex items-center space-x-2">
               <div className="flex items-center space-x-1">
                 <div className="w-1 h-1 rounded-full bg-blue-500" />
                 <span className="text-[10px] font-black text-blue-300 uppercase">{UI_COMMON.LUCK_LABEL} +{totalLuck}</span>
               </div>
               <div className="flex items-center space-x-1">
                 <div className="w-1 h-1 rounded-full bg-emerald-500" />
                 <span className="text-[10px] font-black text-emerald-300 uppercase">{UI_COMMON.YIELD_LABEL} x{totalYield.toFixed(1)}</span>
               </div>
            </div>
          </div>

          {/* Capacity Meter */}
          <div className="flex flex-col items-end shrink-0">
             <div className="flex items-center space-x-1 mb-1.5">
                <span className={`text-[10px] md:text-sm font-black tracking-tighter tabular-nums ${isJarFull ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                  {marblesCount} <span className="text-[8px] md:text-[10px] opacity-40 uppercase tracking-widest font-black">of</span> {jarCapacity}
                </span>
             </div>
             <div className="w-16 md:w-32 h-1.5 md:h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5 relative">
                <div 
                  className={`h-full transition-all duration-700 ease-out relative z-10 ${isJarFull ? 'bg-gradient-to-r from-rose-600 to-red-400' : 'bg-gradient-to-r from-blue-600 to-blue-400'}`} 
                  style={{ width: `${Math.min(100, (marblesCount / jarCapacity) * 100)}%` }} 
                >
                  <div className="absolute inset-0 bg-white/20 mix-blend-overlay animate-[shimmer_2s_infinite]" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Jumbotron;
