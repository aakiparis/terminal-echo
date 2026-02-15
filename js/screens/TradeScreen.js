class TradeScreen extends BaseScreen {
    getItemEffectText(itemData) {
        const statChanges = itemData.stat_change || [];
        if (!statChanges.length) return '';
        return statChanges
            .map(c => `${String(c.stat || '').toUpperCase()} +${c.value}`)
            .join(', ');
    }

    enter(params) {
        this.locationId = params.locationId;
        this.npcId = params.npcId;
        const npcKey = `${this.locationId}|${this.npcId}`;
        const state = this.stateManager.getState();
        const npcData = NPC_DATA[this.locationId][this.npcId];
        // Use persisted NPC inventory if we have one, else normalize from data (supports string[] or { item_id, quantity }[])
        const hasSaved = state.npc_inventories && Object.prototype.hasOwnProperty.call(state.npc_inventories, npcKey);
        const npcInventory = hasSaved
            ? StateManager.normalizeNpcInventory(state.npc_inventories[npcKey])
            : StateManager.normalizeNpcInventory(npcData.inventory || []);
        this.sessionNpcData = JSON.parse(JSON.stringify(npcData));
        this.sessionNpcData.inventory = npcInventory;
        super.enter(params);
    }

    refresh() {
        // Rebuild components based on the latest player state and session NPC data
        if (!this.element) return;
        this.initComponents();
        this.element.innerHTML = '';
        Object.values(this.components).forEach(component => {
            const componentElement = component.render();
            if (componentElement) {
                this.element.appendChild(componentElement);
            }
        });
    }

    initComponents() {
        const playerState = this.stateManager.getEffectivePlayerStats();
        const basePlayerState = this.stateManager.getPlayerStats();
        const inventoryCount = StateManager.getInventoryTotalCount(basePlayerState.inventory || []);
        const playerInventorySlots = StateManager.normalizeInventory(basePlayerState.inventory || []);

        // --- Create a single array to hold all menu items ---
        let menuItems = [];

        // 1. Add a header for the NPC's items
        menuItems.push({
            id: 'header_npc',
            label: `--- ${this.sessionNpcData.name}'s Wares ---`,
            type: 'separator'
        });

        // 2. Add all items from the NPC's inventory (slots with quantity)
        const npcSlots = StateManager.normalizeNpcInventory(this.sessionNpcData.inventory || []);
        npcSlots.forEach(slot => {
            const itemData = ITEMS_DATA[slot.item_id];
            if (!itemData) return;
            const canAfford = playerState.caps >= itemData.price;
            const effectSuffix = this.getItemEffectText(itemData) ? ` (${this.getItemEffectText(itemData)})` : '';
            const qtySuffix = slot.quantity > 1 ? ` x${slot.quantity}` : '';
            menuItems.push({
                id: slot.item_id,
                source: 'npc',
                label: `[ BUY ] ${itemData.name}${qtySuffix}${effectSuffix} - Price: ${itemData.price}`,
                actionText: canAfford ? '[ BUY ]' : '[ TOO EXPENSIVE ]',
                disabled: !canAfford,
                item: itemData
            });
        });

        // 3. Add a header for the Player's items
        menuItems.push({
            id: 'header_player',
            label: `--- Your Inventory ---`,
            type: 'separator'
        });
        // 4. Add all items from the Player's inventory (or a disabled placeholder if none tradeable)
        const tradeableSlots = playerInventorySlots.filter(slot => {
            const itemData = ITEMS_DATA[slot.item_id];
            return itemData && itemData.tradeable !== false;
        });
        if (tradeableSlots.length === 0) {
            menuItems.push({
                id: 'no_tradeable_items',
                label: 'No tradeable items',
                type: 'action',
                source: 'placeholder',
                disabled: true
            });
        } else {
            tradeableSlots.forEach(slot => {
                const itemData = ITEMS_DATA[slot.item_id];
                const qtySuffix = slot.quantity > 1 ? ` x${slot.quantity}` : '';
                const effectSuffix = this.getItemEffectText(itemData) ? ` (${this.getItemEffectText(itemData)})` : '';
                menuItems.push({
                    id: slot.item_id,
                    source: 'player',
                    label: `[ SELL ] ${itemData.name}${qtySuffix}${effectSuffix} - Value: ${itemData.price}`,
                    actionText: '[ SELL ]',
                    disabled: itemData.tradeable === false,
                    item: itemData,
                    quantity: slot.quantity
                });
            });
        }

        // 5. Add the "Finish Trading" option
        menuItems.push({
            id: 'delimiter',
            label: `------`,
            type: 'separator'
        });
        menuItems.push({
            id: 'action_exit',
            source: 'exit',
            label: '[ FINISH TRADING ]',
            actionText: '[ EXIT ]'
        });

        // --- Create the components ---
        this.components.title = new ScreenTitle({ text: 'TRADE' });
        this.components.description = new ScreenDescription({ 
            text: `Your CAPS: ${playerState.caps} | Your Inventory: ${inventoryCount} / ${playerState.carry_capacity}` 
        });
        
        // This single menu contains everything and is the only interactive element
        this.components.tradeMenu = new Menu({
            items: menuItems,
            onSelect: (item) => this.handleAction(item)
        });
    }

    // A single handler for all menu selections
    handleAction(item) {
        switch (item.source) {
            case 'npc':
                this.buyItem(item);
                break;
            case 'player':
                this.sellItem(item);
                break;
            case 'exit':
                // **FIX for Back Navigation**: Explicitly navigate to the correct dialogue node.
                this.eventBus.emit('navigate', {
                    screen: 'Dialogue',
                    params: {
                        locationId: this.locationId,
                        npcId: this.npcId,
                        nodeKey: 'trade' // This ensures you land on the post-trade dialogue.
                    }
                });
                break;
        }
    }

    buyItem(item) {
        const playerState = this.stateManager.getPlayerStats();
        const effectiveStats = this.stateManager.getEffectivePlayerStats();

        // Safety checks
        if (StateManager.getInventoryTotalCount(playerState.inventory || []) >= effectiveStats.carry_capacity) {
            this.eventBus.emit('log', { text: "Inventory is full.", type: 'error' });
            return;
        }
        if (playerState.caps < item.item.price) {
            this.eventBus.emit('log', { text: "Cannot afford this item.", type: 'error' });
            return;
        }
        const newPlayerInventory = StateManager.addInventoryItem(playerState.inventory || [], item.id, 1);
        const newCaps = playerState.caps - item.item.price;
        this.sessionNpcData.inventory = StateManager.removeInventoryItem(this.sessionNpcData.inventory || [], item.id, 1);
        const npcKey = `${this.locationId}|${this.npcId}`;
        this.stateManager.updateState({
            player: { inventory: newPlayerInventory, caps: newCaps },
            npc_inventories: { ...this.stateManager.getState().npc_inventories, [npcKey]: this.sessionNpcData.inventory }
        });

        // Track buy item event
        if (this.analyticsManager) {
            this.analyticsManager.buyItem(item.id);
        }

        this.eventBus.emit('log', { text: `Bought ${item.item.name}.`, type: 'system' });
        this.refresh();
    }

    sellItem(item) {
        const playerState = this.stateManager.getPlayerStats();
        const newPlayerInventory = StateManager.removeInventoryItem(playerState.inventory || [], item.id, 1);
        const newCaps = playerState.caps + item.item.price;
        this.sessionNpcData.inventory = StateManager.addInventoryItem(this.sessionNpcData.inventory || [], item.id, 1);
        const npcKey = `${this.locationId}|${this.npcId}`;
        this.stateManager.updateState({
            player: { inventory: newPlayerInventory, caps: newCaps },
            npc_inventories: { ...this.stateManager.getState().npc_inventories, [npcKey]: this.sessionNpcData.inventory }
        });
        
        // Track sell item event
        if (this.analyticsManager) {
            this.analyticsManager.sellItem(item.id);
        }
        
        this.eventBus.emit('log', { text: `Sold ${item.item.name}.`, type: 'system' });
        this.refresh();
    }

    // Input is now simply passed to the one and only menu
    handleInput(input) {
        this.components.tradeMenu.handleInput(input);
    }
}