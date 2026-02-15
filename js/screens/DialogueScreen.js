class DialogueScreen extends BaseScreen {
    /**
     * Initializes the components for the Dialogue screen based on the NPC and current node.
     * This version is adapted for the new data structure with destination_nodes.
     * @param {object} params - { locationId, npcId, nodeKey }
     */
    initComponents(params) {
        const HIDE_UNMET_CONDITIONS = true;

        this.locationId = params.locationId;
        this.npcId = params.npcId;

        if (!this.locationId || !this.npcId) {
            console.error("DialogueScreen is missing locationId or npcId!");
            this.navigationManager.goBack(); // Failsafe
            return;
        }

        this.npcData = NPC_DATA[this.locationId]?.[this.npcId];

        if (!this.npcData) {
            console.error(`NPC data not found for npcId: ${this.npcId}`);
            this.navigationManager.goBack(); // Go back to the previous screen
            return;
        }

        // Determine the entry node for the conversation
        let targetNodeKey;
        if (params.nodeKey) {
            targetNodeKey = params.nodeKey;
        } else {
            // Check state to see if player has met this NPC before
            const hasSpokenBefore = this.stateManager.getState().convo_history?.[this.npcId];
            targetNodeKey = hasSpokenBefore ? 'return' : 'start';
        }

        this.currentNodeKey = targetNodeKey;
        
        // Track dialogue screen event
        if (this.analyticsManager) {
            const nodeType = targetNodeKey === 'start' || targetNodeKey === 'start_first_time' ? 'start' : 'return';
            this.analyticsManager.dialogueScreen(this.npcId, nodeType);
        }
        const node = this.npcData.dialogue_graph[this.currentNodeKey];

        if (!node) {
            console.error(`Dialogue node "${this.currentNodeKey}" not found for NPC "${this.npcId}"`);
            this.navigationManager.goBack();
            return;
        }

        // --- State and Log Update ---
        // Record that the player has spoken to this NPC for the first time
        if (!params.nodeKey && !this.stateManager.getState().convo_history?.[this.npcId]) {
            const currentHistory = this.stateManager.getState().convo_history || {};
            this.stateManager.updateState({ convo_history: { ...currentHistory, [this.npcId]: true } });
        }
        // Log the NPC's response when entering a new node
        // this.eventBus.emit('log', { text: `${this.npcData.name}: "${node.response}"`, type: 'dialogue' });
        
        // --- Process Outcomes for the current node ---
        if (node.outcomes) {
            this.processOutcomes(node.outcomes);
        }

        // Record "once" node as visited after outcomes (use dedicated method so update is not lost in merge)
        const onceKey = `${this.locationId}|${this.npcId}`;
        if (node.once === true) {
            this.stateManager.recordDialogueNodeVisitedOnce(this.locationId, this.npcId, this.currentNodeKey);
        }

        // --- Initialize Components ---
        this.components.title = new ScreenTitle({ text: this.npcData.name });
        // Show NPC description only when entering dialogue from location (no nodeKey), not when landing on start/return from a dialogue choice
        const enteredFromLocation = !params.nodeKey;
        if (enteredFromLocation && (this.currentNodeKey === 'start' || this.currentNodeKey === 'return')) {
            this.components.npcDescription = new ScreenDescription({ text: this.npcData.description || '' });
        }
        this.components.description = new ScreenDescription({ text: node.response });

        // "Once" nodes: hide options that lead to a node already visited (player can enter that node only once)
        const visitedOnce = this.stateManager.getState().dialogue_nodes_visited_once || {};
        const visitedOnceForNpc = new Set(visitedOnce[onceKey] || []);

        // Map destination_nodes to menu items
        const menuItems = (node.destination_nodes || [])
        .filter(dest => {
                const targetNode = this.npcData.dialogue_graph[dest.node_id];
                // Exclude destination if it's a "once" node already visited
                if (targetNode?.once && visitedOnceForNpc.has(dest.node_id)) {
                    return false;
                }
                // If the flag is false, always show the item (current behavior).
                if (!HIDE_UNMET_CONDITIONS) {
                    return true;
                }
                // Otherwise, only include it if its conditions are met.
                return this.checkConditions(targetNode?.conditions || targetNode?.condition);
        })
        .map((dest, index) => {
            const targetNode = this.npcData.dialogue_graph[dest.node_id];
            
            // Determine the label for the choice
            let label = dest.prompt_replacement || targetNode?.prompt || dest.node_id;

            // Check conditions on the *target* node (support both old and new format)
            const conditions = targetNode?.conditions || targetNode?.condition;
            const isDisabled = !this.checkConditions(conditions);
            
            // Add stat check prefix like "[INT 5]" if it exists
            // Support both old format (condition.type) and new format (conditions.condition[0].type)
            const firstCondition = conditions?.condition?.[0] || conditions;
            if (firstCondition?.type === 'STAT_CHECK') {
                label = `[${firstCondition.stat.toUpperCase()} ${firstCondition.min}] ${label}`;
            }

            return {
                id: `option-${index}`,
                label: label,
                type: 'action',
                action: () => this.selectOption(dest), // Pass the entire destination object
                disabled: isDisabled
            };
        });

        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => {
                if (item.action && !item.disabled) item.action();
            }
        });
    }

    enter(params) {
        if (!this.locationId && params.locationId) {
            this.locationId = params.locationId;
        }
        if (!this.npcId && params.npcId) {
            this.npcId = params.npcId;
        }
        
        // Clear "newly unlocked" pulse for this NPC once the player has talked to them
        const locId = params.locationId || this.locationId;
        const nId = params.npcId || this.npcId;
        if (locId && nId) {
            const state = this.stateManager.getState();
            const newly = state.newly_unlocked_npcs || {};
            const list = newly[locId] || [];
            if (list.includes(nId)) {
                const updated = { ...newly, [locId]: list.filter(id => id !== nId) };
                this.stateManager.updateState({ newly_unlocked_npcs: updated });
            }
        }
        
        // Use the passed nodeKey, or default to the NPC's starting node.
        this.currentNodeKey = params.nodeKey || NPC_DATA[this.locationId][this.npcId].dialogue_graph.start_node || 'start_first_time';
        
        super.enter(params);
    }

    /**
     * Handles the player's selection of a dialogue option.
     * @param {object} destination - The destination object from the dialogue graph, e.g., { node_id: '...', prompt_replacement: '...' }
     */
    selectOption(destination) {
        const targetNode = this.npcData.dialogue_graph[destination.node_id];
        const label = destination.prompt_replacement || targetNode?.prompt || destination.node_id;
        
        // this.eventBus.emit('log', { text: `You:  ${label}`, type: 'system' });

        // Handle navigation to special nodes or next dialogue node
        if (destination.node_id === 'trade') {
            this.eventBus.emit('navigate', {
                screen: 'Trade',
                params: {
                    locationId: this.locationId,
                    npcId: this.npcId
                }
            });
        } else if (destination.node_id === 'end') {
            this.navigationManager.navigateTo({ screen: 'Location', params: { id: this.locationId } });
        } else {
            // Navigate to the next dialogue node within the same screen
            this.navigationManager.navigateTo({
                screen: 'Dialogue',
                params: {
                    locationId: this.locationId,
                    npcId: this.npcId,
                    nodeKey: destination.node_id
                }
            });
        }
    }

    /**
     * Processes outcomes like stat changes, item gains/losses, and quest updates.
     * @param {Array} outcomes - An array of outcome objects.
     */
    processOutcomes(outcomes) {
        const state = this.stateManager.getState();
        let playerUpdates = {};
        let rootUpdates = {};
        const questsUpdates = { ...(state.quests || {}) };
        // Track unlocked NPCs separately to accumulate multiple unlocks
        let accumulatedUnlockedNpcs = { ...(state.unlocked_npcs || {}) };
        // Track newly unlocked NPCs for the pulse indicator (cleared when player talks to them once)
        let accumulatedNewlyUnlockedNpcs = { ...(state.newly_unlocked_npcs || {}) };

        outcomes.forEach(outcome => {
            switch (outcome.type) {
                case 'STAT_CHANGE':
                    playerUpdates[outcome.stat] = (state.player[outcome.stat] || 0) + outcome.value;
                    this.eventBus.emit('log', { text: `[${outcome.stat.toUpperCase()} changed by ${outcome.value}]`, type: 'system' });
                    if (outcome.stat === 'hp' && outcome.value < 0) {
                        this.eventBus.emit('playerLostHp', { amount: outcome.value });
                    }
                    break;
                case 'REPUTATION_CHANGE':
                    playerUpdates.reputation = (state.player.reputation || 0) + outcome.value;
                    this.eventBus.emit('log', { text: `[Reputation changed by ${outcome.value}]`, type: 'system' });
                    break;
                case 'ITEM_GAIN': {
                    const qty = Math.max(1, outcome.quantity || 1);
                    playerUpdates.inventory = StateManager.addInventoryItem(state.player.inventory || [], outcome.item_id, qty);
                    const itemName = ITEMS_DATA[outcome.item_id]?.name || outcome.item_id;
                    this.eventBus.emit('log', { text: `[Received ${qty > 1 ? qty + ' ' : ''}${itemName}]`, type: 'system' });
                    if (StateManager.getInventoryTotalCount(state.player.inventory || []) === 0) {
                        rootUpdates.newly_unlocked_inventory = true;
                        rootUpdates.inventory_unlocked_at_still_quarter = true;
                    }
                    break;
                }
                case 'ITEM_LOSE': {
                    const loseQty = Math.max(1, outcome.quantity || 1);
                    const currentQty = StateManager.getInventoryQuantity(state.player.inventory || [], outcome.item_id);
                    if (currentQty > 0) {
                        const remove = Math.min(loseQty, currentQty);
                        playerUpdates.inventory = StateManager.removeInventoryItem(state.player.inventory || [], outcome.item_id, remove);
                        const itemName = ITEMS_DATA[outcome.item_id]?.name || outcome.item_id;
                        this.eventBus.emit('log', { text: `[Gave ${remove > 1 ? remove + ' ' : ''}${itemName}]`, type: 'system' });
                    }
                    break;
                }
                case 'LOCATION_UNLOCK':
                     if (!state.unlocked_locations.includes(outcome.location_id)) {
                        rootUpdates.unlocked_locations = [...state.unlocked_locations, outcome.location_id];
                        rootUpdates.has_new_location_unlocked = true;
                        rootUpdates.newly_unlocked_location_id = outcome.location_id;
                        this.eventBus.emit('log', { text: `[New location unlocked: ${LOCATION_DATA[outcome.location_id].name}]`, type: 'system' });
                    }
                    break;
                case 'NPC_UNLOCK':
                    const locationNpcs = accumulatedUnlockedNpcs[outcome.location_id] || [];
                    if (!locationNpcs.includes(outcome.npc_id)) {
                        // Update the accumulated object instead of creating a new one each time
                        accumulatedUnlockedNpcs[outcome.location_id] = [...locationNpcs, outcome.npc_id];
                        // Track for pulse indicator until player talks to this NPC once
                        const newlyList = accumulatedNewlyUnlockedNpcs[outcome.location_id] || [];
                        if (!newlyList.includes(outcome.npc_id)) {
                            accumulatedNewlyUnlockedNpcs[outcome.location_id] = [...newlyList, outcome.npc_id];
                        }
                        const npcData = NPC_DATA[outcome.location_id]?.[outcome.npc_id];
                        const npcName = npcData?.name || outcome.npc_id;
                        const unlockLog = npcData?.type === 'npc' ? `[NPC unlocked: ${npcName}]` : `[Unlocked: ${npcName}]`;
                        this.eventBus.emit('log', { text: unlockLog, type: 'system' });
                    }
                    break;
                case 'NPC_LOCK':
                    const currentUnlockedNpcsForLock = state.unlocked_npcs || {};
                    const locationNpcsForLock = currentUnlockedNpcsForLock[outcome.location_id] || [];
                    const currentLockedNpcs = state.locked_npcs || {};
                    const locationLockedNpcs = currentLockedNpcs[outcome.location_id] || [];
                    
                    // Remove from unlocked list if present
                    let updatedUnlockedNpcsForLock = { ...currentUnlockedNpcsForLock };
                    if (locationNpcsForLock.includes(outcome.npc_id)) {
                        updatedUnlockedNpcsForLock = {
                            ...currentUnlockedNpcsForLock,
                            [outcome.location_id]: locationNpcsForLock.filter(id => id !== outcome.npc_id)
                        };
                        rootUpdates.unlocked_npcs = updatedUnlockedNpcsForLock;
                    }
                    // Remove from newly_unlocked_npcs so pulse indicator is not shown for locked NPCs
                    const newlyListForLock = accumulatedNewlyUnlockedNpcs[outcome.location_id] || [];
                    if (newlyListForLock.includes(outcome.npc_id)) {
                        accumulatedNewlyUnlockedNpcs[outcome.location_id] = newlyListForLock.filter(id => id !== outcome.npc_id);
                    }
                    
                    // Add to locked list if not already there
                    if (!locationLockedNpcs.includes(outcome.npc_id)) {
                        const updatedLockedNpcs = {
                            ...currentLockedNpcs,
                            [outcome.location_id]: [...locationLockedNpcs, outcome.npc_id]
                        };
                        rootUpdates.locked_npcs = updatedLockedNpcs;
                        const npcDataForLock = NPC_DATA[outcome.location_id]?.[outcome.npc_id];
                        const npcNameForLock = npcDataForLock?.name || outcome.npc_id;
                        const lockLog = npcDataForLock?.type === 'npc' ? `[NPC locked: ${npcNameForLock}]` : `[Locked: ${npcNameForLock}]`;
                        this.eventBus.emit('log', { text: lockLog, type: 'system' });
                    }
                    break;
                case 'QUEST_SET_STAGE':
                    // Collect quest stage updates without losing other quest state
                    questsUpdates[outcome.quest_id] = { stage: outcome.stage };
                    const questTitle = QUEST_DATA[outcome.quest_id].title;
                    let questLogText;
                    if (outcome.stage === 1) {
                        questLogText = `[New quest "${questTitle}"]`;
                    } else if (outcome.stage === 100) {
                        questLogText = `[Quest "${questTitle}" completed]`;
                    } else {
                        questLogText = `[Quest "${questTitle}" updated]`;
                    }
                    this.eventBus.emit('log', { text: questLogText, type: 'system' });
                    
                    // Track quest update event
                    if (this.analyticsManager) {
                        this.analyticsManager.questUpdated(outcome.quest_id, outcome.stage);
                    }
                    // Fire first_quest_completed once when any quest is completed (onboarding milestone)
                    if (outcome.stage === 100 && !state.first_quest_completed_fired && this.analyticsManager) {
                        this.analyticsManager.firstQuestCompleted(outcome.quest_id);
                        rootUpdates.first_quest_completed_fired = true;
                    }
                    break;
            }
        });

        if (Object.keys(playerUpdates).length > 0) {
            this.stateManager.updateState({ player: { ...state.player, ...playerUpdates } });
        }
        if (Object.keys(questsUpdates).length > 0) {
            rootUpdates.quests = questsUpdates;
        }
        // Set the accumulated unlocked NPCs if any were unlocked
        if (Object.keys(accumulatedUnlockedNpcs).length > 0) {
            rootUpdates.unlocked_npcs = accumulatedUnlockedNpcs;
        }
        // Set newly unlocked NPCs for pulse indicator (also updated when NPC_LOCK removes one)
        rootUpdates.newly_unlocked_npcs = accumulatedNewlyUnlockedNpcs;
        if (Object.keys(rootUpdates).length > 0) this.stateManager.updateState(rootUpdates);
    }

    /**
     * Checks if the player meets the conditions for a given node or option.
     * Supports both old format (single condition object) and new format (conditions object with condition array).
     * @param {object} conditions - Either a single condition object (old format) or conditions object with condition array (new format).
     * @returns {boolean} - True if conditions are met or if there are none.
     */
    checkConditions(conditions) {
        if (!conditions) {
            return true;
        }
        
        // Handle new format: conditions object with condition array
        if (conditions.condition && Array.isArray(conditions.condition)) {
            const conditionArray = conditions.condition;
            const op = conditions.op || 'AND'; // Default to 'AND' if not specified
            
            if (conditionArray.length === 0) {
                return true;
            }
            
            // Evaluate each condition
            const results = conditionArray.map(cond => this.checkSingleCondition(cond));
            
            // Apply operator
            if (op === 'OR') {
                return results.some(result => result === true);
            } else { // 'AND' (default)
                return results.every(result => result === true);
            }
        }
        
        // Handle old format: single condition object (backward compatibility)
        return this.checkSingleCondition(conditions);
    }
    
    /**
     * Checks a single condition object.
     * @param {object} condition - A single condition object.
     * @returns {boolean} - True if condition is met.
     */
    checkSingleCondition(condition) {
        if (!condition || !condition.type) {
            return true;
        }
        const state = this.stateManager.getState();

        switch (condition.type) {
            case 'STAT_CHECK':
                return (state.player[condition.stat] || 0) >= condition.min;
            case 'QUEST_STAGE':
                const questStage = state.quests?.[condition.quest_id]?.stage || 0;
                const op = condition.op || 'eq'; // Default to 'eq' if not specified
                switch (op) {
                    case 'eq':
                        return questStage === condition.stage;
                    case 'neq':
                        return questStage !== condition.stage;
                    case 'gte':
                        return questStage >= condition.stage;
                    default:
                        // Unknown operator, default to equality check
                        return questStage === condition.stage;
                }
            case 'HAVE_ITEM': {
                const required = Math.max(1, condition.quantity || 1);
                return StateManager.getInventoryQuantity(state.player.inventory || [], condition.item_id) >= required;
            }
            case 'NO_ITEM':
                return StateManager.getInventoryQuantity(state.player.inventory || [], condition.item_id) === 0;
            default:
                return true;
        }
    }

    handleInput(input) {
        if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }
}