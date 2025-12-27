
import { Rarity, Location, Achievement } from '../types';

export const CURRENT_VERSION = 14; 
export const TUTORIAL_COOLDOWN = 10; 
export const NORMAL_COOLDOWN = 300; // PRODUCTION: 5 minutes

export const STORAGE_KEY = 'marble_trouble_v14_state';

export const MESSAGE_THRESHOLDS = {
  RARITY_REACTION: 0.3,
  TIP: 0.5,
  MILESTONE: 0.6
};

export const RARITY_WEIGHTS = [
  { rarity: Rarity.COMMON, weight: 60 },
  { rarity: Rarity.UNCOMMON, weight: 25 },
  { rarity: Rarity.RARE, weight: 10 },
  { rarity: Rarity.EPIC, weight: 4 },
  { rarity: Rarity.LEGENDARY, weight: 0.9 },
  { rarity: Rarity.MYTHIC, weight: 0.1 },
];

export const MIN_COMMON_WEIGHT = 10;

export const RANK_REQUIREMENTS = [
  { name: 'Village Elder', xp: 0, icon: '🧓', bgClass: 'bg-slate-500', textClass: 'text-slate-400' },
  { name: 'Scribe', xp: 100, icon: '✍️', bgClass: 'bg-blue-500', textClass: 'text-blue-400' },
  { name: 'District Magistrate', xp: 350, icon: '⚖️', bgClass: 'bg-teal-500', textClass: 'text-teal-400' },
  { name: 'Provincial Governor', xp: 1000, icon: '🏯', bgClass: 'bg-emerald-500', textClass: 'text-emerald-400' },
  { name: 'Court Chamberlain', xp: 3000, icon: '🗝️', bgClass: 'bg-purple-500', textClass: 'text-purple-400' },
  { name: 'High Scholar', xp: 8000, icon: '📚', bgClass: 'bg-indigo-500', textClass: 'text-indigo-400' },
  { name: 'Minister of War', xp: 20000, icon: '⚔️', bgClass: 'bg-red-600', textClass: 'text-red-500' },
  { name: 'Imperial Censor', xp: 50000, icon: '👁️', bgClass: 'bg-orange-500', textClass: 'text-orange-400' },
  { name: 'Grand Chancellor', xp: 150000, icon: '👑', bgClass: 'bg-amber-500', textClass: 'text-amber-400' },
];

export const LOCATIONS: Location[] = [
  {
    id: 'outskirts',
    name: "Chang'an Outskirts",
    description: "The dusty perimeter of the capital. Low-level enchanted marbles often hide among common glass here.",
    minRank: 9, 
    travelCost: 0,
    icon: '🌾'
  },
  {
    id: 'imperial_palace',
    name: "Imperial Palace Grounds",
    description: "The outer vermillion walls. The Overlord's scouts have begun infiltrating the official archives.",
    minRank: 7, 
    travelCost: 500,
    icon: '🏯'
  },
  {
    id: 'inner_courtyard',
    name: "Inner Palace Courtyard",
    description: "The heart of the Dynasty. Only the most powerful and dangerous enchanted marbles are found near the Dragon Throne.",
    minRank: 4, 
    travelCost: 2500,
    icon: '🐉'
  }
];

// Updated to stylized, cartoony backdrops signifying unique locations
export const BACKDROPS: Record<string, string> = {
  'outskirts': 'https://images.unsplash.com/photo-1590001158193-79013018e2dd?auto=format&fit=crop&q=80&w=2000', // Stylized rural china
  'imperial_palace': 'https://images.unsplash.com/photo-1599591037488-8a3064851889?auto=format&fit=crop&q=80&w=2000', // Stylized Vermillion Walls
  'inner_courtyard': 'https://images.unsplash.com/photo-1524398263544-7f12e96289b4?auto=format&fit=crop&q=80&w=2000'  // Stylized Temple/Palace
};

