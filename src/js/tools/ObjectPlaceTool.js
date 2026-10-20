import { ToolBase, getObjectLayer } from './ToolBase.js';
import { LevelObject } from '../level/LevelObject.js';

/**
 * ObjectPlaceTool handles placing entity objects (platforms, boxes, mechanisms)
 * with grid snapping and layer lock protection.
 */
export class ObjectPlaceTool extends ToolBase {
    /**
     * @param {Object|string} [options]
     * @param {string} [options.objectType='platform']
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @param {string} [options.layer]
     * @param {number} [options.gid]
     * @param {Object} [options.properties]
     */
    constructor(options = {}) {
        const opts = typeof options === 'string' ? { objectType: options } : options;
        super({ name: opts.objectType || 'place', ...opts });

        this.objectType = opts.objectType || 'platform';
        this.layer = opts.layer || null;
        this.gid = opts.gid !== undefined ? opts.gid : undefined;

        if (this.objectType === 'platform') {
            this.defaultWidth = typeof opts.width === 'number' ? opts.width : 96;
            this.defaultHeight = typeof opts.height === 'number' ? opts.height : 32;
            this.defaultProperties = { group: 1, dX: 0, dY: 0, ...(opts.properties || {}) };
        } else if (this.objectType === 'box') {
            this.defaultWidth = typeof opts.width === 'number' ? opts.width : 64;
            this.defaultHeight = typeof opts.height === 'number' ? opts.height : 64;
            this.defaultProperties = { ...(opts.properties || {}) };
        } else {
            this.defaultWidth = typeof opts.width === 'number' ? opts.width : 64;
            this.defaultHeight = typeof opts.height === 'number' ? opts.height : 64;
            this.defaultProperties = { ...(opts.properties || {}) };
        }
    }

    /**
     * Determine target layer for this object type.
     * @returns {string}
     */
    getTargetLayer() {
        if (this.layer) return this.layer;
        return getObjectLayer({ type: this.objectType, gid: this.gid });
    }

    /**
     * Pointer down: place object at snapped coordinates.
     * @param {Object} event
     */
    onPointerDown(event) {
        const targetLayer = this.getTargetLayer();
        if (this.isLayerLocked(targetLayer)) {
            return;
        }

        const snap = this.getSnapSize();
        const x = snap > 1 ? Math.round(event.worldX / snap) * snap : Math.round(event.worldX);
        const y = snap > 1 ? Math.round(event.worldY / snap) * snap : Math.round(event.worldY);

        const newObj = new LevelObject({
            type: this.objectType,
            x,
            y,
            width: this.defaultWidth,
            height: this.defaultHeight,
            layer: targetLayer,
            gid: this.gid,
            properties: this.defaultProperties ? { ...this.defaultProperties } : {}
        });

        if (this.level && typeof this.level.addObject === 'function') {
            this.level.addObject(newObj);
        }

        this.selectionManager?.select(newObj);

        if (this.renderer) {
            this.renderer.renderLayer(targetLayer);
            this.renderer.renderHighlight([newObj]);
        }
    }

    /**
     * Pointer move.
     * @param {Object} event
     */
    onPointerMove(event) {}

    /**
     * Pointer up.
     * @param {Object} event
     */
    onPointerUp(event) {}
}

export default ObjectPlaceTool;
