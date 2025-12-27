
import React from 'react';
import Jumbotron from './Jumbotron';
import ControlHUD from './ControlHUD';
import RankUpCelebration from './RankUpCelebration';
import CatchRevealModal from './CatchRevealModal';
import { useGame } from '../context/GameContext';
import { RANK_REQUIREMENTS } from '../data/config';

interface LayoutProps {
  children: React.ReactNode;
}

const WorkshopBackdrop: React.FC<{ palace?: boolean }> = ({ palace }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-clouds">
      <div className={`absolute inset-0 transition-colors duration-1000 ${palace ? 'bg-[#3a0202]' : 'bg-[#0c0404]'}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black opacity-90" />

      {/* Traditional Rotating Motif */}
      <div className="absolute -top-20 -left-20 w-80 h-80 opacity-[0.05] animate-spin-slow text-amber-500">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 35a15 15 0 1 0 0 30 15 15 0 0 0 0-30zm0-35l-5 15h10L50 0zm35 15l-12 10 7 7 5-17zm15 35l-15-5v10l15-5zm-15 35l-5-17-7 7 12 10zm-35 15l5-15h-10l5 15zm-35-15l12-10-7-7-5 17zm-15-35l15 5v-10l-15 5zm15-35l5 17 7-7-12-10z" />
        </svg>
      </div>

      {palace && (
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
      )}

      {/* Atmospheric Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-emerald-900/15 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-amber-900/10 blur-[120px] rounded-full" />

      <div className={`absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[120%] h-[400px] bg-gradient-to-t via-red-900/10 to-transparent blur-3xl opacity-60 animate-furnace-glow ${palace ? 'from-amber-900/40' : 'from-red-950/40'}`} />
      
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full blur-[1px] animate-[float_10s_ease-in-out_infinite] ${palace ? 'bg-amber-400/30' : 'bg-red-400/20'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
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
    setActiveTab,
    rankCelebration,
    clearRankCelebration,
    lastOutcome,
    clearLastOutcome
  } = useGame();

  const isPalace = gameState.xp >= RANK_REQUIREMENTS[5].xp; 

  const onRollRequested = async () => {
    if (!isJarFull) {
      await handleCatch();
    } else {
      setActiveTab('home');
    }
  };

  const showHUD = gameState.hasCompletedOnboarding;

  return (
    <div className="fixed inset-0 flex flex-col items-center text-slate-100 font-sans overflow-hidden">
      <WorkshopBackdrop palace={isPalace} />

      {showHUD && (
        <Jumbotron 
          currency={gameState.currency}
          xp={gameState.xp}
          totalLuck={totalLuck}
          totalYield={totalYield}
          activeCoverName={activeCover.name}
          activeJarName={activeJar.name}
          marblesCount={activeMarbles.length}
          jarCapacity={activeJar.capacity}
          isJarFull={isJarFull}
          totalCatches={gameState.totalCatches}
          currentLocationId={gameState.currentLocationId}
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

      {rankCelebration && (
        <RankUpCelebration rank={rankCelebration} onClose={clearRankCelebration} />
      )}

      {gameState.hasCompletedOnboarding && lastOutcome && (
        <CatchRevealModal 
          outcome={lastOutcome} 
          onDismiss={clearLastOutcome} 
        />
      )}
    </div>
  );
};

export default Layout;
