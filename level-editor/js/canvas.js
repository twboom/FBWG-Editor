import { BLOCK_SIZE } from "./lookup.js";
import { SESSION } from "./session.js";

export const highlightCanvas = document.getElementById('highlight');
export const highlightCtx = highlightCanvas.getContext('2d');

export function resizeCanvas() {
    // Get the correct width and height
    // let width = SESSION.LEVEL.width * blockSize;
    // let height = SESSION.LEVEL.height * blockSize;
    let width = highlightCanvas.getBoundingClientRect().width;
    let height = highlightCanvas.getBoundingClientRect().height;
    
    // Set the correct width and heigth
    SESSION.TILE_CANVAS.width = width;
    SESSION.TILE_CANVAS.height = height;

    SESSION.TEXT_CANVAS.width = width;
    SESSION.TEXT_CANVAS.height = height;

    SESSION.OBJECT_CANVAS.width = width;
    SESSION.OBJECT_CANVAS.height = height;

    highlightCanvas.width = width;
    highlightCanvas.height = height;

    // Move the toolbox
    // let newWidth = SESSION.LEVEL.width;
    // document.getElementById('input-container').style.left = String((newWidth * 32 + 52)) + 'px';
};

const CACHE = {};
export function drawImage(src, sizeX, sizeY, x, y, rotation, ctx) {
    let img = new Image(sizeX, sizeY);
    if (src in CACHE) {
        img = CACHE[src].cloneNode(true)
    } else {
        img.src = src;
        CACHE[src] = img;
    };
    img.onload = _ => {
        ctx.drawImage(img, x, y);
    };
};