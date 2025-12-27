
import { Marble, Rarity } from '../types';
import { MARBLE_DATABASE } from '../data/marbles';
import { RARITY_WEIGHTS, MIN_COMMON_WEIGHT } from '../data/config';

/**
 * Roll for a new marble based on current luck (Attraction) modifiers and location.
 */
export const rollFromDatabase = (luckModifier: number, locationId: string): Marble => {
  const commonWeight = RARITY_WEIGHTS[0].weight;
  const displacement = Math.min(commonWeight - MIN_COMMON_WEIGHT, luckModifier * 1.2);
  
  const totalPower = RARITY_WEIGHTS.slice(1).reduce((acc, _, i) => acc + Math.pow(1.5, i), 0);

  const adjustedWeights = RARITY_WEIGHTS.map((r, i) => {
    if (i === 0) return commonWeight - displacement;
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

  // Filter pool by rarity AND location
  const pool = MARBLE_DATABASE.filter(m => 
    m.rarity === selectedRarity && 
    (m.locations ? m.locations.includes(locationId) : true)
  );
  
  // Fallback if no marble of that rarity exists in this location
  const fallbackPool = pool.length > 0 ? pool : MARBLE_DATABASE.filter(m => 
    (m.locations ? m.locations.includes(locationId) : true)
  );
  
  const template = fallbackPool[Math.floor(Math.random() * fallbackPool.length)] || MARBLE_DATABASE[0];

  return {
    ...template,
    id: Math.random().toString(36).substr(2, 9),
    caughtAt: Date.now()
  };
};
