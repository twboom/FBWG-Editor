import { ToolBase } from './ToolBase.js';
import { LevelObject } from '../level/LevelObject.js';

/**
 * TextTool allows placing Text Objects and Trigger Zones on Tutorial_keyboard layer.
 */
export class TextTool extends ToolBase {
    /**
     * @param {Object} [options]
     */
    constructor(options = {}) {
        super({ name: 'text', ...options });

        this.mode = options.mode || 'text'; // 'text' | 'trigger'
        this.textContent = options.textContent || 'Tutorial Text';
        this.triggerId = typeof options.triggerId === 'number' ? options.triggerId : 0;
        this.fontSize = options.fontSize || 24;
        this.fontFamily = options.fontFamily || 'Trajan Pro';
        this.triggerWidth = options.triggerWidth || 128;
        this.triggerHeight = options.triggerHeight || 64;
        this.textWidth = options.textWidth || 200;
        this.textHeight = options.textHeight || 32;
    }

    /**
     * Handle pointerdown on canvas: place text object or trigger zone.
     * @param {Object} event
     */
    onPointerDown(event) {
        if (!this.level) return;

        const layerName = 'Tutorial_keyboard';
        if (this.isLayerLocked(layerName)) {
            return;
        }

        const snap = this.getSnapSize();
        let posX = event.worldX;
        let posY = event.worldY;

        if (snap > 1) {
            posX = Math.floor(posX / snap) * snap;
            posY = Math.floor(posY / snap) * snap;
        } else {
            posX = Math.round(posX);
            posY = Math.round(posY);
        }

        let newObj;

        if (this.mode === 'trigger') {
            newObj = new LevelObject({
                layer: layerName,
                x: posX,
                y: posY,
                width: this.triggerWidth,
                height: this.triggerHeight,
                properties: {
                    id: this.triggerId
                },
                propertytypes: {
                    id: 'int'
                }
            });
        } else {
            // mode === 'text'
            newObj = new LevelObject({
                layer: layerName,
                x: posX,
                y: posY,
                width: this.textWidth,
                height: this.textHeight,
                properties: {
                    id: this.triggerId
                },
                propertytypes: {
                    id: 'int'
                },
                text: {
                    text: this.textContent,
                    pixelsize: this.fontSize,
                    fontfamily: this.fontFamily,
                    bold: true,
                    halign: 'center',
                    wrap: true
                }
            });
        }

        this.level.addObject(newObj);

        if (this.selectionManager) {
            this.selectionManager.select(newObj);
        }

        if (this.renderer) {
            this.renderer.renderLayer(layerName);
            if (this.selectionManager) {
                this.selectionManager.refreshHighlight();
            }
        }
    }
}

export default TextTool;
