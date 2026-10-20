import { Camera } from './Camera.js';
import { drawObject } from './renderObjects.js';

export const LAYER_NAMES = [
    'Ground',
    'Chars',
    'Objects',
    'Tutorial_keyboard',
    'Highlight'
];

export const GROUP_COLORS = [
    '#FF0000', // 1: red
    '#008000', // 2: green
    '#0000FF', // 3: blue
    '#FFFF00', // 4: yellow
    '#FF00FF', // 5: magenta
    '#005A9C', // 6: cyan/blue
    '#8F00FF', // 7: violet
    '#FFFFFF'  // 8: white
];

export const TILE_SIZE = 32;

/**
 * CanvasRenderer manages the multi-layer HTML5 canvas stack,
 * viewport rendering, layer visibility/locking, and camera synchronization.
 */
export class CanvasRenderer {
    /**
     * @param {Object} options
     * @param {HTMLElement} [options.container] - DOM element containing canvas elements
     * @param {import('../level/LevelModel.js').LevelModel} [options.level] - Level data model
     * @param {Camera} [options.camera] - Viewport camera
     * @param {number} [options.width=800] - Initial canvas width
     * @param {number} [options.height=600] - Initial canvas height
     * @param {boolean} [options.pinContent=false] - If true, pins canvas content to (0, 0) and does not translate content
     */
    constructor({ container, level, camera, width = 800, height = 600, pinContent = false } = {}) {
        this.container = container || null;
        this.level = level || null;
        this.camera = camera || new Camera();
        this.pinContent = Boolean(pinContent);

        this.width = width;
        this.height = height;

        /** @type {Map<string, { name: string, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, visible: boolean, locked: boolean }>} */
        this.layers = new Map();

        this._initCanvases();
    }

    /**
     * Initialize and mount the layered canvas elements.
     * @private
     */
    _initCanvases() {
        if (this.container) {
            if (!this.container.style.position || this.container.style.position === 'static') {
                this.container.style.position = 'relative';
            }
        }

        for (const name of LAYER_NAMES) {
            const canvas = document.createElement('canvas');
            canvas.dataset.layer = name;
            canvas.width = this.width;
            canvas.height = this.height;
            canvas.style.position = 'absolute';
            canvas.style.top = '0px';
            canvas.style.left = '0px';
            canvas.style.width = '100%';
            canvas.style.height = '100%';

            if (name === 'Highlight') {
                canvas.style.pointerEvents = 'none';
            }

            const ctx = canvas.getContext('2d');

            if (this.container) {
                this.container.appendChild(canvas);
            }

            this.layers.set(name, {
                name,
                canvas,
                ctx,
                visible: true,
                locked: false
            });
        }
    }

    /**
     * Get canvas element for a specific layer.
     * @param {string} layerName
     * @returns {HTMLCanvasElement|null}
     */
    getCanvas(layerName) {
        return this.layers.get(layerName)?.canvas || null;
    }

    /**
     * Get 2D rendering context for a specific layer.
     * @param {string} layerName
     * @returns {CanvasRenderingContext2D|null}
     */
    getContext(layerName) {
        return this.layers.get(layerName)?.ctx || null;
    }

    /**
     * Set layer visibility.
     * @param {string} layerName
     * @param {boolean} visible
     */
    setLayerVisibility(layerName, visible) {
        const layer = this.layers.get(layerName);
        if (!layer) return;

        layer.visible = Boolean(visible);
        layer.canvas.style.display = layer.visible ? 'block' : 'none';

        if (!layer.visible && layer.ctx) {
            layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
        } else if (layer.visible) {
            this.renderLayer(layerName);
        }
    }

    /**
     * Get layer visibility.
     * @param {string} layerName
     * @returns {boolean}
     */
    isLayerVisible(layerName) {
        return this.layers.get(layerName)?.visible ?? false;
    }

    /**
     * Set layer locked state.
     * @param {string} layerName
     * @param {boolean} locked
     */
    setLayerLocked(layerName, locked) {
        const layer = this.layers.get(layerName);
        if (layer) {
            layer.locked = Boolean(locked);
        }
    }

    /**
     * Get layer locked state.
     * @param {string} layerName
     * @returns {boolean}
     */
    isLayerLocked(layerName) {
        return this.layers.get(layerName)?.locked ?? false;
    }

