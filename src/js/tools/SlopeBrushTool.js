import { ToolBase } from './ToolBase.js';

export const SLOPE_TYPES = [
    { id: 2, name: 'Top-Right (◢)', key: 'top-right' },
    { id: 3, name: 'Top-Left (◣)', key: 'top-left' },
    { id: 4, name: 'Bottom-Right (◥)', key: 'bottom-right' },
    { id: 5, name: 'Bottom-Left (◤)', key: 'bottom-left' }
];

/**
 * SlopeBrushTool paints directional slope tiles onto the Ground layer.
 */
export class SlopeBrushTool extends ToolBase {
    /**
     * @param {Object} [options]
     * @param {number} [options.tileId=2]
     */
    constructor(options = {}) {
        super({ name: 'slope', ...options });

        this.tileId = typeof options.tileId === 'number' ? options.tileId : 2;
        this.isPainting = false;
        this.lastPaintedTileX = null;
        this.lastPaintedTileY = null;
    }

    /**
     * Set active slope tile ID (2, 3, 4, 5).
     * @param {number} id
     */
    setTileId(id) {
        this.tileId = typeof id === 'number' ? id : 2;
    }

    /**
     * Pointer down: begin painting stroke.
     * @param {Object} event
     */
    onPointerDown(event) {
        if (this.isLayerLocked('Ground')) {
            return;
        }

        this.isPainting = true;
        this._paint(event.worldX, event.worldY);
    }

    /**
     * Pointer move: continue painting along drag path.
     * @param {Object} event
     */
    onPointerMove(event) {
        if (!this.isPainting) return;

        if (this.isLayerLocked('Ground')) {
            this.isPainting = false;
            return;
        }

        this._paint(event.worldX, event.worldY);
    }

    /**
     * Pointer up: end painting stroke.
     * @param {Object} event
     */
    onPointerUp(event) {
        this.isPainting = false;
        this.lastPaintedTileX = null;
        this.lastPaintedTileY = null;
    }

    /**
     * Paint slope tile at specified world coordinates.
     * @private
     * @param {number} worldX
     * @param {number} worldY
     */
    _paint(worldX, worldY) {
        if (!this.level || !this.level.tileMap) return;

        const tileSize = this.level.tilewidth || 32;
        const tileX = Math.floor(worldX / tileSize);
        const tileY = Math.floor(worldY / tileSize);

        if (
            tileX < 0 ||
            tileX >= this.level.width ||
            tileY < 0 ||
            tileY >= this.level.height
        ) {
            return;
        }

        if (this.lastPaintedTileX === tileX && this.lastPaintedTileY === tileY) {
            return;
        }

        this.level.setTile(tileX, tileY, this.tileId);
        this.lastPaintedTileX = tileX;
        this.lastPaintedTileY = tileY;

        if (this.renderer) {
            this.renderer.renderLayer('Ground');
        }
    }

    /**
     * Deactivate tool.
     */
    deactivate() {
        super.deactivate();
        this.isPainting = false;
        this.lastPaintedTileX = null;
        this.lastPaintedTileY = null;
    }
}

export default SlopeBrushTool;
