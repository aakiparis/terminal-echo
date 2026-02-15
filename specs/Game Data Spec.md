# Terminal Echo - Game Data Specification

## Overview
This specification defines how to create new game content (locations, NPCs, quests) for Terminal Echo.  All game data is stored in JavaScript objects and follows consistent patterns for dialogue graph, quest progression, and conditions.


## 0. File Structure
```
js/data/
└──data.js
```
Data defined in `data.js`:
```javascript
const LOCATION_DATA = { /* ... */ };
const NPC_DATA = { /* ... */ };
const QUEST_DATA = { /* ... */ };
const ITEMS_DATA = { /* ... */ };
const ENEMIES_DATA = { /* ... */ };
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

### Location recommendations
Leverage location archetypes (not limits):
- **Settlement**: A small hub for NPCs, trade, and safety. The social core of a region. Spawns NPCs like: ["Merchant", "Leader", "Guard", "Technician", "Civilian"]
- **Ruin**: The remains of a pre-catastrophe structure (office building, suburb, etc.). Dangerous but holds valuable items. Spawns: ["Scavenger", "Hermit"]
- **IndustrialZone**: A derelict factory, power plant, or mine. A source of raw materials and technical components. Spawn: ["Technician", "Scavenger", "Guard"]
- **NaturalWonder**: A strange, mutated geological or biological formation. Often home to mystics or unique resources. Spawns: ["Mystic", "Hermit"]
- **Infrastructure**: A key piece of old-world tech like a comms tower, bridge, or pumping station. Often the focus of quests. Spawn: ["Technician", "Guard"]

## 2. NPC Data

NPCs have dialogue graphs, optional merchant inventory and quest interactions.

```javascript
const NPC_DATA = {
    location_id: {
        npc_id: {
            name: "NPC Display Name",
            type: "npc" | "device" | "advanture",
            is_available: true/false, // true by default
            description: "Brief character description",
            is_merchant: true/false,
            inventory: ["item_id_1", "item_id_2"],  // Optional, only if is_merchant: true
            dialogue_graph: {/* ... */ }
        }
    }
};
```

`type = "npc"` adds "Talk to" prefix in location screen. Other types doesn't add any prefixies and ideally should be taken into square braces, e.g. `[ Enter the tunnel ]` or `[ Vault Terminal ]`.

`is_available = true` allows player to interact with the npc. `false` could be used for situations when npc isn't available for the dialogue yet (e.g. an unlocking task isn't completed) or when the npcs goes off the game (e.g. npc is eleminated),


### NPC recommendations
Truly charesmatic characters and engaging stories are pivotal for the game, as it is the key to player conversion and time spend.

Introduce the following NPC architypes:
- **Merchant**: Trades items for Caps. Always looking for a deal. is_merchant: true
- **Guard**: Protects a location or an individual. Suspicious of outsiders. is_merchant: false
- **Scavenger**: Roams the wastes looking for salvage. Often has items to trade or information for sale. is_merchant: true
- **Technician**: Maintains and repairs old-world technology. is_merchant: false
- **Mystic**: Interprets strange phenomena and speaks in crypticisms. is_merchant: false
- **Leader**: The person in charge of a settlement or faction. is_merchant: false
- **Civilian**: A regular inhabitant of a settlement, trying to get by. is_merchant: false
- **Hermit**: A recluse living in isolation. May be hostile or possess rare knowledge. is_merchant: false
- **Device**: An interactive device like mainframe console. Typically is_merchant: false
- **Advanture**: is used for discovery porposes like scanning the tunnels, fighting with someone or solving an occasion. is_merchant: false

Placement logic:
- NPC archetypes must be consistent with the rules of the Location archetype.
- Each settlement should have
  - at least 6 NPCs
  - at least one Merchant, one bad and one good NPC
  - 3-4 quest-giving NPCs
  - 4 NPCs should have their unique catchy story that can be told through dialogue with at least 4 nodes.
  - 2 NPCs should have interconnected stories because of the same event or a relationship between them


## 3. Dialogue System
`dialogue_graph` is the pivotal part of the game that defines dialogues nodes and transitions between them.
```javascript
const NPC_DATA = {
    location_id: {
        npc_id: {
            /* ... */
            dialogue_graph: {
                node_id_1: { /* ... */},
                node_id_2: { /* ... */}
            }
        }
    }
};
```

### Node Structure
In general case, a node comprised of:
* Condition
* Player's prompt
* NPC's response
* Outcome
* References to next nodes

Base node structure:
```javascript
node_id: {
    condition: {}, // Optional
    once: true/false, // Optional, by default false
    prompt:  "What Player says", // Mandatory if not special node
    response:  "What NPC answers", 
    outcomes: [],  // Optional: effects when node is triggered
    destination_nodes: [ // Mandatory if not end node
        {
            node_id: "node_id",
            prompt_replacement: "Alternative prompt to be taken instead of desitination node_id prompt"
        }
    ]
}
```

#### Special Nodes
Each dialogue graph must have nodes with the following names:
- `start`: First time conversation with NPC
- `return`: Default node for subsequent visits
- `end`: Closes dialogue

`start` node structure:
```javascript
node_id: {
    response:  "Sarah welcomes you. What can I do for you", 
    destination_nodes: [/* ... */]
}
```

`return` node structure:
```javascript
node_id: {
    response:  "You! What has led you to Sarah again?", 
    destination_nodes: [/* ... */]
}
```

`end` node structure:
```javascript
node_id: {
    response:  "Ah, it was a nice chat. See you next time.",
}
```

If NPC is merchant, there must be `trade` node in the graph.
`trade` node structure:
```javascript
node_id: {
    response:  "Always happy to barter with a guy like you, sweetheart.", 
    destination_nodes: [/* ... */]
}
```

#### Regular Nodes and sub-dialogues
Regular nodes represent an intermidiate state in the conversation. A banch of nodes typically compond a sub-graph which shapes solid part of NPCs storyline. A sub-graph is just a logical term which is not explicitly exist in definition.

**There are a few patterns in NPCs storytelling**:
- Story: banch of nodes that explains the history of the location and particular NPC. Typically it is a story of consequqnt 2-3 nodes and additional 2-3 nodes player can clarify and ask for more details.
- Quest (task): 2-3 sequential nodes that explain the problem and the task, 2-3 additional clarification questions about the task specifics, reward and other details and 2 nodes allowing either accept the quest or reject it
- Quest (completion): 2-3 sequential nodes that state the quest completion, congratulate and reward the player

When building a NPCs dialogue graph, it is important to ensure that sub-graphs are logically interconnected and player can get to next sub-graph from the first. Examples
- player went through a NPCs story sub-graph and then as an option they can get to quest sub-graph, trade or end the conversation
- player returns to a NPC and can reach the story or the quest sub-graph just in case the missed to chance to walk through the story first time
Sub-graph interconnectivity is fundamental to ensure that all stories are reachable. `prompt_replacement` attribute can make transition from one sub-graph to another more coherent and seamless if that would sound more natural.

#### Conditions
Some nodes, typically nodes that build a quest's sub-graph, have conditions.

```javascript
node_id: {
    // ...
    conditions: { // Optional.
        op: 'AND' | 'OR', // Optional. Doesn't bring in any logic if there is only one sub-condition within the below array. If there are two and more conditions in the below array, specifies the operand between them. Default value is AND.
        condition: [
            { /*...*/ }, // at least one is required
            { /*...*/ }
        ]
    },
    // ...
}
```
Conditions might me a simple one-clause statement, or a compound condition with multiple sub-clauses.

Example of a simple condition:
```javascript
node_id: {
    // ...
    conditions: {
        condition: [
            { type: "STAT_CHECK", stat: "int", min: 7 }
        ]
    },
    // ...
}
```

Example of a compound condition:
```javascript
node_id: {
    // ...
    conditions: {
        op: "OR",
        condition: [
            { type: "NO_ITEM", "item_id": "item_id_1" },
            { type: "QUEST_STAGE", "quest_id": "quest_id_1", stage: 1 },
        ]
    },
    // ...
}
```

**Condition types:**
- `STAT_CHECK`: Check player stat (str, int, lck, hp, reputation, xp, caps)
Examples:
```javascript
condition: {
    type: "STAT_CHECK", stat: "int", min: 7 
}
```
- `QUEST_STAGE`: Check quest progress
Examples:
```javascript
condition: {
    type: "QUEST_STAGE",
    quest_id: "quest_id",
    stage: 1,
    op: 'eq' | 'neq' | 'gte' // operand is optional. if not specified, default value is eq
}
```

- `HAVE_ITEM`: Check inventory
Examples:
```javascript
condition: {
    type: "HAVE_ITEM":  item_id: "item_id_1" 
}
```

- `NO_ITEM`: Check inventory
Examples:
```javascript
condition: {
    type: "NO_ITEM":  item_id: "item_id_1" 
}
```

#### Outcomes
Array of outcome objects that trigger when a node is shown:

```javascript
outcomes: [
    { type: "NPC_UNLOCK", location_id: "location_id" , npc_id: "npc_id"},
    { type: "NPC_LOCK", location_id: "location_id" , npc_id: "npc_id"},
    { type: "LOCATION_UNLOCK", location_id: "location_id" },
    { type: "QUEST_SET_STAGE", quest_id:  "quest_id", stage: 1 },
    { type: "ITEM_GAIN", item_id: "item_id_1" },
    { type: "ITEM_LOSE", item_id: "item_id_2" },
    { type: "STAT_CHANGE", stat: "xp", value: 200 },
    { type: "REPUTATION_CHANGE", value:  5 },
]
```

#### 3.6 Battle nodes

A dialogue node can represent an **encounter** that triggers the interactive Battle Screen instead of showing a single response. Use this for hostile creatures, hazards, or scripted fights.

**Battle node structure:**
```javascript
node_id: {
    mode: "battle",
    enemy: "enemy_id",   // key in ENEMIES_DATA
    prompt: "[Hold your ground]",
    response: "[ Flavor text after battle, or when entering. ]",
    outcomes: [ /* applied when battle ends (e.g. STAT_CHANGE, QUEST_SET_STAGE) */ ],
    destination_nodes: [
        { "node_id": "next_node_id" }  // where to go after victory
    ]
}
```

*   **`mode: "battle"`** — Identifies this node as a battle; entering it navigates to the Battle Screen.
*   **`enemy`** — Required; must match a key in `ENEMIES_DATA` (e.g. `"rat"`).
*   **`prompt`** — Shown on the previous node as the player’s choice (e.g. “[Hold your ground]”).
*   **`response`** — Narrative showned after the battle as post-victory flavor.
*   **`outcomes`** — Applied when the battle ends (e.g. HP/XP changes, quest stage). On player defeat, standard Game Over applies; node outcomes are not applied.

When the player selects an option whose **destination** is a battle node, the client must navigate to the Battle Screen with `locationId`, `npcId`, `battleNodeKey` (the node’s id), and `enemyId` (`enemy`), rather than opening the Dialogue Screen for that node.

### Dialogue guidance and recommendations

#### 3.1 Special Nodes

Each NPC `dialogue_graph` MUST contain three mandatory, special nodes: `start`, `return`, and `end`. The `trade` node is mandatory for merchants. These nodes form the core of the dialogue flow.

*   **`start`**: The entry point for the player's first-ever interaction with an NPC. This node's primary purpose is to introduce the character and provide initial pathways into their main dialogue sub-graphs (e.g., story, quests, trade).

*   **`return`**: **The central dialogue hub.** This node is the entry point for all subsequent interactions with the NPC after the first meeting.
    *   **CRITICAL RULE:** No dialogue sub-graph (like a story chain or quest interaction) should ever terminate with an `end` node unless it is narratively required for the NPC to permanently cease communication.
    *   **CRITICAL RULE:** Instead of `end`, dialogue branches MUST loop back to the `return` node. This is achieved by making the last node of a sub-graph point to `return`. A `prompt_replacement` should be used to provide a context-appropriate transition, such as "What else can you tell me?" or "Let's talk about something else."
    *   **Example of a correct loop:**
        ```javascript
        "story_node_3": {
            "prompt": "And what happened then?",
            "response": "That's a story for another day.",
            "destination_nodes": [
                // CORRECT: Loops back to the main hub instead of ending the conversation.
                { "node_id": "return", "prompt_replacement": "Alright, let's talk about something else." }
            ]
        }
        ```

*   **`end`**: This node is ONLY for explicitly ending the conversation from the main `return` hub. It should almost always be a direct destination from the `return` node, giving the player a clear "goodbye" option. It should NOT be the termination point for individual story or quest lines.

*   **`trade`**: A mandatory node for any NPC where `is_merchant` is `true`. After the trade interaction is complete, it MUST loop back to the `return` node.




**Storytelling and Dialogue Flow**:
- For half of all NPCs make their stories 90 seconds long. Break it down into chain of 2-3-4 nodes.
- Avoid merging NPCs stories with quests, especially right at the first node. Let player ask something that takes them to the quest opening nodes. 
- When a NPC proposes a quest, provide more options to collect more information about the task. Provide an option to reject it and options that help player to immerse into the world more, allow options with clarifation questions, ask sometimes about the reward
- Annotate and self-document the logic and connections between nodes and storytelling.
- Always provide `start` for new encounters
- End conversation threads with `end`
- Always add a short prefix in prompt like "[INT 5]" when the node has a condition.
* Avoid Dead Ends: After a specific interaction like trading or hearing a piece of a story, the player should be returned to the main dialogue hub (like `start` or `return`) or jump to another sub-graph rather than being forced to `end` the conversation. Use `prompt_replacement` to ensure the transition feels natural.
* Non-Missable Quests: A player's `return` dialogue with a quest-giving NPC should always include a "routing" node, that helps to navigate user to a proper quest nodes depending on the quest stage:
- to the quest's introductory node if the quest has not yet been accepted (`stage: 0`). This ensures quests cannot be permanently missed.
- to a quest reminder or intermidiate node if (`stage in 1-99`)
* Contextual Return Dialogue:** If an NPC has given a quest that is currently in progress, their `return` node should feature a specific, conditional dialogue node that acknowledges the active quest status (e.g., a "quest reminder").


**Quest Integration**
- Set quest stage to 1 when accepted
- Set quest stage to 2..99 for intermidiate steps
- Set quest stage to 100 when completed
- Check quest stages in conditions to show appropriate dialogue
- Use `quest_<name>_<stage>` prefix for quest nodes
- Try using simple conditions instead of composes, give a preference to quest state instead of have item (if possible)
* **Reactive Dialogue:** Other NPCs in a location should have conditional dialogue nodes that appear only after the player has progressed in a relevant quest. This makes the world feel dynamic and responsive to the player's actions.
* **Foreshadowing and Alternative Paths:** When designing interconnected quests, consider having one NPC provide information or an item that is relevant to another NPC's quest. This can create opportunities for:
    *   Foreshadowing key plot points.
    *   Providing alternative solutions or shortcuts for quests.
    *   Adding stat checks (`LCK`, `INT`) or barter options that reward player investment and exploration.

**Stat Checks**
- INT checks for clever/technical options. 
- STR checks for physical/intimidation options.
- LCK checks for chance/intuition options.
- Reputation checks for alignment-based responses.

**Item Management**
- Always pair `HAVE_ITEM` conditions with `ITEM_LOSE` outcomes
- Quest items should have type `quest`
- Don't use `item_id:  "caps"` for currency; caps are part of player's stat


### 3.5 Dialogue Flow Guardrails

To ensure a non-blocking and player-friendly experience, every `dialogue_graph` must adhere to the following structural guardrails, centered around the `return` node.

*   **Guardrail #1: Perpetual Story Availability.** The `return` node MUST always contain a non-conditional destination node that leads back to the beginning of the NPC's main story sub-graph (e.g., `story_1`). This ensures a player can never permanently miss an NPC's backstory, even if they skip it during the first conversation. A `prompt_replacement` should be used to rephrase the entry as a reminder (e.g., "Can you tell me about yourself again?").

*   **Guardrail #2: Perpetual Quest Availability.** For every quest an NPC can give, the `return` node MUST contain a conditional destination node that leads to that quest's introductory node.
    *   This node's condition MUST be `{ "type": "QUEST_STAGE", "quest_id": "the_quest_id", "stage": 0 }`.
    *   This ensures that if a player rejects a quest or ignores it, they will always have the option to start it on a subsequent visit.

*   **Guardrail #3: Guaranteed Quest State Handling.** The `return` node MUST include conditional destination nodes for every potential "in-progress" and "ready for completion" state of a quest the NPC is involved in.
    *   **Reminders:** For intermediate stages (`stage > 0` and `stage < 100`), include a conditional "reminder" node (e.g., "How's that task going?").
    *   **Completion:** For the final step, include a conditional node that checks for the completion criteria (e.g., `{ "type": "HAVE_ITEM", "item_id": "macguffin" }` or `{ "type": "QUEST_STAGE", "quest_id": "the_quest_id", "stage": 99 }`). This node MUST lead to the quest completion sub-graph.

**Example `return` node implementing these guardrails:**
```javascript
"return": {
    "response": "You're back. What do you need?",
    "destination_nodes": [
        // Guardrail #1: Perpetual Story Access
        { "node_id": "story_1", "prompt_replacement": "Tell me about this place again." },

        // Guardrail #2: Perpetual Quest Offer
        { "node_id": "quest_filter_intro", "prompt_replacement": "You mentioned having a problem?" },

        // Guardrail #3: Quest State Handling (Reminder)
        { "node_id": "quest_filter_reminder" }, // This node is conditional for stage 1

        // Guardrail #3: Quest State Handling (Completion)
        { "node_id": "quest_filter_completion" }, // This node is conditional for having the item

        // Standard options
        { "node_id": "trade" }, // If merchant
        { "node_id": "end" }    // The "goodbye" option
    ]
}
```

**Guardrails**
- Once dialogue graph is generated, ensure there are always exist unconditional nodes in conversation (e.g. at least one garanteed path to finish the dialogue)
- Check all nodes are reachable from start_first_time or from start_return
- If a NPC proposes a quest, in start_return node never blindly assume that the player accepted the quest:
    - the message should be quest specific
    - nodes should allow to get to the quest task again


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
- any other sequential number represents intermidiate stages (multi-step quests)
- 100 - completed


**Quest Examples** (not limited by the follwoing, be creative in working out new architypes):
1. The Missing item: NPC_A needs the player to retrieve ITEM_B from LOCATION_C. Stages:
- "Talk to NPC_A in LOCATION_A to get the quest."
- "Travel to LOCATION_B."
- "Acquire ITEM_A (found in container, on a character, or requires a skill check)."
- "Return ITEM_A to NPC_A."
2. Build / Repair an item: NPC_A needs the player to retrieve multiple items to get the ultimate result. Optionally, some of the items can be traded, some got as a dilaogue outcome. Some of items may be in various locations.
3. Reconstruct the story from different opinions: NPC_A tells about a story with some other NPCs. Player needs to talk to all of them to dig into the full picture.
4. The Delivery: NPC_A in LOCATION_A gives the player ITEM_A to deliver to NPC_B in LOCATION_B. Stages:
- "Talk to NPC_A to get the quest and ITEM_A."
- "Travel to LOCATION_B."
- "Give ITEM_A to NPC_B."
- "(Optional) Return to NPC_A for a bonus reward."
5. Eliminate someone: NPC_A wants the player to eliminate NPC_B, who is usually located in a dangerous area. Stages:
- "Talk to NPC_A to get the target."
- "Travel to the target's location."
- "Eliminate NPC_B (through dialogue, combat, or stealth)."
- "Return to NPC_A for payment."
6. INVESTIGATION: NPC_A asks player to investigate strange events at LOCATION_B. Requires talking to 2-3 NPCs.
7. BARTER OR CHAT CHAIN
- Multi-step trading: Get ITEM_A to NPC A, trade to NPC_B for ITEM_B, trade to NPC_C for ITEM_C, return ITEM_C to NPC_A.
- Multi-step chat: Talks to NPC_A, then to NPC_B, return to NPC_A. Could be 2-3 iterations. Example: conlfict negotiation.
8. REPUTATION UNLOCK - "Proving Your Worth" - NPC_A won't help until player completes any quest in the location
9. MORAL CHOICE - "The Double Deal" - Two NPCs offer conflicting quests for the same objective. Player can only complete one.


## 4.5 Enemy Data (ENEMIES_DATA)

Enemies are used by **battle nodes** in the dialogue graph. Each enemy defines combat stats and display name.

```javascript
const ENEMIES_DATA = {
    enemy_id: {
        name: "Display Name",      // e.g. "Rat"
        lck: 1,                    // luck (1–10 typical); affects hit/crit/miss/self-harm chances
        health: 10,                // max HP
        minDamage: 2,
        maxDamage: 10,
        xp: 50                     // optional; XP granted on victory
    }
};
```

*   **`name`** — Shown in the Battle Screen and in combat log lines (e.g. “Rat does 3 damage”).
*   **`lck`** — Creature’s luck; used to resolve the attacker’s outcome (deal damage, critical, miss, self-harm) when the creature attacks.
*   **`health`** — Starting and maximum HP for this enemy.
*   **`minDamage`** / **`maxDamage`** — Normal hit damage is a random integer in `[minDamage, maxDamage]` (inclusive). Critical hit damage = **`maxDamage * 1.5`** (rounded as defined in Combat Rules).
*   **`xp`** — Optional; if present, can be granted to the player on victory (implementation may apply this via battle node outcomes instead).


## 4.6 Combat Rules

These rules apply on the Battle Screen when resolving each turn (creature turn, then player turn, per round).

### Damage formulas

*   **Creature damage (vs player):**
    *   Source: `ENEMIES_DATA[enemyId].minDamage`, `maxDamage`, `health`.
    *   Normal hit: random integer in `[minDamage, maxDamage]`.
    *   Critical hit: **`maxDamage * 1.5`** (round to integer; e.g. `Math.floor(maxDamage * 1.5)`).
*   **Player damage (vs creature):**
    *   **minDamage = max(str * 0.7, 1)** (str = player STR). Round to integer.
    *   **maxDamage = str * 1.3** (use integer if desired, e.g. floor).
    *   Normal hit: random in `[minDamage, maxDamage]`.
    *   Critical hit: **`maxDamage * 1.5`** (round to integer).

### Turn outcome (luck-based)

Each turn, the **attacker** gets exactly one of four outcomes. The attacker is either the creature (use creature’s `lck`) or the player (use player’s `lck`). The probabilities are derived from the attacker’s **luck** value as follows.

**Probability distribution (from damage-probabilities table):**

The illustration defines exact probabilities per 5% segments for **Luck 1**, **Luck 5**, and **Luck 10**. Use the following canonical table; for other luck values (2–4, 6–9), **linearly interpolate** between the two nearest rows.

| Luck | (d) Harm to self | (c) Miss | (a) Deals damage | (b) Critical hit |
|------|------------------|----------|------------------|------------------|
| **1**  | 20% | 30% | 50% | 0%  |
| **5**  | 10% | 20% | 60% | 10% |
| **10** | 0%  | 10% | 70% | 20% |

*   **(d) Harm to self** — Attacker takes damage applied to self. **Self-harm damage range:** creature **`[1, minDamage]`** (creature’s min only); player **`[1, str*0.7]`** (i.e. 1 to player min damage, same floor as normal min).
*   **(c) Miss** — No damage to target.
*   **(a) Deals damage** — Normal damage to target (random in min–max range).
*   **(b) Critical hit** — Critical damage (maxDamage × 1.5) to target.

**Implementation:** Given attacker luck L (1–10), compute P(d), P(c), P(a), P(b) from the table (interpolate for L ∉ {1, 5, 10}). Roll once per turn to choose one of the four outcomes; then apply the chosen outcome. For (a)/(b), use the attacker’s normal or critical damage roll to the target. For (d), use a damage roll in **`[1, minDamage]`** for a creature (attacker’s min only) or **`[1, max(str*0.7, 1)]`** for the player (1 to player min damage), applied to self.

### Combat log messages

Use short, consistent lines so the log stays readable. Examples:

*   Creature hits player: **`"{Enemy name} does {N} damage"`**
*   Player hits creature: **`"You damage the {enemy name} by {N} points"`** or **`"You do {N} damage to the {enemy name}"`**
*   Creature misses: **`"{Enemy name} misses you"`**
*   Player misses: **`"You miss the {enemy name}"`**
*   Creature critical: **`"{Enemy name} does {N} critical damage"`**
*   Player critical: **`"You do {N} critical damage"`** or **`"You do {N} critical damage to the {enemy name}"`**
*   Self-harm (creature): **`"{Enemy name} hurts itself for {N} damage"`**
*   Self-harm (player): **`"You hurt yourself for {N} damage"`**

Battle ends when the creature’s current HP ≤ 0 (victory) or the player’s current HP ≤ 0 (defeat → Game Over). On victory, apply the battle node’s **outcomes** and navigate to the node’s **destination_nodes** (first valid destination).


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

## Worked out reference example

```javascript
const LOCATION_DATA = {
    "neon_nexus": {
        "name": "Neon Nexus",
        "description": "A bustling marketplace cobbled together in the ruins of an old subway station. The air hums with the glow of repurposed neon signs and the chatter of traders.",
        "npcs": ["zane", "mara"]
    }
};

