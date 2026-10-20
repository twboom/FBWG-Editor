/**
 * StatusBar provides the bottom status strip displaying document dimensions,
 * zoom scale, cursor coordinates, and selection status.
 */
export class StatusBar {
    /**
     * @param {Object} [options]
     * @param {import('../renderer/Camera.js').Camera} [options.camera]
     * @param {import('../core/SelectionManager.js').SelectionManager} [options.selectionManager]
     * @param {import('../level/LevelModel.js').LevelModel} [options.level]
     */
    constructor({ camera, selectionManager, level } = {}) {
        this.camera = camera || null;
        this.selectionManager = selectionManager || null;
        this.level = level || null;

        this.cursorX = null;
        this.cursorY = null;

        this.element = null;
        this.docEl = null;
        this.zoomEl = null;
        this.cursorEl = null;
        this.selectionEl = null;

        if (this.selectionManager && typeof this.selectionManager.onSelectionChange === 'function') {
            this._unsubscribeSelection = this.selectionManager.onSelectionChange(() => {
                this.update();
            });
        }
    }

    /**
     * Render the status bar element.
     * @returns {HTMLElement}
     */
    render() {
        if (this.element) {
            return this.element;
        }

        const bar = document.createElement('div');
        bar.className = 'status-bar';

        // Left info group: doc, zoom, cursor
        const leftGroup = document.createElement('div');
        leftGroup.className = 'status-group status-left';

        const docItem = document.createElement('span');
        docItem.className = 'status-item status-doc';
        leftGroup.appendChild(docItem);
        this.docEl = docItem;

        const zoomItem = document.createElement('span');
        zoomItem.className = 'status-item status-zoom';
        leftGroup.appendChild(zoomItem);
        this.zoomEl = zoomItem;

        const cursorItem = document.createElement('span');
        cursorItem.className = 'status-item status-cursor';
        leftGroup.appendChild(cursorItem);
        this.cursorEl = cursorItem;

        bar.appendChild(leftGroup);

        // Right info group: selection
        const rightGroup = document.createElement('div');
        rightGroup.className = 'status-group status-right';

        const selectionItem = document.createElement('span');
        selectionItem.className = 'status-item status-selection';
        rightGroup.appendChild(selectionItem);
        this.selectionEl = selectionItem;

        bar.appendChild(rightGroup);

        this.element = bar;
        this.update();

        return this.element;
    }

    /**
     * Set cursor world or canvas coordinates and update readout.
     * @param {number} x
     * @param {number} y
     */
    setCursor(x, y) {
        if (typeof x === 'number' && !Number.isNaN(x) && typeof y === 'number' && !Number.isNaN(y)) {
            this.cursorX = Math.round(x);
            this.cursorY = Math.round(y);
        } else {
            this.cursorX = null;
            this.cursorY = null;
        }

        this._updateCursorReadout();
    }

    /**
     * Set level model reference and update.
     * @param {import('../level/LevelModel.js').LevelModel|null} level
     */
    setLevel(level) {
        this.level = level;
        this.update();
    }

    /**
     * Set camera reference and update.
     * @param {import('../renderer/Camera.js').Camera|null} camera
     */
    setCamera(camera) {
        this.camera = camera;
        this.update();
    }

    /**
     * Set selection manager reference and update.
     * @param {import('../core/SelectionManager.js').SelectionManager|null} sm
     */
    setSelectionManager(sm) {
        if (typeof this._unsubscribeSelection === 'function') {
            this._unsubscribeSelection();
            this._unsubscribeSelection = null;
        }
        this.selectionManager = sm;
        if (this.selectionManager && typeof this.selectionManager.onSelectionChange === 'function') {
            this._unsubscribeSelection = this.selectionManager.onSelectionChange(() => {
                this.update();
            });
        }
        this.update();
    }

    /**
     * Update all status bar readouts.
     */
    update() {
        if (!this.element) return;

        if (this.docEl) {
            this.docEl.textContent = `Doc: ${this.getDocDimensions()}`;
        }
        if (this.zoomEl) {
            this.zoomEl.textContent = `Zoom: ${this.getZoomPercentage()}`;
        }
        this._updateCursorReadout();

        if (this.selectionEl) {
            this.selectionEl.textContent = `Selected: ${this.getSelectionLabel()}`;
        }
    }

    /**
     * @private
     */
    _updateCursorReadout() {
        if (this.cursorEl) {
            this.cursorEl.textContent = `Cursor: ${this.getCursorReadout()}`;
        }
    }

    /**
     * Formats document dimensions (e.g. "640 × 480 px").
     * @returns {string}
     */
    getDocDimensions() {
        if (!this.level) {
            return '0 × 0 px';
        }

        if (typeof this.level.getPixelWidth === 'function' && typeof this.level.getPixelHeight === 'function') {
            return `${this.level.getPixelWidth()} × ${this.level.getPixelHeight()} px`;
        }

        const tileW = this.level.tilewidth || (this.level.width > 100 ? 1 : 32);
        const tileH = this.level.tileheight || (this.level.height > 100 ? 1 : 32);

        const w = (this.level.width || 0) * tileW;
        const h = (this.level.height || 0) * tileH;

        return `${w} × ${h} px`;
    }

    /**
     * Formats zoom percentage (e.g. "100%").
     * @returns {string}
     */
    getZoomPercentage() {
        if (!this.camera || typeof this.camera.scale !== 'number') {
            return '100%';
        }
        return `${Math.round(this.camera.scale * 100)}%`;
    }

    /**
     * Formats cursor coordinates (e.g. "X: 240, Y: 120").
     * @returns {string}
     */
    getCursorReadout() {
        if (this.cursorX === null || this.cursorY === null) {
            return 'X: --, Y: --';
        }
        return `X: ${this.cursorX}, Y: ${this.cursorY}`;
    }

    /**
     * Formats selection label.
     * @returns {string}
     */
    getSelectionLabel() {
        const obj = this.selectionManager?.selectedObject;
        if (!obj) {
            return 'None';
        }

        let type = obj.type || 'Object';
        type = type.charAt(0).toUpperCase() + type.slice(1);

        const idStr = obj.id !== null && obj.id !== undefined ? `#${obj.id}` : '';
        const groupStr = obj.properties?.group !== undefined ? ` (Group ${obj.properties.group})` : '';

        return `${type} ${idStr}${groupStr}`.trim();
    }

    /**
     * Display a transient status message in the right group for a period of time.
     * @param {string} text
     * @param {number} [duration=3000]
     */
    showMessage(text, duration = 3000) {
        if (!this.selectionEl) return;
        const previousText = this.getSelectionLabel();
        this.selectionEl.textContent = text;
        if (this._messageTimer) {
            clearTimeout(this._messageTimer);
        }
        this._messageTimer = setTimeout(() => {
            this._messageTimer = null;
            if (this.selectionEl) {
                this.selectionEl.textContent = this.getSelectionLabel();
            }
        }, duration);
    }

    /**
     * Clean up listeners.
     */
    destroy() {
        if (this._messageTimer) {
            clearTimeout(this._messageTimer);
            this._messageTimer = null;
        }
        if (typeof this._unsubscribeSelection === 'function') {
            this._unsubscribeSelection();
        }
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}

export default StatusBar;
