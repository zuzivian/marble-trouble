
import React, { useState, useEffect, useRef } from 'react';
import { JARS, COVERS } from '../data/constants';
import { useGame } from '../context/GameContext';
import { UI_SHOP, UI_COMMON, UI_ONBOARDING } from '../data/uiTexts';
import CoverVisual from '../components/CoverVisual';
import MasterTooltip from '../components/MasterTooltip';

type ShopSubTab = 'vessels' | 'covers';

const ShopTab: React.FC = () => {
  const { gameState, buyJar, buyCover, equipCover, advanceOnboarding } = useGame();
  const [subTab, setSubTab] = useState<ShopSubTab>('vessels');
  
  const jarTabRef = useRef<HTMLButtonElement>(null);
  const buyJarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (gameState.onboardingStep === 7) {
      advanceOnboarding(8);
    }
  }, [gameState.onboardingStep, advanceOnboarding]);

  const handleBuyJar = (id: string) => {
    buyJar(id);
    if (gameState.onboardingStep === 8) {
      advanceOnboarding(10); // Finish tutorial after buying the jar
    }
  };

  const handleBuyCover = (id: string) => {
    buyCover(id);
  };

  const renderGlossary = () => (
    <div className="mb-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 text-[9px] md:text-xs text-amber-200/60 italic space-y-1">
      <p><strong className="text-amber-400">CAPACITY:</strong> {UI_SHOP.GLOSSARY_CAPACITY}</p>
      <p><strong className="text-amber-400">MANDATE:</strong> {UI_SHOP.GLOSSARY_MANDATE}</p>
      <p><strong className="text-amber-400">HARVEST:</strong> {UI_SHOP.GLOSSARY_HARVEST}</p>
    </div>
  );

  const renderVesselList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-300 px-2 pb-32">
      {Object.values(JARS).map((jar, index) => {
        const isOwned = gameState.ownedJarIds.includes(jar.id);
        const canAfford = gameState.currency >= jar.cost;
        const isTutorialTarget = gameState.onboardingStep === 8 && jar.id === 'glass_flask' && canAfford;
        
        return (
          <div key={jar.id} className={`glass-premium flex flex-col p-5 md:p-7 rounded-[2.5rem] border transition-all group relative ${isTutorialTarget ? 'ring-2 ring-amber-500 shadow-[0_0_30px_rgba(251,191,36,0.3)]' : ''} ${!isOwned && !canAfford ? 'opacity-60' : 'hover:border-amber-500/30'}`}>
            <div className="flex items-start justify-between mb-6">
              <div className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center bg-black/40 rounded-3xl group-hover:scale-105 transition-transform border border-white/5 shadow-inner">
                <span className="text-4xl md:text-6xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">{jar.icon}</span>
              </div>
              <div className="flex flex-col items-end">
                {isOwned ? (
                  <span className="text-[8px] md:text-[10px] bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-amber-500/20">
                    {UI_COMMON.OWNED_LABEL}
                  </span>
                ) : (
                  <div className="text-emerald-400 font-outfit font-black text-sm md:text-xl flex items-center space-x-1.5">
                    <span className="opacity-50 text-[10px] uppercase tracking-widest">{UI_COMMON.CURRENCY_SYMBOL}</span>
                    <span>{jar.cost.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-grow mb-6">
              <h3 className="font-black text-lg md:text-2xl tracking-tighter uppercase font-outfit text-slate-100 mb-1">{jar.name}</h3>
              <p className="text-slate-500 text-[10px] md:text-sm leading-relaxed italic mb-4 opacity-80">
                "{jar.description}"
              </p>
              
              <div className="flex flex-wrap gap-2">
                <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 flex flex-col">
                  <span className="text-[7px] font-black uppercase text-slate-500 tracking-tighter">{UI_COMMON.CAPACITY_LABEL}</span>
                  <span className="text-xs md:text-sm font-black text-amber-400">{jar.capacity}</span>
                </div>
                <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 flex flex-col">
                  <span className="text-[7px] font-black uppercase text-slate-500 tracking-tighter">{UI_COMMON.LUCK_LABEL}</span>
                  <span className="text-xs md:text-sm font-black text-emerald-400">+{jar.luckBonus}</span>
                </div>
                <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 flex flex-col">
                  <span className="text-[7px] font-black uppercase text-slate-500 tracking-tighter">{UI_COMMON.YIELD_LABEL}</span>
                  <span className="text-xs md:text-sm font-black text-orange-400">x{jar.yieldMultiplier.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {isTutorialTarget && (
                <MasterTooltip 
                  message={UI_ONBOARDING.TUTORIAL_BUY_JAR}
                  position="top"
                  anchorRef={buyJarRef}
                  wide
                />
              )}
              <button 
                ref={isTutorialTarget ? buyJarRef : null}
                onClick={() => handleBuyJar(jar.id)} 
                disabled={isOwned || !canAfford} 
                className={`w-full py-4 rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                  isOwned ? 'bg-slate-800/50 text-slate-600 border border-white/5 cursor-not-allowed' : 
                  canAfford ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:brightness-110' : 'bg-slate-800 text-slate-700 cursor-not-allowed'
                } ${isTutorialTarget ? 'ring-4 ring-amber-400 animate-pulse' : ''}`}
              >
                {isOwned ? UI_COMMON.OWNED_LABEL : UI_COMMON.BUY}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderCoverList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-300 px-2 pb-32">
      {COVERS.map((cover, index) => {
        const isOwned = gameState.ownedCoverIds.includes(cover.id);
        const isActive = gameState.activeCoverId === cover.id;
        const canAfford = gameState.currency >= cover.cost;
        
        return (
          <div key={cover.id} className={`glass-premium flex flex-col p-5 md:p-7 rounded-[2.5rem] border transition-all group relative ${isActive ? 'border-orange-500/50' : 'hover:border-orange-500/30'} ${!isOwned && !canAfford ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-6">
              <div className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center bg-black/40 rounded-3xl group-hover:rotate-3 transition-transform border border-white/5 shadow-inner">
                <div className="scale-[0.8] md:scale-125">
                  <CoverVisual coverId={cover.id} />
                </div>
              </div>
              <div className="flex flex-col items-end">
                {isOwned ? (
                  <span className={`text-[8px] md:text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${isActive ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' : 'bg-slate-500/10 text-slate-400 border-white/10'}`}>
                    {isActive ? UI_COMMON.ACTIVE_LABEL : UI_COMMON.OWNED_LABEL}
                  </span>
                ) : (
                  <div className="text-orange-400 font-outfit font-black text-sm md:text-xl flex items-center space-x-1.5">
                    <span className="opacity-50 text-[10px] uppercase tracking-widest">{UI_COMMON.CURRENCY_SYMBOL}</span>
                    <span>{cover.cost.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-grow mb-6">
              <h3 className="font-black text-lg md:text-2xl tracking-tighter uppercase font-outfit text-slate-100 mb-1">{cover.name}</h3>
              <p className="text-slate-500 text-[10px] md:text-sm leading-relaxed italic mb-4 opacity-80">
                "{cover.description}"
              </p>
              
              <div className="flex wrap gap-2">
                {cover.luckValue > 0 && (
                  <div className="bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/10 flex flex-col">
                    <span className="text-[7px] font-black text-amber-400 uppercase tracking-tighter">{UI_COMMON.LUCK_LABEL}</span>
                    <span className="text-xs md:text-sm font-black text-amber-300">+{cover.luckValue}</span>
                  </div>
                )}
                {cover.yieldValue > 0 && (
                  <div className="bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/10 flex flex-col">
                    <span className="text-[7px] font-black text-emerald-400 uppercase tracking-tighter">{UI_COMMON.YIELD_LABEL}</span>
                    <span className="text-xs md:text-sm font-black text-emerald-300">+{Math.round(cover.yieldValue * 100)}%</span>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => isOwned ? equipCover(cover.id) : handleBuyCover(cover.id)} 
              disabled={isActive || (!isOwned && !canAfford)} 
              className={`w-full py-4 rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                isActive ? 'bg-slate-800/50 text-slate-600 border border-white/5 cursor-not-allowed' : 
                isOwned ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:brightness-110' :
                canAfford ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:brightness-110' : 'bg-slate-800 text-slate-700 cursor-not-allowed'
              }`}
            >
              {isActive ? UI_COMMON.ACTIVE_LABEL : isOwned ? UI_COMMON.APPLY : UI_COMMON.BUY}
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col items-center space-y-4 md:space-y-6 shrink-0 py-4 relative z-50">
        <div className="text-center relative">
          <div className="absolute -inset-x-20 -inset-y-4 bg-orange-500/10 blur-3xl rounded-full opacity-50" />
          <h2 className="text-2xl md:text-5xl font-outfit font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-200 to-emerald-400 relative z-10">{UI_SHOP.TITLE}</h2>
          <p className="text-[8px] md:text-xs font-black text-slate-500 uppercase tracking-[0.4em] mt-2 opacity-60 relative z-10">{UI_SHOP.SUBTITLE}</p>
        </div>
        
        <div className="flex p-1 bg-slate-950/80 rounded-3xl border border-white/10 shadow-2xl w-full max-w-sm relative">
          <button 
            ref={jarTabRef}
            onClick={() => setSubTab('vessels')}
            className={`flex-1 py-3 px-3 rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 ${subTab === 'vessels' ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className="text-lg">🏺</span>
            <span>{UI_SHOP.TAB_VESSELS}</span>
          </button>
          
          <div className="flex-1 relative flex items-center justify-center">
            <button 
              onClick={() => setSubTab('covers')}
              className={`w-full py-3 px-3 rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 ${subTab === 'covers' ? 'bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <span className="text-lg">⚙️</span>
              <span>{UI_SHOP.TAB_COVERS}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pt-4 relative z-20">
        <div className="max-w-4xl mx-auto h-full">
          {renderGlossary()}
          {subTab === 'vessels' ? renderVesselList() : renderCoverList()}
        </div>
      </div>
    </div>
  );
};

export default ShopTab;