const NPC_DATA = {
    "neon_nexus": {
        "zane": {
            "name": "Zane",
            "description": "A jittery technician with a constant stream of data flowing through his cybernetic eye. He seems to be tinkering with a datapad.",
            "is_merchant": true,
            "inventory": ["stimpack", "military_goggles"],
            "dialogue_graph": {
                // start node lists all possible sub-graphs
                "start": {
                    "response": "Whoa there, new face. Welcome to the Nexus. I'm Zane. You looking to trade, or just soaking in the ambiance?",
                    "destination_nodes": [
                        { "node_id": "nexus_story_1" },
                        { "node_id": "quest_intro" },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                // return node allows to remind the location storu again and ensures acces to all other available sub-graphs (i.e. trade and quest-related). Important: NPCs reposnse doesn't allude the quest was accepted or completed.
                "return": {
                    "response": "You're back. Good.",
                    "destination_nodes": [
                        { "node_id": "nexus_story_1", "prompt_replacement": "Hey, can you remind me what this place is?"},
                        { "node_id": "trade" },
                        { "node_id": "quest_into", "prompt_replacement": "You were saing something about problems with power supply, weren't you?" }, // this option is conditional and allows to get to the quest if it wasn't accepted the first time
                        { "node_id": "quest_reminder" }, // this option is conditional and shows up only if Zane's quest was accepted
                        { "node_id": "end" }
                    ]
                },
                // nexus_story_1 and nexus_story_2 tell the story. Then open a gate to a quest sub-graph
                "nexus_story_1": {
                    "prompt": "Tell me about this place.",
                    "response": "This? This is the heart of the sector. Built from the bones of an old subway. We've got power, trade, and relative safety. What more could you want?",
                    "destination_nodes": [
                        { "node_id": "nexus_story_2" }
                    ]
                },
                "nexus_story_2": {
                    "prompt": "How do you keep the power on?",
                    "response": "That's my department. Scavenged geothermal regulators. Tricky to maintain, but they keep the lights on and the mutants out. It's a constant battle, though. Parts are scarce.",
                    "destination_nodes": [
                        { "node_id": "quest_intro" },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "trade": {
                    "prompt": "Let's see what you've got.",
                    "response": "Always happy to barter. My gear is top-notch, you won't find better.",
                    "destination_nodes": [
                        { "node_id": "start", "prompt_replacement": "Anything else I can help with?"}
                    ]
                },
                "quest_intro": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "glitch_in_the_system", "stage": 0 },
                    "prompt": "You seem like you have a problem.",
                    "response": "Astute observation. One of my critical regulators is failing. The diagnostic signature is... corrupted. I need someone to plant a data scrambler on the main junction box to force a reset. The problem is, it's deep in the old service tunnels.",
                    "outcomes": [],
                    "destination_nodes": [
                        { "node_id": "quest_accept" },
                        { "node_id": "quest_details" },
                        { "node_id": "quest_reject" }
                    ]
                },
                "quest_details": {
                    "prompt": "Tell me more about these tunnels.",
                    "response": "Dark, tight, and full of... well, let's just say the original maintenance crews aren't around anymore. But you look like you can handle yourself. The junction box is in the main control room. You can't miss it.",
                    "destination_nodes": [
                        { "node_id": "quest_accept" },
                        { "node_id": "quest_reject" }
                    ]
                },
                "quest_accept": {
                    "prompt": "I'll do it. Where's this scrambler?",
                    "response": "That's the spirit! Here, take it. Just place it on the junction box. It'll do the rest. Be careful down there.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "glitch_in_the_system", "stage": 1 },
                        { "type": "ITEM_GAIN", "item_id": "data_scrambler" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_reject": {
                    "prompt": "Sounds too dangerous. I'm out.",
                    "response": "Your loss. Don't come crying to me when the lights go out for good.",
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_reminder": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "glitch_in_the_system", "stage": 1 },
                    "prompt": "About that regulator...",
                    "response": "The clock is ticking. Get that scrambler on the junction box before the whole grid goes dark.",
                    "destination_nodes": [
                        { "node_id": "quest_completion" } // conditional, if player has the required item
                        { "node_id": "end" }
                    ]
                },
                "quest_completion": {
                    "condition": { "type": "HAVE_ITEM", "item_id": "adaptive_circuit" },
                    "prompt": "I found this adaptive circuit near the junction after the reset.",
                    "response": "An adaptive circuit? And it's intact! This... this is incredible. This is the missing piece I needed! You didn't just reset the system, you've given me a way to upgrade it. I'm in your debt. Here, take this for your trouble. You've earned it.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "glitch_in_the_system", "stage": 100 },
                        { "type": "ITEM_LOSE", "item_id": "adaptive_circuit" },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 300 },
                        { "type": "STAT_CHANGE", "stat": "cap", "value": 250 },
                        { "type": "REPUTATION_CHANGE", "value": 10 }
                    ],
                    "destination_nodes": [
                        { "node_id": "end", "prompt_replacement": "Happy to help!" }
                    ]
                },
                "end": {
                    "prompt": "See you around.",
                    "response": "Stay sharp out there."
                }
            }
        },
        "mara": {
            "name": "Mara",
            "description": "A stoic scavenger with a haunted look in her eyes. She carries a well-maintained rifle and watches the market crowds with suspicion.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "What do you want? I'm busy.",
                    "destination_nodes": [
                        { "node_id": "mara_story_1" },
                        { "node_id": "mara_zane_story_1" },
                        { "node_id": "zane_quest" }, // conditional, if Zane's quest has started
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You again. State your business.",
                    "destination_nodes": [
                        { "node_id": "mara_story_1", "prompt_replacement": "My memory serves me poor, could you please remind me what do you do here?" },
                        { "node_id": "mara_zane_story_1" },
                        { "node_id": "zane_quest" }, // conditional, if Zane's quest has started
                        { "node_id": "end" }
                    ]
                },
                "mara_story_1": {
                    "prompt": "What's your story?",
                    "response": "My story is written in scrap and survival. I was part of a scavenger crew out of the Rust Canyons. We were good. Too good.",
                    "destination_nodes": [
                        { "node_id": "mara_story_2" }
                    ]
                },
                "mara_story_2": {
                    "prompt": "What happened to your crew?",
                    "response": "We hit an old-world tech depot. Alarms, automated defenses... a slaughter. I was the only one who made it out. I carry their tags to remember them.",
                    "destination_nodes": [
                        { "node_id": "mara_story_3" }
                    ]
                },
                 "mara_story_3": {
                    "prompt": "That's rough. What are you doing here?",
                    "response": "Lying low. Trading what I can find. The Nexus is safer than the wastes, but nowhere is truly safe. You learn that fast.",
                    "destination_nodes": [
                        { "node_id": "mara_zane_story_1" }, // allows to transit from mara_story sub-graph to mara_zane_story
                        { "node_id": "end" }
                    ]
                },
                "mara_zane_story_1": {
                    "prompt": "What do you know about Zane?",
                    "response": "The tech-head? He keeps the lights on, so people tolerate his... eccentricities. He's obsessed with the old tech. Thinks it holds all the answers.",
                    "destination_nodes": [
                        { "node_id": "mara_zane_story_2" }
                    ]
                },
                "mara_zane_story_2": {
                    "prompt": "You don't trust him?",
                    "response": "I don't trust anyone who thinks machines are more reliable than people. He sent my last partner on a 'simple' salvage run into the tunnels. He never came back.",
                    "destination_nodes": [
                        { "node_id": "mara_zane_story_3" }
                    ]
                },
                "mara_zane_story_3": {
                    "prompt": "He sent me into those tunnels.",
                    "response": "Did he now? Then be careful. His 'simple' runs have a way of getting complicated. My partner was looking for an 'adaptive circuit'. Never even knew what it was for. Just a prize for Zane to play with.",
                    "destination_nodes": [
                        { "node_id": "mara_story_1" }, // allows to transit from mara_zane_story sub-graph to mara_story
                        { "node_id": "zane_quest" }, // conditional, if Zane's quest has started
                        { "node_id": "end" }
                    ]
                },
                "zane_quest": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "glitch_in_the_system", "stage": 1 },
                    "prompt": "Zane asks for help with his regulator. Do you know what is that?",
                    "response": "Ah, yes, I have adaptaive cicuit.",
                    "outcomes": [],
                    "destination_nodes": [
                        { "node_id": "zane_quest_barter" }, // conditional if user has
                        { "node_id": "zane_quest_get_for_free" }, // conditional if LCK gre 7
                        { "node_id": "end", "prompt_replacement": "Ah, nothing. Forget it."} // fallback if any of the conditions above are met
                    ]
                },
                "zane_quest_get_for_free": {
                    "condition": { "type": "STAT_CHECK", "stat": "int", "min": 7  },
                    "prompt": "[LCK 7] Can I get it for free? Pleeease",
                    "response": "Sure, why not?! Power supply is crutial for Neon Nexus, we all will benefit form properly working power generator.",
                    "outcomes": [
                        { "type": "ITEM_GAIN", "item_id": "adaptive_circuit" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end", "prompt_replacement": "You are so kind! You made my day!" }
                    ]
                },
                "zane_quest_barter": {
                    "condition": { "type": "HAVE_ITEM", "item_id": "data_scrambler" },
                    "prompt": "Is there a way to get it?",
                    "response": "Sure, why not?! You give me data scrambler, I'll give you adaptive_circuit. Deal?",
                    "outcomes": [
                        { "type": "ITEM_LOSE", "item_id": "data_scrambler" },
                        { "type": "ITEM_GAIN", "item_id": "adaptive_circuit" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end", "prompt_replacement": "It seems there was any other way. Thanks." }
                    ]
                },
                "end": {
                    "prompt": "I'll leave you to it.",
                    "response": "Good."
                }
            }
        }
    }
};

