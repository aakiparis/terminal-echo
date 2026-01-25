class Menu extends BaseComponent {
    constructor(config) {
        super(config);
        this.items = config.items || [];
        this.focusedIndex = this.findInitialFocus(config.defaultFocusIndex || 0);
        this.onSelect = config.onSelect || (() => {});
    }

    findInitialFocus(startIndex) {
        if (!this.items[startIndex] || !this.items[startIndex].disabled) {
            return startIndex;
        }
        return this.items.findIndex(item => !item.disabled);
    }

    render() {
        const itemsHtml = this.items.map((item, index) => this.renderItem(item, index)).join('');
        const html = `<ul class="menu-list">${itemsHtml}</ul>`;
        this.element = this._createElementFromHTML(html);
        this.updateFocus();
        return this.element;
    }
    
    renderItem(item, index) {
        const disabledClass = item.disabled ? 'disabled' : '';
        let itemContent = '';

        switch (item.type) {
            case 'attribute':
                itemContent = `
                    <span class="menu-item-label">${item.label}</span>
                    <div class="attribute-controls">
                        <button class="attribute-button" data-action="decrease" data-id="${item.id}">&lt;</button>
                        <span class="attribute-value">${item.value}</span>
                        <button class="attribute-button" data-action="increase" data-id="${item.id}">&gt;</button>
                    </div>`;
                break;
            case 'input':
                itemContent = `
                    <span class="menu-item-label">${item.label}</span>
                    <input type="text" class="input-field" id="${item.id}" value="${item.value || ''}" placeholder="Enter 6-chars nick name..." maxlength="6">`;
                break;
            default: // action, navigation
                itemContent = `
                    <span class="menu-item-label">${item.label}</span>
                    ${item.hotkey ? `<span class="menu-item-hotkey">[${item.hotkey}]</span>` : ''}`;
                break;
        }

        return `<li class="menu-item type-${item.type} ${disabledClass}" data-index="${index}" data-id="${item.id}">${itemContent}</li>`;
    }

    updateFocus() {
        if (!this.element) return;
        this.element.querySelectorAll('.menu-item').forEach((li, index) => {
            if (index === this.focusedIndex) {
                li.classList.add('focused');
            } else {
                li.classList.remove('focused');
            }
        });
    }

    handleInput(input) {
        const currentItem = this.items[this.focusedIndex];
        if (!currentItem) return;

        if (input.type === 'COMMAND') {
            switch (input.command) {
                case 'UP':
                    this.navigate(-1);
                    break;
                case 'DOWN':
                    this.navigate(1);
                    break;
                case 'LEFT':
                    if (currentItem.type === 'attribute' && currentItem.onAdjust && !currentItem.disabled) currentItem.onAdjust(-1);
                    break;
                case 'RIGHT':
                    if (currentItem.type === 'attribute' && currentItem.onAdjust && !currentItem.disabled) currentItem.onAdjust(1);
                    break;
                case 'SELECT':
                    if (!currentItem.disabled) {
                         if (currentItem.type === 'input') {
                            const inputEl = this.element.querySelector(`#${currentItem.id}`);
                            inputEl.focus();
                        } else {
                            this.onSelect(currentItem);
                        }
                    }
                    break;
            }
        } else if (input.type === 'TOUCH_SELECT') {
            const selectedItem = this.items.find(item => item.id === input.id);
            if (selectedItem && !selectedItem.disabled) {
                this.focusedIndex = this.items.indexOf(selectedItem);
                this.updateFocus();
                this.onSelect(selectedItem);
            }
        }
    }
    
    navigate(direction) {
        const numItems = this.items.length;
        if (numItems === 0) return;
        
        let newIndex = this.focusedIndex;
        let attempts = 0;
        
        do {
            newIndex = (newIndex + direction + numItems) % numItems;
            attempts++;
        } while (this.items[newIndex].disabled && attempts < numItems);

        if (!this.items[newIndex].disabled) {
            this.focusedIndex = newIndex;
        }

        this.updateFocus();
    }

    // New method to surgically update an item's value
    updateItemValue(itemId, newValue) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.value = newValue;
            const itemElement = this.element.querySelector(`[data-id="${itemId}"]`);
            if (itemElement) {
                const valueElement = itemElement.querySelector('.attribute-value');
                if (valueElement) {
                    valueElement.textContent = newValue;
                }
            }
        }
    }

    // New method to surgically enable/disable an item
    setItemDisabled(itemId, isDisabled) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.disabled = isDisabled;
            const itemElement = this.element.querySelector(`[data-id="${itemId}"]`);
            if (itemElement) {
                if (isDisabled) {
                    itemElement.classList.add('disabled');
                } else {
                    itemElement.classList.remove('disabled');
                }
            }
        }
    }
}