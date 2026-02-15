class InventoryScreen extends BaseScreen {
    getItemEffectText(itemData) {
        const statChanges = itemData.stat_change || [];
        if (!statChanges.length) return '';
        return statChanges
            .map(c => `${String(c.stat || '').toUpperCase()} +${c.value}`)
            .join(', ');
    }

    initComponents() {
        // Clear "newly unlocked inventory" pulse when player opens inventory for the first time
        if (this.stateManager.getState().newly_unlocked_inventory === true) {
            this.stateManager.updateState({ newly_unlocked_inventory: false });
        }
        const state = this.stateManager.getPlayerStats();
        const effectiveStats = this.stateManager.getEffectivePlayerStats();
        const inventorySlots = StateManager.normalizeInventory(state.inventory || []);
        const inventoryCount = StateManager.getInventoryTotalCount(state.inventory || []);

        let descriptionText = `STR: ${effectiveStats.str} | INT: ${effectiveStats.int} | LCK: ${effectiveStats.lck} `;
        descriptionText += '<br>';
        descriptionText += `LEVEL: ${effectiveStats.level} (XP: ${effectiveStats.xp}) | CAPS: ${effectiveStats.caps}`;

        if (inventoryCount === 0) {
            descriptionText += '<br><br>Your inventory is empty.';
        }

        // Title and Description
        this.components.title = new ScreenTitle({ text: `${state.name} INVENTORY (${inventoryCount} / ${effectiveStats.carry_capacity})` });
        this.components.description = new ScreenDescription({ text: descriptionText });

        // Quest log: list of quests with status (in progress / completed; completed = strikethrough)
        const fullState = this.stateManager.getState();
        const questsState = fullState.quests || {};
        const questLogLines = [];
        Object.keys(questsState).forEach(questId => {
            const stage = questsState[questId].stage;
            if (stage === 0) return; // not started — don't list
            const questMeta = typeof QUEST_DATA !== 'undefined' && QUEST_DATA[questId];
            const title = questMeta ? questMeta.title : questId;
            const stageDesc = questMeta && questMeta.stages && questMeta.stages[String(stage)];
            const stageLabel = stageDesc || (stage === 100 ? 'Completed' : 'In progress');
            const line = `${title}: ${stageLabel}`;
            if (stage === 100) {
                questLogLines.push(`<s>${line}</s>`);
            } else {
                questLogLines.push(line);
            }
        });
        const questLogText = questLogLines.length
            ? '<strong>QUEST LOG</strong><br>' + questLogLines.join('<br>')
            : '<strong>QUEST LOG</strong><br>No active quests.';
        this.components.questLog = new ScreenDescription({ text: questLogText });

        const menuItems = inventorySlots.map((slot, index) => {
            const itemData = ITEMS_DATA[slot.item_id];
            if (!itemData) {
                console.error(`Inventory item "${slot.item_id}" not found in ITEMS_DATA.`);
                return null;
            }
            const qty = slot.quantity || 1;
            const qtySuffix = qty > 1 ? ` x${qty}` : '';
            let actionText = '[ DROP ]';
            if (itemData.type === 'consumable') actionText = '[ USE ]';
            if (itemData.type === 'quest') actionText = '[ QUEST ITEM ]';
            return {
                id: `slot-${index}-${slot.item_id}`,
                item_id: slot.item_id,
                quantity: qty,
                label: `${actionText} ${itemData.name}${qtySuffix}${this.getItemEffectText(itemData) ? ` (${this.getItemEffectText(itemData)})` : ''} (CAP: ${itemData.price})`,
                type: 'action',
                item: itemData,
                disabled: itemData.type === 'quest'
            };
        }).filter(Boolean);

        // Add a back button
        if (inventoryCount > 0) {
            menuItems.push({
                id: 'separator',
                label: `------`,
                type: 'separator'
            });
        }
        menuItems.push({
            id: 'back',
            label: '[ BACK ]',
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

        const itemId = selectedItem.item_id || selectedItem.id;
        const itemData = ITEMS_DATA[itemId] || selectedItem.item;

        // For now, we'll use a simple alert/prompt system for actions.
        // A more complex implementation would use a sub-menu.
        if (itemData.type === 'consumable') {
            this.confirmConsumeItem(itemId, itemData);
        } else {
            // Default action for gear, junk, etc. is to drop.
            this.confirmDropItem(itemId, itemData);
        }
    }

    confirmConsumeItem(itemId, itemData) {
        const effectText = this.getItemEffectText(itemData);
        const effectLine = effectText ? `\nEffect: ${effectText}` : '';

        this.navigationManager.showPopup({
            title: 'CONFIRM USE',
            message: `Use "${itemData.name}"?${effectLine}`,
            menuItems: [
                {
                    id: 'confirm_use',
                    label: '[ USE ]',
                    action: () => {
                        this.navigationManager.closePopup();
                        this.consumeItem(itemId, itemData);
                    }
                },
                {
                    id: 'cancel_use',
                    label: '[ CANCEL ]',
                    action: () => {
                        this.navigationManager.closePopup();
                    }
                }
            ]
        });
    }

    confirmDropItem(itemId, itemData) {
        if (itemData.type === 'quest') {
            this.eventBus.emit('log', { text: `${itemData.name} is a quest item and cannot be dropped.`, type: 'error' });
            return;
        }

        this.navigationManager.showPopup({
            title: 'CONFIRM DROP',
            message: `Dropping "${itemData.name}" is permanent and cannot be undone. Continue?`,
            menuItems: [
                {
                    id: 'confirm_drop',
                    label: '[ DROP ]',
                    action: () => {
                        this.navigationManager.closePopup();
                        this.dropItem(itemId, itemData);
                    }
                },
                {
                    id: 'cancel_drop',
                    label: '[ CANCEL ]',
                    action: () => {
                        this.navigationManager.closePopup();
                    }
                }
            ]
        });
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
        updatedStats.inventory = StateManager.removeInventoryItem(state.inventory || [], itemId, 1);

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

        const state = this.stateManager.getPlayerStats();
        const newInventory = StateManager.removeInventoryItem(state.inventory || [], itemId, 1);
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