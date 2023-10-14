import { highlightCanvas, highlightCtx } from "./canvas.js";
import * as Objects from './Object.js';
import { SESSION } from "./session.js";


export function objectHighlight(object, tracer, color='cyan', clearCtx=true) {
    if (SESSION.SHOW_CONSOLE_DEBUG) { console.log('Render Object Highlight, tracer', tracer);};
    if (clearCtx) {
        clearHighlight();
    };
    let posX = object.x;
    let posY = object.y;
    let width = object.width;
    let height = object.height;
    if (object instanceof Objects.Platform) {
        posY += height;
    };
    if (object instanceof Objects.TextTrigger || object instanceof Objects.TextObject) {
        height = -height;
    };

    highlightCtx.beginPath();
    highlightCtx.rect(posX, posY, width, -height);
    highlightCtx.strokeStyle = color;
    highlightCtx.lineWidth = 8;
    highlightCtx.stroke();
};

export function clearHighlight() {
    highlightCtx.clearRect(0, 0, highlightCanvas.width, highlightCanvas.height);
};