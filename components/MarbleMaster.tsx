
import React from 'react';
import { UI_HOME } from '../data/uiTexts';

interface Props {
  message: string;
}

const MarbleMaster: React.FC<Props> = ({ message }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-1 md:py-2">
      <div className="flex items-center glass px-3 py-1.5 md:p-4 rounded-3xl border-amber-900/20 shadow-lg gap-3">
        {/* Small Avatar */}
        <div className="shrink-0 scale-75 md:scale-100">
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-red-700 to-amber-900 border border-amber-500/20 flex items-center justify-center text-lg md:text-2xl shadow-inner">
            🧙‍♂️
          </div>
        </div>

        {/* Text Content */}
        <div className="min-w-0 flex-grow">
          <p className="text-[9px] md:text-sm font-bold text-amber-100 leading-tight italic truncate">
            "{message}"
          </p>
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 rounded-full bg-amber-500" />
            <span className="text-[6px] md:text-[8px] font-black uppercase text-amber-600 opacity-60">{UI_HOME.MASTER_ROLE}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarbleMaster;
