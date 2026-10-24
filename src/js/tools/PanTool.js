import { ToolBase } from './ToolBase.js';

/**
 * PanTool allows dragging the document viewport canvas.
 */
export class PanTool extends ToolBase {
    /**
     * @param {Object} [options]
     * @param {HTMLElement} [options.viewport]
     */
    constructor(options = {}) {
        super({ name: 'pan', ...options });

        this.viewport = options.viewport || null;
        this.isPanning = false;
        this.lastScreenX = 0;
        this.lastScreenY = 0;
    }

    /**
     * Activate tool: set grab cursor.
     */
    activate() {
        super.activate();
        const el = this.renderer?.container || this.viewport;
        if (el) {
            el.style.cursor = 'grab';
        }
    }

    /**
     * Pointer down: initiate panning.
     * @param {Object} event
     */
    onPointerDown(event) {
        this.isPanning = true;
        this.lastScreenX = event.screenX;
        this.lastScreenY = event.screenY;

        const el = this.renderer?.container || this.viewport;
        if (el) {
            el.style.cursor = 'grabbing';
        }
    }

    /**
     * Pointer move: accumulate camera pan deltas and viewport scroll.
     * @param {Object} event
     */
    onPointerMove(event) {
        if (!this.isPanning) return;

        const dx = event.screenX - this.lastScreenX;
        const dy = event.screenY - this.lastScreenY;

        const viewport = this.viewport || this.toolManager?.viewport;
        if (viewport) {
            viewport.scrollLeft -= dx;
            viewport.scrollTop -= dy;
        }

        if (this.camera) {
            this.camera.pan(dx, dy);
        }

        const container = this.canvasContainer || this.toolManager?.canvasContainer;
        if (container && this.camera) {
            container.style.transform = `translate(${this.camera.x}px, ${this.camera.y}px)`;
        }

        this.lastScreenX = event.screenX;
        this.lastScreenY = event.screenY;

        if (this.renderer) {
            this.renderer.render();
            this.selectionManager?.refreshHighlight();
        }
    }

    /**
     * Pointer up: end panning.
     * @param {Object} event
     */
    onPointerUp(event) {
        this.isPanning = false;
        const el = this.renderer?.container || this.viewport;
        if (el) {
            el.style.cursor = 'grab';
        }
    }

    /**
     * Deactivate tool: reset cursor.
     */
    deactivate() {
        super.deactivate();
        this.isPanning = false;
        const el = this.renderer?.container || this.viewport;
        if (el) {
            el.style.cursor = '';
        }
    }
}

export default PanTool;
