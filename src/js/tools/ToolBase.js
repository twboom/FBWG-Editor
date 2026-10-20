/**
 * Helper to determine which layer an object belongs to.
 * @param {import('../level/LevelObject.js').LevelObject} obj
 * @returns {string}
 */
export function getObjectLayer(obj) {
    if (!obj) return 'Objects';
    if (obj.layer) return obj.layer;

    const charTypes = [
        'spawnFB',
        'spawnWG',
        'doorFB',
        'doorWG',
        'diamondFB',
        'diamondWG',
        'diamondSilver',
        'diamondDuo'
    ];
    if (
        (typeof obj.gid === 'number' && obj.gid >= 16 && obj.gid <= 23) ||
        charTypes.includes(obj.type)
    ) {
        return 'Chars';
    }

    if (obj.text !== undefined || obj.type === 'text') {
        return 'Tutorial_keyboard';
    }

    return 'Objects';
}

/**
 * Base class for all editor tools.
 */
export class ToolBase {
    /**
     * @param {Object} [options]
     * @param {string} [options.name]
     * @param {import('../level/LevelModel.js').LevelModel} [options.level]
     * @param {import('../renderer/CanvasRenderer.js').CanvasRenderer} [options.renderer]
     * @param {import('../renderer/Camera.js').Camera} [options.camera]
     * @param {import('../core/SelectionManager.js').SelectionManager} [options.selectionManager]
     * @param {import('./ToolManager.js').ToolManager} [options.toolManager]
     * @param {number} [options.snapSize]
     */
    constructor(options = {}) {
        this.name = options.name || '';
        this.level = options.level || null;
        this.renderer = options.renderer || null;
        this.camera = options.camera || null;
        this.selectionManager = options.selectionManager || null;
        this.toolManager = options.toolManager || null;
        this.snapSize = options.snapSize !== undefined ? options.snapSize : undefined;
        this.isActive = false;
    }

    /**
     * Check if a layer is locked in renderer or level.
     * @param {string} layerName
     * @returns {boolean}
     */
    isLayerLocked(layerName) {
        if (!layerName) return false;
        if (this.renderer && typeof this.renderer.isLayerLocked === 'function') {
            if (this.renderer.isLayerLocked(layerName)) return true;
        }
        if (this.level && typeof this.level.isLayerLocked === 'function') {
            if (this.level.isLayerLocked(layerName)) return true;
        }
        return false;
    }

    /**
     * Check if a layer is visible in renderer.
     * @param {string} layerName
     * @returns {boolean}
     */
    isLayerVisible(layerName) {
        if (!layerName) return true;
        if (this.renderer && typeof this.renderer.isLayerVisible === 'function') {
            return this.renderer.isLayerVisible(layerName);
        }
        return true;
    }

    /**
     * Get current effective snap increment in pixels.
     * @returns {number}
     */
    getSnapSize() {
        if (this.toolManager && this.toolManager.snapSize !== undefined) {
            return this.toolManager.snapSize;
        }
        if (this.snapSize !== undefined) {
            return this.snapSize;
        }
        return 32;
    }

    /**
     * Activate the tool.
     */
    activate() {
        this.isActive = true;
    }

    /**
     * Deactivate the tool.
     */
    deactivate() {
        this.isActive = false;
    }

    /**
     * Pointer down event handler.
     * @param {Object} event
     */
    onPointerDown(event) {}

    /**
     * Pointer move event handler.
     * @param {Object} event
     */
    onPointerMove(event) {}

    /**
     * Pointer up event handler.
     * @param {Object} event
     */
    onPointerUp(event) {}

    /**
     * Keyboard event handler.
     * @param {Object} event
     */
    onKeyDown(event) {}
}

export default ToolBase;
