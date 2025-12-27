
import React, { useState } from 'react';
import { DiaryEntry } from '../types';
import { UI_COMMON, UI_MODAL } from '../data/uiTexts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entries: DiaryEntry[];
}

const DiaryModal: React.FC<Props> = ({ isOpen, onClose, entries }) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  
  if (!isOpen) return null;

  const currentEntries = entries.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const formatDate = (ts: number) => {
    const date = new Date(ts);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                    date.getMonth() === now.getMonth() && 
                    date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }

    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEntryTypeColor = (type: DiaryEntry['type']) => {
    switch(type) {
      case 'catch': return 'text-blue-400';
      case 'sell': return 'text-emerald-400';
      case 'upgrade': return 'text-orange-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="glass-premium w-full max-w-md h-[480px] rounded-[2.5rem] border border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle background glow */}
        <div className="absolute -inset-20 opacity-10 blur-[100px] pointer-events-none bg-gradient-to-br from-blue-500 to-transparent" />

        {/* Header - Tighter padding */}
        <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between relative z-10 shrink-0">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-0.5">{UI_MODAL.DIARY_SUBTITLE}</span>
            <h2 className="text-lg md:text-2xl font-outfit font-black tracking-tighter uppercase text-slate-100 leading-none">{UI_MODAL.DIARY_LOG_NAME}</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full glass hover:bg-white/10 transition-all active:scale-90 flex items-center justify-center text-sm border border-white/10"
          >
            {UI_COMMON.CLOSE}
          </button>
        </div>

        {/* Entries List - Fixed height via flex-1 parent container */}
        <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-2 bg-black/20 relative z-10 custom-scrollbar">
          {currentEntries.map((entry) => (
            <div 
              key={entry.id} 
              className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/[0.06] transition-colors group animate-in slide-in-from-left-2 duration-300"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-black/40 flex items-center justify-center text-lg md:text-xl border border-white/5 group-hover:scale-110 transition-transform shadow-inner shrink-0">
                {entry.icon}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest ${getEntryTypeColor(entry.type)}`}>
                    {entry.type}
                  </span>
                  <span className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>
                <p className="text-[10px] md:text-xs text-slate-300 font-medium leading-snug italic">
                  "{entry.message}"
                </p>
              </div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
               <span className="text-4xl mb-2">✍️</span>
               <p className="font-black text-[10px] uppercase tracking-[0.4em]">Log Empty</p>
            </div>
          )}
        </div>

        {/* Pagination Footer - Tighter padding */}
        <div className="p-3 md:p-4 border-t border-white/10 flex items-center justify-between bg-white/[0.02] relative z-10 shrink-0">
           <button 
             disabled={page === 0}
             onClick={() => setPage(p => p - 1)}
             className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest hover:bg-white/10 disabled:opacity-20 transition-all active:scale-95"
           >
             Prev
           </button>
           
           <div className="flex flex-col items-center">
             <span className="text-[7px] font-black text-slate-600 uppercase tracking-tighter leading-none mb-0.5">Ledger Page</span>
             <span className="text-[10px] md:text-xs font-black text-slate-100">{page + 1} / {Math.max(1, totalPages)}</span>
           </div>

           <button 
             disabled={page >= totalPages - 1}
             onClick={() => setPage(p => p + 1)}
             className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest hover:bg-white/10 disabled:opacity-20 transition-all active:scale-95"
           >
             Next
           </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryModal;
