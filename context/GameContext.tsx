
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useGameState } from '../hooks/useGameState';
import { GameState, Marble, Jar, Cover } from '../types';

interface GameContextType {
  gameState: GameState;
  timeLeft: number;
  isCatching: boolean;
  // Fix: Added missing lastCaught property to match useGameState return value
  lastCaught: Marble | null;
  lastOutcome: { type: 'catch' | 'escape'; marble: Marble } | null;
  clearLastOutcome: () => void;
  advice: string;
  activeJar: Jar;
  activeMarbles: Marble[];
  activeCover: Cover;
  isJarFull: boolean;
  totalLuck: number;
  totalYield: number;
  activeTab: 'home' | 'jar' | 'album' | 'shop' | 'settings' | 'achievements' | 'travel';
  setActiveTab: (tab: 'home' | 'jar' | 'album' | 'shop' | 'settings' | 'achievements' | 'travel') => void;
  handleCatch: () => Promise<void>;
  completeOnboarding: (jarId: string) => void;
  advanceOnboarding: (toStep?: number) => void;
  sellJarContents: (jarId: string) => number;
  buyJar: (jarId: string) => void;
  buyCover: (coverId: string) => void;
  equipCover: (coverId: string) => void;
  equipJar: (jarId: string) => void;
  markTooltipSeen: (id: string) => void;
  resetGame: () => void;
  rankCelebration: { rank: number; name: string } | null;
  clearRankCelebration: () => void;
  travelToLocation: (locationId: string) => void;
  resetCooldown: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const gameLogic = useGameState();
  const [activeTab, setActiveTab] = useState<'home' | 'jar' | 'album' | 'shop' | 'settings' | 'achievements' | 'travel'>('home');

  return (
    <GameContext.Provider value={{ ...gameLogic, activeTab, setActiveTab }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
