class InventoryScreen extends BaseScreen {
    initComponents() {
        const state = this.stateManager.getPlayerStats();
        const effectiveStats = this.stateManager.getEffectivePlayerStats();
        
        const inventoryCount = effectiveStats.inventory ? effectiveStats.inventory.length : 0;

        let descriptionText = `STR: ${effectiveStats.str} | INT: ${effectiveStats.int} | LCK: ${effectiveStats.lck} | CAPS: ${effectiveStats.caps}`;
        // descriptionText += `\nITEMS: ${inventoryCount}/${effectiveStats.carry_capacity}`;

        if (inventoryCount === 0) {
            descriptionText += '<br><br>Your inventory is empty.';
        }

        // Title and Description
        this.components.title = new ScreenTitle({ text: `${state.name} INVENTORY (${inventoryCount} / ${effectiveStats.carry_capacity})` });
        this.components.description = new ScreenDescription({ text: descriptionText });

        const menuItems = (state.inventory || []).map(itemId => {
            const itemData = ITEMS_DATA[itemId];
            if (!itemData) {
                console.error(`Inventory item "${itemId}" not found in ITEMS_DATA.`);
                return null; // Gracefully handle missing item data
            }

            let actionText = '[ DROP ]';
            if (itemData.type === 'consumable') {
                actionText = '[ USE ]';
            }
            if (itemData.type === 'quest') {
                actionText = '[ QUEST ITEM ]';
            }

            return {
                id: itemId,
                label: `${actionText} ${itemData.name} (CAP: ${itemData.price})`,
                type: 'action',
                item: itemData,
                disabled: itemData.type === 'quest'
            };
        }).filter(Boolean); // Remove any nulls from missing items

        // Add a back button
        menuItems.push({
            id: 'back',
            label: 'Back',
            type: 'navigation',
            action: () => this.eventBus.emit('navigate_back')
        });

        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => this.handleMenuSelect(item)
        });
    }

    handleMenuSelect(selectedItem) {
        if (selectedItem.action) { // For 'Back' button
            selectedItem.action();
            return;
        }

        const itemId = selectedItem.id;
        const itemData = ITEMS_DATA[itemId];

        // For now, we'll use a simple alert/prompt system for actions.
        // A more complex implementation would use a sub-menu.
        if (itemData.type === 'consumable') {
            this.consumeItem(itemId, itemData);
        } else {
            // Default action for gear, junk, etc. is to drop.
            this.dropItem(itemId, itemData);
        }
    }

    consumeItem(itemId, itemData) {
        // Apply stat changes from the consumable
        const state = this.stateManager.getPlayerStats();
        const statChanges = itemData.stat_change || [];
        let updatedStats = {};

        statChanges.forEach(change => {
            let currentValue = state[change.stat] || 0;
            let newValue = Math.min(currentValue + change.value, state.maxHp); // Cap HP at maxHp
            updatedStats[change.stat] = newValue;
        });
        
        // Remove item from inventory
        const newInventory = state.inventory.filter(id => id !== itemId);
        updatedStats.inventory = newInventory;

        this.stateManager.updateState({ player: updatedStats });
        this.eventBus.emit('log', { text: `Used ${itemData.name}.`, type: 'system' });
        
        // Refresh the screen to show updated inventory and stats
        this.navigationManager.navigateTo({ screen: 'Inventory' });
    }

    dropItem(itemId, itemData) {
        if (itemData.type === 'quest') {
            this.eventBus.emit('log', { text: `${itemData.name} is a quest item and cannot be dropped.`, type: 'error' });
            return;
        }

        const state = this.stateManager.getEffectivePlayerStats();
        const newInventory = state.inventory.filter(id => id !== itemId);
        
        this.stateManager.updateState({ player: { inventory: newInventory } });
        this.eventBus.emit('log', { text: `Dropped ${itemData.name}.`, type: 'system' });

        // Refresh the screen
        this.navigationManager.navigateTo({ screen: 'Inventory' });
    }

    handleInput(input) {
        if (input.command === 'BACK' || input.command === 'INVENTORY') {
            this.eventBus.emit('navigate_back');
        } else if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }
}