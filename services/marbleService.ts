
import { Marble, Rarity } from '../types';
import { MARBLE_DATABASE } from '../data/marbles';
import { RARITY_WEIGHTS, MIN_COMMON_WEIGHT } from '../data/config';

/**
 * Roll for a new marble based on current luck (Attraction) modifiers.
 * Attraction displaces Common weight and distributes it to higher tiers
 * with an exponential bias towards the rarest specimens.
 */
export const rollFromDatabase = (luckModifier: number): Marble => {
  // 1. Calculate how much Common weight is displaced
  const commonWeight = RARITY_WEIGHTS[0].weight; // Usually 60
  const displacement = Math.min(commonWeight - MIN_COMMON_WEIGHT, luckModifier * 1.2);
  
  // 2. Distribute displaced weight to other tiers
  // We use a power factor so higher index rarities (Mythic/Legendary) get more of the luck "slice"
  const totalPower = RARITY_WEIGHTS.slice(1).reduce((acc, _, i) => acc + Math.pow(1.5, i), 0);

  const adjustedWeights = RARITY_WEIGHTS.map((r, i) => {
    if (i === 0) {
      // The Common bucket
      return commonWeight - displacement;
    }
    
    // Non-common buckets receive a share of the displacement
    const tierPower = Math.pow(1.5, i - 1);
    const bonus = (displacement * (tierPower / totalPower));
    return r.weight + bonus;
  });

  const totalWeight = adjustedWeights.reduce((acc, w) => acc + w, 0);
  let random = Math.random() * totalWeight;

  let selectedRarity = Rarity.COMMON;
  for (let i = 0; i < adjustedWeights.length; i++) {
    if (random < adjustedWeights[i]) {
      selectedRarity = RARITY_WEIGHTS[i].rarity;
      break;
    }
    random -= adjustedWeights[i];
  }

  const pool = MARBLE_DATABASE.filter(m => m.rarity === selectedRarity);
  const template = pool[Math.floor(Math.random() * pool.length)] || MARBLE_DATABASE[0];

  return {
    ...template,
    id: Math.random().toString(36).substr(2, 9),
    caughtAt: Date.now()
  };
};
