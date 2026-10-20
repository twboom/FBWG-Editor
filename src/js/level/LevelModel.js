import { TileMap } from './TileMap.js';
import { LevelObject } from './LevelObject.js';

/**
 * LevelModel represents the complete level document including dimensions,
 * tile layers, entities, and Tiled metadata.
 */
export class LevelModel {
    /**
     * @param {number} [width=0]
     * @param {number} [height=0]
     * @param {Object} [options]
     */
    constructor(width = 0, height = 0, options = {}) {
        this.width = Math.max(0, Math.floor(width));
        this.height = Math.max(0, Math.floor(height));

        if (options.tileMap instanceof TileMap) {
            this.tileMap = options.tileMap;
        } else {
            this.tileMap = new TileMap(this.width, this.height, options.tiles);
        }

        this.objects = Array.isArray(options.objects)
            ? options.objects.map(o => (o instanceof LevelObject ? o : new LevelObject(o)))
            : [];

        this.nextObjectId = typeof options.nextObjectId === 'number' ? options.nextObjectId : 144;

        for (const obj of this.objects) {
            if (typeof obj.id === 'number' && obj.id >= this.nextObjectId) {
                this.nextObjectId = obj.id + 1;
            }
        }

        this.infinite = options.infinite !== undefined ? options.infinite : false;
        this.orientation = options.orientation || 'orthogonal';
        this.renderorder = options.renderorder || 'right-down';
        this.tiledversion = options.tiledversion || '1.1.6';
        this.tileheight = options.tileheight || 32;
        this.tilewidth = options.tilewidth || 32;
        this.type = options.type || 'map';
        this.version = options.version !== undefined ? options.version : 1;
        this.tilesets = options.tilesets || null;
    }

    /**
     * Resize level grid dimensions.
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        this.width = Math.max(0, Math.floor(width));
        this.height = Math.max(0, Math.floor(height));
        this.tileMap.resize(this.width, this.height);
        const maxPixelX = this.getPixelWidth();
        const maxPixelY = this.getPixelHeight();
        this.objects = this.objects.filter(obj => obj.x < maxPixelX && obj.y < maxPixelY);
    }

    /**
     * Get level width in pixels.
     * @returns {number}
     */
    getPixelWidth() {
        return this.width * (this.tilewidth || 32);
    }

    /**
     * Get level height in pixels.
     * @returns {number}
     */
    getPixelHeight() {
        return this.height * (this.tileheight || 32);
    }

    /**
     * Get tile at grid coordinate (x, y).
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    getTile(x, y) {
        return this.tileMap.getTile(x, y);
    }

    /**
     * Set tile at grid coordinate (x, y).
     * @param {number} x
     * @param {number} y
     * @param {number} tileId
     * @returns {boolean}
     */
    setTile(x, y, tileId) {
        return this.tileMap.setTile(x, y, tileId);
    }

    /**
     * Add a LevelObject to this level.
     * @param {LevelObject|Object} obj
     * @returns {LevelObject} The added object
     */
    addObject(obj) {
        const levelObj = obj instanceof LevelObject ? obj : new LevelObject(obj);
        if (levelObj.id === null || levelObj.id === undefined) {
            levelObj.id = this.nextObjectId++;
        } else if (levelObj.id >= this.nextObjectId) {
            this.nextObjectId = levelObj.id + 1;
        }

        this.objects.push(levelObj);
        return levelObj;
    }

    /**
     * Remove an object by ID or direct object reference.
     * @param {number|LevelObject} target
     * @returns {boolean} Whether an object was removed
     */
    removeObject(target) {
        const index = this.objects.findIndex(o => 
            (typeof target === 'object' && target !== null)
                ? (o === target || (target.id !== undefined && o.id === target.id))
                : (o.id === target)
        );
        if (index !== -1) {
            this.objects.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Find the topmost object containing point (x, y) matching an optional predicate.
     * @param {number} x
     * @param {number} y
     * @param {Function} [filterFn]
     * @returns {LevelObject|null}
     */
    findObjectAt(x, y, filterFn = null) {
        // Iterate backwards so topmost (last added / rendered) is selected first
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const obj = this.objects[i];
            if (obj.containsPoint(x, y)) {
                if (!filterFn || filterFn(obj)) {
                    return obj;
                }
            }
        }
        return null;
    }
}

export default LevelModel;
