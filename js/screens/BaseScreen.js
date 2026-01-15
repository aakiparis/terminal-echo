class BaseScreen {
    constructor(config) {
        this.name = config.name;
        this.eventBus = config.eventBus;
        this.stateManager = config.stateManager;
        this.navigationManager = config.navigationManager;
        this.element = null; // The root DOM element for this screen
        this.components = {}; // Holds component instances
    }

    // Called when screen becomes active
    enter(params) {
        // 1. Create the root element for the screen
        this.element = document.createElement('div');
        this.element.className = `screen screen-${this.name.toLowerCase()} active`;

        // 2. Initialize and create component instances
        this.initComponents(params);

        // 3. Render each component and append it to the screen's root element
        Object.values(this.components).forEach(component => {
            const componentElement = component.render();
            if (componentElement) {
                this.element.appendChild(componentElement);
            }
        });

        console.log(`Entering screen: ${this.name}`);
    }

    // Called before leaving the screen
    exit() {
        console.log(`Exiting screen: ${this.name}`);
        this.element = null;
        this.components = {};
    }

    // This method MUST be implemented by child screens
    initComponents(params) {
        // Child screens will create their components here, e.g.:
        // this.components.title = new ScreenTitle(...);
        // this.components.menu = new Menu(...);
    }

    // Returns the screen's single root DOM element
    render() {
        // The `enter` method now handles the creation of the element
        return this.element;
    }

    // Handle input (delegated to a component, usually a menu)
    handleInput(input) {
        // To be implemented by child classes
    }
}