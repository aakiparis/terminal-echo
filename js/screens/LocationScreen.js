class LocationScreen extends BaseScreen {
    enter(params) {
        super.enter(params);
        const locationId = params?.id || this.stateManager.getState().currentLocation;
        const state = this.stateManager.getState();
        if (locationId === 'the_forgotten_outpost' && !state.forgotten_outpost_waitlist_shown) {
            this._forgottenOutpostWaitlistTimer = setTimeout(() => {
                this._forgottenOutpostWaitlistTimer = null;
                const currentState = this.stateManager.getState();
                if (!currentState.forgotten_outpost_waitlist_shown) {
                    this.showWaitingListPopup();
                    this.stateManager.updateState({ forgotten_outpost_waitlist_shown: true });
                }
            }, 2000);
        }
    }

    exit() {
        if (this._forgottenOutpostWaitlistTimer) {
            clearTimeout(this._forgottenOutpostWaitlistTimer);
            this._forgottenOutpostWaitlistTimer = null;
        }
        super.exit();
    }

    showWaitingListPopup() {
        const emailPopup = new PopupComponent({
            eventBus: this.eventBus,
            title: 'JOIN WAITING LIST',
            message: 'Indefinite mode is coming soon! Enter your email to be notified when AI-generated adventures are available.',
            menuItems: [
                {
                    id: 'email_input',
                    label: 'Email:',
                    type: 'input',
                    value: ''
                },
                {
                    id: 'submit_email',
                    label: '[ SUBMIT ]',
                    type: 'action',
                    action: () => {
                        const emailInput = emailPopup.menu.element?.querySelector('#email_input');
                        const email = emailInput?.value?.trim();
                        if (!email || !email.includes('@')) {
                            this.eventBus.emit('log', { text: 'Please enter a valid email address.', type: 'error' });
                            return;
                        }
                        const surveyId = '019c068e-3e42-0000-188b-9dec52c98e15';
                        if (this.analyticsManager) {
                            this.analyticsManager.waitlistSubmitted(email, surveyId);
                        }
                        this.navigationManager.closePopup();
                        this.eventBus.emit('log', { text: 'Thank you! You\'ve been added to the waiting list.', type: 'system' });
                    }
                },
                {
                    id: 'cancel',
                    label: '[ CANCEL ]',
                    type: 'action',
                    action: () => this.navigationManager.closePopup()
                }
            ]
        });
        this.navigationManager.activePopup = emailPopup;
        this.navigationManager.renderCurrentScreen();
        setTimeout(() => {
            const emailInput = emailPopup.menu.element?.querySelector('#email_input');
            if (emailInput) emailInput.focus();
        }, 100);
    }

    // This method is called by BaseScreen.enter() to build the screen's content.
    initComponents(params) {
        const locationId = params.id || this.stateManager.getState().currentLocation;
        const locationData = LOCATION_DATA[locationId];

        if (!locationData) {
            console.error(`Location data not found for id: ${locationId}`);
            this.eventBus.emit('log', { text: `ERROR: Cannot load location ${locationId}.`, type: 'error' });
            this.navigationManager.navigateTo({ screen: 'WorldMap' });
            return;
        }

        const npcDataForLocation = NPC_DATA[locationId] || {};

        this.components.title = new ScreenTitle({ text: locationData.name });
        this.components.description = new ScreenDescription({ text: locationData.description, centered: true });

        const state = this.stateManager.getState();
        const unlockedNpcs = state.unlocked_npcs || {};
        const locationUnlockedNpcs = unlockedNpcs[locationId] || [];
        const lockedNpcs = state.locked_npcs || {};
        const locationLockedNpcs = lockedNpcs[locationId] || [];
        const newlyUnlockedNpcs = state.newly_unlocked_npcs || {};
        const locationNewlyUnlockedNpcs = newlyUnlockedNpcs[locationId] || [];
        
        const menuItems = (locationData.npcs || [])
            .filter(npcId => {
                const npc = npcDataForLocation[npcId];
                if (!npc) return false;
                
                // If NPC is locked, hide them regardless of is_available status
                if (locationLockedNpcs.includes(npcId)) {
                    return false;
                }
                
                // If NPC is in unlocked list, show them (they were unlocked via NPC_UNLOCK)
                if (locationUnlockedNpcs.includes(npcId)) {
                    return true;
                }
                
                // If NPC is not in unlocked list and not locked:
                // - Show if is_available is true/undefined (default available)
                // - Hide if is_available is false (default unavailable, needs to be unlocked)
                return npc.is_available !== false;
            })
            .map(npcId => {
                const npc = npcDataForLocation[npcId];
                let label = npc.name;
                
                // Add prefix based on type
                if (npc.type === 'npc') {
                    label = `Talk to ${npc.name}`;
                } else if (npc.type === 'device' || npc.type === 'advanture') {
                    label = `[ ${npc.name} ]`;
                }
                
                // Show pulse indicator for just-unlocked NPCs until player talks to them once
                if (locationNewlyUnlockedNpcs.includes(npcId)) {
                    label += '<span class="location-pulse-indicator"></span>';
                }
                
                return {
                    id: `npc-${npcId}`,
                    label: label,
                    type: 'action',
                    action: () => this.talkTo(locationId, npcId),
                };
            });

        // At Still Quarter: show separator + inventory only after first item; once shown, keep showing even if inventory becomes empty
        const hasAnyItems = StateManager.getInventoryTotalCount(state.player.inventory || []) > 0;
        const inventoryUnlockedAtStillQuarter = state.inventory_unlocked_at_still_quarter === true;
        const showInventoryBlock = locationId !== 'still_quarter' || hasAnyItems || inventoryUnlockedAtStillQuarter;
        const newlyUnlockedInventory = state.newly_unlocked_inventory === true;
        const pulseSpan = '<span class="location-pulse-indicator"></span>';
        if (showInventoryBlock) {
            menuItems.push({
                id: 'separator',
                label: `------`,
                type: 'separator'
            });
            menuItems.push({
                id: 'inventory',
                label: newlyUnlockedInventory ? `[ INVENTORY ]${pulseSpan}` : '[ INVENTORY ]',
                type: 'action',
                action: () => this.navigationManager.navigateTo({ screen: 'Inventory' })
            });
        }
        // During onboarding at Still Quarter: hide World Map until Neon Nexus is unlocked
        const unlockedLocations = state.unlocked_locations || [];
        const showWorldMap = locationId !== 'still_quarter' || unlockedLocations.includes('neon_nexus');
        if (showWorldMap) {
            const hasNewLocation = state.has_new_location_unlocked || false;
            const worldMapLabel = hasNewLocation 
                ? `[ WORLD MAP ]<span class="location-pulse-indicator"></span> `
                : '[ WORLD MAP ]';
            const hasSeenWorldMapIntro = state.has_seen_world_map_intro !== false;
            const worldMapScreen = hasSeenWorldMapIntro ? 'WorldMap' : 'WorldMapIntro';
            menuItems.push({
                id: 'travel',
                label: worldMapLabel,
                type: 'navigation',
                action: () => {
                    this.navigationManager.navigateTo({ screen: worldMapScreen });
                    this.eventBus.emit('log', { text: `You've left ${locationData.name}` });
                }
            });
        }
        
        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => {
                if (item.action) item.action();
            }
        });
    }
    
    talkTo(locationId, npcId) {
        this.navigationManager.navigateTo({ screen: 'Dialogue', params: { locationId, npcId } });
        const npcData = NPC_DATA[locationId]?.[npcId];
        const npcName = npcData?.name || npcId;
        const logText = npcData?.type === 'npc' ? `You're talking to ${npcName}` : npcName;
        this.eventBus.emit('log', { text: logText });
    }

    // This method was missing, causing inputs to be ignored.
    handleInput(input) {
        if (input.type === 'COMMAND' && input.command === 'INVENTORY') {
            this.navigationManager.navigateTo({ screen: 'Inventory' });
            return;
        }

        if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }
}