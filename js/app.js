document.addEventListener('DOMContentLoaded', () => {
    class App {
        constructor() {
            this.init();
        }

        init() {
            // DOM Containers
            const screenContainer = document.querySelector('.terminal-body');
            const statusBarContainer = document.querySelector('.terminal-header');
            const eventLogContainer = document.querySelector('.terminal-footer');

            // === CRITICAL CHECK ===
            // Add a guard to ensure the DOM elements exist before proceeding.
            if (!screenContainer || !statusBarContainer || !eventLogContainer) {
                console.error("Fatal Error: Could not find essential DOM containers (.terminal-body, .terminal-header, .terminal-footer). Make sure your index.html is correct.");
                document.body.innerHTML = '<h1 style="color:red; font-family: monospace;">Fatal Error: DOM containers not found. Check console.</h1>';
                return;
            }

            // Core Systems - Initialize ThemeManager first to apply saved theme
            const themeManager = new ThemeManager();
            const eventBus = new EventBus();
            const analyticsManager = new AnalyticsManager();
            const stateManager = new StateManager(eventBus);
            const navigationManager = new NavigationManager(eventBus, stateManager, screenContainer, analyticsManager);
            new InputManager(eventBus);

            // Global Components
            const statusBar = new StatusBar({
                eventBus,
                initialState: { stats: stateManager.getPlayerStats() }
            });
            const eventLog = new EventLog({ eventBus });

            statusBar.mount(statusBarContainer);
            eventLog.mount(eventLogContainer);

            eventBus.on('stateUpdated', (state) => {
                statusBarContainer.innerHTML = '';
                const newStatusBar = new StatusBar({
                    eventBus,
                    initialState: { stats: stateManager.getEffectivePlayerStats() }
                });
                newStatusBar.mount(statusBarContainer);
            });

            // Register Screens
            const screens = [
                MainMenuScreen, NewGameModeScreen, NewGamePlayerNameScreen,
                OnboardingNarrativeScreen, WorldMapIntroScreen, NewGamePlayerAttributesScreen,
                WorldMapScreen, LocationScreen, DialogueScreen, InventoryScreen, TradeScreen
            ];

            screens.forEach(ScreenClass => {
                const screenInstance = new ScreenClass({
                    name: ScreenClass.name.replace('Screen', ''),
                    eventBus, stateManager, navigationManager, analyticsManager, themeManager
                });
                navigationManager.registerScreen(screenInstance);
            });
            
            eventBus.on('input', (input) => {
                navigationManager.handleInput(input);
            });

            // HP loss: 2s red heartbeat flash on the terminal
            const terminalFrame = document.querySelector('.terminal-frame');
            eventBus.on('playerLostHp', () => {
                if (!terminalFrame) return;
                const overlay = document.createElement('div');
                overlay.className = 'hp-loss-overlay';
                terminalFrame.appendChild(overlay);
                setTimeout(() => overlay.remove(), 2000);
            });

            // Start the game: restore last screen if state was loaded from localStorage
            if (stateManager.restoredFromStorage) {
                const state = stateManager.getState();
                const restorable = ['MainMenu', 'Location', 'WorldMap'];
                const screen = restorable.includes(state.currentScreen) ? state.currentScreen : 'Location';
                const params = screen === 'Location' ? { id: state.currentLocation } : (screen === 'WorldMap' ? {} : {});
                navigationManager.navigateTo({ screen, params });
                eventBus.emit('log', { text: 'Game state restored.', type: 'system' });
            } else {
                navigationManager.navigateTo({ screen: 'MainMenu' });
            }
            eventBus.emit('log', { text: 'POST checks.' });
            eventBus.emit('log', { text: 'Welcome to Terminal Echo. v26-2.' });
        }
    }

    new App();
});