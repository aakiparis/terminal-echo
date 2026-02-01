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
        menuItems.push({
            id: 'delimiter',
            label: `--- --- ---`,
            disabled: true // delimiters are not selectable
        });
        // menuItems.push({
        //     id: 'inventory',
        //     label: '[ INVENTORY ]',
        //     type: 'action',
        //     action: () => this.navigationManager.navigateTo({ screen: 'Inventory' })
        // }); 
        menuItems.push({
            id: 'main-menu',
            label: '[ MAIN MENU ]',
            type: 'action',
            action: () => this.confirmMainMenu()
        });

        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => {
                if (item.action) item.action();
            }
        });
    }
    
    confirmMainMenu() {
        this.navigationManager.showPopup({
            title: 'RETURN TO MAIN MENU',
            message: 'Returning to the main menu will lose all current progress. Are you sure?',
            menuItems: [
                {
                    id: 'confirm_main_menu',
                    label: '[ YES, RETURN ]',
                    action: () => {
                        this.navigationManager.closePopup();
                        this.navigationManager.navigateTo({ screen: 'MainMenu' });
                    }
                },
                {
                    id: 'cancel_main_menu',
                    label: '[ CANCEL ]',
                    action: () => {
                        this.navigationManager.closePopup();
                    }
                }
            ]
        });
    }
    
    travelTo(locationId) {
        this.stateManager.updateState({ currentLocation: locationId });
        this.navigationManager.navigateTo({ screen: 'Location', params: { id: locationId } });
        this.eventBus.emit('log', { text: `You've arrived to ${locationId}` });
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