export const getRankData = (xp: number) => {
  let current = RANK_REQUIREMENTS[0];
  let next = RANK_REQUIREMENTS[1];
  let currentRankIndex = 0;

  for (let i = 0; i < RANK_REQUIREMENTS.length; i++) {
    if (xp >= RANK_REQUIREMENTS[i].xp) {
      current = RANK_REQUIREMENTS[i];
      currentRankIndex = i;
      next = RANK_REQUIREMENTS[i + 1] || null;
    } else {
      break;
    }
  }

  const virtualRank = 9 - currentRankIndex;
  const isPalaceRank = virtualRank <= 4;
  
  let progress = 0;
  if (next) {
    const range = next.xp - current.xp;
    const gained = xp - current.xp;
    progress = Math.min(100, Math.max(0, (gained / range) * 100));
  } else {
    progress = 100;
  }

  return { 
    rank: virtualRank, 
    name: current.name, 
    palace: isPalaceRank, 
    icon: current.icon,
    bgClass: current.bgClass,
    color: current.textClass, 
    progress, 
    currentXp: xp, 
    nextXp: next?.xp 
  };
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_bind',
    name: 'Imperial Sanction',
    description: 'Bind your first rogue enchanted marble.',
    icon: '📜',
    condition: (s) => s.totalCatches >= 1
  },
  {
    id: 'treasury_contributor',
    name: 'Wealth of Nations',
    description: 'Accumulate 10,000 Taels in total currency.',
    icon: '💰',
    condition: (s) => s.currency >= 10000
  },
  {
    id: 'rank_ascendant',
    name: 'Seat of Power',
    description: 'Reach Provincial Governor status.',
    icon: '🏯',
    condition: (s) => s.xp >= RANK_REQUIREMENTS[3].xp
  },
  {
    id: 'vessel_master',
    name: 'Imperial Repository',
    description: 'Own the cobalt indigo soul-trap.',
    icon: '🔋',
    condition: (s) => s.ownedJarIds.includes('cobalt_canister')
  },
  {
    id: 'full_archive',
    name: 'Grand Archivist',
    description: 'Bind 10 unique varieties of rogue glass.',
    icon: '📖',
    condition: (s) => Object.keys(s.catchHistory).length >= 10
  },
  {
    id: 'mythic_discovery',
    name: 'Heavenly Paradox',
    description: 'Bind a Mythic-tier marble from the void.',
    icon: '☄️',
    condition: (s) => Object.values(s.catchHistory).some((_, i) => true) && s.diaryEntries.some(e => e.message.includes('Mythic'))
  },
  {
    id: 'resonance_feat',
    name: 'Vessel Resonance',
    description: 'Consign a perfectly full vessel to the throne.',
    icon: '⚛️',
    condition: (s) => s.hasTriggeredResonance
  },
  {
    id: 'world_traveler',
    name: 'Imperial Nomad',
    description: 'Visit every district in the Tang Dynasty.',
    icon: '🧭',
    condition: (s) => s.visitedLocationIds.length >= 3
  },
  {
    id: 'master_collector',
    name: 'Infinite Specimen',
    description: 'Successfully bind 500 rogue marbles.',
    icon: '💎',
    condition: (s) => s.totalCatches >= 500
  },
  {
    id: 'grand_chancellor',
    name: 'The Pillar of State',
    description: 'Attain the rank of Grand Chancellor.',
    icon: '👑',
    condition: (s) => s.xp >= RANK_REQUIREMENTS[8].xp
  },
  {
    id: 'dragon_hoarder',
    name: 'Hoarding the Sun',
    description: 'Own the fabled Crystal Urn.',
    icon: '🐲',
    condition: (s) => s.ownedJarIds.includes('crystal_urn')
  },
  {
    id: 'encyclopedia_glass',
    name: 'Master of Refraction',
    description: 'Catch 20 unique varieties of rogue glass.',
    icon: '📓',
    condition: (s) => Object.keys(s.catchHistory).length >= 20
  }
];
