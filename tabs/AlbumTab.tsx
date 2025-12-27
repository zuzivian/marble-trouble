
import React, { useState, useRef } from 'react';
import { Marble, MarbleTemplate } from '../types';
import { MARBLE_DATABASE } from '../data/marbles';
import { LOCATIONS } from '../data/config';
import { RARITY_COLORS } from '../data/constants';
import { useGame } from '../context/GameContext';
import { UI_ALBUM, UI_ONBOARDING } from '../data/uiTexts';
import MarbleVisual from '../components/MarbleVisual';
import MarbleInfoModal from '../components/MarbleInfoModal';
import MasterTooltip from '../components/MasterTooltip';

const AlbumTab: React.FC = () => {
  const { gameState, markTooltipSeen } = useGame();
  const [selectedTemplate, setSelectedTemplate] = useState<MarbleTemplate | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handleClose = () => setSelectedTemplate(null);

  const showExplanation = gameState.seenTooltips.includes('album_hud') && !gameState.seenTooltips.includes('album_tab');

  return (
    <div className="flex flex-col h-full overflow-hidden px-2">
      <div className="flex flex-col items-center mb-6 md:mb-10 shrink-0 pt-4 relative">
        <h2 ref={titleRef} className="text-2xl md:text-5xl font-outfit font-black tracking-tighter uppercase text-slate-100">{UI_ALBUM.TITLE}</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full mt-2" />
        
        {showExplanation && (
          <MasterTooltip 
            message={UI_ONBOARDING.TUTORIAL_CATALOG_TAB}
            position="bottom"
            anchorRef={titleRef}
            wide
            onOk={() => markTooltipSeen('album_tab')}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-32">
        <div className="max-w-5xl mx-auto space-y-12">
          {LOCATIONS.map(location => {
            const locationMarbles = MARBLE_DATABASE.filter(m => m.locations?.includes(location.id));
            if (locationMarbles.length === 0) return null;

            return (
              <div key={location.id} className="space-y-6">
                <div className="flex items-center space-x-4 px-2">
                  <span className="text-3xl">{location.icon}</span>
                  <div>
                    <h3 className="text-xl font-black font-outfit uppercase text-slate-100 tracking-tight leading-none">{location.name}</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Archive Segment</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-4 px-2">
                  {locationMarbles.map(template => {
                    const count = gameState.catchHistory[template.name] || 0;
                    const isCaught = count > 0;
                    return (
                      <button 
                        key={`${location.id}-${template.name}`} 
                        onClick={() => setSelectedTemplate(template)}
                        className={`group glass p-2 md:p-3 rounded-2xl flex flex-col items-center space-y-2 border transition-all duration-300 hover:scale-105 active:scale-95 ${
                          isCaught ? 'border-white/5 bg-white/5 hover:border-blue-500/30' : 'border-dashed border-white/5 grayscale opacity-40 hover:opacity-60'
                        }`}
                      >
                        <div className="relative">
                          <div className="scale-75 md:scale-90 drop-shadow-md">
                            <MarbleVisual marble={template as Marble} size="sm" isSilhouette={!isCaught} />
                          </div>
                        </div>
                        
                        <div className="text-center w-full">
                          <h3 className="font-black text-[7px] md:text-[9px] tracking-tight text-slate-200 uppercase truncate px-1">
                            {isCaught ? template.name : UI_ALBUM.UNKNOWN}
                          </h3>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
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
