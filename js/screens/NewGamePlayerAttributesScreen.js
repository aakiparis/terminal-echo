class NewGamePlayerAttributesScreen extends BaseScreen {
    initComponents() {
        if (!this.attributes) {
            this.totalPoints = 15;
            this.attributes = { str: 1, int: 7, lck: 7 };
            this.pointsRemaining = this.totalPoints - 15;
        }
        
        this.updateComponents();
    }

    updateComponents() {
        const descriptionText = `Distribute ${this.totalPoints} points. Points remaining: ${this.pointsRemaining}`;
        this.components.title = new ScreenTitle({ text: 'Allocate Attributes' });
        this.components.description = new ScreenDescription({ text: descriptionText, centered: true });

        const menuItems = [
            { id: 'str', label: 'Strength (STR)', type: 'attribute', value: this.attributes.str, onAdjust: (val) => this.adjustAttribute('str', val) },
            { id: 'int', label: 'Intelligence (INT)', type: 'attribute', value: this.attributes.int, onAdjust: (val) => this.adjustAttribute('int', val) },
            { id: 'lck', label: 'Luck (LCK)', type: 'attribute', value: this.attributes.lck, onAdjust: (val) => this.adjustAttribute('lck', val) },
            { id: 'confirm', label: 'Confirm', type: 'action', action: () => this.confirmAttributes(), disabled: this.pointsRemaining > 0 },
            { id: 'back', label: 'Back', type: 'navigation', action: () => this.navigationManager.navigateTo({ screen: 'NewGamePlayerName' }) },
        ];
        
        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => {
                if (item.action) item.action();
            }
        });
    }

    adjustAttribute(attr, direction) {
        let valueChanged = false;
        if (direction > 0 && this.pointsRemaining > 0) {
            this.attributes[attr]++;
            this.pointsRemaining--;
            valueChanged = true;
        } else if (direction < 0 && this.attributes[attr] > 1) {
            this.attributes[attr]--;
            this.pointsRemaining++;
            valueChanged = true;
        }

        if (valueChanged) {
            // Perform surgical updates instead of a full refresh
            this.components.description.update(`Distribute ${this.totalPoints} points. Points remaining: ${this.pointsRemaining}`);
            this.components.menu.updateItemValue(attr, this.attributes[attr]);
            
            // Check and update the confirm button state
            this.components.menu.setItemDisabled('confirm', this.pointsRemaining > 0);
        }
    }

    confirmAttributes() {
        if (this.pointsRemaining === 0) {
            const playerState = this.stateManager.getState().player;
            this.stateManager.updateState({ 
                player: { 
                    ...playerState,
                    ...this.attributes,
                    maxHp: 20 + (this.attributes.str * 2),
                    hp: 20 + (this.attributes.str * 2),
                } 
            });
            this.eventBus.emit('log', { text: 'Character profile calibrated.' });
            this.navigationManager.navigateTo({ screen: 'WorldMap' });
        } else {
            this.eventBus.emit('log', { text: `You must allocate all remaining points.`, type: 'error' });
        }
    }

    handleInput(input) {
        if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }
}