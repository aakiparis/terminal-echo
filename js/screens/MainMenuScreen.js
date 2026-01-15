class MainMenuScreen extends BaseScreen {
    initComponents() {
        // This method is called by BaseScreen.enter()
        this.components.title = new ScreenTitle({ text: 'Terminal Echo' });
        this.components.description = new ScreenDescription({ text: 'A Retro Terminal RPG', centered: true });

        const menuItems = [
            { id: 'new-game', label: 'New Game', type: 'navigation', action: () => this.navigationManager.navigateTo({ screen: 'NewGameMode' }) },
            { id: 'load-game', label: 'Load Game', type: 'action', disabled: true },
            { id: 'credits', label: 'Credits', type: 'action', action: () => this.showCredits() },
        ];

        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => {
                if (item.action) item.action();
            }
        });
    }

    showCredits() {
        this.eventBus.emit('log', { text: 'Terminal Echo - Created by AI.' });
    }

    handleInput(input) {
        // Delegate input handling to the menu component
        if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }
}