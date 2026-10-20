/**
 * Camera handles 2D viewport pan/zoom transformations between
 * screen coordinates and world coordinates.
 */
export class Camera {
    /**
     * @param {Object} [options]
     * @param {number} [options.x=0] - Initial pan offset X (screen space)
     * @param {number} [options.y=0] - Initial pan offset Y (screen space)
     * @param {number} [options.scale=1.0] - Initial zoom scale factor
     * @param {number} [options.minScale=0.25] - Minimum allowable zoom scale (25%)
     * @param {number} [options.maxScale=5.0] - Maximum allowable zoom scale (500%)
     */
    constructor({
        x = 0,
        y = 0,
        scale = 1.0,
        minScale = 0.25,
        maxScale = 5.0
    } = {}) {
        this.x = typeof x === 'number' && !Number.isNaN(x) ? x : 0;
        this.y = typeof y === 'number' && !Number.isNaN(y) ? y : 0;
        this.minScale = typeof minScale === 'number' && minScale > 0 ? minScale : 0.25;
        this.maxScale = typeof maxScale === 'number' && maxScale >= this.minScale ? maxScale : 5.0;

        const initialScale = typeof scale === 'number' && !Number.isNaN(scale) ? scale : 1.0;
        this.scale = Math.min(Math.max(initialScale, this.minScale), this.maxScale);
    }

    /**
     * Pan the viewport by delta (dx, dy) in screen pixels.
     * @param {number} dx
     * @param {number} dy
     */
    pan(dx, dy) {
        if (typeof dx === 'number' && !Number.isNaN(dx)) {
            this.x += dx;
        }
        if (typeof dy === 'number' && !Number.isNaN(dy)) {
            this.y += dy;
        }
    }

    /**
     * Set the zoom scale clamped to [minScale, maxScale], keeping the world
     * point under (centerX, centerY) invariant in screen coordinates.
     *
     * @param {number} scale - Target scale factor
     * @param {number} [centerX=0] - Screen X pivot point for zoom
     * @param {number} [centerY=0] - Screen Y pivot point for zoom
     */
    setZoom(scale, centerX = 0, centerY = 0) {
        if (typeof scale !== 'number' || Number.isNaN(scale)) {
            return;
        }

        const clampedScale = Math.min(Math.max(scale, this.minScale), this.maxScale);
        if (clampedScale === this.scale) {
            return;
        }

        const cx = typeof centerX === 'number' && !Number.isNaN(centerX) ? centerX : 0;
        const cy = typeof centerY === 'number' && !Number.isNaN(centerY) ? centerY : 0;

        // Invariant: screen point (cx, cy) corresponds to world point wx = (cx - x) / oldScale.
        // After zoom, wx must still project to (cx, cy):
        // cx = wx * newScale + newX => newX = cx - wx * newScale
        this.x = cx - ((cx - this.x) / this.scale) * clampedScale;
        this.y = cy - ((cy - this.y) / this.scale) * clampedScale;
        this.scale = clampedScale;
    }

    /**
     * Multiply current zoom scale by a factor, centered around (centerX, centerY).
     * @param {number} factor
     * @param {number} [centerX=0]
     * @param {number} [centerY=0]
     */
    zoomBy(factor, centerX = 0, centerY = 0) {
        if (typeof factor === 'number' && !Number.isNaN(factor) && factor > 0) {
            this.setZoom(this.scale * factor, centerX, centerY);
        }
    }

    /**
     * Convert screen coordinates to world coordinates.
     * @param {number} sx - Screen X
     * @param {number} sy - Screen Y
     * @returns {{ x: number, y: number }} World coordinates
     */
    screenToWorld(sx, sy) {
        return {
            x: (sx - this.x) / this.scale,
            y: (sy - this.y) / this.scale
        };
    }

    /**
     * Convert world coordinates to screen coordinates.
     * @param {number} wx - World X
     * @param {number} wy - World Y
     * @returns {{ x: number, y: number }} Screen coordinates
     */
    worldToScreen(wx, wy) {
        return {
            x: wx * this.scale + this.x,
            y: wy * this.scale + this.y
        };
    }

    /**
     * Reset camera pan and zoom to default.
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [scale=1.0]
     */
    reset(x = 0, y = 0, scale = 1.0) {
        this.x = x;
        this.y = y;
        this.scale = Math.min(Math.max(scale, this.minScale), this.maxScale);
    }
}

export default Camera;
