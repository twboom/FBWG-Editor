import { BLOCK_SIZE } from "./lookup.js";
import { SESSION } from "./session.js";

export const tileCanvas = document.getElementById('tiles');
export const tileCtx = tileCanvas.getContext('2d');
export const objectCanvas = document.getElementById('objects');
export const objectCtx = objectCanvas.getContext('2d');
export const highlightCanvas = document.getElementById('highlight');
export const highlightCtx = highlightCanvas.getContext('2s');

export function resizeCanvas(blockSize = 32) {
    // Get the correct width and height
    let width = SESSION.LEVEL.width * blockSize;
    let height = SESSION.LEVEL.height * blockSize;
    
    // Set the correct width and heigth
    tileCanvas.width = width;
    tileCanvas.height = height;

    objectCanvas.width = width;
    objectCanvas.height = height;

    highlightCanvas.width = width;
    highlightCanvas.height = height;

    
    // Correct the tiles and objects

    // Get the new and old with and heigth
    let oldWidth = SESSION.LEVEL.tiles[0] ? SESSION.LEVEL.tiles[0].length : 0;
    let oldHeight = SESSION.LEVEL.tiles.length;

    let newWidth = SESSION.LEVEL.width;
    let newHeight = SESSION.LEVEL.height;

    // Decreasing width
    if (oldWidth > newWidth) {
        for (let i = 0; i < oldHeight; i++) {
            for (let j = newWidth; j <= oldWidth; j++) {
                SESSION.LEVEL.tiles[i] = SESSION.LEVEL.tiles[i].splice(0, newWidth);
            };
        };

        // Remove objects outside the level
        let newObjects = [];
        for (let i = 0; i < SESSION.LEVEL.objects.length; i++) {
            if (SESSION.LEVEL.objects[i].x < newWidth * BLOCK_SIZE) {
                newObjects.push(SESSION.LEVEL.objects[i]);
            };
        };
        SESSION.LEVEL.objects = newObjects;

    // Increasing width
    } else if (oldWidth < newWidth) {
        for (let i = 0; i < oldHeight; i++) {
            for (let j = oldWidth; j <= newWidth; j++) {
                SESSION.LEVEL.tiles[i][j] = 0;
            };
        };
    };

    // Decreasing heigth
    if (oldHeight > newHeight) {
        SESSION.LEVEL.tiles = SESSION.LEVEL.tiles.splice(0, newHeight);
        
        // Remove objects outside the level
        let newObjects = [];
        for (let i = 0; i < SESSION.LEVEL.objects.length; i++) {
            if (SESSION.LEVEL.objects[i].y < newHeight * BLOCK_SIZE) {
                newObjects.push(SESSION.LEVEL.objects[i]);
            };
        };
        SESSION.LEVEL.objects = newObjects;
        
    // Increasing heigth 
    } else if (oldHeight < newHeight) {
        for (let i = oldHeight; i < newHeight; i++) {
            SESSION.LEVEL.tiles[i] = new Array(newWidth).fill(0);
        };
    };

    // Move the toolbox
    document.getElementById('input-container').style.left = String((newWidth * 32 + 52)) + 'px';
};


const CACHE = {};
export function drawImage(src, sizeX, sizeY, x, y, ctx) {
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