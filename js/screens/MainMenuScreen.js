class MainMenuScreen extends BaseScreen {
    isDesktop() {
        // Check if device is desktop (not mobile/tablet)
        // Desktop typically has: wider screen, no touch or has mouse capability
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const hasPointer = window.matchMedia('(pointer: fine)').matches;
        const isWideScreen = window.innerWidth > 768;
        const isTallEnough = window.innerHeight > 600; // Hide hint on small height screens (e.g., Chromebooks)
        
        // Consider it desktop if: wide screen AND tall enough AND (has fine pointer OR no touch)
        return isWideScreen && isTallEnough && (hasPointer || !hasTouch);
    }

    initComponents() {
        // This method is called by BaseScreen.enter()
        this.components.title = new ScreenTitle({ text: 'Terminal Echo' });
        
        const navigationHint = this.isDesktop() 
            ? '<br>Use UP/DOWN keys on your keyboard to navigate.' 
            : '';
        
        this.components.description = new ScreenDescription(
            { text: `A Retro Terminal Conversational RPG${navigationHint}`, centered: true }
        );

        const menuItems = [
            { id: 'new-game', label: '[ NEW GAME ]', type: 'navigation', action: () => this.navigationManager.navigateTo({ screen: 'NewGameMode' }) },
            { id: 'load-game', label: '[ LOAD GAME ]', type: 'action', action: () => this.loadGame() },
            { id: 'appearance', label: '[ THEME ]', type: 'action', action: () => this.showAppearancePopup() },
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
        this.eventBus.emit('log', { text: 'Created by Andrei Kiparis in 2026' });
    }

    showAppearancePopup() {
        if (!this.themeManager) {
            this.eventBus.emit('log', { text: 'Theme manager not available.', type: 'error' });
            return;
        }

        // Store original theme to restore if cancelled
        const originalTheme = this.themeManager.getCurrentTheme();
        const allThemes = this.themeManager.getAllThemes();

        const menuItems = allThemes.map(themeKey => {
            const themeName = this.themeManager.getThemeName(themeKey);
            const isCurrent = themeKey === originalTheme;
            const label = isCurrent ? `[ ${themeName.toUpperCase()} ] (CURRENT)` : `[ ${themeName.toUpperCase()} ]`;
            
            return {
                id: `theme-${themeKey}`,
                label: label,
                type: 'action',
                action: () => {
                    this.themeManager.applyTheme(themeKey);
                    this.navigationManager.closePopup();
                },
                onHover: () => {
                    // Preview theme on hover/focus
                    this.themeManager.applyTheme(themeKey);
                }
            };
        });

        menuItems.push({
            id: 'separator',
            label: '------',
            type: 'separator'
        });

        menuItems.push({
            id: 'cancel',
            label: '[ CANCEL ]',
            type: 'action',
            action: () => {
                // Restore original theme if user cancels
                this.themeManager.applyTheme(originalTheme);
                this.navigationManager.closePopup();
            }
        });

        this.navigationManager.showPopup({
            title: 'TERMINAL APPEARANCE',
            message: 'Select a color scheme for your terminal.',
            menuItems: menuItems
        });
    }

    loadGame() {
        // Create a hidden file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        
        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) {
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    
                    // Load the state
                    this.stateManager.loadState(saveData);
                    
                    // Navigate to the appropriate screen based on saved state
                    const savedScreen = saveData.currentScreen || 'WorldMap';
                    const savedLocation = saveData.currentLocation;
                    
                    this.eventBus.emit('log', { text: `Game loaded! Welcome back, ${saveData.player?.name || 'Echo'}!`, type: 'system' });
                    
                    // Navigate based on saved screen
                    if (savedScreen === 'Location' && savedLocation) {
                        this.navigationManager.navigateTo({ screen: 'Location', params: { id: savedLocation } });
                    } else if (savedScreen === 'WorldMap') {
                        this.navigationManager.navigateTo({ screen: 'WorldMap' });
                    } else {
                        // Default to WorldMap if screen is unknown
                        this.navigationManager.navigateTo({ screen: 'WorldMap' });
                    }
                } catch (error) {
                    console.error('Error loading game:', error);
                    this.eventBus.emit('log', { text: 'Failed to load game. Invalid save file.', type: 'error' });
                }
            };
            
            reader.onerror = () => {
                this.eventBus.emit('log', { text: 'Error reading save file.', type: 'error' });
            };
            
            reader.readAsText(file);
            
            // Clean up
            document.body.removeChild(fileInput);
        };
        
        // Add to DOM and trigger click
        document.body.appendChild(fileInput);
        fileInput.click();
    }

    handleInput(input) {
        // Delegate input handling to the menu component
        if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }
}