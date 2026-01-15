class DialogueScreen extends BaseScreen {
    initComponents(params) {
        this.locationId = params.locationId;
        this.npcId = params.npcId;
        this.npcData = NPC_DATA[this.locationId][this.npcId];

        let targetNodeKey;
        const convoHistory = this.stateManager.getState().convo_history || {};
        
        if (params.nodeKey) {
            targetNodeKey = params.nodeKey;
        } else {
            const hasSpokenBefore = convoHistory[this.npcId];
            if (hasSpokenBefore && this.npcData.dialogue_graph.nodes.start_return) {
                targetNodeKey = 'start_return';
            } else {
                targetNodeKey = 'start_first_time';
            }
        }
        this.currentNodeKey = targetNodeKey;

        const node = this.npcData.dialogue_graph.nodes[this.currentNodeKey];

        if (!node) {
            console.error(`Dialogue node "${this.currentNodeKey}" not found for NPC "${this.npcId}"`);
            this.navigationManager.navigateTo({ screen: 'Location', params: { id: this.locationId } });
            return;
        }

        // --- CORRECTED HISTORY UPDATE ---
        // Only update history on the very first time entering the conversation
        if (!params.nodeKey && !convoHistory[this.npcId]) {
            // This now correctly passes the *entire* history object with one new key
            this.stateManager.updateState({ convo_history: { ...convoHistory, [this.npcId]: true } });
            this.eventBus.emit('log', { text: `${this.npcData.name}: "${node.text}"`, type: 'dialogue' });
        }
        // --- END CORRECTION ---

        this.components.title = new ScreenTitle({ text: this.npcData.name });
        this.components.description = new ScreenDescription({ text: node.text });

        const menuItems = (node.options || []).map((option, index) => ({
            id: `option-${index}`,
            label: option.text,
            type: 'action',
            action: () => this.selectOption(option),
            disabled: !this.checkConditions(option.conditions)
        }));

        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => {
                if (item.action) item.action();
            }
        });
    }

    // ... other methods remain unchanged ...
    selectOption(option) {
        this.eventBus.emit('log', { text: `You: "${option.text}"`, type: 'system' });
        
        const currentNode = this.npcData.dialogue_graph.nodes[this.currentNodeKey];
        if (currentNode && currentNode.outcomes) {
            this.processOutcomes(currentNode.outcomes);
        }

        if (option.destination_node === 'end_conversation') {
            this.navigationManager.navigateTo({ screen: 'Location', params: { id: this.locationId } });
        } else {
            this.navigationManager.navigateTo({
                screen: 'Dialogue',
                params: {
                    locationId: this.locationId,
                    npcId: this.npcId,
                    nodeKey: option.destination_node
                }
            });
        }
    }

    processOutcomes(outcomes) {
        // This method remains the same
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
                    const newInventoryGain = [...state.player.inventory, outcome.item_id];
                    playerUpdates.inventory = newInventoryGain;
                    this.eventBus.emit('log', { text: `[Received ${ITEMS_DATA[outcome.item_id].name}]`, type: 'system' });
                    break;
                case 'ITEM_LOSE':
                    const newInventoryLose = state.player.inventory.filter(id => id !== outcome.item_id);
                    playerUpdates.inventory = newInventoryLose;
                    this.eventBus.emit('log', { text: `[Gave ${ITEMS_DATA[outcome.item_id].name}]`, type: 'system' });
                    break;
                case 'LOCATION_UNLOCK':
                     if (!state.unlocked_locations.includes(outcome.location_id)) {
                        rootUpdates.unlocked_locations = [...state.unlocked_locations, outcome.location_id];
                        this.eventBus.emit('log', { text: `[New location unlocked: ${LOCATION_DATA[outcome.location_id].name}]`, type: 'system' });
                    }
                    break;
                case 'QUEST_SET_STAGE':
                    rootUpdates.quests = { ...state.quests, [outcome.quest_id]: outcome.stage };
                    this.eventBus.emit('log', { text: `[Quest '${QUEST_DATA[outcome.quest_id].title}' updated]`, type: 'system' });
                    break;
            }
        });

        if (Object.keys(playerUpdates).length > 0) {
            this.stateManager.updateState({ player: playerUpdates });
        }
        if (Object.keys(rootUpdates).length > 0) {
            this.stateManager.updateState(rootUpdates);
        }
    }

    checkConditions(conditions) {
        // This method remains the same
         if (!conditions || conditions.length === 0) {
            return true;
        }
        const state = this.stateManager.getState();

        return conditions.every(condition => {
            switch (condition.type) {
                case 'STAT_CHECK':
                    const statValue = state.player[condition.stat] || 0;
                    const min = condition.min !== undefined ? statValue >= condition.min : true;
                    const max = condition.max !== undefined ? statValue <= condition.max : true;
                    return min && max;
                case 'QUEST_STAGE':
                    return (state.quests[condition.quest_id] || 0) === condition.stage;
                case 'HAVE_ITEM':
                    return state.player.inventory.includes(condition.item_id);
                default:
                    return true;
            }
        });
    }

    handleInput(input) {
        if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }
}