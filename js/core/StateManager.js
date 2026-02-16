const GAME_STATE_STORAGE_KEY = 'terminal-echo-game-state';
const SAVE_DEBOUNCE_MS = 400;

class StateManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.state = this.getInitialState();
        this.restoredFromStorage = false;
        const saved = this._loadFromStorage();
        if (saved && typeof saved === 'object' && saved.player && Array.isArray(saved.unlocked_locations)) {
            this.state = { ...this.getInitialState(), ...saved };
            if (this.state.player && Array.isArray(this.state.player.inventory)) {
                this.state.player.inventory = StateManager.normalizeInventory(this.state.player.inventory);
            }
            if (this.state.npc_inventories && typeof this.state.npc_inventories === 'object') {
                Object.keys(this.state.npc_inventories).forEach(key => {
                    this.state.npc_inventories[key] = StateManager.normalizeNpcInventory(this.state.npc_inventories[key]);
                });
            }
            this.restoredFromStorage = true;
        }
        this._saveDebounceTimer = null;
        this.eventBus.on('updateState', (newState) => this.updateState(newState));
    }

    _loadFromStorage() {
        try {
            const raw = typeof localStorage !== 'undefined' && localStorage.getItem(GAME_STATE_STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    _saveToStorage() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(this.state));
            }
        } catch (e) {
            console.warn('Could not save game state to localStorage:', e);
        }
    }

    _scheduleSave() {
        if (this._saveDebounceTimer) clearTimeout(this._saveDebounceTimer);
        this._saveDebounceTimer = setTimeout(() => {
            this._saveDebounceTimer = null;
            this._saveToStorage();
        }, SAVE_DEBOUNCE_MS);
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
                // Array of { item_id: string, quantity: number }; supports multiple of same item
            inventory: [],
                convo_history: {},
            },
            gameMode: 'scripted',
            currentLocation: 'still_quarter',
            unlocked_locations: ['still_quarter'],
            unlocked_npcs: {}, // Format: { "location_id": ["npc_id1", "npc_id2", ...] }
            locked_npcs: {}, // Format: { "location_id": ["npc_id1", "npc_id2", ...] } - NPCs that were locked via NPC_LOCK
            currentScreen: 'MainMenu',
            quests: {},
            quest_completion_order: [], // quest_id in order completed (most recent last); used to show "last completed" at top of completed block
            eventHistory: [],
            has_new_location_unlocked: false,
            newly_unlocked_location_id: null,
            newly_unlocked_npcs: {}, // { "location_id": ["npc_id1", ...] } — show pulse until player talks to that NPC once
            // Onboarding: show world map intro on first visit; fire game_started once; fire first_quest_completed once
            has_seen_world_map_intro: false,
            game_started_fired: false,
            first_quest_completed_fired: false,
            newly_unlocked_inventory: false, // pulse on inventory at Still Quarter until player opens inventory once
            inventory_unlocked_at_still_quarter: false, // once true, always show inventory block at Still Quarter even if empty
            // Dialogue "once" nodes: player can enter only once per NPC. Key: "locationId|npcId", value: ["node_id", ...]
            dialogue_nodes_visited_once: {},
            // NPC inventories persist between trading sessions. Key: "locationId|npcId", value: [{ item_id, quantity }, ...]
            npc_inventories: {},
            // Show waitlist popup once when player first arrives at The Forgotten Outpost
            forgotten_outpost_waitlist_shown: false
        };
    }

    /**
     * Called after onboarding narrative: set full game state with player name and default stats, then go to home location.
     * @param {string} playerName - Name from the name screen
     */
    startGameStateFromOnboarding(playerName) {
        const initial = this.getInitialState();
        initial.player = {
            ...initial.player,
            name: playerName || initial.player.name,
            str: 1,
            int: 1,
            lck: 1,
            hp: 20,
            maxHp: 20
        };
        initial.currentLocation = 'still_quarter';
        initial.unlocked_locations = ['still_quarter'];
        initial.currentScreen = 'Location';
        initial.has_seen_world_map_intro = false;
        initial.game_started_fired = false;
        initial.first_quest_completed_fired = false;
        initial.newly_unlocked_inventory = false;
        initial.inventory_unlocked_at_still_quarter = false;
        this.state = initial;
        this.eventBus.emit('stateUpdated', this.state);
    }

    getState() {
        return this.state;
    }

    /**
     * Normalize inventory to array of { item_id, quantity }. Accepts legacy format (array of strings).
     * @param {Array} inv - Raw player.inventory
     * @returns {Array<{ item_id: string, quantity: number }>}
     */
    static normalizeInventory(inv) {
        if (!Array.isArray(inv)) return [];
        return inv.map(entry => {
            if (typeof entry === 'string') {
                return { item_id: entry, quantity: 1 };
            }
            const q = Math.max(1, parseInt(entry.quantity, 10) || 1);
            return { item_id: entry.item_id || entry.id || '', quantity: q };
        }).filter(e => e.item_id);
    }

    /** Total number of items (sum of quantities). */
    static getInventoryTotalCount(inv) {
        return StateManager.normalizeInventory(inv).reduce((sum, e) => sum + e.quantity, 0);
    }

    /** Quantity of a specific item_id. */
    static getInventoryQuantity(inv, itemId) {
        const slot = StateManager.normalizeInventory(inv).find(e => e.item_id === itemId);
        return slot ? slot.quantity : 0;
    }

    /** Add item(s). Returns new inventory array (same format). Merges into existing slot if present. */
    static addInventoryItem(inv, itemId, quantity = 1) {
        const normalized = StateManager.normalizeInventory(inv);
        const idx = normalized.findIndex(e => e.item_id === itemId);
        if (idx >= 0) {
            const next = normalized.slice();
            next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
            return next;
        }
        return [...normalized, { item_id: itemId, quantity }];
    }

    /** Remove up to `quantity` of itemId. Returns new inventory array. */
    static removeInventoryItem(inv, itemId, quantity = 1) {
        const normalized = StateManager.normalizeInventory(inv);
        const idx = normalized.findIndex(e => e.item_id === itemId);
        if (idx < 0) return normalized;
        const slot = normalized[idx];
        const remove = Math.min(quantity, slot.quantity);
        if (remove >= slot.quantity) {
            return normalized.filter((_, i) => i !== idx);
        }
        const next = normalized.slice();
        next[idx] = { ...slot, quantity: slot.quantity - remove };
        return next;
    }

    /**
     * Normalize NPC inventory from data (strings or { item_id, quantity }) and merge by item_id (one slot per item).
     * @param {Array} inv - Raw NPC inventory from data
     * @returns {Array<{ item_id: string, quantity: number }>}
     */
    static normalizeNpcInventory(inv) {
        if (!Array.isArray(inv)) return [];
        const normalized = inv.map(entry => {
            if (typeof entry === 'string') return { item_id: entry, quantity: 1 };
            const q = Math.max(1, parseInt(entry.quantity, 10) || 1);
            return { item_id: entry.item_id || entry.id || '', quantity: q };
        }).filter(e => e.item_id);
        const byId = {};
        normalized.forEach(e => {
            byId[e.item_id] = (byId[e.item_id] || 0) + e.quantity;
        });
        return Object.entries(byId).map(([item_id, quantity]) => ({ item_id, quantity }));
    }

    /**
     * Records that a "once" dialogue node was visited. Updates state directly so it is not lost in merge.
     * @param {string} locationId
     * @param {string} npcId
     * @param {string} nodeId
     */
    recordDialogueNodeVisitedOnce(locationId, npcId, nodeId) {
        const onceKey = `${locationId}|${npcId}`;
        const prev = this.state.dialogue_nodes_visited_once || {};
        const list = prev[onceKey] || [];
        if (list.includes(nodeId)) return;
        const updated = JSON.parse(JSON.stringify(this.state));
        if (!updated.dialogue_nodes_visited_once) updated.dialogue_nodes_visited_once = {};
        updated.dialogue_nodes_visited_once[onceKey] = [...list, nodeId];
        this.state = updated;
        this.eventBus.emit('stateUpdated', this.state);
        this._saveToStorage();
    }

    resetState() {
        this.state = this.getInitialState();
        try {
            if (typeof localStorage !== 'undefined') localStorage.removeItem(GAME_STATE_STORAGE_KEY);
        } catch (e) {}
        console.log("State reset to initial state");
        this.eventBus.emit('stateUpdated', this.state);
    }

    loadState(savedState) {
        // Validate that the saved state has the required structure
        if (!savedState || typeof savedState !== 'object') {
            throw new Error('Invalid save file format');
        }
        
        // Merge saved state with current state to ensure all required fields exist
        const initialState = this.getInitialState();
        this.state = { ...initialState, ...savedState };
        if (this.state.player && Array.isArray(this.state.player.inventory)) {
            this.state.player.inventory = StateManager.normalizeInventory(this.state.player.inventory);
        }
        if (this.state.npc_inventories && typeof this.state.npc_inventories === 'object') {
            Object.keys(this.state.npc_inventories).forEach(key => {
                this.state.npc_inventories[key] = StateManager.normalizeNpcInventory(this.state.npc_inventories[key]);
            });
        }
        this._saveToStorage();
        console.log("State loaded from save file");
        this.eventBus.emit('stateUpdated', this.state);
    }

    getPlayerStats() {
        return this.state.player;
    }

    getEffectivePlayerStats() {
        const baseStats = { ...this.getPlayerStats() };
        const inventory = StateManager.normalizeInventory(baseStats.inventory || []);

        // Apply gear bonuses (once per slot; multiple of same gear don't stack)
        inventory.forEach(entry => {
            const itemData = ITEMS_DATA[entry.item_id];
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
                // Merge objects (like player, quests, dialogue_nodes_visited_once); use {} if key was missing (e.g. old save)
                updatedState[key] = { ...(updatedState[key] || {}), ...newState[key] };
            } else {
                // Overwrite primitives and arrays
                updatedState[key] = newState[key];
            }
        }
        
        this.state = updatedState;
        console.log("State updated:", this.state);
        this.eventBus.emit('stateUpdated', this.state);
        this._scheduleSave();

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
                
                // Track game over event (will be handled by NavigationManager or App)
            }
        }
    }

    checkLevelUp(oldPlayerState, newPlayerState) {
        const player = this.state.player;
        const xpThresholds = [
            null,      // Level 0 doesn't exist
            500,        // From level 1 to 2
            1000,      // From level 2 to 3
            2000,      // From level 3 to 4
            5000,      // From level 4 to 5
            10000,     // From level 5 to 6
            20000,     // From level 6 to 7
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
            
            // Emit level up event for popup
            this.eventBus.emit('levelUp', {
                level: currentLevel,
                oldLevel: currentLevel - 1
            });
            
            // Emit PostHog event for level up (keeping existing implementation)
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