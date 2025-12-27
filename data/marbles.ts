
import { Rarity, MarbleTemplate } from '../types';

export const MARBLE_DATABASE: MarbleTemplate[] = [
  {
    name: "Xiao the Scout",
    description: "A dim-witted orb enchanted with a tracking hex. The Overlord sends him to sniff out palace weak points.",
    rarity: Rarity.COMMON,
    color: "#f8fafc",
    pattern: "Clear",
    value: 15, // Buffed from 10
    visualType: 'clear',
    locations: ['outskirts', 'imperial_palace']
  },
  {
    name: "Azure Drifting Soul",
    description: "An enchanted marble that traps a fragment of the sky. It drifts through corridors, spying for its master.",
    rarity: Rarity.COMMON,
    color: "#38bdf8",
    pattern: "Swirl",
    value: 18, // Buffed from 12
    visualType: 'swirl',
    locations: ['outskirts', 'imperial_palace']
  },
  {
    name: "The Cinnabar Guard",
    description: "Infused with furnace heat, this aggressive marble targets Imperial furniture with explosive intent.",
    rarity: Rarity.UNCOMMON,
    color: "#ef4444",
    pattern: "Metallic",
    value: 28, // Buffed from 18
    visualType: 'metallic',
    locations: ['outskirts', 'imperial_palace']
  },
  {
    name: "Jade Wanderer",
    description: "Disguised as a precious ornament, this marble slowly drains the luck of the room it occupies.",
    rarity: Rarity.UNCOMMON,
    color: "#10b981",
    pattern: "Speckled",
    value: 35, // Buffed from 24
    visualType: 'solid',
    locations: ['outskirts', 'imperial_palace']
  },
  {
    name: "Bamboo Whisperer",
    description: "A recording device shaped as glass. It eavesdrops on Imperial secrets and beams them back to the Void.",
    rarity: Rarity.RARE,
    color: "#84cc16",
    pattern: "Swirl",
    value: 50, // Buffed from 32
    visualType: 'swirl',
    locations: ['imperial_palace', 'inner_courtyard']
  },
  {
    name: "Silk-Thread Phantom",
    description: "This marble weaves invisible webs that trip up the Imperial Guard during midnight raids.",
    rarity: Rarity.RARE,
    color: "#f472b6",
    pattern: "Clear",
    value: 60, // Buffed from 40
    visualType: 'clear',
    locations: ['imperial_palace', 'inner_courtyard']
  },
  {
    name: "Gilded Eunuch",
    description: "Enchanted to mimic palace officials. It infiltrates the treasury to replace real gold with glass shards.",
    rarity: Rarity.EPIC,
    color: "#fbbf24",
    pattern: "Metallic",
    value: 85, // Buffed from 50
    visualType: 'metallic',
    locations: ['imperial_palace', 'inner_courtyard']
  },
  {
    name: "Obsidian Assassin",
    description: "A silent marble of absolute darkness. It seeks out the Emperor's seal to shatter the mandate of heaven.",
    rarity: Rarity.EPIC,
    color: "#0f172a",
    pattern: "Solid",
    value: 100, // Buffed from 60
    visualType: 'solid',
    locations: ['imperial_palace', 'inner_courtyard']
  },
  {
    name: "Imperial Fire-Drake",
    description: "Contains a fragment of a captured dragon soul. It is the Overlord's most destructive siege weapon.",
    rarity: Rarity.LEGENDARY,
    color: "#ea580c",
    pattern: "Sparkle",
    value: 140, // Buffed from 85
    visualType: 'sparkle',
    locations: ['inner_courtyard']
  },
  {
    name: "The Celestial Sovereign",
    description: "The core of the Overlord's malice. This marble creates its own gravity, pulling all nearby glass into its orbit.",
    rarity: Rarity.MYTHIC,
    color: "#4338ca",
    pattern: "Sparkle",
    value: 250, // Buffed from 120
    visualType: 'sparkle',
    locations: ['inner_courtyard']
  },
  {
    name: "Vermillion Phoenix",
    description: "A legendary sphere that burns with the eternal flame of the Empress's favor.",
    rarity: Rarity.LEGENDARY,
    color: "#dc2626",
    pattern: "Swirl",
    value: 150, // Buffed from 90
    visualType: 'swirl',
    locations: ['inner_courtyard']
  }
];
