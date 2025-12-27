
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Marble, DiaryEntry, Rarity } from '../types';
import { JARS, COVERS } from '../data/constants';
import { CURRENT_VERSION, TUTORIAL_COOLDOWN, NORMAL_COOLDOWN, STORAGE_KEY, ACHIEVEMENTS, getRankData, LOCATIONS } from '../data/config';
import { rollFromDatabase } from '../services/marbleService';
import { getMarbleMasterMessage } from '../services/messageService';
import { setCookie, getCookie } from '../utils/storage';

const RESONANCE_BONUS = 1.5;

const BASE_CATCH_CHANCE: Record<Rarity, number> = {
  [Rarity.COMMON]: 90,
  [Rarity.UNCOMMON]: 75,
  [Rarity.RARE]: 60,
  [Rarity.EPIC]: 40,
  [Rarity.LEGENDARY]: 20,
  [Rarity.MYTHIC]: 10
};

const createInitialState = (): GameState => ({
  version: CURRENT_VERSION,
  hasCompletedOnboarding: false,
  onboardingStep: 1,
  jarContents: {}, 
  activeCoverId: 'wooden_snapper',
  ownedCoverIds: ['wooden_snapper'],
  currency: 0, 
  xp: 0,
  lastCatchTimestamp: 0,
  catchHistory: {},
  totalCatches: 0,
  username: 'Imperial Aspirant',
  activeJarId: 'lead_jar',
  ownedJarIds: ['lead_jar'],
  diaryEntries: [{
    id: 'initial',
    timestamp: Date.now(),
    message: 'The Outpost scroll has been unrolled. Awaiting the first enchanted marble.',
    type: 'system',
    icon: '🏮'
  }],
  seenTooltips: [],
  unlockedAchievementIds: [],
  currentLocationId: 'outskirts',
  visitedLocationIds: ['outskirts'],
  hasTriggeredResonance: false
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialState = createInitialState();
    let rawSaved: string | null = null;
    try { rawSaved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!rawSaved) rawSaved = getCookie(STORAGE_KEY);

    if (rawSaved) {
      try {
        const parsed = JSON.parse(rawSaved);
        return { ...initialState, ...parsed, version: CURRENT_VERSION };
      } catch (e) { return initialState; }
    }
    return initialState;
  });

  const [timeLeft, setTimeLeft] = useState(0);
  const [isCatching, setIsCatching] = useState(false);
  const [lastOutcome, setLastOutcome] = useState<{ type: 'catch' | 'escape'; marble: Marble } | null>(null);
  const [advice, setAdvice] = useState<string>("The air is cold. The Mandate is ready.");
  const [rankCelebration, setRankCelebration] = useState<{ rank: number; name: string } | null>(null);
  
  const lastRankRef = useRef(getRankData(gameState.xp).rank);

  const activeJarId = gameState.activeJarId;
  const activeJar = JARS[activeJarId] || JARS['lead_jar'];
  const activeMarbles = gameState.jarContents[activeJarId] || [];
  const activeCover = COVERS.find(c => c.id === gameState.activeCoverId) || COVERS[0];
  const isJarFull = activeMarbles.length >= activeJar.capacity;

  const totalLuck = activeJar.luckBonus + activeCover.luckValue;
  const totalYield = activeJar.yieldMultiplier + activeCover.yieldValue;

  const currentMaxCooldown = (gameState.onboardingStep < 10) ? TUTORIAL_COOLDOWN : NORMAL_COOLDOWN;

  useEffect(() => {
    const stateString = JSON.stringify(gameState);
    try { localStorage.setItem(STORAGE_KEY, stateString); } catch (e) {}
    if (stateString.length < 3800) setCookie(STORAGE_KEY, stateString);

    const currentRankData = getRankData(gameState.xp);
    if (currentRankData.rank < lastRankRef.current) {
      setRankCelebration({ rank: currentRankData.rank, name: currentRankData.name });
      
      let ascensionMessage = `ASCENSION! You have attained the standing of ${currentRankData.name}. The Emperor acknowledges your service.`;
      
      if (currentRankData.rank === 7) ascensionMessage += " You may now travel to the Imperial Palace Grounds.";
      if (currentRankData.rank === 4) ascensionMessage += " You are sanctioned to enter the Inner Palace Courtyard.";
      
      addDiaryEntry(ascensionMessage, 'system', '🎊');
      lastRankRef.current = currentRankData.rank;
    }

    const newUnlocks = ACHIEVEMENTS.filter(a => 
      !gameState.unlockedAchievementIds.includes(a.id) && a.condition(gameState)
    ).map(a => a.id);

    if (newUnlocks.length > 0) {
      setGameState(prev => ({
        ...prev,
        unlockedAchievementIds: [...prev.unlockedAchievementIds, ...newUnlocks]
      }));
      newUnlocks.forEach(id => {
        const achievement = ACHIEVEMENTS.find(a => a.id === id);
        if (achievement) addDiaryEntry(`Imperial Feat Unlocked: ${achievement.name}!`, 'system', '🏆');
      });
    }
  }, [gameState]);

  const updateTimeLeft = useCallback(() => {
    const now = Date.now();
    const diff = Math.floor((now - gameState.lastCatchTimestamp) / 1000);
    setTimeLeft(Math.max(0, currentMaxCooldown - diff));
  }, [gameState.lastCatchTimestamp, currentMaxCooldown]);

  useEffect(() => {
    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [updateTimeLeft]);

  const resetGame = useCallback(() => {
    const fresh = createInitialState();
    setGameState(fresh);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const markTooltipSeen = useCallback((tooltipId: string) => {
    setGameState(prev => {
      if (prev.seenTooltips.includes(tooltipId)) return prev;
      return { ...prev, seenTooltips: [...prev.seenTooltips, tooltipId] };
    });
  }, []);

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
      diaryEntries: [newEntry, ...prev.diaryEntries].slice(0, 100)
    }));
  }, []);

  const clearLastOutcome = () => setLastOutcome(null);

  const resetCooldown = useCallback(() => {
    setGameState(prev => ({ ...prev, lastCatchTimestamp: 0 }));
  }, []);

  const handleCatch = async () => {
    if (timeLeft > 0 || isCatching || isJarFull) return;
    setIsCatching(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    try {
      const now = Date.now();
      const potentialMarble = rollFromDatabase(totalLuck, gameState.currentLocationId);
      
      const baseChance = BASE_CATCH_CHANCE[potentialMarble.rarity];
      const luckBonus = totalLuck * 2; 
      const finalChance = Math.min(99, baseChance + luckBonus);
      const roll = Math.random() * 100;
      
      const isTutorial = gameState.onboardingStep < 10;
      const success = isTutorial || roll <= finalChance;
      
      if (success) {
        const updatedJarContents = [...(gameState.jarContents[gameState.activeJarId] || []), potentialMarble];
        let nextOnboardingStep = gameState.onboardingStep;
        if (gameState.onboardingStep === 4 && updatedJarContents.length >= activeJar.capacity) {
          nextOnboardingStep = 5;
        }
        const newState: GameState = {
          ...gameState,
          onboardingStep: nextOnboardingStep,
          jarContents: { ...gameState.jarContents, [gameState.activeJarId]: updatedJarContents },
          xp: gameState.xp + potentialMarble.value,
          lastCatchTimestamp: now,
          totalCatches: gameState.totalCatches + 1,
          catchHistory: { ...gameState.catchHistory, [potentialMarble.name]: (gameState.catchHistory[potentialMarble.name] || 0) + 1 }
        };
        setGameState(newState);
        setLastOutcome({ type: 'catch', marble: potentialMarble });
        addDiaryEntry(`Bound a ${potentialMarble.rarity} enchanted marble: ${potentialMarble.name}.`, 'catch', '📜');
        setAdvice(updatedJarContents.length >= activeJar.capacity ? "Vessel Perfection! Consign haul." : getMarbleMasterMessage(newState, potentialMarble));
      } else {
        setGameState(prev => ({ ...prev, lastCatchTimestamp: now }));
        setLastOutcome({ type: 'escape', marble: potentialMarble });
        addDiaryEntry(`The spirit of ${potentialMarble.name} escaped the Mandate.`, 'system', '💨');
        setAdvice("The Mandate failed! This essence was too slippery.");
      }
      
      setTimeLeft(currentMaxCooldown);
    } catch (e) { console.error(e); } finally { setIsCatching(false); }
  };

  const advanceOnboarding = useCallback((toStep?: number) => {
    setGameState(prev => ({ ...prev, onboardingStep: toStep ?? prev.onboardingStep + 1 }));
  }, []);

  const completeOnboarding = (jarId: string) => {
    const jar = JARS[jarId];
    const currentMarbles = gameState.jarContents[jarId] || [];
    setGameState(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      onboardingStep: currentMarbles.length >= jar.capacity ? 5 : 4,
      activeJarId: jarId,
      ownedJarIds: [jarId],
      currency: 0,
      lastCatchTimestamp: 0
    }));
  };

  const sellJarContents = (jarId: string) => {
    const marbles = gameState.jarContents[jarId] || [];
    if (marbles.length === 0) return 0;
    const jar = JARS[jarId] || JARS['lead_jar'];
    let multiplier = jar.yieldMultiplier + (activeCover?.yieldValue || 0);
    const isFull = marbles.length >= jar.capacity;
    if (isFull) multiplier *= RESONANCE_BONUS;
    const totalValue = marbles.reduce((acc, m) => acc + Math.floor(m.value * multiplier), 0);
    setGameState(prev => ({
      ...prev,
      onboardingStep: prev.onboardingStep === 6 ? 7 : prev.onboardingStep,
      currency: prev.currency + totalValue,
      jarContents: { ...prev.jarContents, [jarId]: [] },
      hasTriggeredResonance: prev.hasTriggeredResonance || isFull
    }));
    addDiaryEntry(`Consigned hauls for ${totalValue} Tael.`, 'sell', '💰');
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
      addDiaryEntry(`Acquired the ${jar.name}.`, 'upgrade', '🏺');
    }
  };

  const buyCover = (coverId: string) => {
    const cover = COVERS.find(c => c.id === coverId);
    if (cover && gameState.currency >= cover.cost && !gameState.ownedCoverIds.includes(coverId)) {
      setGameState(prev => ({
        ...prev,
        currency: prev.currency - cover.cost,
        ownedCoverIds: [...prev.ownedCoverIds, coverId],
        activeCoverId: coverId 
      }));
      addDiaryEntry(`Commissioned the ${cover.name}.`, 'upgrade', '📜');
    }
  };

  const equipCover = (coverId: string) => {
    if (gameState.ownedCoverIds.includes(coverId)) setGameState(prev => ({ ...prev, activeCoverId: coverId }));
  };

  const equipJar = (jarId: string) => {
    if (gameState.ownedJarIds.includes(jarId)) setGameState(prev => ({ ...prev, activeJarId: jarId }));
  };

  const travelToLocation = (locationId: string) => {
    const location = LOCATIONS.find(l => l.id === locationId);
    const currentRank = getRankData(gameState.xp).rank;
    if (location && currentRank <= location.minRank && gameState.currency >= location.travelCost) {
      setGameState(prev => ({
        ...prev,
        currency: prev.currency - location.travelCost,
        currentLocationId: locationId,
        visitedLocationIds: prev.visitedLocationIds.includes(locationId) 
          ? prev.visitedLocationIds 
          : [...prev.visitedLocationIds, locationId]
      }));
      addDiaryEntry(`Traveled to ${location.name}.`, 'system', '🧭');
    }
  };

  return {
    gameState,
    timeLeft,
    isCatching,
    lastCaught: lastOutcome?.type === 'catch' ? lastOutcome.marble : null,
    lastOutcome,
    clearLastOutcome,
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
    equipJar,
    markTooltipSeen,
    resetGame,
    rankCelebration,
    clearRankCelebration: () => setRankCelebration(null),
    travelToLocation,
    resetCooldown
  };
};
