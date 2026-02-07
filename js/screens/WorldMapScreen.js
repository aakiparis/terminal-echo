class WorldMapScreen extends BaseScreen {
    // This method creates the components for the screen.
    initComponents() {
        const state = this.stateManager.getState();
        this.components.title = new ScreenTitle({ text: 'World Map' });
        this.components.description = new ScreenDescription({ text: 'Select a destination to travel to.', centered: true });

        const unlockedLocations = state.unlocked_locations || [];
        const newlyUnlockedLocationId = state.newly_unlocked_location_id;
        const menuItems = unlockedLocations.map(locId => {
            const locationData = LOCATION_DATA[locId];
            const isNewlyUnlocked = locId === newlyUnlockedLocationId;
            const locationLabel = locationData ? locationData.name : 'Unknown Location';
            const label = isNewlyUnlocked 
                ? `${locationLabel}<span class="location-pulse-indicator"></span>`
                : locationLabel;
            return {
                id: `loc-${locId}`,
                label: label,
                type: 'navigation',
                action: () => this.travelTo(locId),
            };
        });

        // Add static options as per the spec
        menuItems.push({
            id: 'separator',
            label: `------`,
            type: 'separator'
        },);
        // menuItems.push({
        //     id: 'inventory',
        //     label: '[ INVENTORY ]',
        //     type: 'action',
        //     action: () => this.navigationManager.navigateTo({ screen: 'Inventory' })
        // }); 
        menuItems.push({
            id: 'save-game',
            label: '[ SAVE GAME ]',
            type: 'action',
            action: () => this.saveGame()
        });
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
    
    saveGame() {
        try {
            const state = this.stateManager.getState();
            const saveData = JSON.stringify(state, null, 2);
            
            // Create a blob and download it
            const blob = new Blob([saveData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const playerName = state.player?.name || 'Echo';
            a.download = `terminal-echo-save-${playerName}-${timestamp}.json`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.eventBus.emit('log', { text: 'Game saved successfully!', type: 'system' });
        } catch (error) {
            console.error('Error saving game:', error);
            this.eventBus.emit('log', { text: 'Failed to save game.', type: 'error' });
        }
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
                        this.stateManager.resetState();
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
        const state = this.stateManager.getState();
        // Clear the new location indicator if player visits the newly unlocked location
        const updates = { currentLocation: locationId };
        if (state.newly_unlocked_location_id === locationId) {
            updates.has_new_location_unlocked = false;
            updates.newly_unlocked_location_id = null;
        }
        this.stateManager.updateState(updates);
        this.navigationManager.navigateTo({ screen: 'Location', params: { id: locationId } });
        const locationData = LOCATION_DATA[locationId];
        const locationName = locationData?.name || locationId;
        this.eventBus.emit('log', { text: `You've arrived at ${locationName}` });
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