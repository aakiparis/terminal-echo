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
        this.eventBus.on('levelUp', (data) => this.showLevelUpPopup(data));
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

    showPopup(popupConfig) {
        this.activePopup = new PopupComponent({
            eventBus: this.eventBus,
            ...popupConfig
        });
        this.renderCurrentScreen();
    }

    closePopup() {
        if (!this.activePopup) return;
        this.activePopup = null;
        this.renderCurrentScreen();
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

    showLevelUpPopup(data) {
        const player = this.stateManager.getState().player;
        const baseStats = {
            str: player.str || 1,
            int: player.int || 1,
            lck: player.lck || 1
        };
        
        // Track allocated points (starts at 0, must reach 1)
        let allocatedPoints = 0;
        const tempStats = { ...baseStats };
        
        const levelUpPopup = new PopupComponent({
            eventBus: this.eventBus,
            title: `LEVEL UP!`,
            message: `Congratulations! You reached Level ${data.level}!\n\nAllocate 1 point to an attribute:`,
            menuItems: [
                {
                    id: 'str',
                    label: 'Strength (STR)',
                    type: 'attribute',
                    value: tempStats.str,
                    onAdjust: (direction) => {
                        if (direction > 0 && allocatedPoints === 0) {
                            // Reset other attributes if they were increased
                            if (tempStats.int > baseStats.int) {
                                tempStats.int = baseStats.int;
                                levelUpPopup.menu.updateItemValue('int', tempStats.int);
                            }
                            if (tempStats.lck > baseStats.lck) {
                                tempStats.lck = baseStats.lck;
                                levelUpPopup.menu.updateItemValue('lck', tempStats.lck);
                            }
                            tempStats.str++;
                            allocatedPoints = 1;
                            levelUpPopup.menu.updateItemValue('str', tempStats.str);
                            levelUpPopup.menu.setItemDisabled('confirm', false);
                        } else if (direction < 0 && tempStats.str > baseStats.str) {
                            tempStats.str--;
                            allocatedPoints = 0;
                            levelUpPopup.menu.updateItemValue('str', tempStats.str);
                            levelUpPopup.menu.setItemDisabled('confirm', true);
                        }
                    }
                },
                {
                    id: 'int',
                    label: 'Intelligence (INT)',
                    type: 'attribute',
                    value: tempStats.int,
                    onAdjust: (direction) => {
                        if (direction > 0 && allocatedPoints === 0) {
                            // Reset other attributes if they were increased
                            if (tempStats.str > baseStats.str) {
                                tempStats.str = baseStats.str;
                                levelUpPopup.menu.updateItemValue('str', tempStats.str);
                            }
                            if (tempStats.lck > baseStats.lck) {
                                tempStats.lck = baseStats.lck;
                                levelUpPopup.menu.updateItemValue('lck', tempStats.lck);
                            }
                            tempStats.int++;
                            allocatedPoints = 1;
                            levelUpPopup.menu.updateItemValue('int', tempStats.int);
                            levelUpPopup.menu.setItemDisabled('confirm', false);
                        } else if (direction < 0 && tempStats.int > baseStats.int) {
                            tempStats.int--;
                            allocatedPoints = 0;
                            levelUpPopup.menu.updateItemValue('int', tempStats.int);
                            levelUpPopup.menu.setItemDisabled('confirm', true);
                        }
                    }
                },
                {
                    id: 'lck',
                    label: 'Luck (LCK)',
                    type: 'attribute',
                    value: tempStats.lck,
                    onAdjust: (direction) => {
                        if (direction > 0 && allocatedPoints === 0) {
                            // Reset other attributes if they were increased
                            if (tempStats.str > baseStats.str) {
                                tempStats.str = baseStats.str;
                                levelUpPopup.menu.updateItemValue('str', tempStats.str);
                            }
                            if (tempStats.int > baseStats.int) {
                                tempStats.int = baseStats.int;
                                levelUpPopup.menu.updateItemValue('int', tempStats.int);
                            }
                            tempStats.lck++;
                            allocatedPoints = 1;
                            levelUpPopup.menu.updateItemValue('lck', tempStats.lck);
                            levelUpPopup.menu.setItemDisabled('confirm', false);
                        } else if (direction < 0 && tempStats.lck > baseStats.lck) {
                            tempStats.lck--;
                            allocatedPoints = 0;
                            levelUpPopup.menu.updateItemValue('lck', tempStats.lck);
                            levelUpPopup.menu.setItemDisabled('confirm', true);
                        }
                    }
                },
                {
                    id: 'delimiter',
                    label: '--- --- ---',
                    disabled: true
                },
                {
                    id: 'confirm',
                    label: '[ CONFIRM ]',
                    type: 'action',
                    disabled: true, // Initially disabled until point is allocated
                    action: () => {
                        if (allocatedPoints === 1) {
                            // Update player stats
                            const playerState = this.stateManager.getState().player;
                            this.stateManager.updateState({
                                player: {
                                    ...playerState,
                                    str: tempStats.str,
                                    int: tempStats.int,
                                    lck: tempStats.lck,
                                    maxHp: 20 + (tempStats.str - 1) * 2,
                                    // Keep current HP, but cap it at new maxHp
                                    hp: Math.min(playerState.hp, 20 + (tempStats.str - 1) * 2)
                                }
                            });
                            
                            this.closePopup();
                            this.eventBus.emit('log', {
                                text: `Attribute increased! STR: ${tempStats.str}, INT: ${tempStats.int}, LCK: ${tempStats.lck}`,
                                type: 'system'
                            });
                        }
                    }
                }
            ]
        });
        
        this.activePopup = levelUpPopup;
        this.renderCurrentScreen();
    }
}