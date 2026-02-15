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

        // Quest log: new quests (stage 1) on top, then other in-progress; then completed (last completed at top of completed block)
        const fullState = this.stateManager.getState();
        const questsState = fullState.quests || {};
        const completionOrder = fullState.quest_completion_order || [];
        const newQuestLines = [];   // stage === 1
        const inProgressLines = []; // stage > 1 && stage < 100
        const completedEntries = []; // { questId, line } for sorting
        Object.keys(questsState).forEach(questId => {
            const stage = questsState[questId].stage;
            if (stage === 0) return;
            const questMeta = typeof QUEST_DATA !== 'undefined' && QUEST_DATA[questId];
            const title = questMeta ? questMeta.title : questId;
            const stageDesc = questMeta && questMeta.stages && questMeta.stages[String(stage)];
            const stageLabel = stageDesc || (stage === 100 ? 'Completed' : 'In progress');
            const line = `${title}: ${stageLabel}`;
            if (stage === 100) {
                completedEntries.push({ questId, line: `<s>${line}</s>` });
            } else if (stage === 1) {
                newQuestLines.push(line);
            } else {
                inProgressLines.push(line);
            }
        });
        // Completed: order by completion order (most recent last in array => show first in list)
        const completedLines = completionOrder.slice().reverse()
            .filter(questId => completedEntries.some(e => e.questId === questId))
            .map(questId => completedEntries.find(e => e.questId === questId).line);
        // Include any completed quests not in completionOrder (e.g. old save)
        completedEntries.forEach(e => {
            if (!completionOrder.includes(e.questId)) completedLines.push(e.line);
        });
        const questLogLines = newQuestLines.concat(inProgressLines).concat(completedLines);
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

        // Resolve actual item_id (menu id can be compound e.g. "slot-0-stimpack")
        let itemId = selectedItem.item_id;
        if (itemId == null && typeof selectedItem.id === 'string' && selectedItem.id.startsWith('slot-')) {
            const parts = selectedItem.id.split('-');
            itemId = parts.slice(2).join('-');
        }
        if (itemId == null) itemId = selectedItem.id;
        const itemData = selectedItem.item || (itemId && ITEMS_DATA[itemId]);
        if (!itemData) return;

        if (itemData.type === 'consumable') {
            this.confirmConsumeItem(itemId, itemData);
        } else {
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
        if (!itemId || !itemData) return;
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