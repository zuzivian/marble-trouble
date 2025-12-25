
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Marble, COOLDOWN_TIME, Rarity } from './types';
import { INITIAL_UPGRADES, RARITY_COLORS } from './constants';
import { generateMarble, getWorkshopAdvice } from './services/geminiService';
import MarbleVisual from './components/MarbleVisual';

// Cookie helper functions
const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  const cookieValue = encodeURIComponent(value);
  document.cookie = `${name}=${cookieValue};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to load from cookie first
    const saved = getCookie('marble_trouble_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse game state from cookie", e);
      }
    }
    
    // Fallback to legacy localStorage if available (migration)
    const legacySaved = localStorage.getItem('marble_trouble_state');
    if (legacySaved) {
      try {
        const parsed = JSON.parse(legacySaved);
        // Clean up legacy localStorage after migrating
        localStorage.removeItem('marble_trouble_state');
        return parsed;
      } catch (e) {
        // Silently fail if parsing fails
      }
    }

    return {
      marbles: [],
      currency: 100,
      lastCatchTimestamp: 0,
      upgrades: {},
      totalCatches: 0,
      username: 'Novice Roller'
    };
  });

  const [timeLeft, setTimeLeft] = useState(0);
  const [isCatching, setIsCatching] = useState(false);
  const [lastCaught, setLastCaught] = useState<Marble | null>(null);
  const [advice, setAdvice] = useState<string>("Welcome to the workshop! Roll when the timer hits zero.");
  const [activeTab, setActiveTab] = useState<'home' | 'collection' | 'workshop'>('home');

  // Persistence via Cookies
  useEffect(() => {
    setCookie('marble_trouble_state', JSON.stringify(gameState));
  }, [gameState]);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - gameState.lastCatchTimestamp) / 1000);
      const remaining = Math.max(0, COOLDOWN_TIME - diff);
      setTimeLeft(remaining);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState.lastCatchTimestamp]);

  const handleCatch = async () => {
    if (timeLeft > 0 || isCatching) return;

    setIsCatching(true);
    try {
      const luck = (gameState.upgrades['net_precision'] || 0) * 5;
      const newMarble = await generateMarble(luck);
      
      const valueMultiplier = 1 + (gameState.upgrades['value_booster'] || 0) * 0.2;
      const earnedCurrency = Math.floor(newMarble.value * valueMultiplier);

      setGameState(prev => ({
        ...prev,
        marbles: [newMarble, ...prev.marbles],
        currency: prev.currency + earnedCurrency,
        lastCatchTimestamp: Date.now(),
        totalCatches: prev.totalCatches + 1
      }));
      
      setLastCaught(newMarble);
      const newAdvice = await getWorkshopAdvice(gameState);
      setAdvice(newAdvice);
    } catch (error) {
      console.error("Failed to catch marble:", error);
    } finally {
      setIsCatching(false);
    }
  };

  const buyUpgrade = (upgradeId: string, cost: number) => {
    if (gameState.currency >= cost) {
      setGameState(prev => ({
        ...prev,
        currency: prev.currency - cost,
        upgrades: {
          ...prev.upgrades,
          [upgradeId]: (prev.upgrades[upgradeId] || 0) + 1
        }
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-24 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="w-full max-w-4xl p-6 flex justify-between items-center z-10">
        <div className="flex flex-col">
          <h1 className="text-3xl font-outfit font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            MARBLE TROUBLE
          </h1>
          <p className="text-slate-400 text-sm">{gameState.username} • {gameState.totalCatches} Catches</p>
        </div>
        <div className="glass px-4 py-2 rounded-full flex items-center space-x-2 border-emerald-500/30">
          <span className="text-emerald-400 font-bold">{gameState.currency}</span>
          <span className="text-slate-500 text-xs">SHARDS</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl px-4 z-10 flex-1 flex flex-col">
        {activeTab === 'home' && (
          <div className="flex flex-col items-center space-y-8 py-10">
            {/* Catch Zone */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <button 
                onClick={handleCatch}
                disabled={timeLeft > 0 || isCatching}
                className={`relative w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform ${
                  timeLeft === 0 && !isCatching ? 'bg-slate-800 hover:scale-105 active:scale-95 border-2 border-emerald-400/50' : 'bg-slate-900 opacity-80 border-2 border-slate-700'
                }`}
              >
                {isCatching ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
                    <span className="text-emerald-400 font-bold animate-pulse">CATCHING...</span>
                  </div>
                ) : (
                  <>
                    <span className="text-5xl mb-2">{timeLeft === 0 ? '✨' : '⏳'}</span>
                    <span className="text-3xl font-outfit font-bold">
                      {timeLeft === 0 ? 'ROLL NOW!' : formatTime(timeLeft)}
                    </span>
                    {timeLeft > 0 && <span className="text-slate-500 text-sm mt-2">Next Marble Arriving</span>}
                  </>
                )}
              </button>
            </div>

            {/* Advice Panel */}
            <div className="glass p-6 rounded-2xl w-full max-w-md text-center">
               <p className="italic text-slate-300">"{advice}"</p>
            </div>

            {/* Last Catch Preview */}
            {lastCaught && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
                <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-4">Last Discovery</h3>
                <div className="glass p-8 rounded-3xl flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 border-white/5">
                  <MarbleVisual marble={lastCaught} size="lg" />
                  <div className="text-center md:text-left max-w-xs">
                    <span className={`text-xs font-bold uppercase ${RARITY_COLORS[lastCaught.rarity]}`}>
                      {lastCaught.rarity}
                    </span>
                    <h2 className="text-2xl font-outfit font-bold">{lastCaught.name}</h2>
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">{lastCaught.description}</p>
                    <div className="mt-4 flex items-center space-x-2">
                      <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">Pattern: {lastCaught.pattern}</span>
                      <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-emerald-400">+{lastCaught.value} Shards</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'collection' && (
          <div className="py-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-outfit font-bold">Your Jar ({gameState.marbles.length})</h2>
              <select className="bg-slate-800 border-none rounded-lg text-sm px-3 py-2 outline-none">
                <option>Newest First</option>
                <option>Rarity</option>
                <option>Value</option>
              </select>
            </div>
            
            {gameState.marbles.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-slate-500">
                <div className="w-16 h-16 border-2 border-dashed border-slate-700 rounded-full mb-4 flex items-center justify-center text-3xl">🫙</div>
                <p>Your jar is empty. Start rolling!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gameState.marbles.map((m) => (
                  <div key={m.id} className="glass p-4 rounded-2xl flex flex-col items-center space-y-3 group hover:border-emerald-500/30 transition-all duration-300">
                    <MarbleVisual marble={m} size="md" />
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-500 uppercase">{m.rarity}</p>
                      <p className="font-semibold text-sm truncate w-32">{m.name}</p>
                    </div>
                    <div className="w-full h-px bg-white/5" />
                    <p className="text-xs text-emerald-400">+{m.value} shards</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'workshop' && (
          <div className="py-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-outfit font-bold mb-6">Workshop Upgrades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INITIAL_UPGRADES.map((up) => {
                const currentLevel = gameState.upgrades[up.id] || 0;
                const cost = up.cost * (currentLevel + 1);
                const isMax = currentLevel >= up.maxLevel;
                const canAfford = gameState.currency >= cost;

                return (
                  <div key={up.id} className={`glass p-6 rounded-2xl border-l-4 ${canAfford ? 'border-l-blue-500' : 'border-l-slate-600'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{up.name}</h3>
                      <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Level {currentLevel}/{up.maxLevel}</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-6">{up.description}</p>
                    <button
                      disabled={isMax || !canAfford}
                      onClick={() => buyUpgrade(up.id, cost)}
                      className={`w-full py-3 rounded-xl font-bold transition-all ${
                        isMax ? 'bg-slate-700 cursor-not-allowed text-slate-500' :
                        canAfford ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40' :
                        'bg-slate-800 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      {isMax ? 'MAXED OUT' : `UPGRADE (${cost} SHARDS)`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Navigation Footer */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-4 rounded-full flex space-x-8 z-50 border-white/5 shadow-2xl">
        <NavButton active={activeTab === 'collection'} onClick={() => setActiveTab('collection')} label="Jar" icon="🫙" />
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} label="Roll" icon="🎲" />
        <NavButton active={activeTab === 'workshop'} onClick={() => setActiveTab('workshop')} label="Tools" icon="🛠️" />
      </nav>
    </div>
  );
};

interface NavBtnProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}

const NavButton: React.FC<NavBtnProps> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center space-y-1 transition-all duration-300 ${active ? 'text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] uppercase font-bold tracking-tighter">{label}</span>
    {active && <div className="w-1 h-1 bg-blue-400 rounded-full" />}
  </button>
);

export default App;
