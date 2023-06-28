import { DO_RENDER } from './session.js';
import { TILE_RENDERER } from './session.js';
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

export function render({do_tiles = true, do_objects = true}) {
    // Render the correct layer
    if (do_tiles) {
        const tiles = SESSION.LEVEL.tiles
        for (let y = 0; y < tiles.length; y++) {
            for (let x = 0; x < tiles[y].length; x++) {
                TILE_RENDERER.render(x, y, tiles[y][x], ctx);
            };
        };
    };
    if (do_objects) {};
    
    // Only render next frame if it is needed
    if (DO_RENDER) {
        requestAnimationFrame(render);
    };
};