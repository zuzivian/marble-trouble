
# 🏺 Marble Trouble: Imperial Dynasty

**Marble Trouble** is a high-fidelity, passive collection RPG inspired by the idle mechanics of *MouseHunt* and the progression loops of classic social games like *Mafia Wars*. Set within a vibrant, glass-morphic reimagining of the Tang Dynasty, players step into the role of an Imperial Aspirant tasked with capturing rogue "Enchanted Marbles"—volatile essences of chaos unleashed by a mysterious Overlord.

---

## 📜 The Narrative: The Mandate of Heaven

In the year 713, during the reign of Emperor Xuanzong, the celestial balance was shattered. An Unknown Overlord, dwelling in the void between stars, has begun raining down "Rogue Glass"—marbles infused with the memories and malice of fallen spirits. These spheres roll through the vermillion halls of Chang'an, spying on the court, draining luck from the treasury, and threatening the very Mandate of Heaven.

As an Aspirant of the Board of Rites, you have been granted a **Binding Scroll**. By striking the Imperial Seal every five minutes, you can anchor these spirits into consecrated vessels. Your goal is to rise from a humble Village Elder to the Grand Chancellor, securing the Dynasty's future one marble at a time.

---

## 🎮 Gameplay Mechanics: The Five-Minute Mandate

Marble Trouble centers around a core "Wait and Catch" loop designed for low-friction, high-engagement play.

### 1. The Binding Loop
Every five minutes, your Binding Scroll reaches full resonance. Striking the seal initiates a "Snare," where the current location's attraction pool is rolled against your **Mandate (Luck)**. 
- **Success**: The spirit is bound to your active vessel, granting you XP (Standing) and a permanent record in your Archive.
- **Escape**: Volatile spirits may resist the seal, requiring higher-tier equipment to capture.

### 2. Vessels & Resonance
Bound marbles are stored in **Vessels (Jars)**. Each vessel has a finite capacity. 
- **The Resonance Bonus**: If you consign a perfectly full vessel to the Imperial Treasury, you trigger a **1.5x Harvest Multiplier**. This encourages patience and strategic timing over rapid, small-scale sales.

### 3. The Artisan Court (Progression)
Accumulated **Taels** (Currency) are reinvested into the East Market:
- **Soul Jars**: Increase your capacity to stay away from the workshop longer and boost your base Harvest multiplier.
- **Scroll Seals (Covers)**: Permanent or swappable modifiers that increase your Mandate (Luck) to find Rare, Epic, and Legendary marbles.

---

## 💎 The Physics of Glass: Rarity & Visuals

Every marble is procedurally rendered using advanced CSS techniques to simulate physical glass properties:
- **Solid**: Opaque, lacquered finish.
- **Swirl**: Internal multi-color filaments that react to hover.
- **Clear**: High transparency with refractive blurs.
- **Sparkle**: Radial gradients simulating trapped stardust.
- **Metallic**: High-specular reflections typical of the Tang's finest bronze-infused glass.

Rarities range from **Common** (Xiao the Scout) to the near-impossible **Mythic** (The Celestial Sovereign), with drop rates dynamically adjusted based on your total Mandate.

---

## 🛠️ Technical Architecture & Design Philosophy

### Glassmorphism & Performance
The UI leverages a "Lacquered Noir" aesthetic. We utilize `backdrop-filter: blur()` extensively to create depth, but to ensure performance on mobile devices, we:
- Restricted blurs to static containers.
- Used `transform-gpu` and `will-change` on animating marbles.
- Implemented a custom SVG-in-JS engine for the Binding Seals to reduce asset overhead.

### State Persistence Engine
We built a robust persistence layer that utilizes `localStorage` with a transparent `Cookie` fallback. This ensures that even in restrictive browser environments, an Aspirant's rank and collection are never lost. The state is versioned (`v14`) to allow for seamless data migrations as the Dynasty expands.

### Procedural Attraction Logic
The "Roll" system doesn't just use flat percentages. It uses a **Weight Displacement Algorithm**:
1. Common marbles occupy the base weight.
2. High Mandate (Luck) "displaces" common weight into the higher tiers.
3. The pool is then filtered by the player's current **Province (Location)**, ensuring that you only catch marbles native to your current rank's jurisdiction.

---

## 🚀 DevLog: The Journey of the Mandate

### Phase 1: The Initial Spark (Weeks 1-2)
The project began as a challenge: could we make a "5-minute cooldown" feel exciting? We focused on the **Master Glassblower (Chancellor Li)**. By giving the game a "voice," we turned a simple timer into a narrative event. We experimented with different cooldown lengths, eventually landing on the 5-minute production standard to respect the player's time while maintaining the "check-in" habit.

### Phase 2: The Visual Identity (Weeks 3-4)
Early prototypes used standard emojis. We quickly realized the game needed a soul. We developed the "Lacquered" look—deep reds, golds, and blacks. The biggest challenge was the **Trap Visual**. We wanted a mechanical, tactile feel. The result was the swappable SVG "Seals" that actually animate and "clamp" down during the catch sequence.

### Phase 3: The Rank & Travel System (Weeks 5-6)
Progression felt too linear. We added **Travel**. By locking specific marbles behind locations like the *Inner Palace Courtyard*, we gave players a mid-game goal. Reaching the rank of "District Magistrate" became a pivotal moment where the game opens up, signified by the first location-based backdrop transition.

### Phase 4: Polish & Production Prep (Weeks 7-8)
The final phase focused on UX friction. We introduced the **Master Tooltip** system—a contextual "nudge" from Chancellor Li that helps new players navigate the Repository and Archive without a heavy-handed tutorial. We also finalized the **12 Legendary Feats**, giving completionists a true north star.

### Final Outcome
Marble Trouble is now a production-ready, atmospheric idle RPG. It successfully blends the charm of 2000s-era collection games with modern web performance and a unique historical narrative.

---

## 🏮 Future Roadmap

- **Imperial Guilds**: Coordinate with other Aspirants to bind Massive Anomalies.
- **Dynamic Events**: Solar eclipses that increase the spawn rate of Mythic marbles.
- **Trading Market**: Exchange rare specimens with other collectors in the East Market.

## ⚖️ License & Credits
Developed by Nathaniel Wong. 
Backdrops provided via high-quality illustrative placeholders to signify the diverse provinces of the Tang Dynasty.
*For the Glory of the Emperor.*

<!-- ci: trigger redeploy -->
