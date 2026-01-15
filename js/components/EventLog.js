class EventLog extends BaseComponent {
    constructor(config) {
        super(config);
        this.maxEntries = config.maxEntries || 50;
        this.entries = [];
        this.eventBus.on('log', (entry) => this.addEntry(entry));
    }

    render() {
        const entriesHtml = this.entries.map(entry =>
            `<div class="event-log-entry type-${entry.type}">&gt; ${entry.text}</div>`
        ).join('');
        const html = `<div class="event-log">${entriesHtml}</div>`;
        this.element = this._createElementFromHTML(html);
        return this.element;
    }

    addEntry({ text, type = 'system' }) {
        this.entries.unshift({ text, type });
        if (this.entries.length > this.maxEntries) {
            this.entries.pop();
        }
        this.updateLog();
    }
    
    updateLog() {
        if (!this.element) return;
        const entriesHtml = this.entries.map(entry =>
            `<div class="event-log-entry type-${entry.type}">&gt; ${entry.text}</div>`
        ).join('');
        this.element.innerHTML = entriesHtml;
    }
}