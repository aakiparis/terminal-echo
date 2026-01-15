# Terminal Echo - Game Data Specification

## Overview
This specification defines how to create new game content (locations, NPCs, quests) for Terminal Echo.  All game data is stored in JavaScript objects and follows consistent patterns for dialogue graph, quest progression, and conditions.


## 0. File Structure
```
js/data/
└── npc-data.js  # Contains NPC_DATA, LOCATION_DATA, QUEST_DATA
```
Data defined in `npc-data.js`:
```javascript
const LOCATION_DATA = { /* ... */ };
const NPC_DATA = { /* ... */ };
const QUEST_DATA = { /* ... */ };
const ITEMS_DATA = { /* ... */ };
```

## 1. Location Data

Defines physical locations the player can visit. 

```javascript
const LOCATION_DATA = {
    location_id: {
        name: "Display Name",
        description: "Atmospheric description shown when entering",
        npcs: ["npc_id_1", "npc_id_2"]  // Array of NPC IDs present here
    }
};
```

**Guidelines**
- Start with 1 unlocked location by default
- Generate content for 5-6 new, interconnected locations
- Ensure there are links between locations within (e.g., either a quest in Location A sends the player to Location B or chat with a character in A unlocks B)."


**Example:**
```javascript
steel_canyon: {
    name: "Steel Canyon",
    description:  "A derelict factory complex, spitting smoke and sparks.",
    npcs: ["wrench", "foreman_kai"]
}
```

### Location recommendations:
Leverage location archetypes (not limits):
- **Settlement**: A small hub for NPCs, trade, and safety. The social core of a region. Spawns NPCs like: ["Merchant", "Leader", "Guard", "Technician", "Civilian"]
- **Ruin**: The remains of a pre-catastrophe structure (office building, suburb, etc.). Dangerous but holds valuable items. Spawns: ["Scavenger", "Hermit"]
- **IndustrialZone**: A derelict factory, power plant, or mine. A source of raw materials and technical components. Spawn: ["Technician", "Scavenger", "Guard"]
- **NaturalWonder**: A strange, mutated geological or biological formation. Often home to mystics or unique resources. Spawns: ["Mystic", "Hermit"]
- **Infrastructure**: A key piece of old-world tech like a comms tower, bridge, or pumping station. Often the focus of quests. Spawn: ["Technician", "Guard"]

## 2. NPC Data

NPCs have dialogue graphs, optional merchant inventories, and quest interactions.

### Basic Structure

```javascript
const NPC_DATA = {
    location_id: {
        npc_id: {
            name: "NPC Display Name",
            description: "Brief character description",
            is_merchant: true/false,
            inventory: ["item_id_1", "item_id_2"],  // Optional, only if is_merchant: true
            dialogue_graph: {
                nodes: { /* ... */ }
            }
        }
    }
};
```



### NPC recommendations
Introduce the following NPC architypes:
- **Merchant**: Trades items for Caps. Always looking for a deal. is_merchant: true
- **Guard**: Protects a location or an individual. Suspicious of outsiders. is_merchant: false
- **Scavenger**: Roams the wastes looking for salvage. Often has items to trade or information for sale. is_merchant: true
- **Technician**: Maintains and repairs old-world technology. is_merchant: false
- **Mystic**: Interprets strange phenomena and speaks in crypticisms. is_merchant: false
- **Leader**: The person in charge of a settlement or faction. is_merchant: false
- **Civilian**: A regular inhabitant of a settlement, trying to get by. is_merchant: false
- **Hermit**: A recluse living in isolation. May be hostile or possess rare knowledge. is_merchant: false

Placement logic:
- NPC archetype must be consistent with the rules of the Location archetype.
- Each settlement should have
  - at least 6 NPCs
  - at least one Merchant, one bad and one good NPC
  - 3-4 quest-giving NPCs


## 3. Dialogue System

### Node Structure

```javascript
dialogue_graph: {
    nodes:  {
        node_id: {
            text:  "What the NPC says",
            options: [
                {
                    text: "Player response option",
                    destination_node:  "target_node_id",
                    conditions: []  // Optional: requirements to show option
                }
            ],
            outcomes: []  // Optional: effects when node is triggered
        }
    }
}
```

### Special Node IDs
- `start_first_time`: First conversation with NPC
- `start_return`: Default node for subsequent visits (use `is_fallback: true`)
- `end_conversation`: Closes dialogue
- `trade`: Opens trade interface (merchants only)

### Conditions

Array of condition objects that gate dialogue options:

```javascript
conditions: [
    { type: "STAT_CHECK", stat: "int", min: 7 },
    { type: "STAT_CHECK", stat: "reputation", max: -10 },
    { type: "HAVE_ITEM":  item_id: "item_id_1" },
    { type: "QUEST_STAGE", quest_id: "quest_id", stage: 1 },
]
```

**Types:**
- `STAT_CHECK`: Check player stat (str, int, lck, hp, reputation, xp, cap)
- `QUEST_STAGE`: Check quest progress
- `HAVE_ITEM`: Check inventory
- `DIALOGUE_HAPPENED`: Checks whether player has talked to someone and went through specific dialogue node

