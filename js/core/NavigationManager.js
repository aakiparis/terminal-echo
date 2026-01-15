class NavigationManager {
    constructor(eventBus, stateManager, screenContainer) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.screenContainer = screenContainer;
        this.screens = {};
        this.currentScreen = null;

        this.eventBus.on('navigate', (payload) => this.navigateTo(payload));
    }

    registerScreen(screen) {
        this.screens[screen.name] = screen;
    }

    navigateTo(payload) {
        const screenName = payload.screen;
        const params = payload.params || {};

        if (!this.screens[screenName]) {
            console.error(`Screen "${screenName}" not found.`);
            return;
        }

        if (this.currentScreen) {
            this.currentScreen.exit();
        }
        
        this.stateManager.updateState({ currentScreen: screenName });

        this.currentScreen = this.screens[screenName];
        this.currentScreen.enter(params);

        this.renderCurrentScreen();
    }

    renderCurrentScreen() {
        this.screenContainer.innerHTML = ''; // Reverted to simpler, correct version
        this.screenContainer.appendChild(this.currentScreen.render());
    }

    handleInput(input) {
        if (this.currentScreen) {
            this.currentScreen.handleInput(input);
        }
    }
}