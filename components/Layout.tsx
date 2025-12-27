
import React from 'react';
import Jumbotron from './Jumbotron';
import ControlHUD from './ControlHUD';
import { useGame } from '../context/GameContext';

interface LayoutProps {
  children: React.ReactNode;
}

const WorkshopBackdrop: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Base Gradient Layer */}
      <div className="absolute inset-0 bg-[#0f172a]" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#0f172a] to-black opacity-80" />

      {/* Workshop Elements: Large Background Gears */}
      <div className="absolute -top-20 -left-20 w-80 h-80 opacity-[0.03] animate-spin-slow text-white">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 35a15 15 0 1 0 0 30 15 15 0 0 0 0-30zm0-35l-5 15h10L50 0zm35 15l-12 10 7 7 5-17zm15 35l-15-5v10l15-5zm-15 35l-5-17-7 7 12 10zm-35 15l5-15h-10l5 15zm-35-15l12-10-7-7-5 17zm-15-35l15 5v-10l-15 5zm15-35l5 17 7-7-12-10z" />
        </svg>
      </div>
      <div className="absolute -bottom-40 -right-20 w-[400px] h-[400px] opacity-[0.02] animate-[spin_30s_linear_infinite_reverse] text-white">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 35a15 15 0 1 0 0 30 15 15 0 0 0 0-30zm0-35l-5 15h10L50 0zm35 15l-12 10 7 7 5-17zm15 35l-15-5v10l15-5zm-15 35l-5-17-7 7 12 10zm-35 15l5-15h-10l5 15zm-35-15l12-10-7-7-5 17zm-15-35l15 5v-10l-15 5zm15-35l5 17 7-7-12-10z" />
        </svg>
      </div>

      {/* Atmospheric Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full" />

      {/* Furnace Heart (The central glow at the bottom) */}
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[120%] h-[400px] bg-gradient-to-t from-orange-900/40 via-orange-600/10 to-transparent blur-3xl opacity-60 animate-furnace-glow" />
      
      {/* Drifting Embers / Dust */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full blur-[1px] animate-[float_10s_ease-in-out_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Subtle Grid / Floor Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { 
    gameState, 
    totalLuck, 
    totalYield, 
    activeCover, 
    activeJar, 
    activeMarbles, 
    isJarFull,
    timeLeft,
    isCatching,
    handleCatch,
    activeTab,
    setActiveTab
  } = useGame();

  const onRollRequested = async () => {
    if (!isJarFull) {
      setActiveTab('home');
      await handleCatch();
    } else {
      setActiveTab('home');
    }
  };

  const showHUD = gameState.hasCompletedOnboarding;

  return (
    <div className="fixed inset-0 flex flex-col items-center text-slate-100 font-sans overflow-hidden">
      {/* Persistent Workshop Backdrop */}
      <WorkshopBackdrop />

      {showHUD && (
        <Jumbotron 
          currency={gameState.currency}
          totalLuck={totalLuck}
          totalYield={totalYield}
          activeCoverName={activeCover.name}
          activeJarName={activeJar.name}
          marblesCount={activeMarbles.length}
          jarCapacity={activeJar.capacity}
          isJarFull={isJarFull}
        />
      )}

      <main className="w-full max-w-6xl px-2 md:px-4 z-10 flex-grow relative overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pt-2 md:pt-4">
          <div className="h-full">
            {children}
          </div>
        </div>
      </main>

      {showHUD && (
        <ControlHUD 
          gameState={gameState}
          timeLeft={timeLeft}
          isCatching={isCatching}
          onRoll={onRollRequested}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};

export default Layout;
