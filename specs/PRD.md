# Product Requirements Document: Project "Terminal Echo"

**Author:** Copilot
**Date:** 2026-01-08
**Version:** 1.0

## 1. Overview

Project "Terminal Echo" is a console-based, conversational role-playing game (RPG) that blends the dystopian, text-heavy aesthetic of retro computer terminals with the immersive, choice-driven narratives found in games like *Fallout* and the philosophical undertones of worlds like *The Matrix*. The player navigates a persistent world through dialogue, making choices that shape their character, their relationships, and the world around them. The game features two modes: a richly detailed, pre-scripted narrative and an endless, AI-generated mode for limitless exploration.

## 2. Goals and Objectives

*   **Primary Goal:** To create a highly immersive, text-and-menu-driven RPG experience that is lightweight and accessible.
*   **Secondary Goal:** To offer deep replayability through branching narratives, dynamic character progression, and two distinct game modes (Scripted and AI-Generated).
*   **Technical Goal:** To build a flexible game engine capable of supporting both handcrafted content and procedurally generated content from an AI model.

## 3. Core Concepts and Requirements

### A) The Player Character

The player character is defined by a combination of baseline attributes set at creation and runtime attributes that evolve through gameplay.

#### 1. Baseline User Attributes
*   **Strength (STR):** A measure of physical power. Defines inventory capacity.
*   **Intelligence (INT):** A measure of problem-solving ability and knowledge. Unlocks specific dialogue options and may influence quest outcomes.
*   **Luck (LCK):** A measure of fortune and chance. Can subtly influence random events, loot, and dialogue success rates.
*   **Attribute Allocation:** At the start of the game, the player distributes **15 points** across STR, INT, and LCK. A minimum of **1 point** must be allocated to each attribute.

#### 2. Runtime User Attributes
*   **Experience Points (XP):** Gained from completing quests and successful conversations.
*   **Health Points (HP):** Represents the character's life force. Starts at **20 HP**.
*   **Reputation:** A measure of how the character is perceived by the world's inhabitants (e.g., Honorable, Neutral, Shady). Starts at **Neutral**.
*   **Currency (Caps):** The in-game money. Starts with **5 Caps**.

#### 3. User Inventory
*   **Capacity:** The inventory capacity is directly determined by the character's **Strength** attribute (e.g., 10 STR = 10 inventory slots).
*   **Items:** Each item takes up one inventory slot.
*   **Item Functions:**
    *   **Consumable:** Can be used to gain an effect (e.g., "Nutri-Paste" restores HP).
    *   **Quest Item:** Required to complete a specific quest.
    *   **Tradable:** Can be sold for Caps or bartered.
    *   **Droppable:** Items can be dropped permanently to free up inventory space.

#### 4. Perks and Achievements
*   Upon completion of significant quests or reaching specific milestones, the user is awarded an achievement.
*   Achievements are recorded in the Event Log and may unlock unique dialogue or events in the future.

### B) Experience and Health Mechanics

#### 1. Experience and Leveling
*   The player levels up upon reaching specific XP thresholds.
*   **XP Levels:**
    *   Level 2: 1,000 XP
    *   Level 3: 3,000 XP
    *   Level 4: 10,000 XP
    *   Level 5: 20,000 XP
    *   *(Subsequent levels should follow a scaling pattern).*
*   **Level Up Bonus:** Upon reaching a new level, the player can increase one **Baseline Attribute** (STR, INT, or LCK) by **1 point**.

#### 2. Health Point (HP) System
*   **HP Attrition:** The user loses **1 HP every hour** of real-time play to simulate survival needs.
*   **HP Recovery:** Health can be recovered in the following ways:
    *   Consuming specific items from inventory (e.g., "Purified Water," "Irradiated Meal").
    *   As a positive outcome of a dialogue or quest.
    *   By paying for healing services from specific characters.

### C) Gameplay Loop and Rules

#### 1. Game Start
*   The user is presented with a setup screen to:
    1.  Choose a character name.
    2.  Allocate 15 points to their baseline attributes.
    3.  Select a game mode: **Scripted** or **AI-Generated**.

#### 2. World Navigation
*   The game begins in a starting location with a menu of available sub-locations to visit.
*   New locations become unlocked on the world map as the player discovers them through conversation and quests.

#### 3. Location Interaction
*   Upon entering a location, the user sees a menu listing:
    1.  Characters available to talk to.
    2.  An option to navigate to another unlocked location.

