
import React, { useRef } from 'react';
import { useGame } from '../context/GameContext';
import { LOCATIONS, RANK_REQUIREMENTS, getRankData } from '../data/config';
import { UI_TRAVEL, UI_COMMON } from '../data/uiTexts';
import MasterTooltip from '../components/MasterTooltip';

const TravelTab: React.FC = () => {
  const { gameState, travelToLocation, markTooltipSeen } = useGame();
  const currentRank = getRankData(gameState.xp).rank;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const palaceCardRef = useRef<HTMLDivElement>(null);

  const isDistrictMagistrate = currentRank <= 7;
  const hasSeenTravelTabIntro = gameState.seenTooltips.includes('travel_tab_first_open');

  return (
    <div className="flex flex-col h-full overflow-hidden px-4 py-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center relative">
        <h2 ref={titleRef} className="text-2xl md:text-5xl font-outfit font-black tracking-tighter uppercase text-slate-100">{UI_TRAVEL.TITLE}</h2>
        <p className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-[0.4em] mt-2">{UI_TRAVEL.SUBTITLE}</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOCATIONS.map((loc, idx) => {
            const isCurrent = gameState.currentLocationId === loc.id;
            const isUnlocked = currentRank <= loc.minRank;
            const canAfford = gameState.currency >= loc.travelCost;
            const minRankName = RANK_REQUIREMENTS[9 - loc.minRank]?.name || 'Unknown';
            const isPalace = loc.id === 'imperial_palace';

            const showNudge = isPalace && isDistrictMagistrate && !hasSeenTravelTabIntro && !isCurrent;

            return (
              <div 
                key={loc.id} 
                ref={isPalace ? palaceCardRef : null}
                className={`glass-premium flex flex-col p-6 rounded-[3rem] border transition-all duration-500 relative ${isCurrent ? 'border-amber-500/50 ring-2 ring-amber-500/10' : 'border-white/5'} ${!isUnlocked ? 'opacity-40' : ''}`}
              >
                {showNudge && (
                  <MasterTooltip 
                    message={UI_TRAVEL.NUDGE_PALACE}
                    position="top"
                    anchorRef={palaceCardRef}
                    wide
                    onOk={() => markTooltipSeen('travel_tab_first_open')}
                  />
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-4xl border ${isCurrent ? 'bg-amber-500/20 border-amber-500/20' : 'bg-black/40 border-white/5'}`}>
                    {loc.icon}
                  </div>
                  {isUnlocked && !isCurrent && (
                    <div className="text-right">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">{UI_TRAVEL.COST}</span>
                      <span className="text-emerald-400 font-black text-lg font-outfit">{loc.travelCost}</span>
                    </div>
                  )}
                </div>

                <div className="flex-grow mb-6">
                  <h3 className="text-xl font-black font-outfit uppercase tracking-tighter text-slate-100 mb-2">{loc.name}</h3>
                  <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed italic mb-4">
                    "{loc.description}"
                  </p>
                  
                  {!isUnlocked && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl">
                      <p className="text-[8px] font-black text-red-400 uppercase tracking-widest leading-tight">
                        {UI_TRAVEL.LOCKED}
                        <br />
                        <span className="text-slate-500">Requires {minRankName}</span>
                      </p>
                    </div>
                  )}
                </div>

                {isCurrent ? (
                  <div className="w-full py-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                    {UI_TRAVEL.CURRENT}
                  </div>
                ) : (
                  <button 
                    disabled={!isUnlocked || !canAfford}
                    onClick={() => travelToLocation(loc.id)}
                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                      isUnlocked && canAfford 
                        ? 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white hover:from-blue-600 hover:to-indigo-700' 
                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {!isUnlocked ? 'Classified' : !canAfford ? 'Insufficient Tael' : UI_TRAVEL.DEPART}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TravelTab;
