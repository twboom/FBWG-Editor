import { DO_RENDER } from './session.js';
import { drawTile, drawFluid, drawSlope } from './tile_renderer.js'

export class SpriteRenderer {
    constructor(src, width, height) {
        this.width = width;
        this.height = height;
        this.src = src;
        this.img = new Image(width, height);
    };

    render(x, y, ctx) {
        ctx.drawImage(this.img, x, y);
    };
};

export class TileRenderer {
    // Render the tiles
    render(x, y, type, ctx) {
        const RENDER_LOOKUP = [
            drawTile, 
            drawTile,
            drawSlope,
            drawSlope,
            drawSlope,
            drawSlope,
            drawFluid,
            drawFluid,
            drawFluid,
        ];
        // Render the correct type
        RENDER_LOOKUP[type](x, y, ctx);
    };
};

export function render() {

    // Only render next frame if it is needed
    if (DO_RENDER) {
        requestAnimationFrame(render);
    };
};