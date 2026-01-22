class MainMenuScreen extends BaseScreen {
    initComponents() {
        // This method is called by BaseScreen.enter()
        this.components.title = new ScreenTitle({ text: 'Terminal Echo' });
        this.components.description = new ScreenDescription(
            { text: 'A Retro Terminal Conversational RPG<br>Use UP/DOWN keys on your keyboard to navigate.', centered: true }
        );

        const menuItems = [
            { id: 'new-game', label: '[ NEW GAME ]', type: 'navigation', action: () => this.navigationManager.navigateTo({ screen: 'NewGameMode' }) },
            { id: 'load-game', label: '[ LOAD GAME ] ( coming soon ) ', type: 'action', disabled: true },
            { id: 'credits', label: '[ CREDITS ]', type: 'action', action: () => this.showCredits() },
        ];

        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => {
                if (item.action) item.action();
            }
        });
    }

    showCredits() {
        this.eventBus.emit('log', { text: 'Created by Andrei Kiparis with Terminal Echo GPT' });
    }

    handleInput(input) {
        // Delegate input handling to the menu component
        if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }
}