import { resizeCanvas } from "./canvas.js";
import { resizeLevel } from "./editor.js";
import { SESSION } from "./session.js";
import { exportTEXT, exportJSON } from "./export.js";
import { Modal } from "./modal.js";
import { clearHighlight } from "./highlight_renderer.js";


export function initInterface() {
    resizeCanvas();
    window.addEventListener('resize', _ => { resizeCanvas(); });
};