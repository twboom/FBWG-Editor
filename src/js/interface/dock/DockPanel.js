/**
 * DockPanel coordinates the stacked right-hand panels (LayersPanel and PropertiesInspector).
 */
export class DockPanel {
    /**
     * @param {Object} [options]
     * @param {import('./LayersPanel.js').LayersPanel} [options.layersPanel]
     * @param {import('./PropertiesInspector.js').PropertiesInspector} [options.propertiesInspector]
     */
    constructor({ layersPanel, propertiesInspector } = {}) {
        this.layersPanel = layersPanel || null;
        this.propertiesInspector = propertiesInspector || null;
        this.element = null;
    }

    /**
     * Render the dock container and mount child panels.
     * @returns {HTMLElement}
     */
    render() {
        if (this.element) {
            return this.element;
        }

        const dock = document.createElement('div');
        dock.className = 'dock';

        if (this.layersPanel && typeof this.layersPanel.render === 'function') {
            const layersEl = this.layersPanel.render();
            layersEl.style.flex = '1';
            dock.appendChild(layersEl);
        }

        if (this.propertiesInspector && typeof this.propertiesInspector.render === 'function') {
            const propsEl = this.propertiesInspector.render();
            propsEl.style.flex = '1.2';
            dock.appendChild(propsEl);
        }

        this.element = dock;
        return this.element;
    }

    /**
     * Clean up child panels and remove DOM element.
     */
    destroy() {
        this.layersPanel?.destroy?.();
        this.propertiesInspector?.destroy?.();
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}

export default DockPanel;