#### 4. Dialogue and Outcomes
*   The user selects a character to enter the **Chat Mode**.
*   The outcome of a chat can include, but is not limited to:
    *   Unlocking a new location.
    *   Gaining or losing XP, HP, Reputation, or Caps.
    *   Receiving, buying, or selling items.
    *   Starting or advancing a quest.
    *   A combination of the above, or no material effect at all.

#### 5. Game Over
*   The game ends if the user's HP reaches **0**.
*   Otherwise, the game is designed to be played indefinitely.

### D) Chat Mode

#### 1. Dialogue Mechanics
*   The UI displays a message from the non-player character (NPC) followed by a list of **3-5 dialogue options** for the player to choose from.
*   The availability of certain options shall depend on the player's **Baseline Attributes**, **Reputation**, and active **Quest** status.

#### 2. Character Roles and Dialogue Graphs
*   Characters can be quest-givers, traders, or simply conversational.
*   Each character's dialogue is structured as a graph. The player's choices determine the path taken through the graph.
*   The system must track the state of conversations. If a player talks to a character a second time, the entry point to the dialogue graph should be different to reflect that the character remembers the previous interaction.

#### 3. State Management in Dialogue
*   **Quests:** The game must check if a player has already started or completed a quest offered by a character to prevent repeating the same introductory dialogue.
*   **Trading:** When trading, the system must prevent a character from selling the same unique item twice. Consumables like food and water are exempt from this rule and can be restocked over time.

### E) Quests

*   **Quest Types:** Quests can include, but are not limited to:
    *   **Delivery:** Transport an item from NPC A to NPC B.
    *   **Task:** Perform an action for an NPC (e.g., "fix a terminal," "scout a location").
    *   **Elimination:** Remove a target character from the game.
*   **Reputation Impact:** Every quest will affect the player's reputation. Completing a quest to help a settlement may grant "Honorable" points, while an assassination may grant "Shady" points.

### F) Event Log

*   An in-game panel shall log all significant player actions and their results. This includes:
    *   Entering/discovering locations.
    *   Dialogue choices and outcomes.
    *   Changes to attributes (XP, HP, etc.).
    *   Inventory changes (items gained/lost).
    *   Quest status updates (started, completed).
*   The log must be persistent and readable by the player at any time.

## 4. Game Content & Modes

### A) Pre-scripted Mode Content
This mode provides a finite, handcrafted story.

*   **Locations:** 6 unique locations.
*   **Characters:** 6 unique characters per location (36 total). Each character will have a distinct personality and role.
*   **Dialogues:**
    *   All characters will have neutral/introductory dialogue trees.
*   **Quests:** 4 unique quests per location (24 total), structured as follows:
    1.  **"The Good Path":** A quest designed for players with a positive or neutral reputation.
    2.  **"The Low Road":** A quest that requires or results in a negative reputation.
    3.  **"The Courier":** A quest that spans at least two different locations.
    4.  **"The Follow-Up":** A random quest that only unlocks after one of the other three is completed.

### B) AI-Generated Mode (Endless Game)
This mode is for endless play. The system must have the capability to procedurally generate new content as the player explores.

*   **Requirements:** The AI engine must be able to generate:
    *   **New Locations:** With unique names and descriptions.
    *   **New Characters:** With names, roles (trader, wanderer), and basic personality profiles.
    *   **New Items:** Including consumables and miscellaneous junk for trading.
    *   **New Quests:** Simple, procedurally generated quests based on templates (e.g., fetch-item-from-new-location, talk-to-new-character).

## 5. User Interface (UI), Visuals, and IP

#### 1. Visual Style
*   The entire game interface shall be styled to look like a retro computer console.
*   **Font:** Green monochrome, fixed-width font.
*   **Frame:** The game content shall be framed within a UI element reminiscent of a "Pip-Boy" or other wrist-mounted tactical device.

#### 2. Navigation
*   All menus and dialogue options must be navigable using **keyboard arrow keys** and the **Enter/Return key**.
*   There will be **no mouse cursor support**.

#### 3. Copyright and Intellectual Property
*   The game must **not** use any trademarks, character names, location names, or specific lore from existing intellectual properties, including but not limited to *Fallout* and *The Matrix*. All content must be original, though inspired by these themes.

## 6. Technical Requirements

#### 1. Game State Management
*   The current state of the game (player attributes, inventory, quest status, world state) must be stored in local memory during play.
*   **Save/Load Functionality:** The user must be able to:
    *   **Backup (Save):** Export the current game state to a local file.
    *   **Restore (Load):** Import a previously saved game state file to continue playing.