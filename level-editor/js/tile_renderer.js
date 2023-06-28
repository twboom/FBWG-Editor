import { SESSION } from './session.js';
import { FLUID_COLOR, BLOCK_COLOR } from './lookup.js';

const CONFIG = {
    BLOCK_SIZE: 32,
    SLOPE_STEEPNESS: 0.6,
};

export function drawTile(x, y, ctx) {
    // Get the tiles type
    let type = SESSION.LEVEL.tiles[y][x];

    // Draw the tile
    ctx.beginPath();
    ctx.rect(x, y, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
    ctx.fillStyle = BLOCK_COLOR[type];
    ctx.fill();
};

export function drawFluid(x, y, ctx) {
    // Get the tiles type
    let type = SESSION.LEVEL.tiles[y][x];

    // Get the previous and next tiles type
    let prevType = (x == 0) ? prevType = null : prevType = SESSION.LEVEL.tiles[y][x - 1];
    let nextType = (x == SESSION.LEVEL.widht) ? null : SESSION.LEVEL.tiles[y][x - 1];
    
    // Convert to pixel coördinates
    x *= CONFIG.BLOCK_SIZE;
    y *= CONFIG.BLOCK_SIZE;
    
    // Draw fluid background
    ctx.beginPath();
    ctx.rect(x, y, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
    ctx.fillStyle = FLUID_COLOR[type - 6];
    ctx.fill();

    // Function to draw the slope on the edge of a fluid
    function drawEdge(left = false) {
        ctx.beginPath();
        ctx.moveTo(x, y + CONFIG.BLOCK_SIZE);
        ctx.lineTo(x + CONFIG.BLOCK_SIZE, y + CONFIG.BLOCK_SIZE);
        if (left) {
            ctx.lineTo(x + CONFIG.BLOCK_SIZE, y);
            ctx.lineTo(x, y + CONFIG.SLOPE_STEEPNESS * CONFIG.BLOCK_SIZE);
        } else {
            ctx.lineTo(x + CONFIG.BLOCK_SIZE, y + CONFIG.SLOPE_STEEPNESS * CONFIG.BLOCK_SIZE);
            ctx.lineTo(x, y);  
        };
        ctx.fillStyle = 'white';
        ctx.fill();
    };

    // Call the correct drawSlope()
    if (prevType !== type) { drawEdge(); };
    if (nextType !== type) { drawEdge(true); };

    // Fill the bottom of the fluid
    if (prevType == type && nextType == type) {
        ctx.beginPath();
        ctx.rect(x, y + CONFIG.SLOPE_STEEPNESS * CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE, (1 - CONFIG.SLOPE_STEEPNESS) * CONFIG.BLOCK_SIZE);
        ctx.fillStyle = 'white';
        ctx.fill();
    };
};

export function drawSlope(x, y, ctx, isBackground=false) {
    // Get the tiles type
    let type = SESSION.LEVEL.tiles[y][x]

    // Convert to pixel coörnidates
    x *= SESSION.LEVEL.BLOCK_SIZE
    y *= SESSION.LEVEL.BLOCK_SIZE

    // Draw the slope
    tileCtx.beginPath();
    switch (type) {
        case 2:
            tileCtx.moveTo(x, y + SESSION.LEVEL.BLOCK_SIZE);
            tileCtx.lineTo(x + SESSION.LEVEL.BLOCK_SIZE, y  + SESSION.LEVEL.BLOCK_SIZE);
            tileCtx.lineTo(x + SESSION.LEVEL.BLOCK_SIZE, y);
            break
        case 3:
            tileCtx.moveTo(x, y);
            tileCtx.lineTo(x, y + SESSION.LEVEL.BLOCK_SIZE);
            tileCtx.lineTo(x + SESSION.LEVEL.BLOCK_SIZE, y + SESSION.LEVEL.BLOCK_SIZE);
            break
        case 4:
            tileCtx.moveTo(x, y);
            tileCtx.lineTo(x + SESSION.LEVEL.BLOCK_SIZE, y);
            tileCtx.lineTo(x + SESSION.LEVEL.BLOCK_SIZE, y + SESSION.LEVEL.BLOCK_SIZE);
            break
        case 5:
            tileCtx.moveTo(x, y);
            tileCtx.lineTo(x + SESSION.LEVEL.BLOCK_SIZE, y);
            tileCtx.lineTo(x , y + SESSION.LEVEL.BLOCK_SIZE);
            break    
    }

    // Change color to black for the background
    if (isBackground) { tileCtx.fillStyle = BLOCK_COLOR[0] } else { tileCtx.fillStyle = BLOCK_COLOR[1] };
    tileCtx.fill();

    // Call the funcion again to draw the background
    if (!isBackground) { drawTriangle(7-type, [x/SESSION.LEVEL.BLOCK_SIZE, y/SESSION.LEVEL.BLOCK_SIZE], ctx,  true) };
};