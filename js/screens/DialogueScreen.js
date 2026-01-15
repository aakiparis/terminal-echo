class DialogueScreen extends BaseScreen {
    initComponents(params) {
        this.locationId = params.locationId;
        this.npcId = params.npcId;
        this.npcData = NPC_DATA[this.locationId][this.npcId];
        this.currentNodeKey = params.nodeKey || 'start_first_time';
        const node = this.npcData.dialogue_graph.nodes[this.currentNodeKey];

        if (!node) {
            console.error(`Dialogue node "${this.currentNodeKey}" not found for NPC "${this.npcId}"`);
            this.navigationManager.navigateTo({ screen: 'Location', params: { id: this.locationId } });
            return;
        }

        this.components.title = new ScreenTitle({ text: this.npcData.name });
        this.components.description = new ScreenDescription({ text: node.text });

        if (!params.nodeKey) {
            this.eventBus.emit('log', { text: `${this.npcData.name}: "${node.text}"`, type: 'dialogue' });
        }

        const menuItems = node.options.map((option, index) => ({
            id: `option-${index}`,
            label: option.text,
            type: 'action',
            action: () => this.selectOption(option),
            // --- THIS NOW WORKS ---
            // checkConditions will return true/false, disabling the item
            disabled: !this.checkConditions(option.conditions)
        }));

        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => {
                if (item.action) item.action();
            }
        });
    }

    selectOption(option) {
        this.eventBus.emit('log', { text: `You: "${option.text}"`, type: 'system' });
        const node = this.npcData.dialogue_graph.nodes[this.currentNodeKey];

        // --- PROCESS OUTCOMES for the current node ---
        if (node.outcomes) {
            this.processOutcomes(node.outcomes);
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

    // === NEW: PROCESSES OUTCOMES ===
    processOutcomes(outcomes) {
        const playerState = this.stateManager.getPlayerStats();
        let updatedStats = {};
        let newLocations = [...this.stateManager.getState().unlocked_locations];

        outcomes.forEach(outcome => {
            switch (outcome.type) {
                case 'STAT_CHANGE':
                    updatedStats[outcome.stat] = (playerState[outcome.stat] || 0) + outcome.value;
                    this.eventBus.emit('log', { text: `[${outcome.stat.toUpperCase()} changed by ${outcome.value}]`, type: 'system' });
                    break;
                case 'REPUTATION_CHANGE':
                    updatedStats.reputation = (playerState.reputation || 0) + outcome.value;
                     this.eventBus.emit('log', { text: `[Reputation changed by ${outcome.value}]`, type: 'system' });
                    break;
                case 'ITEM_GAIN':
                    updatedStats.inventory = [...playerState.inventory, outcome.item_id];
                    this.eventBus.emit('log', { text: `[Received ${ITEMS_DATA[outcome.item_id].name}]`, type: 'system' });
                    break;
                case 'LOCATION_UNLOCK':
                    if (!newLocations.includes(outcome.location_id)) {
                        newLocations.push(outcome.location_id);
                        this.eventBus.emit('log', { text: `[New location unlocked: ${LOCATION_DATA[outcome.location_id].name}]`, type: 'system' });
                    }
                    break;
            }
        });

        if (Object.keys(updatedStats).length > 0) {
            this.stateManager.updateState({ player: updatedStats });
        }
        this.stateManager.updateState({ unlocked_locations: newLocations });
    }

    // === NEW: IMPLEMENTS STAT CHECKS ===
    checkConditions(conditions) {
        if (!conditions || conditions.length === 0) {
            return true; // No conditions means the option is always available
        }
        const playerStats = this.stateManager.getPlayerStats();

        // 'every' ensures ALL conditions must be met
        return conditions.every(condition => {
            switch (condition.type) {
                case 'STAT_CHECK':
                    return playerStats[condition.stat] >= condition.min;
                // Future condition types can be added here
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