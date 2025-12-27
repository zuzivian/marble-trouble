
import { GameState, Marble, Rarity } from '../types';
import { MASTER_MESSAGES } from '../data/messages';
import { MESSAGE_THRESHOLDS } from '../data/config';
import { JARS, COVERS } from '../data/constants';

/**
 * Determines which message the Master Glassblower should say based on 
 * the current game state and latest catch.
 */
export const getMarbleMasterMessage = (state: GameState, lastMarble: Marble | null): string => {
  const roll = Math.random();
  
  // 1. High rarity reactions take precedence
  if (lastMarble && (lastMarble.rarity === Rarity.LEGENDARY || lastMarble.rarity === Rarity.MYTHIC)) {
    const pool = MASTER_MESSAGES.RARITY_REACTION[lastMarble.rarity];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 2. Attraction awareness
  const activeJar = JARS[state.activeJarId];
  const activeCover = COVERS.find(c => c.id === state.activeCoverId);
  const totalLuck = (activeJar?.luckBonus || 0) + (activeCover?.luckValue || 0);

  if (totalLuck > 40 && Math.random() < 0.2) {
    return "The Attraction in this room is palpable! The rare ones can't resist.";
  }

  // 3. Specific progress milestones
  if ([10, 50, 100, 500].includes(state.totalCatches)) {
    return MASTER_MESSAGES.MILESTONES[Math.floor(Math.random() % 3)];
  }

  // 4. Probabilistic selection based on config thresholds
  if (roll < MESSAGE_THRESHOLDS.RARITY_REACTION && lastMarble) {
    const pool = MASTER_MESSAGES.RARITY_REACTION[lastMarble.rarity];
    return pool[Math.floor(Math.random() * pool.length)];
  } else if (roll < MESSAGE_THRESHOLDS.TIP) {
    return MASTER_MESSAGES.TIPS[Math.floor(Math.random() * MASTER_MESSAGES.TIPS.length)];
  } else if (roll < MESSAGE_THRESHOLDS.MILESTONE) {
    return MASTER_MESSAGES.MILESTONES[Math.floor(Math.random() * MASTER_MESSAGES.MILESTONES.length)];
  } else {
    // Default general flavor
    return MASTER_MESSAGES.GENERAL[Math.floor(Math.random() * MASTER_MESSAGES.GENERAL.length)];
  }
};
