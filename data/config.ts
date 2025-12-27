
import { Rarity } from '../types';

export const CURRENT_VERSION = 5; 
// Cooldown in seconds between marble encounters
export const COOLDOWN_TIME = 2; // Development mode (2 seconds)
export const STORAGE_KEY = 'marble_trouble_v5_state';

// Probabilities for Master Glassblower messages
export const MESSAGE_THRESHOLDS = {
  RARITY_REACTION: 0.3, // 30% chance
  TIP: 0.5,             // 20% window (0.3 to 0.5)
  MILESTONE: 0.6        // 10% window (0.5 to 0.6)
};

// Base weight distribution for Rarity tiers
export const RARITY_WEIGHTS = [
  { rarity: Rarity.COMMON, weight: 60 },
  { rarity: Rarity.UNCOMMON, weight: 25 },
  { rarity: Rarity.RARE, weight: 10 },
  { rarity: Rarity.EPIC, weight: 4 },
  { rarity: Rarity.LEGENDARY, weight: 0.9 },
  { rarity: Rarity.MYTHIC, weight: 0.1 },
];

export const MIN_COMMON_WEIGHT = 10;
