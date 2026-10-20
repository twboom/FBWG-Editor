/**
 * TileMap manages the 2D grid of terrain tiles.
 */
export class TileMap {
    /**
     * @param {number} width
     * @param {number} height
     * @param {Array<number>|Array<Array<number>>|null} [data]
     */
    constructor(width = 0, height = 0, data = null) {
        this.width = Math.max(0, Math.floor(width));
        this.height = Math.max(0, Math.floor(height));
        this.tiles = [];

        if (Array.isArray(data)) {
            if (Array.isArray(data[0])) {
                // 2D array
                this.tiles = Array.from({ length: this.height }, (_, y) =>
                    Array.from({ length: this.width }, (_, x) => (data[y] && data[y][x] !== undefined ? data[y][x] : 0))
                );
            } else {
                // 1D array (e.g. from Tiled JSON layer.data)
                this.tiles = Array.from({ length: this.height }, (_, y) =>
                    Array.from({ length: this.width }, (_, x) => {
                        const idx = y * this.width + x;
                        return data[idx] !== undefined ? data[idx] : 0;
                    })
                );
            }
        } else {
            this.tiles = Array.from({ length: this.height }, () => Array(this.width).fill(0));
        }
    }

    /**
     * Get tile at (x, y). Returns 0 for out-of-bounds queries to prevent rendering crashes.
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return 0;
        }
        const row = this.tiles[y];
        if (!row) {
            return 0;
        }
        return row[x] !== undefined ? row[x] : 0;
    }

    /**
     * Set tile at (x, y). Safe against out-of-bounds coordinates.
     * @param {number} x
     * @param {number} y
     * @param {number} tileId
     * @returns {boolean} Whether setting tile succeeded
     */
    setTile(x, y, tileId) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }
        if (!this.tiles[y]) {
            return false;
        }
        this.tiles[y][x] = tileId;
        return true;
    }

    /**
     * Resize tilemap dimensions, cleanly preserving existing in-bound tiles.
     * @param {number} newWidth
     * @param {number} newHeight
     */
    resize(newWidth, newHeight) {
        const targetWidth = Math.max(0, Math.floor(newWidth));
        const targetHeight = Math.max(0, Math.floor(newHeight));

        const nextTiles = Array.from({ length: targetHeight }, (_, y) =>
            Array.from({ length: targetWidth }, (_, x) => {
                if (x < this.width && y < this.height && this.tiles[y]) {
                    return this.tiles[y][x] !== undefined ? this.tiles[y][x] : 0;
                }
                return 0;
            })
        );

        this.width = targetWidth;
        this.height = targetHeight;
        this.tiles = nextTiles;
    }

    /**
     * Flatten the 2D tile grid to a 1D array conforming to Tiled tilelayer data schema.
     * @returns {Array<number>}
     */
    to1DArray() {
        const flat = [];
        for (let y = 0; y < this.height; y++) {
            const row = this.tiles[y];
            for (let x = 0; x < this.width; x++) {
                flat.push(row && row[x] !== undefined ? row[x] : 0);
            }
        }
        return flat;
    }

    /**
     * Create an independent clone of this TileMap.
     * @returns {TileMap}
     */
    clone() {
        return new TileMap(this.width, this.height, this.to1DArray());
    }
}

export default TileMap;
