class InputManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Basic touch support
        // document.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });

        // A much smarter handler that replaces the problematic 'handleTouch'
        document.addEventListener('click', (e) => this.handleClick(e));
    }

    handleKeyDown(e) {
        const key = e.key;
        let command = null;

        switch (key) {
            case 'ArrowUp':
                command = 'UP';
                break;
            case 'ArrowDown':
                command = 'DOWN';
                break;
            case 'ArrowLeft':
                command = 'LEFT';
                break;
            case 'ArrowRight':
                command = 'RIGHT';
                break;
            case 'Enter':
                command = 'SELECT';
                break;
            case 'Escape':
                command = 'BACK';
                break;
            default:
                // For text input fields, let the event propagate
                if (e.target.tagName === 'INPUT') {
                    this.eventBus.emit('input', { type: 'TEXT', key: key, target: e.target });
                    return; 
                }
                command = key.toUpperCase();
                break;
        }

        if (command) {
            e.preventDefault();
            this.eventBus.emit('input', { type: 'COMMAND', command: command });
        }
    }

    handleTouch(e) {
        // This is a very simplified touch handler.
        // It treats any tap as a 'SELECT' command.
        e.preventDefault();
        const target = e.target;

        // Check if the tap is on a menu item
        const menuItem = target.closest('.menu-item');
        if (menuItem && menuItem.dataset.id) {
            this.eventBus.emit('input', { type: 'TOUCH_SELECT', id: menuItem.dataset.id });
            return;
        }

        this.eventBus.emit('input', { type: 'COMMAND', command: 'SELECT' });
    }

    handleClick(e) {
        const target = e.target;

        // Specifically check for attribute buttons FIRST (before the early return for buttons)
        // This must come before the generic button check because attribute buttons ARE buttons
        const attributeButton = target.closest('.attribute-button');
        if (attributeButton && attributeButton.dataset.action) {
            e.preventDefault(); // We're handling this, so prevent other actions.
            const uiActionEvent = {
                type: 'UI_ACTION',
                action: attributeButton.dataset.action,
                stat: attributeButton.dataset.stat
            };
            this.eventBus.emit('input', uiActionEvent);
            return;
        }

        // If the click is on a standard interactive element, let the browser do its job and do nothing further.
        if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.tagName === 'A') {
            return; 
        }

        // --- Targeted fix for menu items ---
        // Check if the click was on a menu item
        const menuItem = target.closest('.menu-item');
        if (menuItem && menuItem.dataset.id) {
            e.preventDefault();
            // Emit a specific event for a direct tap, so the menu knows which item was selected.
            this.eventBus.emit('input', { type: 'TOUCH_SELECT', id: menuItem.dataset.id });
            return;
        }

    }


}