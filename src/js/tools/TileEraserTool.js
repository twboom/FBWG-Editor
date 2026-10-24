import { ToolBase } from './ToolBase.js';

/**
 * TileEraserTool erases tiles on the Ground layer by resetting them to air (0).
 */
export class TileEraserTool extends ToolBase {
    /**
     * @param {Object} [options]
     */
    constructor(options = {}) {
        super({ name: 'eraser', ...options });

        this.isErasing = false;
        this.lastErasedTileX = null;
        this.lastErasedTileY = null;
    }

    /**
     * Pointer down: begin erasing stroke.
     * @param {Object} event
     */
    onPointerDown(event) {
        if (this.isLayerLocked('Ground')) {
            return;
        }

        this.isErasing = true;
        this._erase(event.worldX, event.worldY);
    }

    /**
     * Pointer move: continue erasing along stroke.
     * @param {Object} event
     */
    onPointerMove(event) {
        if (!this.isErasing) return;

        if (this.isLayerLocked('Ground')) {
            this.isErasing = false;
            return;
        }

        this._erase(event.worldX, event.worldY);
    }

    /**
     * Pointer up: end erasing stroke.
     * @param {Object} event
     */
    onPointerUp(event) {
        this.isErasing = false;
        this.lastErasedTileX = null;
        this.lastErasedTileY = null;
    }

    /**
     * Erase tile at specified world coordinates.
     * @private
     * @param {number} worldX
     * @param {number} worldY
     */
    _erase(worldX, worldY) {
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

        if (this.lastErasedTileX === tileX && this.lastErasedTileY === tileY) {
            return;
        }

        this.level.setTile(tileX, tileY, 0);
        this.lastErasedTileX = tileX;
        this.lastErasedTileY = tileY;

        if (this.renderer) {
            this.renderer.renderLayer('Ground');
        }
    }

    /**
     * Deactivate tool.
     */
    deactivate() {
        super.deactivate();
        this.isErasing = false;
        this.lastErasedTileX = null;
        this.lastErasedTileY = null;
    }
}

export default TileEraserTool;
