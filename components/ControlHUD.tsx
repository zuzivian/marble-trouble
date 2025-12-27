
import React, { useRef } from 'react';
import { GameState } from '../types';
import { JARS } from '../data/constants';
import { UI_HUD, UI_ONBOARDING } from '../data/uiTexts';
import MasterTooltip from './MasterTooltip';

interface Props {
  gameState: GameState;
  timeLeft: number;
  isCatching: boolean;
  onRoll: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const ControlHUD: React.FC<Props> = ({ gameState, timeLeft, isCatching, onRoll, activeTab, setActiveTab }) => {
  const activeJarId = gameState.activeJarId;
  const activeJar = JARS[activeJarId] || JARS['lead_jar'];
  const activeMarbles = gameState.jarContents[activeJarId] || [];
  const isJarFull = activeMarbles.length >= activeJar.capacity;
  
  const rollBtnRef = useRef<HTMLButtonElement>(null);
  const shopBtnRef = useRef<HTMLButtonElement>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isTutorialRolling = gameState.onboardingStep === 4 && timeLeft === 0 && !isCatching;
  const isTutorialShop = gameState.onboardingStep === 7;

  const RollingMarbleIcon = () => (
    <div className="w-8 h-8 md:w-14 md:h-14 relative animate-[bounce_1s_infinite]">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_5px_10px_rgba(255,255,255,0.3)]">
        <defs>
          <radialGradient id="rollMarbleGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#60a5fa" />
          </radialGradient>
          <linearGradient id="trailGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        
        {/* Motion Trails */}
        <path d="M5 40 Q 20 40 40 45" stroke="url(#trailGrad)" strokeWidth="4" strokeLinecap="round" className="animate-[pulse_0.5s_infinite]" />
        <path d="M0 55 Q 25 55 45 50" stroke="url(#trailGrad)" strokeWidth="6" strokeLinecap="round" className="animate-[pulse_0.7s_infinite]" />
        <path d="M10 70 Q 30 70 50 55" stroke="url(#trailGrad)" strokeWidth="4" strokeLinecap="round" className="animate-[pulse_0.6s_infinite]" />

        {/* The Marble */}
        <circle cx="65" cy="50" r="30" fill="url(#rollMarbleGrad)" />
        <path d="M50 35Q65 25 80 35Q65 45 50 35Z" fill="white" fillOpacity="0.4" />
        <circle cx="55" cy="40" r="8" fill="white" fillOpacity="0.3" />
      </svg>
    </div>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 md:p-6 pb-2 md:pb-8 flex justify-center pointer-events-none h-[80px] md:h-[130px]">
      <div className="w-full max-w-2xl glass rounded-[2.5rem] p-1.5 flex items-center justify-between pointer-events-auto border-t border-white/10 shadow-2xl relative">
        
        {/* Navigation Buttons */}
        <div className="flex-1 flex justify-around items-center">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center p-2.5 rounded-2xl transition-all active:scale-90 ${activeTab === 'home' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <span className="text-2xl md:text-4xl">🏠</span>
            <span className="hidden md:block text-[8px] font-black uppercase mt-1 tracking-tighter">{UI_HUD.WORKSHOP}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('jar')}
            className={`flex flex-col items-center p-2.5 rounded-2xl transition-all active:scale-90 ${activeTab === 'jar' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <span className="text-2xl md:text-4xl">🫙</span>
            <span className="hidden md:block text-[8px] font-black uppercase mt-1 tracking-tighter">{UI_HUD.SHELF}</span>
          </button>
        </div>

        {/* Center Roll Button */}
        <div className="relative -top-4 md:-top-10 px-3 shrink-0 flex items-center justify-center">
          {isTutorialRolling && (
            <MasterTooltip 
              message="Don't stop now, apprentice! Snare more specimens until the vessel is full."
              position="top"
              anchorRef={rollBtnRef}
              wide
            />
          )}

          <button
            ref={rollBtnRef}
            onClick={onRoll}
            disabled={(!isJarFull && timeLeft > 0) || isCatching}
            className={`group relative w-16 h-16 md:w-24 md:h-24 rounded-full transition-all duration-300 transform active:scale-95 ${
              isJarFull ? 'scale-100 animate-vibrate' :
              timeLeft === 0 && !isCatching ? 'scale-110' : 'grayscale opacity-60'
            } ${isTutorialRolling ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-slate-900 animate-pulse' : ''}`}
          >
            <div className={`absolute -inset-2 md:-inset-6 rounded-full blur-lg md:blur-[40px] transition-opacity duration-500 ${
              isJarFull ? 'bg-red-500/60 opacity-100' :
              timeLeft === 0 && !isCatching ? 'bg-blue-600/60 opacity-100 animate-pulse' : 'bg-slate-900/0 opacity-0'
            }`} />
            <div className={`relative w-full h-full rounded-full border-[3px] md:border-[4px] flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-500 ${
              isJarFull ? 'bg-slate-900 border-red-500' :
              timeLeft === 0 && !isCatching 
                ? 'bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-800 border-white/50' 
                : 'bg-slate-800 border-slate-700'
            }`}>
              {isCatching ? (
                <div className="w-6 h-6 md:w-9 md:h-9 border-2 md:border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : isJarFull ? (
                <div className="flex flex-col items-center">
                  <span className="text-[10px] md:text-sm font-black text-red-500 leading-none">{UI_HUD.FULL}</span>
                  <span className="text-[6px] md:text-[8px] font-black text-red-400 uppercase tracking-tighter mt-1 animate-pulse">Resonance!</span>
                </div>
              ) : timeLeft === 0 ? (
                <RollingMarbleIcon />
              ) : (
                <span className="text-[12px] md:text-lg font-black text-slate-200 font-outfit tabular-nums">{formatTime(timeLeft)}</span>
              )}
            </div>
          </button>
        </div>

        <div className="flex-1 flex justify-around items-center">
          <button 
            onClick={() => setActiveTab('album')}
            className={`flex flex-col items-center p-2.5 rounded-2xl transition-all active:scale-90 ${activeTab === 'album' ? 'text-purple-400 bg-purple-500/10' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <span className="text-2xl md:text-4xl">📖</span>
            <span className="hidden md:block text-[8px] font-black uppercase mt-1 tracking-tighter">{UI_HUD.ALBUM}</span>
          </button>

          <div className="relative">
            {isTutorialShop && (
              <MasterTooltip 
                message={UI_ONBOARDING.TUTORIAL_SHOP_HUD}
                position="top"
                anchorRef={shopBtnRef}
                wide
              />
            )}
            <button 
              ref={shopBtnRef}
              onClick={() => setActiveTab('shop')}
              className={`flex flex-col items-center p-2.5 rounded-2xl transition-all active:scale-90 ${
                isTutorialShop ? 'ring-2 ring-orange-500 animate-pulse bg-orange-500/10' : ''
              } ${activeTab === 'shop' ? 'text-orange-400 bg-orange-500/10' : 'text-slate-500 hover:text-slate-400'}`}
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