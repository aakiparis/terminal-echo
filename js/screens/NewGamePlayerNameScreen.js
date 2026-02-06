class NewGamePlayerNameScreen extends BaseScreen {
    initComponents() {
        this.playerName = this.stateManager.getState().player.name || 'User';
        this.components.title = new ScreenTitle({ text: 'Character Creation' });
        this.components.description = new ScreenDescription({ text: 'Enter your name', centered: true });

        const menuItems = [
            { 
                id: 'player-name', 
                label: 'Name: ', 
                type: 'input',
                value: this.playerName,
            },
            {
                id: 'separator',
                label: `------`,
                type: 'separator'
            },
            { id: 'confirm', label: '[ CONFIRM ]', type: 'action', action: () => this.confirmName() },
            { id: 'back', label: '[ BACK ]', type: 'navigation', action: () => this.navigationManager.navigateTo({ screen: 'NewGameMode' }) },
        ];

        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => {
                if (item.action) item.action();
            }
        });
    }

    confirmName() {
        const inputEl = document.getElementById('player-name');
        if (inputEl) {
            this.playerName = inputEl.value.trim();
        }

        if (this.playerName.length > 0) {
            this.stateManager.updateState({ player: { name: this.playerName } });
            this.navigationManager.navigateTo({ screen: 'NewGamePlayerAttributes' });
        } else {
            this.eventBus.emit('log', { text: 'Name cannot be empty.', type: 'error' });
        }
    }
    
    handleInput(input) {
        // Special case for the 'Confirm' button on this screen
        if (input.type === 'COMMAND' && input.command === 'SELECT' && this.components.menu.focusedIndex === 1) {
             this.confirmName();
             return; // Stop further processing
        }
        
        // Default behavior: pass to the menu
        if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }
}