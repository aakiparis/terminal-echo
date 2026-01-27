class NavigationManager {
    constructor(eventBus, stateManager, screenContainer) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.screenContainer = screenContainer;
        this.screens = {};
        this.currentScreen = null;
        this.activePopup = null;
        this.history = []; 
        this.eventBus.on('navigate', (payload) => this.navigateTo(payload));
        this.eventBus.on('navigate_back', () => this.goBack());
        this.eventBus.on('render', () => this.renderCurrentScreen());
        this.eventBus.on('gameOver', () => this.showGameOverPopup());
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

        // Push the current screen to history *before* changing it
        if (this.currentScreen && this.currentScreen.name !== screenName) {
            this.history.push({ screen: this.currentScreen.name, params: this.currentScreen.params || {} });
        }

        if (this.currentScreen) {
            this.currentScreen.exit();
        }
        
        this.stateManager.updateState({ currentScreen: screenName });

        this.currentScreen = this.screens[screenName];
        this.currentScreen.enter(params);

        this.renderCurrentScreen();
    }
    
    goBack() {
        const lastScreen = this.history.pop();
        if (lastScreen) {
            // A simple navigate call will work, as the history has already been popped.
            this.navigateTo(lastScreen);
        } else {
            console.warn("Navigation history is empty. Cannot go back.");
        }
    }

    renderCurrentScreen() {
        if (!this.currentScreen) return;
        this.screenContainer.innerHTML = ''; // Clear container
        this.screenContainer.appendChild(this.currentScreen.render());

        // If there's an active popup, render it on top
        if (this.activePopup) {
            this.screenContainer.appendChild(this.activePopup.render());
        }
    }

    handleInput(input) {
        if (this.activePopup) {
            this.activePopup.handleInput(input);
        } else if (this.currentScreen) {
            this.currentScreen.handleInput(input);
        }
    }

    showGameOverPopup() {
        this.activePopup = new PopupComponent({
            eventBus: this.eventBus,
            title: "GAME OVER",
            message: "You have just lost all your Health Points",
            menuItems: [
                {
                    id: 'restart',
                    label: '[ Main Menu ]',
                    action: () => {
                        // Reloading the page is the simplest way to restart.
                        window.location.reload();
                    }
                }
            ]
        });

        // Re-render the screen to include the new popup
        this.renderCurrentScreen();
    }
}