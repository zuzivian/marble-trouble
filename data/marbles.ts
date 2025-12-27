
import { Rarity, MarbleTemplate } from '../types';

export const MARBLE_DATABASE: MarbleTemplate[] = [
  {
    name: "Clear Sprite",
    description: "A simple, perfectly clear glass marble found in most beginner collections.",
    rarity: Rarity.COMMON,
    color: "#e2e8f0",
    pattern: "Clear",
    value: 10,
    visualType: 'clear'
  },
  {
    name: "Sky Swirl",
    description: "Cloud-like wisps of white dancing in a sky-blue base.",
    rarity: Rarity.COMMON,
    color: "#60a5fa",
    pattern: "Swirl",
    value: 15,
    visualType: 'swirl'
  },
  {
    name: "Forest Dweller",
    description: "Deep earthy greens with mossy internal patterns.",
    rarity: Rarity.UNCOMMON,
    color: "#166534",
    pattern: "Speckled",
    value: 35,
    visualType: 'solid'
  },
  {
    name: "Cobalt Core",
    description: "A dense, metallic blue marble that feels heavier than it looks.",
    rarity: Rarity.UNCOMMON,
    color: "#1e3a8a",
    pattern: "Metallic",
    value: 50,
    visualType: 'metallic'
  },
  {
    name: "Sunset Ember",
    description: "Glowing orange glass filled with golden sparkles that catch the light.",
    rarity: Rarity.RARE,
    color: "#f97316",
    pattern: "Glitter",
    value: 120,
    visualType: 'sparkle'
  },
  {
    name: "Shadow Weaver",
    description: "Ink-black swirls intertwined with silver ribbons.",
    rarity: Rarity.RARE,
    color: "#1e293b",
    pattern: "Twin Swirl",
    value: 180,
    visualType: 'swirl'
  },
  {
    name: "Royal Amethyst",
    description: "Vibrant purple glass that seems to glow from within.",
    rarity: Rarity.EPIC,
    color: "#7e22ce",
    pattern: "Deep Glow",
    value: 450,
    visualType: 'metallic'
  },
  {
    name: "Verdant Eye",
    description: "A rare green marble with a single, perfectly centered swirl.",
    rarity: Rarity.EPIC,
    color: "#15803d",
    pattern: "Target",
    value: 600,
    visualType: 'swirl'
  },
  {
    name: "Dragon's Fury",
    description: "Molten red and charred black glass, sparkling with hidden heat.",
    rarity: Rarity.LEGENDARY,
    color: "#b91c1c",
    pattern: "Chaos",
    value: 1500,
    visualType: 'sparkle'
  },
  {
    name: "Nebula Soul",
    description: "The ultimate prize. Contains a microscopic universe of cosmic dust.",
    rarity: Rarity.MYTHIC,
    color: "#4c1d95",
    pattern: "Universe",
    value: 5000,
    visualType: 'sparkle'
  }
];
