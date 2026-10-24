import { getObjectLayer } from '../tools/ToolBase.js';

/**
 * SelectionManager maintains strictly single-object selection state,
 * handles selection notifications, and synchronizes selection highlight
 * with CanvasRenderer's Highlight layer.
 */
export class SelectionManager {
    /**
     * @param {Object} [options]
     * @param {import('../renderer/CanvasRenderer.js').CanvasRenderer} [options.renderer]
     * @param {import('../level/LevelModel.js').LevelModel} [options.level]
     */
    constructor({ renderer, level } = {}) {
        this.renderer = renderer || null;
        this.level = level || null;
        /** @type {import('../level/LevelObject.js').LevelObject|null} */
        this.selectedObject = null;
        /** @type {Set<Function>} */
        this._listeners = new Set();
    }

    /**
     * Set or update the renderer instance.
     * @param {import('../renderer/CanvasRenderer.js').CanvasRenderer|null} renderer
     */
    setRenderer(renderer) {
        this.renderer = renderer;
        this.refreshHighlight();
    }

    /**
     * Select a single LevelObject.
     * @param {import('../level/LevelObject.js').LevelObject|null} obj
     */
    select(obj) {
        if (!obj) {
            return this.deselect();
        }

        if (this.renderer) {
            const layer = getObjectLayer(obj);
            if (
                (typeof this.renderer.isLayerLocked === 'function' && this.renderer.isLayerLocked(layer)) ||
                (typeof this.renderer.isLayerVisible === 'function' && !this.renderer.isLayerVisible(layer))
            ) {
                return;
            }
        }

        this.selectedObject = obj;
        this.refreshHighlight();
        this._notifyListeners(this.selectedObject);
    }

    /**
     * Deselect currently selected object.
     */
    deselect() {
        if (this.selectedObject === null) return;

        this.selectedObject = null;
        this.refreshHighlight();
        this._notifyListeners(null);
    }

    /**
     * Check if a given object is currently selected.
     * @param {import('../level/LevelObject.js').LevelObject|null} obj
     * @returns {boolean}
     */
    isSelected(obj) {
        if (!this.selectedObject || !obj) return false;
        if (this.selectedObject === obj) return true;
        if (
            this.selectedObject.id !== undefined &&
            this.selectedObject.id !== null &&
            obj.id !== undefined &&
            obj.id !== null
        ) {
            return this.selectedObject.id === obj.id;
        }
        return false;
    }

    /**
     * Register a callback for selection changes.
     * @param {function(import('../level/LevelObject.js').LevelObject|null): void} cb
     * @returns {function(): void} Unsubscribe function
     */
    onSelectionChange(cb) {
        if (typeof cb === 'function') {
            this._listeners.add(cb);
        }
        return () => {
            this._listeners.delete(cb);
        };
    }

    /**
     * Re-render highlight on the renderer's Highlight layer.
     */
    refreshHighlight() {
        if (this.renderer && typeof this.renderer.renderHighlight === 'function') {
            this.renderer.renderHighlight(this.selectedObject ? [this.selectedObject] : []);
        }
    }

    /**
     * Notify registered listeners.
     * @private
     * @param {import('../level/LevelObject.js').LevelObject|null} obj
     */
    _notifyListeners(obj) {
        for (const listener of this._listeners) {
            try {
                listener(obj);
            } catch (err) {
                console.error('Error in selection change listener:', err);
            }
        }
    }
}

export default SelectionManager;
