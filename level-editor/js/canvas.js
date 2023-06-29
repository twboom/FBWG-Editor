import { SESSION } from "./session.js";

export let tileCanvas = document.getElementById('tiles');
export const tileCtx = tileCanvas.getContext('2d');
export let objectCanvas = document.getElementById('objects');
export const objectCtx = objectCanvas.getContext('2d');
export let highlightCanvas = document.getElementById('highlight');
export const highlightCtx = highlightCanvas.getContext('2s');

export function resizeCanvas(blockSize = 32) {
    // Get the canvasses

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
};