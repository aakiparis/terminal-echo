class DialogueScreen extends BaseScreen {
    /**
     * Initializes the components for the Dialogue screen based on the NPC and current node.
     * This version is adapted for the new data structure with destination_nodes.
     * @param {object} params - { locationId, npcId, nodeKey }
     */
    initComponents(params) {
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

        // --- Initialize Components ---
        this.components.title = new ScreenTitle({ text: this.npcData.name });
        this.components.description = new ScreenDescription({ text: node.response });

        // Map destination_nodes to menu items
        const menuItems = (node.destination_nodes || []).map((dest, index) => {
            const targetNode = this.npcData.dialogue_graph[dest.node_id];
            
            // Determine the label for the choice
            let label = dest.prompt_replacement || targetNode?.prompt || dest.node_id;

            // Check conditions on the *target* node
            const isDisabled = !this.checkConditions(targetNode?.condition);
            
            // Add stat check prefix like "[INT 5]" if it exists
            if (targetNode?.condition?.type === 'STAT_CHECK') {
                label = `[${targetNode.condition.stat.toUpperCase()} ${targetNode.condition.min}] ${label}`;
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

        outcomes.forEach(outcome => {
            switch (outcome.type) {
                case 'STAT_CHANGE':
                    playerUpdates[outcome.stat] = (state.player[outcome.stat] || 0) + outcome.value;
                    this.eventBus.emit('log', { text: `[${outcome.stat.toUpperCase()} changed by ${outcome.value}]`, type: 'system' });
                    break;
                case 'REPUTATION_CHANGE':
                    playerUpdates.reputation = (state.player.reputation || 0) + outcome.value;
                    this.eventBus.emit('log', { text: `[Reputation changed by ${outcome.value}]`, type: 'system' });
                    break;
                case 'ITEM_GAIN':
                    // Avoid adding duplicate quest items
                    if (!state.player.inventory.includes(outcome.item_id)) {
                        playerUpdates.inventory = [...state.player.inventory, outcome.item_id];
                        this.eventBus.emit('log', { text: `[Received ${ITEMS_DATA[outcome.item_id].name}]`, type: 'system' });
                    }
                    break;
                case 'ITEM_LOSE':
                    const itemIndex = state.player.inventory.indexOf(outcome.item_id);
                    if (itemIndex > -1) {
                        const newInventory = [...state.player.inventory];
                        newInventory.splice(itemIndex, 1);
                        playerUpdates.inventory = newInventory;
                        this.eventBus.emit('log', { text: `[Gave ${ITEMS_DATA[outcome.item_id].name}]`, type: 'system' });
                    }
                    break;
                case 'LOCATION_UNLOCK':
                     if (!state.unlocked_locations.includes(outcome.location_id)) {
                        rootUpdates.unlocked_locations = [...state.unlocked_locations, outcome.location_id];
                        this.eventBus.emit('log', { text: `[New location unlocked: ${LOCATION_DATA[outcome.location_id].name}]`, type: 'system' });
                    }
                    break;
                case 'QUEST_SET_STAGE':
                    // Update quests object without overwriting other quests
                    const currentQuests = state.quests || {};
                    rootUpdates.quests = { ...currentQuests, [outcome.quest_id]: { stage: outcome.stage } };
                    this.eventBus.emit('log', { text: `[Quest '${QUEST_DATA[outcome.quest_id].title}' updated]`, type: 'system' });
                    break;
            }
        });

        if (Object.keys(playerUpdates).length > 0) {
            this.stateManager.updateState({ player: { ...state.player, ...playerUpdates } });
        }
        if (Object.keys(rootUpdates).length > 0) {
            this.stateManager.updateState(rootUpdates);
        }
    }

    /**
     * Checks if the player meets the conditions for a given node or option.
     * @param {object} condition - A single condition object.
     * @returns {boolean} - True if conditions are met or if there are none.
     */
    checkConditions(condition) {
        if (!condition) {
            return true;
        }
        const state = this.stateManager.getState();

        switch (condition.type) {
            case 'STAT_CHECK':
                return (state.player[condition.stat] || 0) >= condition.min;
            case 'QUEST_STAGE':
                return (state.quests?.[condition.quest_id]?.stage || 0) === condition.stage;
            case 'HAVE_ITEM':
                return state.player.inventory.includes(condition.item_id);
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