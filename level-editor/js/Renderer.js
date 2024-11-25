import { render_object } from './object_renderer.js';
import { SESSION } from './session.js';
import { render_text } from './text_renderer.js';
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

export function render(options, tracer) {
    // const {do_tiles = true, do_objects = true, do_text = true} = options;
    const {do_tiles = true, do_objects = true, do_text = true} = {};
    if (SESSION.SHOW_CONSOLE_DEBUG) {
        console.log('RENDER:', options, 'tracer:', tracer);
    };

    if (SESSION.CAMERA_MOVE_LEFT) { SESSION.CAMERA_POSITION[0] += 4; };
    if (SESSION.CAMERA_MOVE_RIGHT) { SESSION.CAMERA_POSITION[0] -= 4; };
    if (SESSION.CAMERA_MOVE_UP) { SESSION.CAMERA_POSITION[1] += 4; };
    if (SESSION.CAMERA_MOVE_DOWN) { SESSION.CAMERA_POSITION[1] -= 4; };

    let txt = false;
    switch (SESSION.EDITOR_FUNCTION) {
        case 'tile-editor':
            SESSION.TILE_CTX.globalAlpha = 1;
            SESSION.OBJECT_CTX.globalAlpha = 0.3;
            SESSION.TEXT_CTX.globalAlpha = 0.3;
            break;
        case 'object-editor':
            SESSION.TILE_CTX.globalAlpha = 0.3;
            SESSION.OBJECT_CTX.globalAlpha = 1;
            SESSION.TEXT_CTX.globalAlpha = 0.3;
            break;
        case 'text-editor':
            SESSION.TILE_CTX.globalAlpha = 0.3;
            SESSION.OBJECT_CTX.globalAlpha = 0.3;
            SESSION.TEXT_CTX.globalAlpha = 1;
            txt = true
            break;
        case 'all':
            SESSION.TILE_CTX.globalAlpha = 1;
            SESSION.OBJECT_CTX.globalAlpha = 1;
            SESSION.TEXT_CTX.globalAlpha = 1;
            break;
        default:
            SESSION.TILE_CTX.globalAlpha = 0.3;
            SESSION.OBJECT_CTX.globalAlpha = 0.3;
            SESSION.TEXT_CTX.globalAlpha = 0.3;
    };

    SESSION.TILE_CTX.resetTransform();
    SESSION.TILE_CTX.clearRect(0, 0, SESSION.TILE_CANVAS.width, SESSION.TILE_CANVAS.height);
    SESSION.TILE_CTX.translate(SESSION.CAMERA_POSITION[0], SESSION.CAMERA_POSITION[1]);
    SESSION.TILE_CTX.scale(SESSION.CAMERA_ZOOM, SESSION.CAMERA_ZOOM)
    SESSION.OBJECT_CTX.resetTransform();
    SESSION.OBJECT_CTX.clearRect(0, 0, SESSION.TILE_CANVAS.width, SESSION.TILE_CANVAS.height);
    SESSION.OBJECT_CTX.translate(SESSION.CAMERA_POSITION[0], SESSION.CAMERA_POSITION[1]);
    SESSION.OBJECT_CTX.scale(SESSION.CAMERA_ZOOM, SESSION.CAMERA_ZOOM)
    SESSION.TEXT_CTX.resetTransform();
    SESSION.TEXT_CTX.clearRect(0, 0, SESSION.TILE_CANVAS.width, SESSION.TILE_CANVAS.height);
    SESSION.TEXT_CTX.translate(SESSION.CAMERA_POSITION[0], SESSION.CAMERA_POSITION[1]);
    SESSION.TEXT_CTX.scale(SESSION.CAMERA_ZOOM, SESSION.CAMERA_ZOOM)

    const cameraCorrectedX = -(SESSION.CAMERA_POSITION[0])
    const cameraCorrectedY = -(SESSION.CAMERA_POSITION[1])

    // Render the correct layer
    if (do_tiles) {
        SESSION.TILE_CTX.clearRect(cameraCorrectedX, cameraCorrectedY, SESSION.TILE_CANVAS.width, SESSION.TILE_CANVAS.height);
        const tiles = SESSION.LEVEL.tiles;
        let later = []
        for (let y = 0; y < tiles.length; y++) {
            for (let x = 0; x < tiles[y].length; x++) {
                if (tiles[y][x] == 12 || tiles[y][x] == 13 || tiles[y][x] == 14) {
                    later.push([x, y]);
                };
                SESSION.TILE_RENDERER.render(x, y, tiles[y][x], SESSION.TILE_CTX);
            };
        };
        
        // Render snow last
        for (let i = 0; i < later.length; i++) {
            SESSION.TILE_RENDERER.render(later[i][0], later[i][1], tiles[later[i][1]][later[i][0]], SESSION.TILE_CTX);
        };
    };
    if (do_objects) {
        SESSION.OBJECT_CTX.clearRect(cameraCorrectedX, cameraCorrectedY, SESSION.OBJECT_CANVAS.width, SESSION.OBJECT_CANVAS.height);
        const objects = SESSION.LEVEL.objects;
        for (let i = 0; i < objects.length; i++) {
            if (objects[i]) {
                render_object(objects[i], SESSION.OBJECT_CTX);
            };
        };
    };

    if (do_text) {
        SESSION.TEXT_CTX.clearRect(cameraCorrectedX, cameraCorrectedY, SESSION.TEXT_CANVAS.width, SESSION.TEXT_CANVAS.height);
        const objects = SESSION.LEVEL.text;
        for (let i = 0; i < objects.length; i++) {
            if (objects[i]) {
                render_text(objects[i], txt, SESSION.TEXT_CTX);
            };
        };
    };
    
    // Only render next frame if it is needed
    if (SESSION.DO_RENDER) {
        requestAnimationFrame(_ => {
            // ID tracer
            tracer = String(tracer);
            if (!String(tracer).includes('AnimationFrame')) { tracer += ' AnimationFrame' };
            render(options, tracer);
        });
    };
};