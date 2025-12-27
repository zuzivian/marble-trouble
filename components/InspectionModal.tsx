
import React, { useRef } from 'react';
import { Marble, Jar } from '../types';
import { UI_MODAL, UI_COMMON } from '../data/uiTexts';
import { RARITY_COLORS } from '../data/constants';
import MarbleVisual from './MarbleVisual';
import MasterTooltip from './MasterTooltip';
import { useGame } from '../context/GameContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  marbles: Marble[];
  jar: Jar;
  totalYield: number;
  onSell: () => void;
}

const InspectionModal: React.FC<Props> = ({ isOpen, onClose, marbles, jar, totalYield, onSell }) => {
  const { gameState } = useGame();
  const sellBtnRef = useRef<HTMLButtonElement>(null);
  
  if (!isOpen) return null;

  const isFull = marbles.length >= jar.capacity;
  const yieldMultiplier = isFull ? totalYield * 1.2 : totalYield;
  const totalValue = marbles.reduce((acc, m) => acc + Math.floor(m.value * yieldMultiplier), 0);
  const resonanceShards = isFull ? Math.floor(totalValue - (totalValue / 1.2)) : 0;

  // Step 6 is explicitly "Consign All Marbles"
  const isTutorialConsigning = gameState.onboardingStep === 6;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glass w-full max-w-3xl max-h-[85vh] rounded-[2.5rem] flex flex-col border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Manifest Header */}
        <div className="flex justify-between items-center p-6 md:p-8 bg-white/[0.02] border-b border-white/5">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-xl md:text-3xl shadow-inner">
              {jar.icon}
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-outfit font-black uppercase tracking-tighter text-slate-100">{UI_MODAL.CHAMBER_TITLE}</h2>
              <div className="flex items-center space-x-2 mt-0.5">
                <p className="text-[8px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest">{jar.name}</p>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <p className="text-[8px] md:text-[11px] font-black text-blue-400 uppercase tracking-widest">{marbles.length} / {jar.capacity} Specimens</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 md:w-12 md:h-12 rounded-full glass hover:bg-white/10 transition-all active:scale-90 flex items-center justify-center text-lg md:text-xl border border-white/10"
          >
            {UI_COMMON.CLOSE}
          </button>
        </div>
        
        {/* Scrollable Inventory Grid */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-10 bg-black/20">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5">
            {marbles.map((m, idx) => {
              const adjustedValue = Math.floor(m.value * yieldMultiplier);
              return (
                <div 
                  key={m.id + idx} 
                  className="group flex flex-col items-center space-y-3 p-4 rounded-3xl transition-all duration-300 hover:scale-105 relative"
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
                      <MarbleVisual marble={m} size="sm" />
                    </div>
                  </div>
                  <div className="text-center w-full">
                    <p className={`text-[7px] md:text-[9px] font-black uppercase tracking-widest mb-0.5 ${RARITY_COLORS[m.rarity]}`}>
                      {m.rarity}
                    </p>
                    <h4 className="text-[9px] md:text-xs font-black text-slate-200 uppercase tracking-tight line-clamp-1 mb-2">
                      {m.name}
                    </h4>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 py-1 rounded-xl">
                      <p className="text-[8px] md:text-[10px] font-black text-emerald-400 tabular-nums">
                        {adjustedValue} {UI_COMMON.CURRENCY_SYMBOL}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {marbles.length === 0 && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center opacity-30">
                <span className="text-5xl md:text-7xl mb-4 grayscale">🫙</span>
                <p className="uppercase font-black tracking-[0.4em] text-xs md:text-base">{UI_MODAL.CHAMBER_EMPTY}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 md:p-8 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row items-center gap-4 relative">
          
          {isTutorialConsigning && (
            <MasterTooltip 
              message="A windfall awaits! Consign these specimens to the furnace for a 20% Resonance Bonus in Shards."
              position="top"
              anchorRef={sellBtnRef}
              wide
            />
          )}

          <div className="flex-grow flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-center md:text-left">
            <div>
              <p className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Estimated Yield</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-xl md:text-3xl font-black text-emerald-400 font-outfit leading-none tabular-nums">
                  {totalValue}
                </p>
                {isFull && (
                  <span className="text-[8px] md:text-[10px] font-black text-orange-400 uppercase animate-pulse">
                    (+{resonanceShards} Resonance)
                  </span>
                )}
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-white/5" />
            <p className="text-[8px] md:text-xs text-slate-400 italic max-w-xs leading-tight">
              {isFull 
                ? "Perfect Seal achieved! All specimens have reached maximum resonance value." 
                : "Consign specimens now, or fill the vessel to trigger a +20% Resonance Bonus."}
            </p>
          </div>
          
          <button 
            ref={sellBtnRef}
            onClick={onSell} 
            disabled={marbles.length === 0}
            className={`w-full md:w-auto px-8 md:px-12 py-4 md:py-5 rounded-[2rem] font-black uppercase text-[10px] md:text-sm tracking-widest transition-all shadow-xl active:scale-95 text-white flex items-center justify-center space-x-2 relative ${
              isTutorialConsigning ? 'ring-4 ring-emerald-500 animate-pulse' : ''
            } ${
              isFull 
                ? 'bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 shadow-orange-900/40' 
                : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:opacity-20'
            }`}
          >
            <span>{isFull ? '💎' : '🔥'}</span>
            <span>{isFull ? 'Resonate & Sell' : UI_MODAL.SELL_ACTION}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspectionModal;