    /**
     * Resize all canvases to match new dimensions.
     * @param {number} [width]
     * @param {number} [height]
     */
    resize(width, height) {
        if (typeof width === 'number' && typeof height === 'number') {
            this.width = width;
            this.height = height;
        } else if (this.container) {
            this.width = this.container.clientWidth || this.width;
            this.height = this.container.clientHeight || this.height;
        }

        for (const layer of this.layers.values()) {
            layer.canvas.width = this.width;
            layer.canvas.height = this.height;
        }

        this.render();
    }

    /**
     * Render all visible layers.
     */
    render() {
        for (const layerName of LAYER_NAMES) {
            if (layerName !== 'Highlight') {
                this.renderLayer(layerName);
            }
        }
    }

    /**
     * Render a single layer.
     * @param {string} layerName
     */
    renderLayer(layerName) {
        const layer = this.layers.get(layerName);
        if (!layer || !layer.ctx) return;

        const ctx = layer.ctx;
        ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);

        if (!layer.visible) return;

        ctx.save();
        if (this.pinContent) {
            ctx.translate(0, 0);
        } else {
            ctx.translate(this.camera.x, this.camera.y);
        }
        ctx.scale(this.camera.scale, this.camera.scale);

        switch (layerName) {
            case 'Ground':
                this._renderGroundLayer(ctx);
                break;
            case 'Chars':
                this._renderCharsLayer(ctx);
                break;
            case 'Objects':
                this._renderObjectsLayer(ctx);
                break;
            case 'Tutorial_keyboard':
                this._renderTutorialLayer(ctx);
                break;
            default:
                break;
        }

