class ScreenTitle extends BaseComponent {
    render() {
        const text = this.config.text || '';
        const html = `<div class="screen-title">${text.toUpperCase()}</div>`;
        // Create the element and return it
        this.element = this._createElementFromHTML(html);
        return this.element;
    }
}