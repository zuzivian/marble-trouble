
import React, { useRef } from 'react';
import { GameState } from '../types';
import { JARS } from '../data/constants';
import { UI_HUD, UI_ONBOARDING } from '../data/uiTexts';
import MasterTooltip from './MasterTooltip';
import { useGame } from '../context/GameContext';

interface Props {
  gameState: GameState;
  timeLeft: number;
  isCatching: boolean;
  onRoll: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const ControlHUD: React.FC<Props> = ({ gameState, timeLeft, isCatching, onRoll, activeTab, setActiveTab }) => {
  const { markTooltipSeen, lastCaught } = useGame();
  const activeJarId = gameState.activeJarId;
  const activeJar = JARS[activeJarId] || JARS['lead_jar'];
  const activeMarbles = gameState.jarContents[activeJarId] || [];
  const isJarFull = activeMarbles.length >= activeJar.capacity;
  
  const rollBtnRef = useRef<HTMLButtonElement>(null);
  const shelfBtnRef = useRef<HTMLButtonElement>(null);
  const albumBtnRef = useRef<HTMLButtonElement>(null);
  const shopBtnRef = useRef<HTMLButtonElement>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Tang Progression: Gallery after 2nd roll, Catalog after 4th roll
  const isShelfUnlocked = gameState.totalCatches >= 2; 
  const isAlbumUnlocked = gameState.totalCatches >= 4; 
  const isShopUnlocked = gameState.onboardingStep >= 7;

  // Nudge Priority System to prevent overlapping
  const getNudge = () => {
    // 0. Disable all HUD tooltips if a capture reveal is active or onboarding is incomplete
    if (!gameState.hasCompletedOnboarding || lastCaught) return null;
    if (activeTab !== 'home') return null;

    // 1. Gallery Unlock (Priority 1)
    if (isShelfUnlocked && !gameState.seenTooltips.includes('shelf_hud')) {
      return { id: 'shelf_hud', message: UI_ONBOARDING.TUTORIAL_GALLERY_HUD, ref: shelfBtnRef, actionRequired: true };
    }
    
    // 2. Catalog Unlock (Priority 2) - Only show if Priority 1 is cleared
    if (isAlbumUnlocked && !gameState.seenTooltips.includes('album_hud')) {
      return { id: 'album_hud', message: UI_ONBOARDING.TUTORIAL_CATALOG_HUD, ref: albumBtnRef, actionRequired: true };
    }
    
    // 3. East Market Unlock (Priority 3)
    if (isShopUnlocked && gameState.currency >= 250 && gameState.onboardingStep === 7 && !gameState.seenTooltips.includes('shop_hud')) {
      return { id: 'shop_hud', message: UI_ONBOARDING.TUTORIAL_SHOP_HUD, ref: shopBtnRef, actionRequired: false };
    }

    // 4. Action: Roll Reminder (Only for very first few catches)
    if (gameState.totalCatches < 3 && timeLeft === 0 && !isCatching && !isJarFull) {
       return { id: 'roll_nudge', message: "Don't stop now, Aspirant! Bind more souls for the Emperor.", ref: rollBtnRef, actionRequired: true };
    }

    return null;
  };

  const currentNudge = getNudge();

  const handleTabClick = (tab: any) => {
    if (tab === 'jar' && !isShelfUnlocked) return;
    if (tab === 'album' && !isAlbumUnlocked) return;
    if (tab === 'shop' && !isShopUnlocked) return;

    if (currentNudge && currentNudge.id !== 'roll_nudge') {
      markTooltipSeen(currentNudge.id);
    }
    
    setActiveTab(tab);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 md:p-6 pb-2 md:pb-10 flex justify-center pointer-events-none h-[90px] md:h-[140px]">
      <div className="w-full max-w-2xl glass rounded-[2.5rem] p-1.5 flex items-center justify-between pointer-events-auto border border-amber-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
        
        <div className="flex-1 flex justify-around items-center">
          <button 
            onClick={() => handleTabClick('home')}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all active:scale-90 ${activeTab === 'home' ? 'text-amber-400 bg-amber-500/10' : 'text-amber-900/60 hover:text-amber-600'}`}
          >
            <span className="text-2xl md:text-4xl">🏠</span>
            <span className="hidden md:block text-[8px] font-black uppercase mt-1 tracking-tighter">{UI_HUD.WORKSHOP}</span>
          </button>
          
          <div className="relative">
            {currentNudge?.id === 'shelf_hud' && (
              <MasterTooltip message={currentNudge.message} position="top" anchorRef={shelfBtnRef} wide />
            )}
            <button 
              ref={shelfBtnRef}
              onClick={() => handleTabClick('jar')}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all active:scale-90 ${
                !isShelfUnlocked ? 'opacity-20 cursor-not-allowed grayscale' : 
                currentNudge?.id === 'shelf_hud' ? 'ring-2 ring-amber-500 animate-pulse bg-amber-500/10' : ''
              } ${activeTab === 'jar' ? 'text-amber-400 bg-amber-500/10' : 'text-amber-900/60 hover:text-amber-600'}`}
            >
              <span className="text-2xl md:text-4xl">🏺</span>
              <span className="hidden md:block text-[8px] font-black uppercase mt-1 tracking-tighter">{UI_HUD.SHELF}</span>
            </button>
          </div>
        </div>

        <div className="relative -top-5 md:-top-12 px-4 shrink-0 flex items-center justify-center">
          {currentNudge?.id === 'roll_nudge' && (
            <MasterTooltip message={currentNudge.message} position="top" anchorRef={rollBtnRef} wide />
          )}

          <button
            ref={rollBtnRef}
            onClick={onRoll}
            disabled={(!isJarFull && timeLeft > 0) || isCatching}
            className={`group relative w-16 h-16 md:w-28 md:h-28 rounded-full transition-all duration-300 transform active:scale-95 ${
              isJarFull ? 'scale-100 animate-vibrate' :
              timeLeft === 0 && !isCatching ? 'scale-110' : 'grayscale opacity-60'
            } ${currentNudge?.id === 'roll_nudge' ? 'ring-4 ring-amber-500 ring-offset-4 ring-offset-red-950 animate-pulse' : ''}`}
          >
            <div className={`absolute -inset-3 md:-inset-8 rounded-full blur-xl md:blur-[50px] transition-opacity duration-500 ${
              isJarFull ? 'bg-red-600/60 opacity-100' :
              timeLeft === 0 && !isCatching ? 'bg-amber-600/40 opacity-100 animate-pulse' : 'bg-transparent opacity-0'
            }`} />
            <div className={`relative w-full h-full rounded-full border-[3px] md:border-[5px] flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-500 ${
              isJarFull ? 'bg-black border-red-500' :
              timeLeft === 0 && !isCatching 
                ? 'bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 border-amber-200/50' 
                : 'bg-red-950/80 border-amber-900/30'
            }`}>
              {isCatching ? (
                <div className="w-7 h-7 md:w-10 md:h-10 border-2 md:border-4 border-white/20 border-t-amber-400 rounded-full animate-spin" />
              ) : isJarFull ? (
                <div className="flex flex-col items-center">
                  <span className="text-[10px] md:text-sm font-black text-red-500 leading-none">{UI_HUD.FULL}</span>
                  <span className="text-[6px] md:text-[8px] font-black text-red-400 uppercase tracking-tighter mt-1 animate-pulse">Imperial!</span>
                </div>
              ) : timeLeft === 0 ? (
                <div className="text-3xl md:text-5xl drop-shadow-lg">✨</div>
              ) : (
                <span className="text-[12px] md:text-xl font-black text-amber-100 font-outfit tabular-nums">{formatTime(timeLeft)}</span>
              )}
            </div>
          </button>
        </div>

        <div className="flex-1 flex justify-around items-center">
          <div className="relative">
            {currentNudge?.id === 'album_hud' && (
              <MasterTooltip message={currentNudge.message} position="top" anchorRef={albumBtnRef} wide />
            )}
            <button 
              ref={albumBtnRef}
              onClick={() => handleTabClick('album')}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all active:scale-90 ${
                !isAlbumUnlocked ? 'opacity-20 cursor-not-allowed grayscale' : 
                currentNudge?.id === 'album_hud' ? 'ring-2 ring-amber-500 animate-pulse bg-amber-500/10' : ''
              } ${activeTab === 'album' ? 'text-amber-400 bg-amber-500/10' : 'text-amber-900/60 hover:text-amber-600'}`}
            >
              <span className="text-2xl md:text-4xl">📖</span>
              <span className="hidden md:block text-[8px] font-black uppercase mt-1 tracking-tighter">{UI_HUD.ALBUM}</span>
            </button>
          </div>

          <div className="relative">
            {currentNudge?.id === 'shop_hud' && (
              <MasterTooltip message={currentNudge.message} position="top" anchorRef={shopBtnRef} wide onOk={() => markTooltipSeen('shop_hud')} />
            )}
            <button 
              ref={shopBtnRef}
              onClick={() => handleTabClick('shop')}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all active:scale-90 ${
                !isShopUnlocked ? 'opacity-20 cursor-not-allowed grayscale' : 
                currentNudge?.id === 'shop_hud' ? 'ring-2 ring-amber-500 animate-pulse bg-amber-500/10' : ''
              } ${activeTab === 'shop' ? 'text-amber-400 bg-amber-500/10' : 'text-amber-900/60 hover:text-amber-600'}`}
            >
              <span className="text-2xl md:text-4xl">🛒</span>
              <span className="hidden md:block text-[8px] font-black uppercase mt-1 tracking-tighter">{UI_HUD.SHOP}</span>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ControlHUD;
