/**
 * LevelObject represents an entity within a level (platform, mechanism, character spawn, text, etc.).
 */
export class LevelObject {
    /**
     * @param {Object} options
     * @param {number} [options.id]
     * @param {string} [options.type]
     * @param {string} [options.name]
     * @param {number} [options.x]
     * @param {number} [options.y]
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @param {Object} [options.properties]
     * @param {Object} [options.propertytypes]
     * @param {number} [options.gid]
     * @param {boolean} [options.visible]
     * @param {number} [options.rotation]
     * @param {string} [options.layer]
     * @param {Object} [options.text]
     * @param {Array<{x: number, y: number}>} [options.polyline]
     */
    constructor({
        id,
        type = '',
        name = '',
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        properties = {},
        propertytypes,
        gid,
        visible = true,
        rotation = 0,
        layer,
        text,
        polyline
    } = {}) {
        this.id = id !== undefined ? id : null;
        this.type = type;
        this.name = name;
        this.x = typeof x === 'number' ? x : 0;
        this.y = typeof y === 'number' ? y : 0;
        this.width = typeof width === 'number' ? width : 0;
        this.height = typeof height === 'number' ? height : 0;
        this.properties = properties ? { ...properties } : {};

        // Harmonize dX / dx and dY / dy
        if (this.properties.dX !== undefined && this.properties.dx === undefined) {
            this.properties.dx = this.properties.dX;
        } else if (this.properties.dx !== undefined && this.properties.dX === undefined) {
            this.properties.dX = this.properties.dx;
        }

        if (this.properties.dY !== undefined && this.properties.dy === undefined) {
            this.properties.dy = this.properties.dY;
        } else if (this.properties.dy !== undefined && this.properties.dY === undefined) {
            this.properties.dY = this.properties.dy;
        }

        this.propertytypes = propertytypes ? { ...propertytypes } : undefined;
        this.gid = gid !== undefined ? gid : undefined;
        this.visible = visible !== false;
        this.rotation = typeof rotation === 'number' ? rotation : 0;
        this.layer = layer || undefined;
        this.text = text ? { ...text } : undefined;
        this.polyline = Array.isArray(polyline) ? polyline.map(p => ({ ...p })) : undefined;
    }

    /**
     * Trajectory dX getter
     * @returns {number}
     */
    get dX() {
        return this.properties.dX ?? this.properties.dx ?? 0;
    }

    /**
     * Trajectory dX setter
     * @param {number} val
     */
    set dX(val) {
        this.properties.dX = val;
        this.properties.dx = val;
    }

    /**
     * Trajectory dY getter
     * @returns {number}
     */
    get dY() {
        return this.properties.dY ?? this.properties.dy ?? 0;
    }

    /**
     * Trajectory dY setter
     * @param {number} val
     */
    set dY(val) {
        this.properties.dY = val;
        this.properties.dy = val;
    }

    /**
     * Wiring group getter
     * @returns {number}
     */
    get group() {
        return this.properties.group ?? 0;
    }

    /**
     * Wiring group setter
     * @param {number} val
     */
    set group(val) {
        this.properties.group = val;
    }

    /**
     * Create an independent deep copy of this LevelObject.
     * @returns {LevelObject}
     */
    clone() {
        return new LevelObject({
            id: this.id,
            type: this.type,
            name: this.name,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            properties: JSON.parse(JSON.stringify(this.properties || {})),
            propertytypes: this.propertytypes ? JSON.parse(JSON.stringify(this.propertytypes)) : undefined,
            gid: this.gid,
            visible: this.visible,
            rotation: this.rotation,
            layer: this.layer,
            text: this.text ? JSON.parse(JSON.stringify(this.text)) : undefined,
            polyline: this.polyline ? JSON.parse(JSON.stringify(this.polyline)) : undefined
        });
    }

    /**
     * Test whether this object's bounding area contains the given point (px, py).
     * @param {number} px
     * @param {number} py
     * @returns {boolean}
     */
    containsPoint(px, py) {
        const minX = Math.min(this.x, this.x + this.width);
        const maxX = Math.max(this.x, this.x + this.width);
        if (px < minX || px > maxX) {
            return false;
        }

        if (this.gid) {
            // Tiled tile objects use baseline y [y - height, y], but also support top-left
            const inBaseline = py >= this.y - this.height && py <= this.y;
            const inTopLeft = py >= this.y && py <= this.y + this.height;
            return inBaseline || inTopLeft;
        }

        const minY = Math.min(this.y, this.y + this.height);
        const maxY = Math.max(this.y, this.y + this.height);
        return py >= minY && py <= maxY;
    }
}

export default LevelObject;
