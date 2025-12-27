
import React, { useRef } from 'react';
import { JARS } from '../data/constants';
import { useGame } from '../context/GameContext';
import { UI_SHELF, UI_COMMON, UI_ONBOARDING } from '../data/uiTexts';
import MarbleVisual from '../components/MarbleVisual';
import MasterTooltip from '../components/MasterTooltip';

const ShelfTab: React.FC = () => {
  const { gameState, equipJar, sellJarContents, markTooltipSeen } = useGame();
  const titleRef = useRef<HTMLHeadingElement>(null);

  const showExplanation = gameState.seenTooltips.includes('shelf_hud') && !gameState.seenTooltips.includes('shelf_tab');

  return (
    <div className="flex flex-col h-full overflow-hidden px-2">
      <div className="flex flex-col items-center mb-6 md:mb-10 shrink-0 pt-4 relative">
        <h2 ref={titleRef} className="text-2xl md:text-5xl font-outfit font-black tracking-tighter uppercase text-slate-100">{UI_SHELF.TITLE}</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-transparent rounded-full mt-2" />
        
        {showExplanation && (
          <MasterTooltip 
            message={UI_ONBOARDING.TUTORIAL_GALLERY_TAB}
            position="bottom"
            anchorRef={titleRef}
            wide
            onOk={() => markTooltipSeen('shelf_tab')}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pb-32">
        {gameState.ownedJarIds.map(jarId => {
          const jar = JARS[jarId];
          const contents = gameState.jarContents[jarId] || [];
          const isActive = gameState.activeJarId === jarId;
          
          return (
            <div key={jarId} className={`glass-premium p-6 md:p-10 rounded-[2.5rem] border transition-all duration-500 ${isActive ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-white/5 opacity-80 hover:opacity-100'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center space-x-6">
                  <div className={`w-16 h-16 md:w-24 md:h-24 rounded-3xl flex items-center justify-center text-4xl md:text-6xl shadow-inner border transition-all ${isActive ? 'bg-amber-500/10 border-amber-500/20' : 'bg-black/20 border-white/5'}`}>
                    {jar.icon}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-3xl font-black font-outfit uppercase tracking-tight text-slate-100">{jar.name}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-[10px] md:text-xs font-black text-amber-400 uppercase tracking-widest">{contents.length} / {jar.capacity} Specimens</span>
                      {isActive && (
                        <span className="text-[8px] md:text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Active Vessel</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {!isActive && (
                    <button 
                      onClick={() => equipJar(jarId)} 
                      className="flex-1 md:flex-none px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-amber-900/20"
                    >
                      {UI_COMMON.EQUIP}
                    </button>
                  )}
                  <button 
                    onClick={() => sellJarContents(jarId)} 
                    disabled={contents.length === 0} 
                    className="flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-20 border border-white/10"
                  >
                    {UI_SHELF.RELINQUISH}
                  </button>
                </div>
              </div>

              <div className="bg-black/30 rounded-3xl p-4 md:p-8 border border-white/5 shadow-inner">
                {contents.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center opacity-20">
                    <span className="text-4xl md:text-6xl mb-4 grayscale">🏺</span>
                    <p className="uppercase font-black tracking-[0.4em] text-[10px] md:text-sm">Vessel Empty</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 md:gap-4">
                    {contents.map((m, idx) => (
                      <div key={m.id + idx} className="aspect-square flex items-center justify-center hover:scale-125 transition-transform cursor-help group relative">
                        <div className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                          <MarbleVisual marble={m} size="xs" />
                        </div>
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 px-2 py-1 rounded text-[8px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          {m.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Fixed: Added default export to the component
export default ShelfTab;
