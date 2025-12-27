
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

export interface DiaryEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'catch' | 'sell' | 'upgrade' | 'system';
  icon: string;
}

export interface MarbleTemplate extends Omit<Marble, 'id' | 'caughtAt'> {}

export interface Jar {
  id: string;
  name: string;
  description: string;
  capacity: number;
  luckBonus: number;
  yieldMultiplier: number;
  icon: string;
  cost: number;
}

export interface Cover {
  id: string;
  name: string;
  description: string;
  cost: number;
  effectType: 'luck' | 'value' | 'hybrid';
  luckValue: number;
  yieldValue: number;
}

export interface GameState {
  version: number;
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
  jarContents: Record<string, Marble[]>;
  activeCoverId: string | null;
  ownedCoverIds: string[];
  currency: number;
  lastCatchTimestamp: number;
  catchHistory: Record<string, number>;
  totalCatches: number;
  username: string;
  activeJarId: string;
  ownedJarIds: string[];
  diaryEntries: DiaryEntry[];
}
