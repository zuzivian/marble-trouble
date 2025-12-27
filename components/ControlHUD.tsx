
import React, { useRef } from 'react';
import { GameState } from '../types';
import { JARS } from '../data/constants';
import { UI_HUD, UI_ONBOARDING } from '../data/uiTexts';
import { getRankData } from '../data/config';
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
  const { markTooltipSeen, lastOutcome } = useGame();
  const activeJarId = gameState.activeJarId;
  const activeJar = JARS[activeJarId] || JARS['lead_jar'];
  const activeMarbles = gameState.jarContents[activeJarId] || [];
  const isJarFull = activeMarbles.length >= activeJar.capacity;
  
  const rollBtnRef = useRef<HTMLButtonElement>(null);
  const shelfBtnRef = useRef<HTMLButtonElement>(null);
  const albumBtnRef = useRef<HTMLButtonElement>(null);
  const shopBtnRef = useRef<HTMLButtonElement>(null);
  const homeBtnRef = useRef<HTMLButtonElement>(null);
  const travelBtnRef = useRef<HTMLButtonElement>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isShelfUnlocked = gameState.totalCatches >= 2; 
  const isAlbumUnlocked = gameState.totalCatches >= 4; 
  const isShopUnlocked = gameState.currency >= 250 || gameState.seenTooltips.includes('shop_hud');
  const isTutorialFullyOver = gameState.seenTooltips.includes('tutorial_final');
  const isPostTutorial = gameState.onboardingStep >= 10 && isTutorialFullyOver;

  const currentRank = getRankData(gameState.xp).rank;
  const isDistrictMagistrate = currentRank <= 7; // Virtual rank 7 is District Magistrate
  const hasSeenTravelNudge = gameState.seenTooltips.includes('travel_nudge_magistrate');

  const hasSeenShelfIntro = gameState.seenTooltips.includes('shelf_hud');
  const hasSeenAlbumIntro = gameState.seenTooltips.includes('album_hud');
  const hasSeenShopIntro = gameState.seenTooltips.includes('shop_hud');

  const getNudge = () => {
    if (!gameState.hasCompletedOnboarding || lastOutcome) return null;
    if (isJarFull && activeTab !== 'home') {
      return { id: 'jar_full_nudge', message: "Vessel Full! Return to the Outpost to consign your haul.", ref: homeBtnRef, actionRequired: true };
    }
    if (activeTab !== 'home') return null;
    
    // Magistrate Travel Nudge
    if (isDistrictMagistrate && !hasSeenTravelNudge && gameState.currentLocationId === 'outskirts') {
      return { id: 'travel_nudge_magistrate', message: "Aspirant! Your standing is high enough to enter the Imperial Palace Grounds. Seek the Palace Road.", ref: travelBtnRef, actionRequired: true };
    }

    if (gameState.onboardingStep === 10 && !isTutorialFullyOver) {
       return { id: 'tutorial_final', message: UI_ONBOARDING.TUTORIAL_FINAL, ref: rollBtnRef, actionRequired: true };
    }
    if (isShelfUnlocked && !hasSeenShelfIntro) {
      return { id: 'shelf_hud', message: UI_ONBOARDING.TUTORIAL_GALLERY_HUD, ref: shelfBtnRef, actionRequired: true };
    }
    if (isAlbumUnlocked && !hasSeenAlbumIntro) {
      return { id: 'album_hud', message: UI_ONBOARDING.TUTORIAL_CATALOG_HUD, ref: albumBtnRef, actionRequired: true };
    }
    if (isShopUnlocked && !hasSeenShopIntro) {
      return { id: 'shop_hud', message: UI_ONBOARDING.TUTORIAL_SHOP_HUD, ref: shopBtnRef, actionRequired: false };
    }
    if (gameState.totalCatches < 3 && timeLeft === 0 && !isCatching && !isJarFull) {
       return { id: 'roll_nudge', message: "Don't stop now, Aspirant! Bind more enchanted marbles for the Emperor.", ref: rollBtnRef, actionRequired: true };
    }
    return null;
  };

  const currentNudge = getNudge();

  const handleTabClick = (tab: any) => {
    if (tab === 'jar' && !isShelfUnlocked) return;
    if (tab === 'album' && !isAlbumUnlocked) return;
    if (tab === 'shop' && !isShopUnlocked) return;
    if (currentNudge && currentNudge.id !== 'roll_nudge' && currentNudge.id !== 'tutorial_final' && currentNudge.id !== 'jar_full_nudge') {
      markTooltipSeen(currentNudge.id);
    }
    setActiveTab(tab);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 md:p-6 pb-2 md:pb-10 flex justify-center pointer-events-none h-[110px] md:h-[140px]">
      <div className="w-full max-w-3xl glass rounded-[2.5rem] p-1.5 flex items-center justify-between pointer-events-auto border-2 border-amber-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative">
        <div className="flex-1 flex justify-around items-center">
          <div className="relative">
            {currentNudge?.id === 'jar_full_nudge' && (
              <MasterTooltip message={currentNudge.message} position="top" anchorRef={homeBtnRef} wide />
            )}
            <button ref={homeBtnRef} onClick={() => handleTabClick('home')} className={`flex flex-col items-center p-2 md:p-3 rounded-2xl transition-all active:scale-90 ${activeTab === 'home' ? 'text-amber-400 bg-amber-500/20' : 'text-amber-900/80 hover:text-amber-600'}`}>
              <span className="text-xl md:text-4xl">🏠</span>
              <span className="hidden md:block text-[8px] font-black uppercase mt-1 tracking-tighter">{UI_HUD.WORKSHOP}</span>
            </button>
          </div>
          {isShelfUnlocked && (
            <div className="relative">
              {currentNudge?.id === 'shelf_hud' && (
                <MasterTooltip message={currentNudge.message} position="top" anchorRef={shelfBtnRef} wide />
              )}
              <button ref={shelfBtnRef} onClick={() => handleTabClick('jar')} className={`flex flex-col items-center p-2 md:p-3 rounded-2xl transition-all active:scale-90 ${currentNudge?.id === 'shelf_hud' ? 'ring-2 ring-amber-500 animate-pulse bg-amber-500/10' : ''} ${activeTab === 'jar' ? 'text-amber-400 bg-amber-500/20' : 'text-amber-900/80 hover:text-amber-600'}`}>
                <span className="text-xl md:text-4xl">🏺</span>
                <span className="hidden md:block text-[8px] font-black uppercase mt-1 tracking-tighter">{UI_HUD.SHELF}</span>
              </button>
            </div>
          )}
          {isPostTutorial && (
            <div className="relative">
              {currentNudge?.id === 'travel_nudge_magistrate' && (
                <MasterTooltip message={currentNudge.message} position="top" anchorRef={travelBtnRef} wide onOk={() => markTooltipSeen('travel_nudge_magistrate')} />
              )}
              <button ref={travelBtnRef} onClick={() => handleTabClick('travel')} className={`flex flex-col items-center p-2 md:p-3 rounded-2xl transition-all active:scale-90 ${activeTab === 'travel' ? 'text-amber-400 bg-amber-500/20' : 'text-amber-900/80 hover:text-amber-600'} ${currentNudge?.id === 'travel_nudge_magistrate' ? 'ring-2 ring-blue-500 animate-pulse' : ''}`}>
                <span className="text-xl md:text-3xl">🧭</span>
                <span className="hidden md:block text-[8px] font-black uppercase mt-1 tracking-tighter">{UI_HUD.TRAVEL}</span>
              </button>
            </div>
          )}
        </div>
        <div className="relative -top-5 md:-top-14 px-4 shrink-0 flex items-center justify-center">
          {(currentNudge?.id === 'roll_nudge' || currentNudge?.id === 'tutorial_final') && (
            <MasterTooltip message={currentNudge.message} position="top" anchorRef={rollBtnRef} wide onOk={currentNudge.id === 'tutorial_final' ? () => markTooltipSeen('tutorial_final') : undefined} />
          )}
          <button ref={rollBtnRef} onClick={onRoll} disabled={(!isJarFull && timeLeft > 0) || isCatching} className={`group relative w-16 h-16 md:w-32 md:h-32 rounded-full transition-all duration-300 transform active:scale-95 ${isJarFull ? 'scale-100 animate-vibrate' : timeLeft === 0 && !isCatching ? 'scale-110' : 'grayscale opacity-60'} ${(currentNudge?.id === 'roll_nudge' || currentNudge?.id === 'tutorial_final') ? 'ring-4 ring-amber-500 ring-offset-4 ring-offset-red-950 animate-pulse' : ''}`}>
            <div className={`absolute -inset-3 md:-inset-10 rounded-full blur-xl md:blur-[60px] transition-opacity duration-500 ${isJarFull ? 'bg-red-600/70 opacity-100' : timeLeft === 0 && !isCatching ? 'bg-amber-500/50 opacity-100 animate-pulse' : 'bg-transparent opacity-0'}`} />
            <div className={`relative w-full h-full rounded-full border-[3px] md:border-[6px] flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-500 ${isJarFull ? 'bg-black border-red-500' : timeLeft === 0 && !isCatching ? 'bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 border-amber-200' : 'bg-red-950/90 border-amber-900/40'}`}>
              {isCatching ? (
                <div className="w-8 h-8 md:w-14 md:h-14 border-4 border-white/20 border-t-amber-400 rounded-full animate-spin" />
              ) : isJarFull ? (
                <div className="flex flex-col items-center text-center">
                  <span className="text-[10px] md:text-xs font-black text-red-500 leading-none">{UI_HUD.FULL}</span>
                </div>
              ) : timeLeft === 0 ? (
                <div className="text-4xl md:text-6xl drop-shadow-2xl animate-pulse">✨</div>
              ) : (
                <span className="text-[14px] md:text-2xl font-black text-amber-500 font-outfit tabular-nums">{formatTime(timeLeft)}</span>
              )}
            </div>
          </button>
        </div>
        <div className="flex-1 flex justify-around items-center">
          {isAlbumUnlocked && (
            <div className="relative">
              {currentNudge?.id === 'album_hud' && (
                <MasterTooltip message={currentNudge.message} position="top" anchorRef={albumBtnRef} wide />
              )}
              <button ref={albumBtnRef} onClick={() => handleTabClick('album')} className={`flex flex-col items-center p-2 md:p-3 rounded-2xl transition-all active:scale-90 ${currentNudge?.id === 'album_hud' ? 'ring-2 ring-amber-500 animate-pulse bg-amber-500/10' : ''} ${activeTab === 'album' ? 'text-amber-400 bg-amber-500/20' : 'text-amber-900/80 hover:text-amber-600'}`}>
                <span className="text-xl md:text-4xl">📖</span>
                <span className="hidden md:block text-[8px] font-black uppercase mt-1 tracking-tighter">{UI_HUD.ALBUM}</span>
              </button>
            </div>
          )}
          {isShopUnlocked && (
            <div className="relative">
              {currentNudge?.id === 'shop_hud' && (
                <MasterTooltip message={currentNudge.message} position="top" anchorRef={shopBtnRef} wide onOk={() => markTooltipSeen('shop_hud')} />
              )}
              <button ref={shopBtnRef} onClick={() => handleTabClick('shop')} className={`flex flex-col items-center p-2 md:p-3 rounded-2xl transition-all active:scale-90 ${currentNudge?.id === 'shop_hud' ? 'ring-2 ring-amber-500 animate-pulse bg-amber-500/10' : ''} ${activeTab === 'shop' ? 'text-amber-400 bg-amber-500/20' : 'text-amber-900/80 hover:text-amber-600'}`}>
                <span className="text-xl md:text-4xl">🛒</span>
                <span className="hidden md:block text-[8px] font-black uppercase mt-1 tracking-tighter">{UI_HUD.SHOP}</span>
              </button>
            </div>
          )}
          {isPostTutorial && (
            <>
              <button onClick={() => handleTabClick('achievements')} className={`flex flex-col items-center p-2 md:p-3 rounded-2xl transition-all active:scale-90 ${activeTab === 'achievements' ? 'text-amber-400 bg-amber-500/20' : 'text-amber-900/80 hover:text-amber-600'}`}>
                <span className="text-xl md:text-3xl">🏆</span>
                <span className="hidden md:block text-[8px] font-black uppercase mt-1 tracking-tighter">{UI_HUD.ACHIEVEMENTS}</span>
              </button>
              <button onClick={() => handleTabClick('settings')} className={`flex flex-col items-center p-2 md:p-3 rounded-2xl transition-all active:scale-90 ${activeTab === 'settings' ? 'text-amber-400 bg-amber-500/20' : 'text-amber-900/80 hover:text-amber-600'}`}>
                <span className="text-xl md:text-3xl">📜</span>
                <span className="hidden md:block text-[8px] font-black uppercase mt-1 tracking-tighter">{UI_HUD.SETTINGS}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlHUD;