const QUEST_DATA = {
    "glitch_in_the_system": {
        "title": "Glitch in the System",
        "description": "Zane, the technician in Neon Nexus, needs help resetting a failing power regulator by planting a data scrambler in the old service tunnels.",
        "location": "neon_nexus",
        "giver": "zane",
        "stages": {
            "0": "Not started",
            "1": "Plant the data scrambler on the junction box in the service tunnels.",
            "100": "Completed"
        },
        "rewards": {
            "items": [],
            "stat_change": [
                { "stat": "xp", "value": 300 },
                { "stat": "cap", "value": 250 },
                { "stat": "reputation", "value": 10 }
            ]
        }
    }
};

const ITEMS_DATA = {
    "data_scrambler": {
        "name": "Data Scrambler",
        "tradeable": false,
        "type": "quest",
        "price": 0
    },
    "adaptive_circuit": {
        "name": "Adaptive Circuit",
        "tradeable": false,
        "type": "quest",
        "price": 0
    },
    "stimpack": {
        "name": "Stimpack",
        "tradeable": true,
        "type": "consumable",
        "stat_change": [
            { "stat": "hp", "value": 20 }
        ],
        "price": 50
    },
    "military_goggles": {
        "name": "Military Goggles",
        "tradeable": true,
        "type": "gear",
        "stat_change": [
            { "stat": "int", "value": 1 }
        ],
        "price": 120
    }
};
```