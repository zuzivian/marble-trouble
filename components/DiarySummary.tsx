
import React, { useState } from 'react';
import { DiaryEntry } from '../types';
import DiaryModal from './DiaryModal';

interface Props {
  entries: DiaryEntry[];
}

const DiarySummary: React.FC<Props> = ({ entries }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const latest = entries[0];

  if (!latest) return null;

  const formatDate = (ts: number) => {
    const date = new Date(ts);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                    date.getMonth() === now.getMonth() && 
                    date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="w-full h-full max-w-5xl mx-auto px-4 md:px-6 py-2 cursor-pointer group"
      >
        <div className="h-full glass rounded-3xl border border-white/5 flex items-center px-6 gap-4 group-hover:bg-white/5 group-hover:border-blue-500/30 transition-all duration-300">
          {/* Status Indicator */}
          <div className="relative shrink-0">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
             <div className="absolute inset-0 w-2 h-2 rounded-full bg-blue-400 animate-ping opacity-40" />
          </div>

          {/* Icon & Message */}
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-xl shrink-0 group-hover:scale-125 transition-transform">{latest.icon}</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">Scrolls of the Rites — {formatDate(latest.timestamp)}</span>
              <p className="text-[10px] md:text-sm font-medium text-slate-300 truncate tracking-tight italic">
                "{latest.message}"
              </p>
            </div>
          </div>

          {/* Hint */}
          <div className="ml-auto hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[8px] font-black uppercase text-blue-400 tracking-tighter">View Full Ledger</span>
            <span className="text-sm">📖</span>
          </div>
        </div>
      </div>

      <DiaryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        entries={entries} 
      />
    </>
  );
};

export default DiarySummary;
