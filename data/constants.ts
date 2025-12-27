
import { Cover, Jar } from "../types";

export const JARS: Record<string, Jar> = {
  'lead_jar': {
    id: 'lead_jar',
    name: 'Dull Lead Casket',
    description: 'A heavy, opaque vessel from the western provinces. Its lead lining keeps the souls quiet.',
    capacity: 5,
    luckBonus: 0,
    yieldMultiplier: 1.1,
    icon: '🏺',
    cost: 100
  },
  'glass_flask': {
    id: 'glass_flask',
    name: 'Spirit-Vail of Qin',
    description: 'Forged from high-mountain quartz. Its clarity is a trap for wandering essences.',
    capacity: 5,
    luckBonus: 1.5,
    yieldMultiplier: 1.0,
    icon: '🧪',
    cost: 250
  },
  'cobalt_canister': {
    id: 'cobalt_canister',
    name: 'Indigo Soul-Trap',
    description: 'Deep cobalt glass treated with celestial salts to lure more stubborn minions.',
    capacity: 6,
    luckBonus: 2.0,
    yieldMultiplier: 1.25,
    icon: '🔋',
    cost: 750
  },
  'crystal_urn': {
    id: 'crystal_urn',
    name: 'The Dragon\'s Reliquary',
    description: 'A masterpiece of the Imperial Court. It hums with the authority of the Overlord himself.',
    capacity: 10,
    luckBonus: 4.0,
    yieldMultiplier: 1.5,
    icon: '🏺',
    cost: 2500
  }
};

export const COVERS: Cover[] = [
  {
    id: "wooden_snapper",
    name: "Bamboo Snapper",
    description: "Simple split-bamboo mechanism. Old-fashioned but effective.",
    cost: 150,
    effectType: "luck",
    luckValue: 0.5,
    yieldValue: 0
  },
  {
    id: "clockwork_cage",
    name: "Brass Court-Lid",
    description: "Intricate clockwork from the Silk Road merchants. Precision capture.",
    cost: 400,
    effectType: "luck",
    luckValue: 1.5,
    yieldValue: 0
  },
  {
    id: "gilded_clasp",
    name: "Golden Imperial Seal",
    description: "The Overlord's mark. It extracts more essence from every soul captured.",
    cost: 600,
    effectType: "value",
    luckValue: 0,
    yieldValue: 0.25
  },
  {
    id: "chrono_vacuum",
    name: "Void-Eye Clasp",
    description: "A tear in reality that pulls minions directly into servitude.",
    cost: 2000,
    effectType: "hybrid",
    luckValue: 2.5,
    yieldValue: 0.4
  }
];

export const RARITY_COLORS: Record<string, string> = {
  Common: "text-slate-400",
  Uncommon: "text-emerald-400",
  Rare: "text-blue-400",
  Epic: "text-purple-400",
  Legendary: "text-orange-400",
  Mythic: "text-red-500 font-bold animate-pulse"
};
