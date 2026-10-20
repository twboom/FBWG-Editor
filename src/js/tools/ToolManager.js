import { SelectionManager } from '../core/SelectionManager.js';
import { SelectTool } from './SelectTool.js';
import { PanTool } from './PanTool.js';
import { TileBrushTool } from './TileBrushTool.js';
import { SlopeBrushTool } from './SlopeBrushTool.js';
import { FluidBrushTool } from './FluidBrushTool.js';
import { TileEraserTool } from './TileEraserTool.js';
import { ObjectPlaceTool } from './ObjectPlaceTool.js';
import { TextTool } from './TextTool.js';

export const TOOL_HOTKEYS = {
    v: 'select',
    V: 'select',
    h: 'pan',
    H: 'pan',
    b: 'brush',
    B: 'brush',
    s: 'slope',
    S: 'slope',
    f: 'fluid',
    F: 'fluid',
    e: 'eraser',
    E: 'eraser',
    p: 'platform',
    P: 'platform',
    o: 'box',
    O: 'box',
    l: 'lever',
    L: 'lever',
    d: 'door',
    D: 'door',
    g: 'gem',
    G: 'gem',
    t: 'text',
    T: 'text'
};

/**
 * ToolManager coordinates active editing tools, event routing,
 * snap configuration, hotkeys, and tool lifecycle.
 */
export class ToolManager {
    /**
     * @param {Object} [options]
     * @param {import('../level/LevelModel.js').LevelModel} [options.level]
     * @param {import('../renderer/CanvasRenderer.js').CanvasRenderer} [options.renderer]
     * @param {import('../renderer/Camera.js').Camera} [options.camera]
     * @param {SelectionManager} [options.selectionManager]
     * @param {number} [options.snapSize=32]
     * @param {HTMLElement} [options.viewport]
     */
    constructor(options = {}) {
        this._level = options.level || null;
        this._renderer = options.renderer || null;
        this._camera = options.camera || null;
        this.viewport = options.viewport || null;

        this.selectionManager =
            options.selectionManager ||
            new SelectionManager({
                renderer: this._renderer,
                level: this._level
            });

        // Ensure selection manager has renderer attached
        if (this._renderer && !this.selectionManager.renderer) {
            this.selectionManager.setRenderer(this._renderer);
        }

        this.snapSize = options.snapSize !== undefined ? options.snapSize : 32;

        /** @type {Map<string, import('./ToolBase.js').ToolBase>} */
        this.tools = new Map();

        /** @type {import('./ToolBase.js').ToolBase|null} */
        this.activeTool = null;

        /** @type {string|null} */
        this.activeToolName = null;

        /** @type {Set<Function>} */
        this._listeners = new Set();

        this._registerDefaultTools();
        this.setActiveTool('select');
    }

    get renderer() {
        return this._renderer;
    }

    set renderer(val) {
        this.setRenderer(val);
    }

    /**
     * Update active renderer and propagate to all tools.
     * @param {import('../renderer/CanvasRenderer.js').CanvasRenderer} renderer
     */
    setRenderer(renderer) {
        this._renderer = renderer;
        for (const tool of this.tools.values()) {
            tool.renderer = renderer;
        }
        if (this.selectionManager && renderer) {
            this.selectionManager.setRenderer(renderer);
        }
    }

    get level() {
        return this._level;
    }

    set level(val) {
        this.setLevel(val);
    }

    /**
     * Update active level model and propagate to all tools.
     * @param {import('../level/LevelModel.js').LevelModel} level
     */
    setLevel(level) {
        this._level = level;
        for (const tool of this.tools.values()) {
            tool.level = level;
        }
    }

    get camera() {
        return this._camera;
    }

    set camera(val) {
        this.setCamera(val);
    }

    /**
     * Update camera and propagate to all tools.
     * @param {import('../renderer/Camera.js').Camera} camera
     */
    setCamera(camera) {
        this._camera = camera;
        for (const tool of this.tools.values()) {
            tool.camera = camera;
        }
    }

    /**
     * Register default tool set: select, pan, brush, slope, fluid, eraser, platform, box, lever, door, gem, text.
     * @private
     */
    _registerDefaultTools() {
        const commonOptions = {
            level: this._level,
            renderer: this._renderer,
            camera: this._camera,
            selectionManager: this.selectionManager,
            toolManager: this,
            viewport: this.viewport
        };

        this.registerTool('select', new SelectTool(commonOptions));
        this.registerTool('pan', new PanTool(commonOptions));
        this.registerTool('brush', new TileBrushTool(commonOptions));
        this.registerTool('slope', new SlopeBrushTool(commonOptions));
        this.registerTool('fluid', new FluidBrushTool(commonOptions));
        this.registerTool('eraser', new TileEraserTool(commonOptions));
        this.registerTool(
            'platform',
            new ObjectPlaceTool({
                ...commonOptions,
                objectType: 'platform',
                layer: 'Objects',
                width: 96,
                height: 32,
                properties: { dx: 0, dy: 0, group: 1 }
            })
        );
        this.registerTool('box', new ObjectPlaceTool({
            ...commonOptions,
            objectType: 'box',
            gid: 28,
            layer: 'Objects',
            width: 64,
            height: 64,
            properties: {}
        }));
        this.registerTool('lever', new ObjectPlaceTool({
            ...commonOptions,
            objectType: 'lever',
            gid: 25,
            layer: 'Objects',
            width: 64,
            height: 64,
            properties: { group: 1 }
        }));
        this.registerTool('door', new ObjectPlaceTool({
            ...commonOptions,
            objectType: 'door',
            gid: 16,
            layer: 'Chars',
            width: 64,
            height: 64,
            properties: {}
        }));
        this.registerTool('gem', new ObjectPlaceTool({
            ...commonOptions,
            objectType: 'gem',
            gid: 20,
            layer: 'Chars',
            width: 64,
            height: 64,
            properties: {}
        }));
        this.registerTool('text', new TextTool(commonOptions));
    }

