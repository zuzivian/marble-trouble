
import React, { useRef } from 'react';
import { Marble } from '../types';
import { UI_HOME } from '../data/uiTexts';
import { RARITY_COLORS } from '../data/constants';
import MarbleVisual from './MarbleVisual';
import MasterTooltip from './MasterTooltip';
import { useGame } from '../context/GameContext';

interface Props {
  outcome: { type: 'catch' | 'escape'; marble: Marble } | null;
  onDismiss: () => void;
}

const CatchRevealModal: React.FC<Props> = ({ outcome, onDismiss }) => {
  const { gameState, markTooltipSeen } = useGame();
  const cardRef = useRef<HTMLDivElement>(null);

  if (!outcome) return null;

  const { type, marble } = outcome;
  const isCaughtOnce = (gameState.catchHistory[marble.name] || 0) > 0;
  const showNudge = type === 'catch' && !gameState.seenTooltips.includes('reveal_mechanic_once');

  const handleConfirm = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (showNudge) {
      markTooltipSeen('reveal_mechanic_once');
    }
    onDismiss();
  };

  const isSuccess = type === 'catch';

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
      onClick={() => handleConfirm()}
    >
      <div 
        ref={cardRef}
        className="glass-premium w-full max-w-md rounded-[3rem] p-10 md:p-14 border-2 border-amber-500/40 shadow-[0_0_100px_rgba(0,0,0,0.95)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-12 duration-500 flex flex-col items-center text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`absolute -inset-20 opacity-30 blur-[120px] pointer-events-none bg-gradient-to-br ${isSuccess ? 'from-amber-400' : 'from-red-600'} to-transparent`} />
        
        <span className={`text-[11px] md:text-sm font-black uppercase tracking-[0.5em] mb-8 animate-pulse ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
          {isSuccess ? UI_HOME.CATCH_REVEAL_HEADER : "Specimen Escaped"}
        </span>

        {/* The Marble Showcase */}
        <div className="relative mb-10 group">
          <div className={`absolute -inset-14 ${isSuccess ? 'bg-amber-400/10' : 'bg-red-600/10'} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="scale-[2.0] md:scale-[3.0] drop-shadow-[0_25px_50px_rgba(0,0,0,0.7)] animate-float">
            <MarbleVisual marble={marble} size="md" isSilhouette={!isCaughtOnce && !isSuccess} />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3 mt-6">
          <p className={`text-sm md:text-xl font-black uppercase tracking-[0.2em] ${isSuccess || isCaughtOnce ? RARITY_COLORS[marble.rarity] : 'text-slate-600'}`}>
            {isSuccess || isCaughtOnce ? marble.rarity : "???"}
          </p>
          <h3 className="text-3xl md:text-5xl font-black font-outfit tracking-tighter text-slate-100 uppercase drop-shadow-md">
            {isSuccess || isCaughtOnce ? marble.name : "Unknown Essence"}
          </h3>
          <div className="max-w-[300px] mx-auto pt-6">
            <p className="text-xs md:text-base text-slate-300 italic leading-relaxed font-medium">
              {isSuccess 
                ? `"${marble.description}"` 
                : isCaughtOnce 
                  ? `"${marble.name} slipped through the Mandate's grasp. Its spirit remains free."`
                  : `"An unidentified specimen resisted your seal. Strengthen your Mandate to bind such elusive glass."`}
            </p>
          </div>
        </div>

        {showNudge && (
          <MasterTooltip 
            message={`This spirit is now among your Bound Minions. You can audit your collection in the Outpost vault.`}
            position="bottom"
            anchorRef={cardRef}
            wide
            onOk={() => handleConfirm()}
          />
        )}

        <button 
          onClick={handleConfirm}
          className={`mt-12 px-14 py-4 ${isSuccess ? 'bg-amber-600 hover:bg-amber-500' : 'bg-red-950 hover:bg-red-900'} text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-2xl border border-white/20 text-[11px] md:text-sm`}
        >
          {isSuccess ? "Confirm Binding" : "Return to Outpost"}
        </button>
      </div>
    </div>
  );
};

export default CatchRevealModal;