### Outcomes

Array of outcome objects that trigger when a node is shown:

```javascript
outcomes: [
    { type: "LOCATION_UNLOCK", location_id: "location_id" },
    { type: "QUEST_SET_STAGE", quest_id:  "quest_id", stage: 1 },
    { type: "ITEM_GAIN", item_id: "item_id_1" },
    { type: "ITEM_LOSE", item_id: "item_id_2" },
    { type: "STAT_CHANGE", stat: "xp", value: 200 },
    { type: "REPUTATION_CHANGE", value:  5 },
]
```


### Dialogue recommendations
**Dialogue Flow**
- Always provide `start_first_time` for new encounters
- Use `is_fallback: true` on the default return node
- End conversation threads with `end_conversation` or `end_trade`

**Quest Integration**
- Set quest stage to 1 when accepted
- Set quest stage to 100 when completed
- Check quest stages in conditions to show appropriate dialogue
- Use `post_quest_<name>` nodes for completion dialogues

**Stat Checks**
- INT checks for clever/technical options
- STR checks for physical/intimidation options  
- LCK checks for chance/intuition options
- Reputation checks for alignment-based responses

**Item Management**
- Always pair `HAVE_ITEM` conditions with `ITEM_LOSE` outcomes
- Quest items should have type `quest`
- Don't use `item_id:  "caps"` for currency; caps are part of player's stat


## 4. Quest Data
Quests are the primary driver of narrative and exploration. They should be simple in structure but contextually rich, using generated locations, NPCs, and items.

```javascript
const QUEST_DATA = {
    quest_id: {
        title: "Quest Title",
        description: "Brief quest summary",
        location: "location_id",
        giver: "npc_id",
        stages: {
            0: "Not started",
            1: "Stage 1 description",
            2: "Stage 2 description",
            100: "Completed"  // Always use 100 for completion
        }
        rewards: {
            items: ["item_id_1", "item_id_2"],
            stat_change: [
                {stat: "xp", value: 200 },
                {stat: "cap", value: 200 },
                {stat: "reputation", value: -5 }
            ]
        }
    }
};
```

**Stages:** :
- 0 - quest not started,
- 1 - started
- any other number represent any additional intermidiate steps
- 100 - completed


**Quest Examples** (not limited by the follwoing, be creative):
1. The Missing item: NPC_A needs the player to retrieve ITEM_B from LOCATION_C. Stages:
- "Talk to NPC_A in LOCATION_A to get the quest."
- "Travel to LOCATION_B."
- "Acquire ITEM_A (found in container, on a character, or requires a skill check)."
- "Return ITEM_A to NPC_A."
2. The Delivery: NPC_A in LOCATION_A gives the player ITEM_A to deliver to NPC_B in LOCATION_B. Stages:
- "Talk to NPC_A to get the quest and ITEM_A."
- "Travel to LOCATION_B."
- "Give ITEM_A to NPC_B."
- "(Optional) Return to NPC_A for a bonus reward."
3. Eliminate someone: NPC_A wants the player to eliminate NPC_B, who is usually located in a dangerous area. Stages:
- "Talk to NPC_A to get the target."
- "Travel to the target's location."
- "Eliminate NPC_B (through dialogue, combat, or stealth)."
- "Return to NPC_A for payment."
4. INVESTIGATION: NPC_A asks player to investigate strange events at LOCATION_B. Requires talking to 2-3 NPCs.
5. BARTER OR CHAT CHAIN
- Multi-step trading: Get ITEM_A to NPC A, trade to NPC_B for ITEM_B, trade to NPC_C for ITEM_C, return ITEM_C to NPC_A.
- Multi-step chat: Talks to NPC_A, then to NPC_B, return to NPC_A. Could be 2-3 iterations. Example: conlfict negotiation.
6. REPUTATION UNLOCK - "Proving Your Worth" - NPC_A won't help until player completes any quest in the location
7. MORAL CHOICE - "The Double Deal" - Two NPCs offer conflicting quests for the same objective. Player can only complete one.


## Items

```javascript
const ITEMS_DATA = {
    item_id: {
        name: "Item Name",
        tradeable: true/false // false items aren't shown on trading list. Use false for quest items
        type: "consumable" | "gear" | "quest" | "junk",
        stat_change: [ // Optional
            {stat: "hp", value: 5 },
            {stat: "str", value: 1 },
        ]
        { hp: 5, str: 1 },  
        price: 10 // number, not decimal. the price might flow up and down by -20% or +20% depending whether it is being bought (higher) or sold (lower)
    }
};
```
**Types**:
- `consumable`: Single-use items that provide a temporary effect (e.g., +5 HP) when consumed. Disappers after use.
- `gear`: Items that provide a passive bonus (e.g. +1 STR). Affects while in the player inventory.
- `quest`: Unique items required for a specific quest. Cannot be sold or dropped.
- `junk`: Scrap from the old world. Has no use other than trade.
