
import { Rarity, MarbleTemplate } from '../types';

export const MARBLE_DATABASE: MarbleTemplate[] = [
  {
    name: "Xiao the Scout",
    description: "A dim-witted but loyal orb. He spends his eternity looking for the Overlord's lost slippers.",
    rarity: Rarity.COMMON,
    color: "#f8fafc",
    pattern: "Clear",
    value: 10,
    visualType: 'clear'
  },
  {
    name: "Azure Drifting Soul",
    description: "A dreamy minion who frequently forgets he has been enslaved. He likes to watch the clouds.",
    rarity: Rarity.COMMON,
    color: "#38bdf8",
    pattern: "Swirl",
    value: 12,
    visualType: 'swirl'
  },
  {
    name: "The Cinnabar Guard",
    description: "Fierce and hot-tempered. He guards the furnace entrance with a tiny, invisible pike.",
    rarity: Rarity.UNCOMMON,
    color: "#ef4444",
    pattern: "Metallic",
    value: 18,
    visualType: 'metallic'
  },
  {
    name: "Jade Wanderer",
    description: "A restless spirit seeking the ancient Silk Road. He is prone to sighing in the jar.",
    rarity: Rarity.UNCOMMON,
    color: "#10b981",
    pattern: "Speckled",
    value: 24,
    visualType: 'solid'
  },
  {
    name: "Bamboo Whisperer",
    description: "A gossip-monger of the celestial court. He knows exactly who the Overlord plans to conquer next.",
    rarity: Rarity.RARE,
    color: "#84cc16",
    pattern: "Swirl",
    value: 32,
    visualType: 'swirl'
  },
  {
    name: "Silk-Thread Phantom",
    description: "Elegant and delicate. He believes he is far too refined to be kept in a lead jar.",
    rarity: Rarity.RARE,
    color: "#f472b6",
    pattern: "Clear",
    value: 40,
    visualType: 'clear'
  },
  {
    name: "Gilded Eunuch",
    description: "Obsessed with protocol and shards. He counts the other marbles when you aren't looking.",
    rarity: Rarity.EPIC,
    color: "#fbbf24",
    pattern: "Metallic",
    value: 50,
    visualType: 'metallic'
  },
  {
    name: "Obsidian Assassin",
    description: "The Overlord's silent shadow. He doesn't speak; he only waits for the order to strike.",
    rarity: Rarity.EPIC,
    color: "#0f172a",
    pattern: "Solid",
    value: 60,
    visualType: 'solid'
  },
  {
    name: "Imperial Fire-Drake",
    description: "A fragment of the dragon that guards the Forbidden City. He hums with ancient power.",
    rarity: Rarity.LEGENDARY,
    color: "#ea580c",
    pattern: "Sparkle",
    value: 75,
    visualType: 'sparkle'
  },
  {
    name: "The Celestial Sovereign",
    description: "The ultimate minion. He is a direct fragment of the Overlord's own will. Bow before him.",
    rarity: Rarity.MYTHIC,
    color: "#4338ca",
    pattern: "Sparkle",
    value: 100,
    visualType: 'sparkle'
  }
];
