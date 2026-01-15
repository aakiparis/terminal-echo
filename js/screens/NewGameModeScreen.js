class NewGameModeScreen extends BaseScreen {
    // THIS METHOD IS CRITICAL. It creates the components for this screen.
    initComponents() {
        this.components.title = new ScreenTitle({ text: 'Select Game Mode' });

        const menuItems = [
            { id: 'scripted', label: 'Scripted', type: 'navigation', action: () => this.selectMode('scripted') },
            { id: 'ai-generated', label: 'AI-Generated', type: 'action', disabled: true },
            { id: 'back', label: 'Back', type: 'navigation', action: () => this.navigationManager.navigateTo({ screen: 'MainMenu' }) },
        ];

        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => {
                if (item.action) item.action();
            }
        });
    }

    selectMode(mode) {
        this.eventBus.emit('log', { text: 'Scripted game mode' });
        this.stateManager.updateState({ gameMode: mode });
        this.navigationManager.navigateTo({ screen: 'NewGamePlayerName' });
    }

    // This method handles arrow keys and enter.
    handleInput(input) {
        // It must delegate the input to the menu component.
        if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }
}