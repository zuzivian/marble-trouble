
import { GoogleGenAI, Type } from "@google/genai";
import { Marble, Rarity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMarble = async (luckModifier: number): Promise<Marble> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a unique, collectible glass marble for a game. The player's current luck modifier is ${luckModifier}. 
    Based on this, determine a rarity (Common to Mythic) and describe its appearance, color, and mystical properties.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          rarity: { 
            type: Type.STRING, 
            enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'] 
          },
          color: { type: Type.STRING, description: "A hex color code representing the primary hue" },
          pattern: { type: Type.STRING },
          value: { type: Type.NUMBER },
          visualType: { 
            type: Type.STRING, 
            enum: ['solid', 'swirl', 'clear', 'sparkle', 'metallic'] 
          }
        },
        required: ["name", "description", "rarity", "color", "pattern", "value", "visualType"]
      }
    }
  });

  const marbleData = JSON.parse(response.text);
  return {
    ...marbleData,
    id: Math.random().toString(36).substr(2, 9),
    caughtAt: Date.now()
  };
};

export const getWorkshopAdvice = async (gameState: any): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are the Marble Master. The player has ${gameState.marbles.length} marbles and ${gameState.currency} glass shards. 
    They have these upgrades: ${JSON.stringify(gameState.upgrades)}. 
    Give them a short, witty piece of advice or encouragement in one sentence.`,
  });
  return response.text;
};
