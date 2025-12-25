
import { WorkshopUpgrade } from "./types";

export const INITIAL_UPGRADES: WorkshopUpgrade[] = [
  {
    id: "net_precision",
    name: "Fine Silk Net",
    description: "Increases the chance of finding Rare and Epic marbles.",
    cost: 50,
    level: 0,
    maxLevel: 10,
    effectType: "luck"
  },
  {
    id: "cooldown_reduction",
    name: "Polished Pavement",
    description: "Reduces the wait time between marble sightings (Not implemented yet).",
    cost: 150,
    level: 0,
    maxLevel: 5,
    effectType: "cooldown"
  },
  {
    id: "value_booster",
    name: "Golden Jar Lining",
    description: "Increases the shard value of caught marbles by 20%.",
    cost: 100,
    level: 0,
    maxLevel: 10,
    effectType: "value"
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
