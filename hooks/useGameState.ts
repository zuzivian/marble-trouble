
// Fix: Corrected corrupted import statement on line 1
import { useState, useEffect, useCallback } from 'react';
import { GameState, Marble, DiaryEntry } from '../types';
import { JARS, COVERS } from '../data/constants';
import { CURRENT_VERSION, COOLDOWN_TIME, STORAGE_KEY } from '../data/config';
import { rollFromDatabase } from '../services/marbleService';
import { getMarbleMasterMessage } from '../services/messageService';
import { setCookie, getCookie } from '../utils/storage';

const RESONANCE_BONUS = 1.2; // 20% bonus for full jar

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialState: GameState = {
      version: CURRENT_VERSION,
      hasCompletedOnboarding: false,
      onboardingStep: 1,
      jarContents: {}, 
      activeCoverId: 'wooden_snapper',
      ownedCoverIds: ['wooden_snapper'],
      currency: 200,
      lastCatchTimestamp: 0,
      catchHistory: {},
      totalCatches: 0,
      username: 'Apprentice Collector',
      activeJarId: 'lead_jar',
      ownedJarIds: ['lead_jar'],
      diaryEntries: [{
        id: 'initial',
        timestamp: Date.now(),
        message: 'The Workshop furnace has been lit. Awaiting the first descent.',
        type: 'system',
        icon: '🔥'
      }]
    };

    let rawSaved: string | null = null;
    try { rawSaved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!rawSaved) rawSaved = getCookie(STORAGE_KEY);

    if (rawSaved) {
      try {
        const parsed = JSON.parse(rawSaved);
        if (!parsed.activeCoverId) parsed.activeCoverId = 'wooden_snapper';
        if (!parsed.ownedCoverIds || parsed.ownedCoverIds.length === 0) parsed.ownedCoverIds = ['wooden_snapper'];
        if (!parsed.diaryEntries) parsed.diaryEntries = initialState.diaryEntries;
        if (parsed.onboardingStep === undefined) parsed.onboardingStep = parsed.hasCompletedOnboarding ? 7 : 1;
        return { ...initialState, ...parsed, version: CURRENT_VERSION };
      } catch (e) { return initialState; }
    }
    return initialState;
  });

  const [timeLeft, setTimeLeft] = useState(0);
  const [isCatching, setIsCatching] = useState(false);
  const [lastCaught, setLastCaught] = useState<Marble | null>(null);
  const [advice, setAdvice] = useState<string>("The furnace glows hot. A perfect time for a roll.");

  const activeJarId = gameState.activeJarId;
  const activeJar = JARS[activeJarId] || JARS['lead_jar'];
  const activeMarbles = gameState.jarContents[activeJarId] || [];
  const activeCover = COVERS.find(c => c.id === gameState.activeCoverId) || COVERS[0];
  const isJarFull = activeMarbles.length >= activeJar.capacity;

  const totalLuck = activeJar.luckBonus + activeCover.luckValue;
  const totalYield = activeJar.yieldMultiplier + activeCover.yieldValue;

  useEffect(() => {
    const stateString = JSON.stringify(gameState);
    try { localStorage.setItem(STORAGE_KEY, stateString); } catch (e) {}
    if (stateString.length < 3800) setCookie(STORAGE_KEY, stateString);
  }, [gameState]);

  const updateTimeLeft = useCallback(() => {
    const now = Date.now();
    const diff = Math.floor((now - gameState.lastCatchTimestamp) / 1000);
    setTimeLeft(Math.max(0, COOLDOWN_TIME - diff));
  }, [gameState.lastCatchTimestamp]);

  useEffect(() => {
    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [updateTimeLeft]);

  const addDiaryEntry = useCallback((message: string, type: DiaryEntry['type'], icon: string) => {
    const newEntry: DiaryEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      message,
      type,
      icon
    };
    setGameState(prev => ({
      ...prev,
      diaryEntries: [newEntry, ...prev.diaryEntries].slice(0, 100) // Keep last 100
    }));
  }, []);

  const clearLastCaught = () => setLastCaught(null);

  const handleCatch = async () => {
    if (timeLeft > 0 || isCatching || isJarFull) return;
    setIsCatching(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const newMarble = rollFromDatabase(totalLuck);
      const now = Date.now();
      
      setTimeLeft(COOLDOWN_TIME);
      
      const updatedJarContents = [...(gameState.jarContents[gameState.activeJarId] || []), newMarble];
      
      // Onboarding Step logic: Advance to 5 (Inspect) only if jar becomes full during Workshop Phase (Step 4)
      let nextOnboardingStep = gameState.onboardingStep;
      if (gameState.onboardingStep === 4 && updatedJarContents.length >= activeJar.capacity) {
        nextOnboardingStep = 5;
      }

      const newState: GameState = {
        ...gameState,
        onboardingStep: nextOnboardingStep,
        jarContents: { 
          ...gameState.jarContents, 
          [gameState.activeJarId]: updatedJarContents 
        },
        lastCatchTimestamp: now,
        totalCatches: gameState.totalCatches + 1,
        catchHistory: { 
          ...gameState.catchHistory, 
          [newMarble.name]: (gameState.catchHistory[newMarble.name] || 0) + 1 
        }
      };
      
      setGameState(newState);
      setLastCaught(newMarble);
      
      addDiaryEntry(
        `Snared a ${newMarble.rarity} ${newMarble.name}. The glass pulsates in the jar.`, 
        'catch', 
        '💎'
      );

      if (updatedJarContents.length >= activeJar.capacity) {
        setAdvice("The jar hums with a perfect seal! Consign it now for a Resonance Bonus.");
      } else {
        setAdvice(getMarbleMasterMessage(newState, newMarble));
      }

    } catch (e) {
      console.error("Failed to capture marble:", e);
    } finally {
      setIsCatching(false);
    }
  };

  const advanceOnboarding = useCallback((toStep?: number) => {
    setGameState(prev => ({
      ...prev,
      onboardingStep: toStep ?? prev.onboardingStep + 1
    }));
  }, []);

  const completeOnboarding = (jarId: string) => {
    const jar = JARS[jarId];
    const currentMarbles = gameState.jarContents[jarId] || [];
    const isActuallyFull = currentMarbles.length >= jar.capacity;

    setGameState(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      onboardingStep: isActuallyFull ? 5 : 4, // Directly go to inspection if already full
      activeJarId: jarId,
      ownedJarIds: [jarId],
      currency: 150,
      lastCatchTimestamp: 0 // Ensure immediate readiness for the first guided workshop roll
    }));
    addDiaryEntry('Apprentice training complete. The Great Work begins.', 'system', '📜');
  };

  const sellJarContents = (jarId: string) => {
    const marbles = gameState.jarContents[jarId] || [];
    if (marbles.length === 0) return 0;
    const jar = JARS[jarId] || JARS['lead_jar'];
    let multiplier = jar.yieldMultiplier + (activeCover?.yieldValue || 0);
    
    const isFull = marbles.length >= jar.capacity;
    if (isFull) multiplier *= RESONANCE_BONUS;

    const totalValue = marbles.reduce((acc, m) => acc + Math.floor(m.value * multiplier), 0);
    
    // Check for onboarding completion (Sale)
    let nextOnboardingStep = gameState.onboardingStep;
    if (gameState.onboardingStep === 6) nextOnboardingStep = 7;

    setGameState(prev => ({
      ...prev,
      onboardingStep: nextOnboardingStep,
      currency: prev.currency + totalValue,
      jarContents: { ...prev.jarContents, [jarId]: [] }
    }));
    
    setAdvice(isFull ? "The resonance was spectacular! A fine harvest." : "The furnace accepts your glass.");
    
    addDiaryEntry(
      `Consigned ${marbles.length} specimens to the furnace. Earned ${totalValue} Shards.`, 
      'sell', 
      '🔥'
    );
    
    return totalValue;
  };

  const buyJar = (jarId: string) => {
    const jar = JARS[jarId];
    if (gameState.currency >= jar.cost && !gameState.ownedJarIds.includes(jarId)) {
      setGameState(prev => ({
        ...prev,
        currency: prev.currency - jar.cost,
        ownedJarIds: [...prev.ownedJarIds, jarId]
      }));
      setAdvice(`${jar.name} acquired! A fine vessel for your workshop.`);
      addDiaryEntry(`Acquired the ${jar.name}. Storage capacity increased.`, 'upgrade', '🏺');
    }
  };

  const buyCover = (coverId: string) => {
    const cover = COVERS.find(c => c.id === coverId);
    if (!cover) return;
    if (gameState.currency >= cover.cost && !gameState.ownedCoverIds.includes(coverId)) {
      setGameState(prev => ({
        ...prev,
        currency: prev.currency - cover.cost,
        ownedCoverIds: [...prev.ownedCoverIds, coverId],
        activeCoverId: coverId 
      }));
      setAdvice(`The ${cover.name} is installed. Hear it whir!`);
      addDiaryEntry(`Forged and installed the ${cover.name}. Snare efficiency up.`, 'upgrade', '⚙️');
    }
  };

  const equipCover = (coverId: string) => {
    if (gameState.ownedCoverIds.includes(coverId)) {
      setGameState(prev => ({ ...prev, activeCoverId: coverId }));
      setAdvice(`Armed the workshop with the ${COVERS.find(c => c.id === coverId)?.name}.`);
      addDiaryEntry(`Re-calibrated snare to ${COVERS.find(c => c.id === coverId)?.name}.`, 'upgrade', '🔄');
    }
  };

  const equipJar = (jarId: string) => {
    if (gameState.ownedJarIds.includes(jarId)) {
      setGameState(prev => ({ ...prev, activeJarId: jarId }));
      addDiaryEntry(`Switched active vessel to ${JARS[jarId]?.name}.`, 'system', '🫙');
    }
  };

  return {
    gameState,
    timeLeft,
    isCatching,
    lastCaught,
    clearLastCaught,
    advice,
    activeJar,
    activeMarbles,
    activeCover,
    isJarFull,
    totalLuck,
    totalYield,
    handleCatch,
    advanceOnboarding,
    completeOnboarding,
    sellJarContents,
    buyJar,
    buyCover,
    equipCover,
    equipJar
  };
};
