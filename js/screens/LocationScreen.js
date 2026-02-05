class LocationScreen extends BaseScreen {
    // This method is called by BaseScreen.enter() to build the screen's content.
    initComponents(params) {
        const locationId = params.id || this.stateManager.getState().currentLocation;
        const locationData = LOCATION_DATA[locationId];

        if (!locationData) {
            console.error(`Location data not found for id: ${locationId}`);
            this.eventBus.emit('log', { text: `ERROR: Cannot load location ${locationId}.`, type: 'error' });
            this.navigationManager.navigateTo({ screen: 'WorldMap' });
            return;
        }

        const npcDataForLocation = NPC_DATA[locationId] || {};

        this.components.title = new ScreenTitle({ text: locationData.name });
        this.components.description = new ScreenDescription({ text: locationData.description, centered: true });

        const state = this.stateManager.getState();
        const unlockedNpcs = state.unlocked_npcs || {};
        const locationUnlockedNpcs = unlockedNpcs[locationId] || [];
        const lockedNpcs = state.locked_npcs || {};
        const locationLockedNpcs = lockedNpcs[locationId] || [];
        
        const menuItems = (locationData.npcs || [])
            .filter(npcId => {
                const npc = npcDataForLocation[npcId];
                if (!npc) return false;
                
                // If NPC is locked, hide them regardless of is_available status
                if (locationLockedNpcs.includes(npcId)) {
                    return false;
                }
                
                // If NPC is in unlocked list, show them (they were unlocked via NPC_UNLOCK)
                if (locationUnlockedNpcs.includes(npcId)) {
                    return true;
                }
                
                // If NPC is not in unlocked list and not locked:
                // - Show if is_available is true/undefined (default available)
                // - Hide if is_available is false (default unavailable, needs to be unlocked)
                return npc.is_available !== false;
            })
            .map(npcId => {
                const npc = npcDataForLocation[npcId];
                let label = npc.name;
                
                // Add prefix based on type
                if (npc.type === 'npc') {
                    label = `Talk to ${npc.name}`;
                } else if (npc.type === 'device' || npc.type === 'advanture') {
                    label = `[ ${npc.name} ]`;
                }
                
                return {
                    id: `npc-${npcId}`,
                    label: label,
                    type: 'action',
                    action: () => this.talkTo(locationId, npcId),
                };
            });

        // Add static options as per the spec
        menuItems.push({
            id: 'delimiter',
            label: `--- --- ---`,
            disabled: true // delimiters are not selectable
        });
        menuItems.push({
            id: 'inventory',
            label: '[ INVENTORY ]',
            type: 'action',
            action: () => this.navigationManager.navigateTo({ screen: 'Inventory' })
        });
        menuItems.push({
            id: 'travel',
            label: '[ WORLD MAP ]',
            type: 'navigation',
            action: () => {
                this.navigationManager.navigateTo({ screen: 'WorldMap' })
                this.eventBus.emit('log', { text: `You've left ${locationData.name}` });
            }
        });
        
        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => {
                if (item.action) item.action();
            }
        });
    }
    
    talkTo(locationId, npcId) {
        this.navigationManager.navigateTo({ screen: 'Dialogue', params: { locationId, npcId } });
        const npcData = NPC_DATA[locationId]?.[npcId];
        const npcName = npcData?.name || npcId;
        this.eventBus.emit('log', { text: `You're talking to ${npcName}` });
    }

    // This method was missing, causing inputs to be ignored.
    handleInput(input) {
        if (input.type === 'COMMAND' && input.command === 'INVENTORY') {
            this.navigationManager.navigateTo({ screen: 'Inventory' });
            return;
        }

        if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }
}