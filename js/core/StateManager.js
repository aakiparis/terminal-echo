class StateManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.state = this.getInitialState();
        this.eventBus.on('updateState', (newState) => this.updateState(newState));
    }

    getInitialState() {
        return {
            player: {
                name: 'Gotten',
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
            unlocked_locations: ['neon_nexus','rust_pit'],
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
}