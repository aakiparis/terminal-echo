class WorldMapScreen extends BaseScreen {
    // This method creates the components for the screen.
    initComponents() {
        const state = this.stateManager.getState();
        this.components.title = new ScreenTitle({ text: 'World Map' });
        this.components.description = new ScreenDescription({ text: 'Select a destination to travel to.', centered: true });

        const unlockedLocations = state.unlocked_locations || [];
        const menuItems = unlockedLocations.map(locId => {
            const locationData = LOCATION_DATA[locId];
            return {
                id: `loc-${locId}`,
                label: locationData ? locationData.name : 'Unknown Location',
                type: 'navigation',
                action: () => this.travelTo(locId),
            };
        });

        // Add static options as per the spec
        menuItems.push(
            {
                id: 'inventory', label: 'Inventory (i)', type: 'action', action: () => this.navigationManager.navigateTo({ screen: 'Inventory' })
            }
        ); 
        // menuItems.push({ id: 'inventory', label: 'Inventory (i)', type: 'action', disabled: true }); 
        menuItems.push({ id: 'game-menu', label: 'Game Menu (m)', type: 'action', disabled: true }); // Not implemented yet

        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => {
                if (item.action) item.action();
            }
        });
    }
    
    travelTo(locationId) {
        this.stateManager.updateState({ currentLocation: locationId });
        this.navigationManager.navigateTo({ screen: 'Location', params: { id: locationId } });
    }

    // This method handles arrow keys and enter.
    handleInput(input) {
        if (this.components.menu) {
            if (input.type === 'COMMAND' && input.command === 'INVENTORY') {
                this.navigationManager.navigateTo({ screen: 'Inventory' });
                return;
            }

            if (this.components.menu) {
                this.components.menu.handleInput(input);
            }
        }
    }

    handleInput(input) {
        // Check for the INVENTORY command from the InputManager
        if (input.command === 'INVENTORY') {
            this.eventBus.emit('navigate', { screen: 'Inventory' });
            return; // Stop further processing
        }

        // If not a hotkey, pass input to the menu component
        if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }

    //     // Check for hotkeys first
    //     if (input.type === 'COMMAND') {
    //         switch(input.command) {
    //             case 'INVENTORY':
    //                 this.eventBus.emit('navigate', { screen: 'Inventory' });
    //                 return;
    //             case 'M':
    //                 // Future: this.navigationManager.navigateTo({ screen: 'GameMenu' });
    //                 this.eventBus.emit('log', { text: 'Game Menu not yet implemented.', type: 'system' });
    //                 return;
    //         }
    //     }
    //     // If not a hotkey, pass to the menu
    //     this.components.menu.handleInput(input);
    // }
}