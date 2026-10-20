import { ToolBase, getObjectLayer } from './ToolBase.js';

/**
 * SelectTool handles strictly single-object selection, bounding box highlighting,
 * and position dragging with configurable grid snapping and layer lock enforcement.
 */
export class SelectTool extends ToolBase {
    /**
     * @param {Object} [options]
     */
    constructor(options = {}) {
        super({ name: 'select', ...options });

        this.isDragging = false;
        this.dragStartWorldX = 0;
        this.dragStartWorldY = 0;
        this.objStartX = 0;
        this.objStartY = 0;
    }

    /**
     * Pointer down on canvas: select entity or deselect on empty canvas.
     * @param {Object} event
     */
    onPointerDown(event) {
        const worldX = event.worldX;
        const worldY = event.worldY;

        const obj = this.level?.findObjectAt(worldX, worldY, (candidate) => {
            const layer = getObjectLayer(candidate);
            return !this.isLayerLocked(layer) && this.isLayerVisible(layer);
        }) || null;

        if (obj) {
            this.selectionManager?.select(obj);

            const layer = getObjectLayer(obj);
            if (!this.isLayerLocked(layer)) {
                this.isDragging = true;
                this.dragStartWorldX = worldX;
                this.dragStartWorldY = worldY;
                this.objStartX = obj.x;
                this.objStartY = obj.y;
            } else {
                this.isDragging = false;
            }
        } else {
            this.selectionManager?.deselect();
            this.isDragging = false;
        }
    }

    /**
     * Pointer move: drag selected object if dragging is active.
     * @param {Object} event
     */
    onPointerMove(event) {
        if (!this.isDragging || !this.selectionManager?.selectedObject) {
            return;
        }

        const obj = this.selectionManager.selectedObject;
        const layer = getObjectLayer(obj);

        if (this.isLayerLocked(layer)) {
            this.isDragging = false;
            return;
        }

        const dx = event.worldX - this.dragStartWorldX;
        const dy = event.worldY - this.dragStartWorldY;

        let rawX = this.objStartX + dx;
        let rawY = this.objStartY + dy;

        const snap = this.getSnapSize();
        if (snap > 1) {
            rawX = Math.round(rawX / snap) * snap;
            rawY = Math.round(rawY / snap) * snap;
        } else {
            rawX = Math.round(rawX);
            rawY = Math.round(rawY);
        }

        obj.x = rawX;
        obj.y = rawY;

        if (this.renderer) {
            this.renderer.renderLayer(layer);
            this.renderer.renderHighlight([obj]);
        }
    }

    /**
     * Pointer up: end dragging.
     * @param {Object} event
     */
    onPointerUp(event) {
        this.isDragging = false;
    }

    /**
     * Handle keydown shortcuts like Delete / Backspace.
     * @param {Object} event
     */
    onKeyDown(event) {
        if (event.key === 'Delete' || event.key === 'Backspace') {
            const obj = this.selectionManager?.selectedObject;
            if (!obj) return;

            const layer = getObjectLayer(obj);
            if (this.isLayerLocked(layer)) return;

            if (this.level && typeof this.level.removeObject === 'function') {
                this.level.removeObject(obj.id ?? obj);
            }
            this.selectionManager?.deselect();

            if (this.renderer) {
                this.renderer.renderLayer(layer);
                this.renderer.renderHighlight([]);
            }
        }
    }

    /**
     * Tool deactivated: cancel drag.
     */
    deactivate() {
        super.deactivate();
        this.isDragging = false;
    }
}

export default SelectTool;
