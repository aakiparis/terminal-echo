class ScreenDescription extends BaseComponent {
    render() {
        const text = this.config.text || '';
        const centeredClass = this.config.centered ? 'text-center' : '';
        const html = `<div class="screen-description ${centeredClass}">${text}</div>`;
        this.element = this._createElementFromHTML(html);
        return this.element;
    }

    // New method to update the text content
    update(newText) {
        if (this.element) {
            this.element.textContent = newText;
        }
    }
}