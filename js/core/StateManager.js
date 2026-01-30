class StateManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.state = this.getInitialState();
        this.eventBus.on('updateState', (newState) => this.updateState(newState));
    }

    getInitialState() {
        return {
            player: {
                name: 'Echo',
                level: 1,
                hp: 20,
                maxHp: 20,
                xp: 0,
                caps: 10,
                str: 1,
                int: 1,
                lck: 1,
                reputation: 0, // e.g., -100 (Shady) to +100 (Honorable)
                inventory: [],
                // inventory: ['stim_pack', 'nano_gloves'], // Will hold item IDs
                convo_history: {},
            },
            gameMode: 'scripted',
            currentLocation: 'neon_nexus',
            unlocked_locations: ['neon_nexus'],
            unlocked_npcs: {}, // Format: { "location_id": ["npc_id1", "npc_id2", ...] }
            currentScreen: 'MainMenu',
            quests: {},
            eventHistory: []
        };
    }

    getState() {
        return this.state;
    }

    getPlayerStats() {
        return this.state.player;
    }

    getEffectivePlayerStats() {
        const baseStats = { ...this.getPlayerStats() };
        const inventory = baseStats.inventory || [];

        // Iterate through gear in inventory and apply bonuses
        inventory.forEach(itemId => {
            const itemData = ITEMS_DATA[itemId];
            if (itemData && itemData.type === 'gear' && itemData.stat_change) {
                itemData.stat_change.forEach(change => {
                    baseStats[change.stat] = (baseStats[change.stat] || 0) + change.value;
                });
            }
        });
        baseStats.carry_capacity = 10 + baseStats.str;
        return baseStats;
    }

    updateState(newState) {
        const oldPlayerState = { ...(this.state.player || {}) };

        // Create a deep copy to avoid direct mutation
        let updatedState = JSON.parse(JSON.stringify(this.state));

        for (const key in newState) {
            if (typeof newState[key] === 'object' && newState[key] !== null && !Array.isArray(newState[key])) {
                // Merge objects (like player, quests, convo_history)
                updatedState[key] = { ...updatedState[key], ...newState[key] };
            } else {
                // Overwrite primitives and arrays
                updatedState[key] = newState[key];
            }
        }
        
        this.state = updatedState;
        console.log("State updated:", this.state);
        this.eventBus.emit('stateUpdated', this.state);

        // Level up Check
        if (newState.player && newState.player.xp !== undefined) {
            this.checkLevelUp(oldPlayerState, this.state.player);
        }

        // Check for game over condition after every state update.
        if (this.state.player && this.state.player.hp <= 0) {
            // Check if we are not already in a game over state to prevent loops.
            console.log("GAME OVER");
            if (this.state.gameMode !== 'gameOver') {
                this.state.gameMode = 'gameOver'; // Set the state
                this.eventBus.emit('gameOver');   // Emit the event
            }
        }
    }

    checkLevelUp(oldPlayerState, newPlayerState) {
        const player = this.state.player;
        const xpThresholds = [
            null,      // Level 0 doesn't exist
            1000,      // From level 1 to 2
            2000,      // From level 2 to 3
            5000,      // From level 3 to 4
            10000,     // From level 4 to 5
            20000      // From level 5 to 6
            // Add more thresholds for higher levels
        ];

        let currentLevel = newPlayerState.level;
        let requiredXp = xpThresholds[currentLevel];

        // Loop in case the player gains enough XP for multiple levels at once.
        // Continue as long as there is a defined next level and the player has enough XP.
        while (requiredXp !== null && requiredXp !== undefined && newPlayerState.xp >= requiredXp) {
            // Player leveled up!
            currentLevel++;
            
            // Update the player's level directly in the state.
            newPlayerState.level = currentLevel;

            this.eventBus.emit('log', {
                text: `LEVEL UP! You are now Level ${currentLevel}`,
                type: 'system-highlight' // Use a special type for styling if desired
            });
            
            // Emit PostHog event for level up
            if (typeof window !== 'undefined' && window.posthog) {
                window.posthog.capture('player_level_up', {
                    level: currentLevel,
                });
            }
            
            // Get the requirement for the next level.
            requiredXp = xpThresholds[currentLevel];
        }
    }
}