        ctx.restore();
    }

    /**
     * Render Ground tilemap layer.
     * @private
     * @param {CanvasRenderingContext2D} ctx
     */
    _renderGroundLayer(ctx) {
        if (!this.level || !this.level.tileMap) return;

        const { width, height } = this.level;
        const tileMap = this.level.tileMap;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tile = tileMap.getTile(x, y);
                if (tile === 0) continue; // air

                const px = x * TILE_SIZE;
                const py = y * TILE_SIZE;

                this._drawTile(ctx, px, py, tile);
            }
        }
    }

    /**
     * Draw individual tile based on its Tiled ID.
     * @private
     */
    _drawTile(ctx, px, py, tileId) {
        ctx.save();

        switch (tileId) {
            case 1: // Solid block
                ctx.beginPath();
                ctx.rect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = '#333333';
                ctx.lineWidth = 1;
                ctx.stroke();
                break;

            case 2: // Top slope facing right
                ctx.beginPath();
                ctx.moveTo(px, py + TILE_SIZE);
                ctx.lineTo(px + TILE_SIZE, py + TILE_SIZE);
                ctx.lineTo(px + TILE_SIZE, py);
                ctx.closePath();
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = '#333333';
                ctx.stroke();
                break;

            case 3: // Top slope facing left
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px, py + TILE_SIZE);
                ctx.lineTo(px + TILE_SIZE, py + TILE_SIZE);
                ctx.closePath();
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = '#333333';
                ctx.stroke();
                break;

            case 4: // Bottom slope facing right
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px + TILE_SIZE, py);
                ctx.lineTo(px + TILE_SIZE, py + TILE_SIZE);
                ctx.closePath();
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = '#333333';
                ctx.stroke();
                break;

            case 5: // Bottom slope facing left
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px + TILE_SIZE, py);
                ctx.lineTo(px, py + TILE_SIZE);
                ctx.closePath();
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = '#333333';
                ctx.stroke();
                break;

            case 6: // Water
                ctx.beginPath();
                ctx.rect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = 'blue';
                ctx.fill();
                break;

            case 7: // Lava / Fire
                ctx.beginPath();
                ctx.rect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = 'red';
                ctx.fill();
                break;

            case 8: // Acid
                ctx.beginPath();
                ctx.rect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = 'green';
                ctx.fill();
                break;

            case 15: // Ice
                ctx.beginPath();
                ctx.rect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#AAAAFF';
                ctx.fill();
                break;

            default:
                ctx.beginPath();
                ctx.rect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#555555';
                ctx.fill();
                break;
        }

        ctx.restore();
    }

    /**
     * Render Chars layer (spawn points, doors, diamonds).
     * @private
     * @param {CanvasRenderingContext2D} ctx
     */
    _renderCharsLayer(ctx) {
        if (!this.level || !Array.isArray(this.level.objects)) return;

        const charTypes = ['spawnFB', 'spawnWG', 'doorFB', 'doorWG', 'diamondFB', 'diamondWG', 'diamondSilver', 'diamondDuo'];

        for (const obj of this.level.objects) {
            const isChar = obj.layer === 'Chars' ||
                (typeof obj.gid === 'number' && obj.gid >= 16 && obj.gid <= 23) ||
                charTypes.includes(obj.type);

            if (!isChar || obj.visible === false) continue;

            const drawY = obj.gid ? obj.y - (obj.height || 64) : obj.y;

            if (obj.gid) {
                switch (obj.gid) {
                    case 16: drawObject(ctx, 'spawn_fb', '', obj.x, drawY); break;
                    case 17: drawObject(ctx, 'spawn_wg', '', obj.x, drawY); break;
                    case 18: drawObject(ctx, 'door_fb', '', obj.x, drawY); break;
                    case 19: drawObject(ctx, 'door_wg', '', obj.x, drawY); break;
                    case 20: drawObject(ctx, 'diamond', 'fb', obj.x, drawY); break;
                    case 21: drawObject(ctx, 'diamond', 'wg', obj.x, drawY); break;
                    case 22: drawObject(ctx, 'diamond', 'silver', obj.x, drawY); break;
                    case 23: drawObject(ctx, 'diamond', 'fbwg', obj.x, drawY); break;
                    default:
                        drawObject(ctx, obj.type, obj.properties?.variant || '', obj.x, drawY);
                        break;
                }
            } else {
                drawObject(ctx, obj.type, obj.properties?.variant || '', obj.x, drawY, { rotation: obj.rotation });
            }
        }
    }

    /**
     * Render Objects layer (platforms, buttons, levers, boxes).
     * @private
     * @param {CanvasRenderingContext2D} ctx
     */
    _renderObjectsLayer(ctx) {
        if (!this.level || !Array.isArray(this.level.objects)) return;

        for (const obj of this.level.objects) {
            const isChars = obj.layer === 'Chars' || (typeof obj.gid === 'number' && obj.gid >= 16 && obj.gid <= 23);
            const isTutorial = obj.layer === 'Tutorial_keyboard' || obj.text !== undefined;

            if (isChars || isTutorial || obj.visible === false) continue;

            if (obj.type === 'platform' || (!obj.gid && obj.width > 0 && obj.height > 0)) {
                this._drawPlatform(ctx, obj);
            } else if (obj.gid === 24 || obj.type === 'button') {
                const drawY = obj.gid ? obj.y - (obj.height || 64) : obj.y;
                drawObject(ctx, 'button', obj.group || 1, obj.x, drawY);
            } else if (obj.gid === 25 || obj.type === 'leverLeft') {
                const drawY = obj.gid ? obj.y - (obj.height || 64) : obj.y;
                drawObject(ctx, 'lever_left', obj.group || 1, obj.x, drawY, { rotation: obj.rotation });
            } else if (obj.gid === 26 || obj.type === 'leverRight') {
                const drawY = obj.gid ? obj.y - (obj.height || 64) : obj.y;
                drawObject(ctx, 'lever_right', obj.group || 1, obj.x, drawY, { rotation: obj.rotation });
            } else if (obj.gid === 28 || obj.type === 'box') {
                const drawY = obj.gid ? obj.y - (obj.height || 64) : obj.y;
                drawObject(ctx, 'box', obj.properties?.variant || 'normal', obj.x, drawY);
            } else if (obj.gid === 37 || obj.type === 'heavyBox') {
                const drawY = obj.gid ? obj.y - (obj.height || 64) : obj.y;
                drawObject(ctx, 'box', 'heavy', obj.x, drawY);
            } else if (obj.gid === 36 || obj.type === 'mirrorBox') {
                const drawY = obj.gid ? obj.y - (obj.height || 64) : obj.y;
                drawObject(ctx, 'box', 'mirror', obj.x, drawY);
            } else {
                const drawY = obj.gid ? obj.y - (obj.height || 64) : obj.y;
                drawObject(ctx, obj.type, obj.properties?.variant || '', obj.x, drawY, { rotation: obj.rotation });
            }
        }
    }

    /**
     * Draw platform entity with wiring group color and trajectory preview.
     * @private
     */
    _drawPlatform(ctx, obj) {
        ctx.save();

        const group = obj.group || 0;
        const color = group > 0 && group <= GROUP_COLORS.length
            ? GROUP_COLORS[group - 1]
            : (group > 8 ? '#FFFF00' : '#FFFFFF');

        // Main platform body
        ctx.beginPath();
        ctx.rect(obj.x, obj.y, obj.width, obj.height);
        ctx.fillStyle = color;
        ctx.fill();

        // Inner edge border
        ctx.beginPath();
        ctx.rect(obj.x + 4, obj.y + 4, Math.max(0, obj.width - 8), Math.max(0, obj.height - 8));
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Trajectory preview
        const dx = obj.dX;
        const dy = obj.dY;
        if (dx !== 0 || dy !== 0) {
            const previewX = obj.x + -dx * TILE_SIZE;
            const previewY = obj.y + -dy * TILE_SIZE;

            // Dashed connection line
            ctx.beginPath();
            ctx.setLineDash([5, 10]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#666666';
            ctx.moveTo(obj.x + obj.width / 2, obj.y + obj.height / 2);
            ctx.lineTo(previewX + obj.width / 2, previewY + obj.height / 2);
            ctx.stroke();

            // Destination ghost box
            ctx.beginPath();
            ctx.rect(previewX, previewY, obj.width, obj.height);
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.35;
            ctx.fill();
            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = 'gray';
            ctx.stroke();
            ctx.setLineDash([]);
        }

        ctx.restore();
    }

    /**
     * Render Tutorial_keyboard text layer.
     * @private
     * @param {CanvasRenderingContext2D} ctx
     */
    _renderTutorialLayer(ctx) {
        if (!this.level || !Array.isArray(this.level.objects)) return;

        for (const obj of this.level.objects) {
            const isTutorial = obj.layer === 'Tutorial_keyboard' || obj.text !== undefined || obj.type === 'text';
            if (!isTutorial || obj.visible === false) continue;

            if (obj.text && obj.text.text) {
                ctx.save();
                const fontBold = obj.text.bold ? 'bold ' : '';
                const fontSize = obj.text.pixelsize || 24;
                const fontFamily = obj.text.fontfamily || 'sans-serif';
                ctx.font = `${fontBold}${fontSize}px ${fontFamily}`;
                ctx.fillStyle = 'yellow';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;

                const textY = obj.y + (obj.height || fontSize);
                ctx.fillText(obj.text.text, obj.x, textY);
                ctx.strokeText(obj.text.text, obj.x, textY);
                ctx.restore();
            } else if (obj.width > 0 && obj.height > 0) {
                // Tutorial trigger boundary
                ctx.save();
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = '#FFA726';
                ctx.lineWidth = 1;
                ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);

                ctx.fillStyle = 'rgba(255, 167, 38, 0.15)';
                ctx.fillRect(obj.x, obj.y, obj.width, obj.height);

                ctx.setLineDash([]);
                ctx.font = '11px sans-serif';
                ctx.fillStyle = '#FFA726';
                const triggerId = obj.properties?.id ?? 0;
                ctx.fillText(`Trigger #${triggerId}`, obj.x + 4, obj.y + 14);
                ctx.restore();
            }
        }
    }

    /**
     * Render selection highlight overlay on Highlight canvas.
     * @param {Array<import('../level/LevelObject.js').LevelObject>} objects
     */
    renderHighlight(objects = []) {
        const layer = this.layers.get('Highlight');
        if (!layer || !layer.ctx) return;

        const ctx = layer.ctx;
        ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);

        if (!objects || objects.length === 0) return;

        ctx.save();
        if (this.pinContent) {
            ctx.translate(0, 0);
        } else {
            ctx.translate(this.camera.x, this.camera.y);
        }
        ctx.scale(this.camera.scale, this.camera.scale);

        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 2 / this.camera.scale;
        ctx.setLineDash([4 / this.camera.scale, 4 / this.camera.scale]);

        for (const obj of objects) {
            const drawY = obj.gid ? obj.y - (obj.height || 64) : obj.y;
            const w = obj.width || 64;
            const h = obj.height || 64;

            ctx.strokeRect(obj.x - 2, drawY - 2, w + 4, h + 4);

            // Draw corner handles
            const handleSize = 6 / this.camera.scale;
            ctx.fillStyle = '#00E5FF';
            ctx.fillRect(obj.x - 2 - handleSize / 2, drawY - 2 - handleSize / 2, handleSize, handleSize);
            ctx.fillRect(obj.x + w + 2 - handleSize / 2, drawY - 2 - handleSize / 2, handleSize, handleSize);
            ctx.fillRect(obj.x - 2 - handleSize / 2, drawY + h + 2 - handleSize / 2, handleSize, handleSize);
            ctx.fillRect(obj.x + w + 2 - handleSize / 2, drawY + h + 2 - handleSize / 2, handleSize, handleSize);
        }

        ctx.restore();
    }
}

export default CanvasRenderer;
