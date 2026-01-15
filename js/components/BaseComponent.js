class BaseComponent {
    constructor(config = {}) {
        this.id = config.id || `component-${Math.random().toString(36).substr(2, 9)}`;
        this.element = null;
        this.config = config;
        this.eventBus = config.eventBus;
    }

    render() {
        // This method should be overridden by child classes.
        // If a child class fails to implement it, this error will be thrown.
        throw new Error('Render method must be implemented by a component subclass.');
    }

    mount(container) {
        if (!this.element) {
            this.render(); // Ensure element is created if not already
        }
        if (this.element) {
            container.appendChild(this.element);
            this.bindEvents();
        }
    }

    unmount() {
        this.unbindEvents();
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    update(newState) {
        // Can be implemented by child classes
    }

    bindEvents() {
        // Can be implemented by child classes
    }

    unbindEvents() {
        // Can be implemented by child classes
    }

    /**
     * Helper function to create a DOM element from an HTML string.
     * @param {string} htmlString The HTML string to parse.
     * @returns {Node} The first element created from the string.
     */
    _createElementFromHTML(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }
}