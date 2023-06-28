import { SESSION } from './session.js';
import { FLUID_COLOR, BLOCK_COLOR, BLOCK_SIZE } from './lookup.js';

const CONFIG = {
    BLOCK_SIZE: 32,
    SLOPE_STEEPNESS: 0.6,
};

export function drawTile(x, y, ctx) {
    // Get the tiles type
    let type = SESSION.LEVEL.tiles[y][x];

    // Draw the tile
    ctx.beginPath();
    ctx.rect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fillStyle = BLOCK_COLOR[type];
    ctx.fill();

    // Draw the grid
    ctx.strokeStyle = '#333333';
    ctx.stroke();
};

export function drawFluid(x, y, ctx) {
    // Get the tiles type
    let type = SESSION.LEVEL.tiles[y][x];

    // Get the previous and next tiles type
    let prevType = (x == 0) ? null : SESSION.LEVEL.tiles[y][x - 1];
    let nextType = (x == SESSION.LEVEL.widht) ? null : SESSION.LEVEL.tiles[y][x + 1];
    
    // Convert to pixel coördinates
    x *= BLOCK_SIZE;
    y *= BLOCK_SIZE;
    
    // Draw fluid background
    ctx.beginPath();
    ctx.rect(x, y, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fillStyle = FLUID_COLOR[type - 6];
    ctx.fill();

    // Function to draw the slope on the edge of a fluid
    function drawEdge(left = false) {
        ctx.beginPath();
        ctx.moveTo(x, y + BLOCK_SIZE);
        ctx.lineTo(x + BLOCK_SIZE, y + BLOCK_SIZE);
        if (left) {
            ctx.lineTo(x + BLOCK_SIZE, y);
            ctx.lineTo(x, y + CONFIG.SLOPE_STEEPNESS * BLOCK_SIZE);
        } else {
            ctx.lineTo(x + BLOCK_SIZE, y + CONFIG.SLOPE_STEEPNESS * BLOCK_SIZE);
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
        ctx.rect(x, y + CONFIG.SLOPE_STEEPNESS * BLOCK_SIZE, BLOCK_SIZE, (1 - CONFIG.SLOPE_STEEPNESS) * BLOCK_SIZE);
        ctx.fillStyle = 'white';
        ctx.fill();
    };

    // Draw the grid
    ctx.beginPath();
    ctx.rect(x, y, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#333333';
    ctx.stroke();
};

export function drawSlope(x, y, ctx, isBackground=false) {
    // Get the tiles type
    let type =  isBackground ? 7 - SESSION.LEVEL.tiles[y][x] : SESSION.LEVEL.tiles[y][x];

    // Convert to pixel coörnidates
    x *= BLOCK_SIZE
    y *= BLOCK_SIZE

    // Draw the slope
    ctx.beginPath();
    switch (type) {
        case 2:
            ctx.moveTo(x, y + BLOCK_SIZE);
            ctx.lineTo(x + BLOCK_SIZE, y  + BLOCK_SIZE);
            ctx.lineTo(x + BLOCK_SIZE, y);
            break
        case 3:
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + BLOCK_SIZE);
            ctx.lineTo(x + BLOCK_SIZE, y + BLOCK_SIZE);
            break
        case 4:
            ctx.moveTo(x, y);
            ctx.lineTo(x + BLOCK_SIZE, y);
            ctx.lineTo(x + BLOCK_SIZE, y + BLOCK_SIZE);
            break
        case 5:
            ctx.moveTo(x, y);
            ctx.lineTo(x + BLOCK_SIZE, y);
            ctx.lineTo(x , y + BLOCK_SIZE);
            break    
    }

    // Change color to black for the background
    if (isBackground) { ctx.fillStyle = BLOCK_COLOR[0] } else { ctx.fillStyle = BLOCK_COLOR[1] };
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.stroke();

    // Call the funcion again to draw the background
    if (!isBackground) { drawSlope(x/BLOCK_SIZE, y/BLOCK_SIZE, ctx,  true) };
};