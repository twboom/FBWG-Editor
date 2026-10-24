import { ToolBase } from './ToolBase.js';

/**
 * TileBrushTool paints tiles on the Ground layer with layer-lock protection.
 */
export class TileBrushTool extends ToolBase {
    /**
     * @param {Object} [options]
     * @param {number} [options.tileId=1] - Tile ID to paint
     */
    constructor(options = {}) {
        super({ name: 'brush', ...options });

        this.tileId = typeof options.tileId === 'number' ? options.tileId : 1;
        this.isPainting = false;
        this.lastPaintedTileX = null;
        this.lastPaintedTileY = null;
    }

    /**
     * Set active tile ID to paint.
     * @param {number} id
     */
    setTileId(id) {
        if (typeof id === 'number') {
            this.tileId = id;
        }
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
     * Paint tile at specified world coordinates.
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

export default TileBrushTool;
