import { highlightCanvas, highlightCtx } from "./canvas.js";
import * as Objects from './Object.js';


export function objectHighlight(object, tracer, color='cyan', clearCtx=true) {
    console.log('Render Object Highlight, tracer', tracer);
    if (clearCtx) {
        highlightCtx.clearRect(0, 0, highlightCanvas.width, highlightCanvas.height);
    };
    let posX = object.x;
    let posY = object.y;
    let width = 64;
    let height = 64;
    if (object instanceof Objects.Platform) {
        width = object.width;
        height = object.height;
        posY += height;
    };
    highlightCtx.beginPath();
    highlightCtx.rect(posX, posY, width, -height);
    highlightCtx.strokeStyle = color;
    highlightCtx.lineWidth = 8;
    highlightCtx.stroke();
};