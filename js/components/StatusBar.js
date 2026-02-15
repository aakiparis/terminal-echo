class StatusBar extends BaseComponent {
    constructor(config) {
        super(config);
        this.state = config.initialState || {};
    }

    render() {
        const { name, hp, maxHp, xp, level, caps, reputation } = this.state.stats || {};
        const currentHp = hp || 0;
        const currentMaxHp = maxHp || 0;
        const isLowHp = currentMaxHp > 0 && currentHp <= currentMaxHp * 0.3;
        const hpClass = isLowHp ? 'hp-low' : '';
        const pulseCircle = isLowHp ? '<span class="hp-pulse-indicator"></span>' : '';
        const html = `
            <div class="terminal-status">
                <div class="status-left">
                    <span>NAME: ${name || 'N/A'}</span>
                    <span class="hp-display ${hpClass}">
                        HP: ${currentHp}/${currentMaxHp} ${pulseCircle}
                    </span>
                    <!--<span>XP: ${xp || 0}</span>
                    <span>XP: ${xp || 0} (LVL: ${level || 1})</span>-->
                </div>
                <div class="status-right">
                    <!--<span>LVL: ${level || 1}</span>
                    <span>CAPS: ${caps || 0}</span>-->
                    <span>REP: ${reputation || 0 }</span>
                </div>
            </div>
        `;
        // Create the element and return it
        this.element = this._createElementFromHTML(html);
        return this.element;
    }
    
    update(newState) {
        this.state = newState;
        // Re-render the component's internals
        const newElement = this.render();
        if (this.element && this.element.parentNode) {
            this.element.parentNode.replaceChild(newElement, this.element);
        }
        this.element = newElement;
    }
}