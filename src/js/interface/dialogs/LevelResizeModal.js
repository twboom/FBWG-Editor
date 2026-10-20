/**
 * LevelResizeModal
 * Dialog modal allowing the user to specify new grid dimensions for the level,
 * with a clear warning about out-of-bounds pruning when shrinking dimensions.
 */
export class LevelResizeModal {
    /**
     * @param {Object} options
     * @param {number} [options.currentWidth=25]
     * @param {number} [options.currentHeight=18]
     * @param {Function} [options.onConfirm]
     * @param {Function} [options.onCancel]
     */
    constructor({ currentWidth = 25, currentHeight = 18, onConfirm = null, onCancel = null } = {}) {
        this.currentWidth = currentWidth;
        this.currentHeight = currentHeight;
        this.onConfirm = onConfirm;
        this.onCancel = onCancel;
        this.element = null;
    }

    /**
     * Render the modal DOM element.
     * @returns {HTMLElement}
     */
    render() {
        if (this.element) return this.element;

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay level-resize-modal';

        overlay.innerHTML = `
            <div class="modal-card">
                <div class="modal-header">
                    <span class="modal-title">Resize Level Dimensions</span>
                </div>
                <form class="modal-body">
                    <div class="modal-row">
                        <label for="resize-width">Width (tiles):</label>
                        <input type="number" id="resize-width" name="width" class="prop-input" value="${this.currentWidth}" min="1" required />
                    </div>
                    <div class="modal-row">
                        <label for="resize-height">Height (tiles):</label>
                        <input type="number" id="resize-height" name="height" class="prop-input" value="${this.currentHeight}" min="1" required />
                    </div>
                    <div class="resize-warning">
                        Warning: Shrinking dimensions will permanently delete tiles and objects outside the new boundary.
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancel">Cancel</button>
                        <button type="submit" class="btn-confirm">Resize</button>
                    </div>
                </form>
            </div>
        `;

        const form = overlay.querySelector('form');
        const widthInput = overlay.querySelector('input[name="width"]');
        const heightInput = overlay.querySelector('input[name="height"]');
        const cancelBtn = overlay.querySelector('.btn-cancel');

        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.onCancel) this.onCancel();
            this.destroy();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const w = parseInt(widthInput.value, 10);
            const h = parseInt(heightInput.value, 10);
            if (!Number.isNaN(w) && !Number.isNaN(h) && w > 0 && h > 0) {
                if (this.onConfirm) this.onConfirm(w, h);
                this.destroy();
            }
        });

        this.element = overlay;
        return overlay;
    }

    /**
     * Remove modal from the DOM.
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}

export default LevelResizeModal;
