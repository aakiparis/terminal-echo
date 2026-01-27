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
        // Pass input directly to the internal menu
        this.menu.handleInput(input);
    }
}