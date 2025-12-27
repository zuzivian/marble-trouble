
import React from 'react';
import { Marble, MarbleTemplate, Rarity } from '../types';
import { UI_COMMON } from '../data/uiTexts';
import { RARITY_COLORS } from '../data/constants';
import MarbleVisual from './MarbleVisual';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  template: MarbleTemplate;
  count: number;
}

const MarbleInfoModal: React.FC<Props> = ({ isOpen, onClose, template, count }) => {
  if (!isOpen) return null;

  const isCaught = count > 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
      <div 
        className="glass-premium w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-white/[0.03] border-b border-white/5 p-6 md:p-10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-1 ${isCaught ? RARITY_COLORS[template.rarity] : 'text-slate-600'}`}>
              {template.rarity} Classification
            </span>
            <h2 className="text-2xl md:text-4xl font-outfit font-black tracking-tighter uppercase text-slate-100">
              {isCaught ? template.name : 'Unknown Specimen'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 md:w-14 md:h-14 rounded-full glass hover:bg-white/10 transition-all active:scale-90 flex items-center justify-center text-xl border border-white/10"
          >
            {UI_COMMON.CLOSE}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-10 space-y-8 flex flex-col items-center">
          {/* Hero Display */}
          <div className="relative group">
            <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="scale-125 md:scale-150 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
              <MarbleVisual marble={template as Marble} size="lg" isSilhouette={!isCaught} />
            </div>
          </div>

          {/* Lore Section */}
          <div className="w-full text-center">
             <div className="inline-block px-3 py-1 bg-white/5 rounded-full border border-white/5 mb-4">
                <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Workshop Log entry</span>
             </div>
             <p className="text-slate-300 italic text-sm md:text-xl leading-relaxed px-4">
               {isCaught ? `"${template.description}"` : '"This glass remains elusive. Its properties are hidden within the furnace heat."'}
             </p>
          </div>

          {/* Technical Specs Grid */}
          <div className="w-full grid grid-cols-3 gap-4">
            <div className="bg-black/20 p-4 rounded-3xl border border-white/5 flex flex-col items-center text-center">
              <span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Base Value</span>
              <span className="text-sm md:text-lg font-black text-emerald-400 font-outfit">
                {isCaught ? template.value : '???'}
              </span>
            </div>
            <div className="bg-black/20 p-4 rounded-3xl border border-white/5 flex flex-col items-center text-center">
              <span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Pattern</span>
              <span className="text-sm md:text-lg font-black text-blue-400 font-outfit uppercase tracking-tighter">
                {isCaught ? template.pattern : '???'}
              </span>
            </div>
            <div className="bg-black/20 p-4 rounded-3xl border border-white/5 flex flex-col items-center text-center">
              <span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Caught</span>
              <span className="text-sm md:text-lg font-black text-slate-300 font-outfit">
                {count}x
              </span>
            </div>
          </div>
        </div>

        {/* Footer Insight */}
        <div className="p-6 md:p-8 bg-black/40 border-t border-white/5 flex items-center justify-center space-x-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            {isCaught ? 'Full Spectrum Analysis Complete' : 'Awaiting Physical Specimen for Analysis'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarbleInfoModal;
