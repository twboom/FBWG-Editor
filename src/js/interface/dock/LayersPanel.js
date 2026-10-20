import { getObjectLayer } from '../../tools/ToolBase.js';

/**
 * Fixed 4-Layer Schema for the Fireboy & Watergirl game engine.
 * Fixed to Ground (tilelayer), Chars (objectgroup), Objects (objectgroup),
 * and Tutorial_keyboard (objectgroup). No arbitrary layer creation/deletion.
 */
export const FIXED_LAYERS = [
    { id: 'Tutorial_keyboard', name: 'Tutorial_keyboard', title: 'Text & Triggers', type: 'objectgroup' },
    { id: 'Objects', name: 'Objects', title: 'Objects (Platforms/Boxes)', type: 'objectgroup' },
    { id: 'Chars', name: 'Chars', title: 'Characters & Spawns', type: 'objectgroup' },
    { id: 'Ground', name: 'Ground', title: 'Tiles (Geometry & Fluids)', type: 'tilelayer' }
];

/**
 * LayersPanel renders the visual list of the fixed 4 game layers
 * with eye (visibility) and lock controls.
 */
export class LayersPanel {
    /**
     * @param {Object} [options]
     * @param {import('../../renderer/CanvasRenderer.js').CanvasRenderer} [options.renderer]
     * @param {import('../../level/LevelModel.js').LevelModel} [options.level]
     * @param {import('../../core/SelectionManager.js').SelectionManager} [options.selectionManager]
     */
    constructor({ renderer, level, selectionManager } = {}) {
        this.renderer = renderer || null;
        this.level = level || null;
        this.selectionManager = selectionManager || null;
        this.activeLayer = 'Objects';

        /** @type {Map<string, boolean>} */
        this._visibilityState = new Map(FIXED_LAYERS.map(l => [l.id, true]));
        /** @type {Map<string, boolean>} */
        this._lockState = new Map(FIXED_LAYERS.map(l => [l.id, false]));

        this.element = null;
        this.rowElements = new Map();
    }

    /**
     * Set level model and refresh panel.
     * @param {import('../../level/LevelModel.js').LevelModel|null} level
     */
    setLevel(level) {
        this.level = level;
        this.update();
    }

    /**
     * Check if a layer is visible.
     * @param {string} name
     * @returns {boolean}
     */
    isLayerVisible(name) {
        if (this.renderer && typeof this.renderer.isLayerVisible === 'function') {
            return this.renderer.isLayerVisible(name);
        }
        return this._visibilityState.get(name) ?? true;
    }

    /**
     * Toggle visibility of a layer.
     * @param {string} name
     * @returns {boolean} New visibility state
     */
    toggleVisibility(name) {
        const current = this.isLayerVisible(name);
        const next = !current;

        if (this.renderer && typeof this.renderer.setLayerVisibility === 'function') {
            this.renderer.setLayerVisibility(name, next);
        }
        this._visibilityState.set(name, next);

        if (!next && this.selectionManager?.selectedObject) {
            const layer = getObjectLayer(this.selectionManager.selectedObject);
            if (layer === name) {
                this.selectionManager.deselect();
            }
        }

        this.updateRow(name);
        return next;
    }

    /**
     * Check if a layer is locked.
     * @param {string} name
     * @returns {boolean}
     */
    isLayerLocked(name) {
        if (this.renderer && typeof this.renderer.isLayerLocked === 'function') {
            return this.renderer.isLayerLocked(name);
        }
        return this._lockState.get(name) ?? false;
    }

    /**
     * Toggle lock of a layer.
     * @param {string} name
     * @returns {boolean} New locked state
     */
    toggleLock(name) {
        const current = this.isLayerLocked(name);
        const next = !current;

        if (this.renderer && typeof this.renderer.setLayerLocked === 'function') {
            this.renderer.setLayerLocked(name, next);
        }
        this._lockState.set(name, next);

        if (next && this.selectionManager?.selectedObject) {
            const layer = getObjectLayer(this.selectionManager.selectedObject);
            if (layer === name) {
                this.selectionManager.deselect();
            }
        }

        this.updateRow(name);
        return next;
    }

    /**
     * Set the currently active layer row.
     * @param {string} name
     */
    setActiveLayer(name) {
        this.activeLayer = name;
        this.updateActiveRow();
    }

