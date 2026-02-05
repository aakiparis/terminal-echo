class PopupComponent extends BaseComponent {
    constructor(config) {
        super(config);
        this.title = config.title || '';
        this.message = config.message || '';
        this.menuItems = config.menuItems || [];
        
        this.menu = new Menu({
            eventBus: this.eventBus,
            items: this.menuItems,
            onSelect: (item) => {
                if (item.action) {
                    item.action();
                }
            }
        });
    }

    render() {
        const overlayElement = document.createElement('div');
        overlayElement.className = 'popup-overlay';

        const popupElement = document.createElement('div');
        popupElement.className = 'popup-content';

        const titleElement = document.createElement('div');
        titleElement.className = 'screen-title';
        titleElement.textContent = this.title;

        const messageElement = document.createElement('div');
        messageElement.className = 'screen-description';
        messageElement.textContent = this.message;

        popupElement.appendChild(titleElement);
        popupElement.appendChild(messageElement);
        popupElement.appendChild(this.menu.render());

        overlayElement.appendChild(popupElement);
        return overlayElement;
    }

    handleInput(input) {
        // Handle UI_ACTION for attribute buttons
        if (input.type === 'UI_ACTION') {
            const item = this.menu.items.find(i => i.id === input.stat);
            if (item && item.type === 'attribute' && item.onAdjust) {
                if (input.action === 'increase') {
                    item.onAdjust(1);
                } else if (input.action === 'decrease') {
                    item.onAdjust(-1);
                }
            }
            return;
        }
        
        // Pass other input directly to the internal menu
        this.menu.handleInput(input);
    }
}