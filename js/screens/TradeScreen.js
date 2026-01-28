class TradeScreen extends BaseScreen {
    getItemEffectText(itemData) {
        const statChanges = itemData.stat_change || [];
        if (!statChanges.length) return '';
        return statChanges
            .map(c => `${String(c.stat || '').toUpperCase()} +${c.value}`)
            .join(', ');
    }

    enter(params) {
        // Store the context passed from the DialogueScreen
        this.locationId = params.locationId;
        this.npcId = params.npcId;
        
        // IMPORTANT: Create a temporary, mutable copy of the NPC's data.
        // This ensures that changes made during this trade session don't
        // permanently alter the master data in `NPC_DATA`.
        this.sessionNpcData = JSON.parse(JSON.stringify(NPC_DATA[this.locationId][this.npcId]));
        
        super.enter(params); // This will call initComponents()
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
        // We need the base inventory to iterate over, not the one with calculated stats
        const basePlayerState = this.stateManager.getPlayerStats();
        const inventoryCount = basePlayerState.inventory.length;

        // --- Create a single array to hold all menu items ---
        let menuItems = [];

        // 1. Add a header for the NPC's items
        menuItems.push({
            id: 'header_npc',
            label: `--- ${this.sessionNpcData.name}'s Wares ---`,
            disabled: true // Headers are not selectable
        });

        // 2. Add all items from the NPC's inventory
        (this.sessionNpcData.inventory || []).forEach(itemId => {
            const itemData = ITEMS_DATA[itemId];
            const canAfford = playerState.caps >= itemData.price;
            const effectSuffix = this.getItemEffectText(itemData) ? ` (${this.getItemEffectText(itemData)})` : '';
            menuItems.push({
                id: itemId,
                source: 'npc', // Mark item source for action logic
                label: `${itemData.name}${effectSuffix} (Price: ${itemData.price})`,
                actionText: canAfford ? '[ BUY ]' : '[ TOO EXPENSIVE ]',
                disabled: !canAfford,
                item: itemData
            });
        });

        // 3. Add a header for the Player's items
        menuItems.push({
            id: 'header_player',
            label: `--- Your Inventory ---`,
            disabled: true
        });

        // 4. Add all items from the Player's inventory
        (basePlayerState.inventory || []).forEach(itemId => {
            const itemData = ITEMS_DATA[itemId];
            const effectSuffix = this.getItemEffectText(itemData) ? ` (${this.getItemEffectText(itemData)})` : '';
            menuItems.push({
                id: itemId,
                source: 'player', // Mark item source
                label: `${itemData.name}${effectSuffix} (Value: ${itemData.price})`,
                actionText: '[ SELL ]',
                disabled: itemData.tradeable === false,
                item: itemData
            });
        });

        // 5. Add the "Finish Trading" option
        menuItems.push({
            id: 'delimiter',
            label: `--- --- ---`,
            disabled: true // delimiters are not selectable
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
        if (playerState.inventory.length >= effectiveStats.carry_capacity) {
            this.eventBus.emit('log', { text: "Inventory is full.", type: 'error' });
            return;
        }
        if (playerState.caps < item.item.price) {
            this.eventBus.emit('log', { text: "Cannot afford this item.", type: 'error' });
            return;
        }

        // Update player state via StateManager
        const newPlayerInventory = [...playerState.inventory, item.id];
        const newCaps = playerState.caps - item.item.price;
        this.stateManager.updateState({ player: { inventory: newPlayerInventory, caps: newCaps } });
        
        // Update the *session's* NPC inventory
        this.sessionNpcData.inventory = this.sessionNpcData.inventory.filter(id => id !== item.id);

        this.eventBus.emit('log', { text: `Bought ${item.item.name}.`, type: 'system' });
        this.refresh();
    }

    sellItem(item) {
        const playerState = this.stateManager.getPlayerStats();

        // Update player state
        const newPlayerInventory = playerState.inventory.filter(id => id !== item.id);
        const newCaps = playerState.caps + item.item.price;
        this.stateManager.updateState({ player: { inventory: newPlayerInventory, caps: newCaps } });

        // Update the *session's* NPC inventory
        this.sessionNpcData.inventory.push(item.id);
        
        this.eventBus.emit('log', { text: `Sold ${item.item.name}.`, type: 'system' });
        this.refresh();
    }

    // Input is now simply passed to the one and only menu
    handleInput(input) {
        this.components.tradeMenu.handleInput(input);
    }
}