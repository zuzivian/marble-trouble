
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import MarbleMaster from '../components/MarbleMaster';
import TrapVisual from '../components/TrapVisual';
import MechanicalChamber from '../components/MechanicalChamber';
import InspectionModal from '../components/InspectionModal';
import CatchRevealModal from '../components/CatchRevealModal';
import DiarySummary from '../components/DiarySummary';
import { UI_COMMON } from '../data/uiTexts';

// Static asset for the workshop background
const STATIC_WORKSHOP_BG = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=2000';

const HomeTab: React.FC = () => {
  const {
    advice,
    isCatching,
    activeCover,
    activeJar,
    activeMarbles,
    totalLuck,
    totalYield,
    lastCaught,
    clearLastCaught,
    sellJarContents,
    gameState,
    advanceOnboarding
  } = useGame();

  const [isInspecting, setIsInspecting] = useState(false);

  const handleOpenInspection = () => {
    if (gameState.onboardingStep === 5) {
      advanceOnboarding(6);
    }
    setIsInspecting(true);
  };

  // Determine attraction quality for UI feedback
  const getAttractionColor = () => {
    if (totalLuck > 50) return 'text-amber-400';
    if (totalLuck > 25) return 'text-blue-400';
    return 'text-slate-400';
  };

  const getAttractionGlow = () => {
    if (totalLuck > 50) return 'border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]';
    if (totalLuck > 25) return 'border-blue-500/50';
    return 'border-white/5';
  };

  return (
    <div className="flex flex-col items-center justify-start h-full space-y-1.5 md:space-y-4 animate-in fade-in duration-500 pb-[85px] md:pb-[140px] overflow-hidden">
      {/* Top Banner Message */}
      <div className="w-full shrink-0">
        <MarbleMaster message={advice} />
      </div>
      
      {/* Main Area - Centered and Wide */}
      <div className="w-full max-w-5xl flex-1 flex flex-col items-stretch justify-center px-4 md:px-6 overflow-hidden min-h-0">
        
        {/* CONSOLIDATED WORKSHOP BOX */}
        <div className="glass relative overflow-hidden rounded-[2.5rem] border-white/10 shadow-2xl min-h-0 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] md:grid-rows-[1fr_1fr] h-full">
          
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none z-[1]" />
          
          {/* 1. LEFT SIDE: Visual Stage - Background localized here, trap centred with lower offset */}
          <div className="md:col-start-1 md:row-span-2 flex items-center justify-center p-4 md:p-12 border-b md:border-b-0 md:border-r border-white/5 bg-black/80 relative overflow-hidden z-[2]">
            
            {/* Static Workshop Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img 
                src={STATIC_WORKSHOP_BG} 
                alt="Workshop Background" 
                className="w-full h-full object-cover opacity-60 brightness-[0.4] contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-transparent to-slate-900/40" />
            </div>

            {/* Trap scaling logic: Mobile/Tablet +20% (scale-1.2), PC -20% (scale-0.8) */}
            <div className="scale-[1.2] sm:scale-[1.2] md:scale-[1.2] lg:scale-[0.8] xl:scale-[0.8] transform-gpu transition-all duration-700 ease-out flex items-center justify-center w-full h-full min-h-[300px] md:min-h-0 translate-y-8 md:translate-y-12 relative z-10">
              <TrapVisual coverId={activeCover.id} jarIcon={activeJar.icon} isCatching={isCatching} />
            </div>
            
            {/* Visual floor glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-900/40 to-transparent pointer-events-none z-[5]" />
          </div>

          {/* 2. TOP RIGHT: Specs & Calibration - Titles Swapped (Jar as primary) */}
          <div className="md:col-start-2 md:row-start-1 flex flex-col p-4 md:p-10 border-b border-white/5 bg-white/[0.02] backdrop-blur-md min-h-0 overflow-hidden relative z-[2]">
            <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 pointer-events-none hidden md:block">
              <span className="text-[60px] md:text-[100px] font-black leading-none">⚙️</span>
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              {/* Identification Area */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-1 md:w-1.5 h-4 md:h-6 bg-blue-500 rounded-full" />
                  <h2 className="text-[14px] md:text-2xl lg:text-3xl font-black font-outfit uppercase text-slate-100 tracking-tighter leading-none">
                    {activeJar.name}
                  </h2>
                </div>
                <p className="text-slate-500 text-[9px] md:text-sm lg:text-base font-black uppercase tracking-[0.2em] ml-3 md:ml-4">
                  {activeCover.name}
                </p>
              </div>
              
              {/* Technical Spec Grid */}
              <div className="grid grid-cols-2 gap-4 mt-auto">
                 <div className={`flex flex-col border-l-2 pl-3 md:pl-4 py-1 transition-all duration-500 ${getAttractionGlow()}`}>
                    <span className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                      {UI_COMMON.LUCK_LABEL}
                    </span>
                    <div className="flex items-baseline space-x-1">
                      <span className={`text-[12px] md:text-xl lg:text-3xl font-black font-outfit leading-none ${getAttractionColor()}`}>
                        +{totalLuck}
                      </span>
                    </div>
                 </div>

                 <div className="flex flex-col border-l-2 border-emerald-500/30 pl-3 md:pl-4 py-1">
                    <span className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                      {UI_COMMON.YIELD_LABEL}
                    </span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-[12px] md:text-xl lg:text-3xl font-black text-emerald-400 font-outfit leading-none">
                        x{totalYield.toFixed(1)}
                      </span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* 3. BOTTOM RIGHT: Isolation Vault */}
          <div className="md:col-start-2 md:row-start-2 p-3 md:p-8 min-h-0 flex flex-col overflow-visible bg-black/40 backdrop-blur-md z-[2] relative">
            <MechanicalChamber 
              marbles={activeMarbles} 
              capacity={activeJar.capacity} 
              onInspect={handleOpenInspection} 
            />
          </div>
        </div>
      </div>

      {/* Workshop Log (Diary) */}
      <div className="w-full shrink-0 h-[60px] md:h-[80px]">
        <DiarySummary entries={gameState.diaryEntries} />
      </div>

      <InspectionModal 
        isOpen={isInspecting}
        onClose={() => setIsInspecting(false)}
        marbles={activeMarbles}
        jar={activeJar}
        totalYield={totalYield}
        onSell={() => {
          sellJarContents(gameState.activeJarId);
          setIsInspecting(false);
        }}
      />

      {/* Catch Reveal Pop-up */}
      {gameState.hasCompletedOnboarding && (
        <CatchRevealModal 
          marble={lastCaught} 
          onDismiss={clearLastCaught} 
        />
      )}
    </div>
  );
};

export default HomeTab;