    /**
     * Calculate badge label for layer.
     * @param {typeof FIXED_LAYERS[number]} layerDef
     * @returns {string}
     */
    getLayerBadge(layerDef) {
        if (layerDef.type === 'tilelayer') {
            return 'Tilemap';
        }
        if (this.level && Array.isArray(this.level.objects)) {
            const count = this.level.objects.filter(o => {
                if (o.layer) {
                    return o.layer === layerDef.id;
                }
                // Fallback default layer mapping if layer not tagged
                if (layerDef.id === 'Chars') {
                    return o.type?.startsWith('spawn_') || o.type?.startsWith('door_');
                }
                if (layerDef.id === 'Tutorial_keyboard') {
                    return o.type === 'text' || o.text;
                }
                return true;
            }).length;
            return String(count);
        }
        return '';
    }

    /**
     * Render the layers panel element.
     * @returns {HTMLElement}
     */
    render() {
        if (this.element) {
            return this.element;
        }

        const panel = document.createElement('div');
        panel.className = 'dock-panel layers-panel';

        // Header
        const header = document.createElement('div');
        header.className = 'dock-header';
        const titleSpan = document.createElement('span');
        titleSpan.textContent = 'Layers';
        header.appendChild(titleSpan);
        panel.appendChild(header);

        // Body
        const body = document.createElement('div');
        body.className = 'dock-body';

        const list = document.createElement('div');
        list.className = 'layer-list';

        this.rowElements.clear();

        for (const layerDef of FIXED_LAYERS) {
            const row = document.createElement('div');
            row.className = 'layer-row';
            row.dataset.layer = layerDef.id;
            if (this.activeLayer === layerDef.id) {
                row.classList.add('active');
            }

            // Eye icon (visibility)
            const eyeIcon = document.createElement('span');
            eyeIcon.className = 'layer-icon layer-eye';
            eyeIcon.dataset.action = 'toggle-visibility';
            eyeIcon.title = 'Toggle Visibility';
            eyeIcon.textContent = '👁';
            if (this.isLayerVisible(layerDef.id)) {
                eyeIcon.classList.add('visible');
            }
            eyeIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleVisibility(layerDef.id);
            });
            row.appendChild(eyeIcon);

            // Lock icon (lock)
            const lockIcon = document.createElement('span');
            lockIcon.className = 'layer-icon layer-lock';
            lockIcon.dataset.action = 'toggle-lock';
            lockIcon.title = 'Toggle Lock';
            const isLocked = this.isLayerLocked(layerDef.id);
            lockIcon.textContent = isLocked ? '🔒' : '🔓';
            if (isLocked) {
                lockIcon.classList.add('locked');
            }
            lockIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLock(layerDef.id);
            });
            row.appendChild(lockIcon);

            // Title
            const title = document.createElement('span');
            title.className = 'layer-title';
            title.textContent = layerDef.title;
            row.appendChild(title);

            // Badge
            const badge = document.createElement('span');
            badge.className = 'layer-badge';
            badge.textContent = this.getLayerBadge(layerDef);
            row.appendChild(badge);

            // Row click selects active layer
            row.addEventListener('click', () => {
                this.setActiveLayer(layerDef.id);
            });

            this.rowElements.set(layerDef.id, { row, eyeIcon, lockIcon, badge });
            list.appendChild(row);
        }

        body.appendChild(list);
        panel.appendChild(body);
        this.element = panel;

        return this.element;
    }

    /**
     * Update UI representation of a single layer row.
     * @param {string} name
     */
    updateRow(name) {
        const rowData = this.rowElements.get(name);
        if (!rowData) return;

        const visible = this.isLayerVisible(name);
        if (visible) {
            rowData.eyeIcon.classList.add('visible');
            rowData.eyeIcon.style.opacity = '1';
        } else {
            rowData.eyeIcon.classList.remove('visible');
            rowData.eyeIcon.style.opacity = '0.35';
        }

        const locked = this.isLayerLocked(name);
        rowData.lockIcon.textContent = locked ? '🔒' : '🔓';
        if (locked) {
            rowData.lockIcon.classList.add('locked');
        } else {
            rowData.lockIcon.classList.remove('locked');
        }
    }

    /**
     * Update active row class on layer rows.
     */
    updateActiveRow() {
        for (const [id, rowData] of this.rowElements.entries()) {
            if (id === this.activeLayer) {
                rowData.row.classList.add('active');
            } else {
                rowData.row.classList.remove('active');
            }
        }
    }

    /**
     * Update all rows and badges.
     */
    update() {
        for (const layerDef of FIXED_LAYERS) {
            this.updateRow(layerDef.id);
            const rowData = this.rowElements.get(layerDef.id);
            if (rowData) {
                rowData.badge.textContent = this.getLayerBadge(layerDef);
            }
        }
        this.updateActiveRow();
    }

    /**
     * Clean up event listeners and DOM element.
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
        this.rowElements.clear();
    }
}

export default LayersPanel;
