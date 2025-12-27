
import { Cover, Jar } from "../types";

export const JARS: Record<string, Jar> = {
  'lead_jar': {
    id: 'lead_jar',
    name: 'Dull Lead Jar',
    description: 'A heavy, opaque jar. Its lead lining hides the internal glow, making it harder for rare marbles to find their way in.',
    capacity: 4, // Was 8
    luckBonus: 0,
    yieldMultiplier: 1.1,
    icon: '🏺',
    cost: 100
  },
  'glass_flask': {
    id: 'glass_flask',
    name: 'Borosilicate Flask',
    description: 'Forged from lab-grade glass. Its perfect transparency acts as a beacon, calling out to rare specimens.',
    capacity: 3, // Was 5
    luckBonus: 15,
    yieldMultiplier: 1.0,
    icon: '🧪',
    cost: 250
  },
  'cobalt_canister': {
    id: 'cobalt_canister',
    name: 'Cobalt Collector',
    description: 'The deep blue tint creates a spectral resonance that rarer marbles find irresistible.',
    capacity: 6, // Was 12
    luckBonus: 20,
    yieldMultiplier: 1.25,
    icon: '🔋',
    cost: 750
  },
  'crystal_urn': {
    id: 'crystal_urn',
    name: 'Radiant Crystal Urn',
    description: 'A masterpiece of the glazier art. Every facet is designed to trap light and snare the most elusive mythical glass.',
    capacity: 10, // Was 20
    luckBonus: 40,
    yieldMultiplier: 1.5,
    icon: '🏺',
    cost: 2500
  }
};

export const COVERS: Cover[] = [
  {
    id: "wooden_snapper",
    name: "Wooden Snapper",
    description: "A simple spring-loaded lid mechanism. Reliable, if a bit rustic.",
    cost: 150,
    effectType: "luck",
    luckValue: 5,
    yieldValue: 0
  },
  {
    id: "clockwork_cage",
    name: "Clockwork Lid",
    description: "An intricate brass contraption that uses precision gears to snap shut at the slightest glint of glass.",
    cost: 400,
    effectType: "luck",
    luckValue: 15,
    yieldValue: 0
  },
  {
    id: "gilded_clasp",
    name: "Gilded Snare",
    description: "Animatronic fingers plated in gold. They don't just catch marbles; they preserve their luster for higher value.",
    cost: 600,
    effectType: "value",
    luckValue: 0,
    yieldValue: 0.25
  },
  {
    id: "chrono_vacuum",
    name: "Chrono-Lid",
    description: "Uses a tiny singularity to pull wandering marbles directly into the safety of the jar. The ultimate snaring technology.",
    cost: 2000,
    effectType: "hybrid",
    luckValue: 25,
    yieldValue: 0.4
  }
];

export const RARITY_COLORS: Record<string, string> = {
  Common: "text-slate-400",
  Uncommon: "text-green-400",
  Rare: "text-blue-400",
  Epic: "text-purple-400",
  Legendary: "text-orange-400",
  Mythic: "text-red-500 font-bold animate-pulse"
};