    /**
     * Register a tool by name.
     * @param {string} name
     * @param {import('./ToolBase.js').ToolBase} tool
     */
    registerTool(name, tool) {
        tool.toolManager = this;
        if (!tool.level) tool.level = this._level;
        if (!tool.renderer) tool.renderer = this._renderer;
        if (!tool.camera) tool.camera = this._camera;
        if (!tool.selectionManager) tool.selectionManager = this.selectionManager;

        this.tools.set(name, tool);
    }

    /**
     * Get a registered tool by name.
     * @param {string} name
     * @returns {import('./ToolBase.js').ToolBase|null}
     */
    getTool(name) {
        return this.tools.get(name) || null;
    }

    /**
     * Set the current active tool by name.
     * @param {string} name
     * @returns {import('./ToolBase.js').ToolBase|null}
     */
    setActiveTool(name) {
        const nextTool = this.tools.get(name);
        if (!nextTool) {
            return null;
        }

        if (this.activeTool && typeof this.activeTool.deactivate === 'function') {
            this.activeTool.deactivate();
        }

        this.activeTool = nextTool;
        this.activeToolName = name;

        if (typeof this.activeTool.activate === 'function') {
            this.activeTool.activate();
        }

        for (const listener of this._listeners) {
            try {
                listener(name, this.activeTool);
            } catch (err) {
                console.error('Error in tool change listener:', err);
            }
        }

        return this.activeTool;
    }

    /**
     * Subscribe to active tool changes.
     * @param {Function} listener
     * @returns {Function} Unsubscribe function
     */
    onToolChange(listener) {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    /**
     * Set grid snapping increment in pixels.
     * @param {number} size
     */
    setSnapSize(size) {
        this.snapSize = typeof size === 'number' && size >= 0 ? size : 0;
        for (const tool of this.tools.values()) {
            if (typeof tool.setSnapSize === 'function') {
                tool.setSnapSize(this.snapSize);
            }
        }
    }

    /**
     * Construct normalized tool event with world and screen coordinates.
     * @private
     * @param {Object} e
     * @returns {Object}
     */
    _createToolEvent(e) {
        let screenX = 0;
        let screenY = 0;

        if (e.screenX !== undefined && e.screenY !== undefined && e.worldX !== undefined && e.worldY !== undefined) {
            return {
                ...e,
                screenX: e.screenX,
                screenY: e.screenY,
                worldX: e.worldX,
                worldY: e.worldY,
                rawEvent: e
            };
        }

        if (e.clientX !== undefined && e.clientY !== undefined) {
            const containerEl = this._renderer?.container || (e.target?.closest ? e.target.closest('.canvas-content') : null) || e.target;
            if (containerEl && typeof containerEl.getBoundingClientRect === 'function') {
                const rect = containerEl.getBoundingClientRect();
                screenX = e.clientX - rect.left;
                screenY = e.clientY - rect.top;
            } else {
                screenX = e.clientX;
                screenY = e.clientY;
            }
        } else if (e.offsetX !== undefined && e.offsetY !== undefined) {
            screenX = e.offsetX;
            screenY = e.offsetY;
        } else if (e.x !== undefined && e.y !== undefined) {
            screenX = e.x;
            screenY = e.y;
        }

        let worldX = screenX;
        let worldY = screenY;

        if (this._renderer?.pinContent) {
            const scale = this._camera?.scale || 1.0;
            worldX = screenX / scale;
            worldY = screenY / scale;
        } else if (this._camera && typeof this._camera.screenToWorld === 'function') {
            const world = this._camera.screenToWorld(screenX, screenY);
            worldX = world.x;
            worldY = world.y;
        }

        return {
            ...e,
            screenX,
            screenY,
            worldX,
            worldY,
            rawEvent: e
        };
    }

    /**
     * Route pointerdown to active tool.
     * @param {Object} e
     */
    onPointerDown(e) {
        if (!this.activeTool) return;
        const event = this._createToolEvent(e);
        this.activeTool.onPointerDown(event);
    }

    /**
     * Route pointermove to active tool.
     * @param {Object} e
     */
    onPointerMove(e) {
        if (!this.activeTool) return;
        const event = this._createToolEvent(e);
        this.activeTool.onPointerMove(event);
    }

    /**
     * Route pointerup to active tool.
     * @param {Object} e
     */
    onPointerUp(e) {
        if (!this.activeTool) return;
        const event = this._createToolEvent(e);
        this.activeTool.onPointerUp(event);
    }

    /**
     * Handle keyboard events (hotkey switching and routing).
     * @param {Object} e
     */
    onKeyDown(e) {
        if (!e) return;

        // Hotkey switching if not editing in an input/textarea and no modifiers pressed
        const targetTag = e.target?.tagName?.toLowerCase();
        if (
            targetTag !== 'input' &&
            targetTag !== 'textarea' &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.altKey
        ) {
            const hotkeyTool = TOOL_HOTKEYS[e.key];
            if (hotkeyTool && this.tools.has(hotkeyTool)) {
                this.setActiveTool(hotkeyTool);
                if (typeof e.preventDefault === 'function') {
                    e.preventDefault();
                }
                return;
            }
        }

        if (this.activeTool && typeof this.activeTool.onKeyDown === 'function') {
            this.activeTool.onKeyDown(e);
        }
    }
}

export default ToolManager;
