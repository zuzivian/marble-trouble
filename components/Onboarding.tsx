
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { JARS } from '../data/constants';
import TrapVisual from './TrapVisual';
import MarbleVisual from './MarbleVisual';
import { UI_COMMON, UI_ONBOARDING } from '../data/uiTexts';

// Explicitly define the props interface for FloatingShard
interface FloatingShardProps {
  index: number;
}

// Fixed: Typing FloatingShard as React.FC to properly handle React internal props like 'key' in JSX
const FloatingShard: React.FC<FloatingShardProps> = ({ index }) => {
  const duration = 15 + Math.random() * 20;
  const delay = Math.random() * -20;
  const left = Math.random() * 100;
  const size = 2 + Math.random() * 6;

  return (
    <div 
      className="absolute animate-drifting-shard rounded-full bg-white/20 blur-[1px]"
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        '--duration': `${duration}s`,
        '--delay': `${delay}s`
      } as any}
    />
  );
};

const Onboarding: React.FC = () => {
  const { completeOnboarding, handleCatch, lastCaught, isCatching, advanceOnboarding, gameState } = useGame();
  const [step, setStep] = useState(gameState.onboardingStep);
  const [selectedJar, setSelectedJar] = useState<string | null>(null);

  // Sync internal step with global state in case of external advances
  useEffect(() => {
    setStep(gameState.onboardingStep);
  }, [gameState.onboardingStep]);

  const starterJars = [
    { ...JARS['lead_jar'], tagline: UI_ONBOARDING.JAR_LEAD_TAG, icon: '🏺' },
    { ...JARS['glass_flask'], name: 'Glass Vial', tagline: UI_ONBOARDING.JAR_GLASS_TAG, icon: '🧪', capacity: 3, luckBonus: 1.5 }
  ];

  const handleNextStep = () => {
    const next = step + 1;
    setStep(next);
    advanceOnboarding(next);
  };

  const finish = () => {
    if (selectedJar) completeOnboarding(selectedJar);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center p-4 overflow-hidden">
      {/* Background Decor & Shards */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-900/15 rounded-full blur-[180px]" />
        
        {/* Dying Furnace Glow */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-orange-600/10 rounded-full blur-[120px] animate-furnace-glow" />

        {/* Particle System */}
        {Array.from({ length: 30 }).map((_, i) => (
          <FloatingShard key={i} index={i} />
        ))}

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
      </div>

      <div className="relative w-full max-w-2xl glass rounded-[2.5rem] p-6 md:p-10 border-white/10 shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col border border-white/5 backdrop-blur-3xl max-h-[95vh]">
        
        {/* Animated Glow Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-pulse" />

        {/* Step 1: Cinematic Lore */}
        {step === 1 && (
          <div className="space-y-4 md:space-y-6 animate-in fade-in zoom-in-95 duration-1000 overflow-y-auto custom-scrollbar pr-1">
            {/* Master & Workshop Character Visual - Reduced Padding */}
            <div className="relative w-full flex justify-center py-2 shrink-0">
              <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
                {/* Orbital Decoration */}
                <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-spin-slow" />
                <div className="absolute inset-4 rounded-full border border-indigo-400/10 animate-[spin_8s_linear_infinite_reverse]" />
                
                {/* Furnace Hearth Aura */}
                <div className="absolute bottom-0 w-32 h-12 bg-orange-500/20 blur-2xl rounded-full" />
                
                {/* The Character Vessel */}
                <div className="relative z-10 w-24 h-24 md:w-36 md:h-36 rounded-full glass-premium border border-white/20 flex flex-col items-center justify-center shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-black/90" />
                  
                  {/* Floating Character Element */}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-5xl md:text-7xl animate-float drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">🧙‍♂️</span>
                    <div className="absolute -bottom-2 w-12 h-1 bg-blue-500/40 blur-[2px] rounded-full animate-pulse" />
                  </div>
                  
                  {/* Internal Shimmer */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
                </div>

                {/* Satellite Shards */}
                <div className="absolute top-0 right-4 w-6 h-6 animate-float" style={{ animationDelay: '0.5s' }}>💎</div>
                <div className="absolute bottom-8 left-0 w-4 h-4 animate-float" style={{ animationDelay: '1.2s' }}>✨</div>
              </div>
            </div>

            <div className="text-center space-y-1 shrink-0">
              <h1 className="text-2xl md:text-4xl font-black font-outfit uppercase tracking-tighter text-slate-100">{UI_ONBOARDING.MASTER_NAME}</h1>
              <div className="flex items-center justify-center space-x-2">
                <div className="h-px w-6 bg-blue-500/50" />
                <p className="text-blue-400 font-black uppercase text-[9px] md:text-[10px] tracking-[0.4em]">{UI_ONBOARDING.MASTER_SUBTITLE}</p>
                <div className="h-px w-6 bg-blue-500/50" />
              </div>
            </div>
            
            {/* Lore Text Section - Compressed spacing */}
            <div className="space-y-3 text-xs md:text-base text-slate-300 leading-relaxed italic font-medium px-2 md:px-4 text-center overflow-hidden shrink-0">
              <p className="opacity-0 animate-text-reveal" style={{ animationDelay: '400ms' }}>
                {UI_ONBOARDING.LORE_P1}
              </p>
              <p className="opacity-0 animate-text-reveal" style={{ animationDelay: '1400ms' }}>
                {UI_ONBOARDING.LORE_P2}
              </p>
              <p className="opacity-0 animate-text-reveal text-indigo-300 font-bold" style={{ animationDelay: '2400ms' }}>
                {UI_ONBOARDING.LORE_P3}
              </p>
            </div>

            <button 
              onClick={handleNextStep}
              className="group relative w-full py-4 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 rounded-2xl font-black uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 text-[10px] md:text-xs text-white border border-white/10 overflow-hidden shrink-0"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/10 -skew-x-[30deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000" />
              {UI_ONBOARDING.CONTINUE_BTN}
            </button>
          </div>
        )}

        {/* Step 2: Choose Jar */}
        {step === 2 && (
          <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 overflow-y-auto custom-scrollbar pr-2">
            <div className="text-center shrink-0">
              <h2 className="text-2xl md:text-4xl font-black font-outfit uppercase tracking-tighter mb-2 text-slate-100">{UI_ONBOARDING.SELECT_VESSEL_TITLE}</h2>
              <p className="text-slate-500 font-black uppercase text-[10px] md:text-xs tracking-[0.4em]">{UI_ONBOARDING.SELECT_VESSEL_SUBTITLE}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
              {starterJars.map(jar => (
                <button
                  key={jar.id}
                  onClick={() => setSelectedJar(jar.id)}
                  className={`relative p-6 md:p-8 rounded-3xl border-2 transition-all flex flex-col items-center text-center group ${selectedJar === jar.id ? 'bg-blue-600/20 border-blue-500 shadow-2xl shadow-blue-500/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                >
                  <span className="text-5xl md:text-8xl mb-4 group-hover:scale-110 transition-transform drop-shadow-2xl">{jar.icon}</span>
                  <h3 className="font-black uppercase text-sm md:text-xl mb-1 text-slate-100">{jar.name}</h3>
                  <p className="text-blue-400 text-[10px] md:text-xs font-black uppercase mb-4 tracking-widest">{jar.tagline}</p>
                  
                  <div className="flex gap-6 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{UI_ONBOARDING.SPACE_LABEL}</span>
                      <span className="font-black text-xs md:text-sm text-slate-200">{jar.capacity}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{UI_COMMON.LUCK_LABEL}</span>
                      <span className="font-black text-xs md:text-sm text-emerald-400">+{jar.luckBonus}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button 
              onClick={handleNextStep}
              disabled={!selectedJar}
              className="w-full py-5 bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 disabled:opacity-20 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 text-xs md:text-sm text-white shrink-0"
            >
              {UI_ONBOARDING.ARM_SNARE_BTN}
            </button>
          </div>
        )}

        {/* Step 3: First Roll */}
        {step === 3 && (
          <div className="space-y-4 md:space-y-6 animate-in fade-in zoom-in-95 duration-700 text-center flex flex-col items-center overflow-y-auto custom-scrollbar pr-2">
            <div className="mb-2 md:mb-4 shrink-0">
              <h2 className="text-2xl md:text-4xl font-black font-outfit uppercase tracking-tighter mb-2 text-slate-100">{UI_ONBOARDING.MOMENT_TITLE}</h2>
              <p className="text-slate-500 font-black uppercase text-[10px] md:text-xs tracking-[0.4em]">{UI_ONBOARDING.MOMENT_SUBTITLE}</p>
            </div>

            {/* Adjusted height container for Trap Visual */}
            <div className="h-60 md:h-[350px] lg:h-[380px] w-full flex items-center justify-center relative pointer-events-none mb-4 md:mb-8 shrink-0">
              {lastCaught ? (
                <div className="animate-in zoom-in-50 duration-700 flex flex-col items-center">
                  <div className="scale-100 md:scale-[1.6] drop-shadow-[0_0_40px_rgba(59,130,246,0.6)]">
                    <MarbleVisual marble={lastCaught} size="lg" />
                  </div>
                  <div className="mt-8 md:mt-16 flex flex-col items-center space-y-2">
                    <span className="text-emerald-400 text-[10px] md:text-sm font-black uppercase tracking-[0.5em] animate-pulse">Stabilized</span>
                    <h3 className="font-black uppercase text-xl md:text-4xl text-slate-100 tracking-widest">{lastCaught.name}</h3>
                  </div>
                </div>
              ) : (
                <div className="scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 transform-gpu opacity-100 transition-opacity">
                  <TrapVisual coverId="wooden_snapper" jarIcon={selectedJar === 'lead_jar' ? '🏺' : '🧪'} isCatching={isCatching} />
                </div>
              )}
            </div>

            <div className="w-full relative z-10 shrink-0 mt-auto pb-4">
              {!lastCaught ? (
                <button 
                  onClick={handleCatch}
                  disabled={isCatching}
                  className="w-full py-6 md:py-8 bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 hover:from-blue-600 hover:via-indigo-700 hover:to-blue-800 rounded-3xl font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 text-sm md:text-xl pointer-events-auto border border-white/10"
                >
                  {isCatching ? UI_COMMON.SNARING : UI_ONBOARDING.PERFORM_SNARE_BTN}
                </button>
              ) : (
                <button 
                  onClick={finish}
                  className="w-full py-6 md:py-8 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 rounded-3xl font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 text-sm md:text-xl pointer-events-auto border border-white/10"
                >
                  {UI_ONBOARDING.ENTER_WORKSHOP_BTN}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;
