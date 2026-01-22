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

        const menuItems = (locationData.npcs || []).map(npcId => {
            const npc = npcDataForLocation[npcId];
            return {
                id: `npc-${npcId}`,
                label: `Talk to ${npc.name}`,
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
                this.eventBus.emit('log', { text: `You've leaved ${locationId}` });
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
        this.eventBus.emit('log', { text: `You're talking to ${npcId}` });
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