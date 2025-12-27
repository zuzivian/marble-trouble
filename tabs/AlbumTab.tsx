
import React, { useState } from 'react';
import { Marble, MarbleTemplate } from '../types';
import { MARBLE_DATABASE } from '../data/marbles';
import { RARITY_COLORS } from '../data/constants';
import { useGame } from '../context/GameContext';
import { UI_ALBUM } from '../data/uiTexts';
import MarbleVisual from '../components/MarbleVisual';
import MarbleInfoModal from '../components/MarbleInfoModal';

const AlbumTab: React.FC = () => {
  const { gameState } = useGame();
  const [selectedTemplate, setSelectedTemplate] = useState<MarbleTemplate | null>(null);

  const handleClose = () => setSelectedTemplate(null);

  return (
    <div className="flex flex-col h-full overflow-hidden px-2">
      <div className="flex flex-col items-center mb-6 md:mb-10 shrink-0 pt-4">
        <h2 className="text-2xl md:text-5xl font-outfit font-black tracking-tighter uppercase text-slate-100">{UI_ALBUM.TITLE}</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full mt-2" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-32">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5 max-w-5xl mx-auto px-2">
          {MARBLE_DATABASE.map(template => {
            const count = gameState.catchHistory[template.name] || 0;
            const isCaught = count > 0;
            return (
              <button 
                key={template.name} 
                onClick={() => setSelectedTemplate(template)}
                className={`group glass-premium p-4 md:p-6 rounded-3xl flex flex-col items-center space-y-3 md:space-y-4 border transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isCaught ? 'border-white/5 bg-white/5 hover:border-blue-500/30' : 'border-dashed border-white/5 grayscale opacity-40 hover:opacity-60'
                }`}
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <MarbleVisual marble={template as Marble} size="md" isSilhouette={!isCaught} />
                </div>
                
                <div className="text-center w-full">
                  <p className={`text-[7px] md:text-[9px] font-black uppercase tracking-widest mb-1 ${isCaught ? RARITY_COLORS[template.rarity] : 'text-slate-700'}`}>
                    {template.rarity}
                  </p>
                  <h3 className="font-black text-[10px] md:text-sm tracking-tight text-slate-200 uppercase truncate px-1">
                    {isCaught ? template.name : UI_ALBUM.UNKNOWN}
                  </h3>
                  
                  {isCaught && (
                    <div className="mt-2 py-1 px-2 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                        Collected: <span className="text-blue-400">{count}</span>
                      </p>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedTemplate && (
        <MarbleInfoModal 
          isOpen={true} 
          onClose={handleClose} 
          template={selectedTemplate} 
          count={gameState.catchHistory[selectedTemplate.name] || 0}
        />
      )}
    </div>
  );
};

export default AlbumTab;
