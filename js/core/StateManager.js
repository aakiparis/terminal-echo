class StateManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.state = this.getInitialState();
        this.eventBus.on('updateState', (newState) => this.updateState(newState));
    }

    getInitialState() {
        return {
            player: {
                name: 'User',
                level: 1,
                hp: 20,
                maxHp: 20,
                xp: 0,
                caps: 10,
                str: 1,
                int: 1,
                lck: 1,
                // --- ADDED THESE ---
                reputation: 0, // e.g., -100 (Shady) to +100 (Honorable)
                inventory: [], // Will hold item IDs
            },
            gameMode: 'scripted',
            currentLocation: 'aethelburg_sprawl',
            unlocked_locations: ['aethelburg_sprawl', 'haven'],
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

    updateState(newState) {
        // Deep merge player object to avoid overwriting nested properties
        if (newState.player) {
            newState.player = { ...this.state.player, ...newState.player };
        }
        
        this.state = { ...this.state, ...newState };
        console.log("State updated:", this.state);
        this.eventBus.emit('stateUpdated', this.state);
    }
}