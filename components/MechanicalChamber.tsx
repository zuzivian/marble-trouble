
import React, { useRef } from 'react';
import { Marble } from '../types';
import { UI_HOME, UI_COMMON } from '../data/uiTexts';
import MarbleVisual from './MarbleVisual';
import MasterTooltip from './MasterTooltip';
import { useGame } from '../context/GameContext';

interface Props {
  marbles: Marble[];
  capacity: number;
  onInspect: () => void;
}

const MechanicalChamber: React.FC<Props> = ({ marbles, capacity, onInspect }) => {
  const { gameState } = useGame();
  const vaultRef = useRef<HTMLDivElement>(null);
  
  const stacks = marbles.reduce((acc, marble) => {
    if (!acc[marble.name]) {
      acc[marble.name] = { marble, count: 0 };
    }
    acc[marble.name].count++;
    return acc;
  }, {} as Record<string, { marble: Marble; count: number }>);

  const stackArray = Object.values(stacks);
  
  const isMobile = window.innerWidth < 768;
  const displayLimit = isMobile ? 6 : 18; 
  const displayStacks = stackArray.slice(0, displayLimit);

  // Overlap protection
  const hasPendingHUDNudge = (
    (gameState.totalCatches >= 1 && !gameState.seenTooltips.includes('shelf_hud')) ||
    (gameState.totalCatches >= 2 && !gameState.seenTooltips.includes('album_hud')) ||
    (gameState.onboardingStep >= 7 && gameState.currency >= 250 && !gameState.seenTooltips.includes('shop_hud'))
  );

  const isTutorialInspecting = gameState.onboardingStep === 5 && !hasPendingHUDNudge;

  return (
    <div className="flex flex-col w-full h-full min-h-0 relative">
      {isTutorialInspecting && (
        <MasterTooltip 
          message="The vessel hums! A perfect seal is achieved. Inspect your harvest."
          position="top"
          anchorRef={vaultRef}
          wide
        />
      )}

      {/* Refined Header */}
      <div className="flex items-center justify-between mb-2 md:mb-4 px-1 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-1 md:w-1.5 h-3 md:h-4 bg-amber-700 rounded-full" />
          <span className="text-[10px] md:text-sm font-black text-amber-200/40 uppercase tracking-[0.2em] leading-none">
            {UI_HOME.VAULT_TITLE}
          </span>
        </div>
        <div className="flex items-center bg-black/40 px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-amber-500/10">
          <span className="text-[7px] md:text-[10px] font-black text-amber-500/80 uppercase tracking-tighter leading-none whitespace-nowrap">
            {marbles.length} / {capacity}
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div 
        ref={vaultRef}
        className={`relative flex-1 bg-black/60 rounded-3xl p-1.5 md:p-3 border border-amber-900/20 flex flex-col group cursor-pointer transition-all hover:border-amber-500/30 min-h-0 overflow-hidden shadow-2xl ${
          isTutorialInspecting ? 'ring-4 ring-emerald-500 animate-pulse border-emerald-400' : ''
        }`} 
        onClick={onInspect}
      >
        <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-6 grid-rows-2 md:grid-rows-3 gap-1 md:gap-2 p-1.5 md:p-3 opacity-20 pointer-events-none">
          {Array.from({ length: displayLimit }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/5" />
          ))}
        </div>

        {stackArray.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20 space-y-2">
             <span className="text-xl md:text-4xl grayscale">💎</span>
             <p className="text-[8px] md:text-[12px] font-black text-slate-400 uppercase tracking-[0.4em]">{UI_COMMON.EMPTY}</p>
          </div>
        ) : (
          <div className="relative z-10 grid grid-cols-3 md:grid-cols-6 gap-1 md:gap-2 w-full h-full content-start overflow-hidden">
            {displayStacks.map(({ marble, count }) => (
              <div 
                key={marble.name} 
                className="relative aspect-square flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-[1.1] hover:z-20"
              >
                <div className="scale-[0.8] sm:scale-90 md:scale-100 lg:scale-110 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                  <MarbleVisual marble={marble} size="xs" />
                </div>
                {count > 1 && (
                  <div className="absolute top-0 right-0 bg-amber-600/90 text-white text-[5px] md:text-[9px] font-black px-1 md:px-1.5 py-0.5 rounded-bl-xl rounded-tr-xl border-l border-b border-amber-400/20 z-20 shadow-md tabular-nums">
                    {count}
                  </div>
                )}
              </div>
            ))}
            
            {stackArray.length > displayLimit && (
              <div className="aspect-square flex flex-col items-center justify-center bg-slate-800/40 rounded-xl shadow-lg">
                <span className="text-[10px] md:text-lg font-black text-slate-300 leading-none">+{stackArray.length - displayLimit}</span>
                <span className="text-[5px] md:text-[7px] font-black text-slate-500 uppercase tracking-tighter mt-0.5">More</span>
              </div>
            )}
          </div>
        )}

        {/* Technical Inspection Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-10 md:h-16 bg-gradient-to-t from-emerald-500/10 to-transparent flex items-end justify-center pb-2 md:pb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-3 md:px-5 py-1 md:py-2 rounded-full shadow-lg">
            <span className="text-emerald-300 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">
              {UI_HOME.VAULT_INSPECT_HINT}
            </span>
            <span className="text-[10px] md:text-sm">🔍</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicalChamber;
