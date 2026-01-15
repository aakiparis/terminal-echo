class InputManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        // Basic touch support
        document.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });
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
}