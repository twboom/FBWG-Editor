import { objectCanvas, objectCtx, tileCanvas, tileCtx } from './canvas.js';
import { render_object } from './object_renderer.js';
import { SESSION } from './session.js';
import { drawTile, drawFluid, drawSlope, drawSnow } from './tile_renderer.js'

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
            drawTile, /* air */
            drawTile, /* block */
            drawSlope,
            drawSlope,
            drawSlope,
            drawSlope,
            drawFluid, /* lava */
            drawFluid, /* water */
            drawFluid, /* acid */
            undefined,
            undefined,
            drawTile,
            drawSnow, /* snow edge TR*/
            drawSnow, /* snow edge TL*/
            drawSnow, /* snow */
            drawFluid, /* ice */ 
        ];
        // Render the correct type
        RENDER_LOOKUP[type](x, y, ctx);
    };
};

export function render({do_tiles = true, do_objects = true}) {
    // Render the correct layer
    if (do_tiles) {
        tileCtx.clearRect(0, 0, tileCanvas.width, tileCanvas.height);
        const tiles = SESSION.LEVEL.tiles;
        let later = []
        for (let y = 0; y < tiles.length; y++) {
            for (let x = 0; x < tiles[y].length; x++) {
                if (tiles[y][x] == 12 || tiles[y][x] == 13 || tiles[y][x] == 14) {
                    later.push([x, y]);
                };
                SESSION.TILE_RENDERER.render(x, y, tiles[y][x], tileCtx);
            };
        };
        
        // Render snow last
        for (let i = 0; i < later.length; i++) {
            SESSION.TILE_RENDERER.render(later[i][0], later[i][1], tiles[later[i][1]][later[i][0]], tileCtx);
        };
    };
    if (do_objects) {
        objectCtx.clearRect(0, 0, objectCanvas.width, objectCanvas.height);
        const objects = SESSION.LEVEL.objects;
        for (let i = 0; i < objects.length; i++) {
            if (objects[i]) {
                render_object(objects[i], objectCtx);
            };
        };
    };
    
    // Only render next frame if it is needed
    if (SESSION.DO_RENDER) {
        requestAnimationFrame(render);
    };
};