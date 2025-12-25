
export enum Rarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
  MYTHIC = 'Mythic'
}

export interface Marble {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  color: string;
  pattern: string;
  value: number;
  caughtAt: number;
  visualType: 'solid' | 'swirl' | 'clear' | 'sparkle' | 'metallic';
}

export interface WorkshopUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  effectType: 'cooldown' | 'luck' | 'value' | 'capacity';
}

export interface GameState {
  marbles: Marble[];
  currency: number;
  lastCatchTimestamp: number;
  upgrades: Record<string, number>;
  totalCatches: number;
  username: string;
}

export const COOLDOWN_TIME = 1; // 1 second for dev purposes
