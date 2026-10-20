import { LevelModel } from './level/LevelModel.js';
import { parseLevelJSON, serializeLevelToJSON } from './level/serializer.js';
import { Camera } from './renderer/Camera.js';
import { CanvasRenderer } from './renderer/CanvasRenderer.js';
import { SelectionManager } from './core/SelectionManager.js';
import { ToolManager } from './tools/ToolManager.js';
import { MenuBar } from './interface/MenuBar.js';
import { ToolRail } from './interface/ToolRail.js';
import { ToolOptionsBar } from './interface/ToolOptionsBar.js';
import { StatusBar } from './interface/StatusBar.js';
import { DockPanel } from './interface/dock/DockPanel.js';
import { LayersPanel } from './interface/dock/LayersPanel.js';
import { PropertiesInspector } from './interface/dock/PropertiesInspector.js';
import { LevelResizeModal } from './interface/dialogs/LevelResizeModal.js';

/**
 * EditorApp is the root application coordinator assembling the UI layout,
 * subsystems (Renderer, Tools, Dock, Status, Menu), file I/O, and keyboard shortcuts.
 */
export class EditorApp {
    /**
     * @param {HTMLElement} containerElement
     * @param {Object} [options]
     * @param {LevelModel} [options.level]
     */
    constructor(containerElement, options = {}) {
        if (!containerElement) {
            throw new Error('EditorApp requires a container element');
        }
        this.container = containerElement;
        this.options = options;

        this.level = options.level || null;
        this.camera = new Camera();
        this.selectionManager = new SelectionManager();
        this.toolManager = new ToolManager({
            camera: this.camera,
            selectionManager: this.selectionManager
        });

        // UI components
        this.menuBar = null;
        this.toolOptionsBar = null;
        this.toolRail = null;
        this.layersPanel = null;
        this.propertiesInspector = null;
        this.dockPanel = null;
        this.statusBar = null;
        this.renderer = null;

        // DOM elements
        this.workspaceEl = null;
        this.viewportEl = null;
        this.canvasContainerEl = null;
        this.canvasHeaderEl = null;
        this.canvasContentEl = null;
        this.fileInputEl = null;

        // Navigation state
        this.isSpacePressed = false;
        this._isPanning = false;
        this._panStartX = 0;
        this._panStartY = 0;

        // Bind event handlers for cleanup
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onWheel = this._onWheel.bind(this);
        this._onCanvasPointerDown = this._onCanvasPointerDown.bind(this);
        this._onCanvasPointerMove = this._onCanvasPointerMove.bind(this);
        this._onWindowPointerMove = this._onWindowPointerMove.bind(this);
        this._onCanvasPointerUp = this._onCanvasPointerUp.bind(this);
        this._onWindowPointerUp = this._onWindowPointerUp.bind(this);
        this._onCanvasPointerLeave = this._onCanvasPointerLeave.bind(this);
    }

    /**
     * Bootstrap the application and mount UI regions.
     * @returns {Promise<EditorApp>}
     */
    async init() {
        this._buildDOM();

        // Attach global window listeners
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', this._onKeyDown);
            window.addEventListener('keyup', this._onKeyUp);
            window.addEventListener('pointermove', this._onWindowPointerMove);
            window.addEventListener('pointerup', this._onWindowPointerUp);
        }

        // Initial level bootstrap
        if (this.options.level) {
            this.loadLevel(this.options.level);
        } else {
            try {
                const res = await fetch('./data/example_level.json');
                if (res.ok) {
                    const json = await res.json();
                    this.loadLevel(json);
                } else {
                    const blankRes = await fetch('./blank_level.json');
                    if (blankRes.ok) {
                        const json = await blankRes.json();
                        this.loadLevel(json);
                    } else {
                        this.loadLevel(new LevelModel(20, 15));
                    }
                }
            } catch {
                this.loadLevel(new LevelModel(20, 15));
            }
        }

        return this;
    }

    /**
     * Build and mount the UI structure.
     * @private
     */
    _buildDOM() {
        this.container.innerHTML = '';

        // 1. Top MenuBar
        this.menuBar = new MenuBar({
            onAction: (action) => this.handleMenuAction(action)
        });
        this.container.appendChild(this.menuBar.render());

        // 2. Secondary dynamic ToolOptionsBar
        this.toolOptionsBar = new ToolOptionsBar({
            toolManager: this.toolManager
        });
        this.container.appendChild(this.toolOptionsBar.render());

        // 3. Main Workspace (3-column layout)
        this.workspaceEl = document.createElement('div');
        this.workspaceEl.className = 'workspace';
        this.container.appendChild(this.workspaceEl);

        // 4. Left ToolRail (Icon strip)
        this.toolRail = new ToolRail({
            toolManager: this.toolManager
        });
        this.workspaceEl.appendChild(this.toolRail.render());

        // 5. Center Viewport Area (header stuck to top + scrollable viewport)
        this.centerAreaEl = document.createElement('div');
        this.centerAreaEl.className = 'center-area';
        this.workspaceEl.appendChild(this.centerAreaEl);

        this.canvasHeaderEl = document.createElement('div');
        this.canvasHeaderEl.className = 'canvas-header';
        this.centerAreaEl.appendChild(this.canvasHeaderEl);

        this.viewportEl = document.createElement('div');
        this.viewportEl.className = 'viewport';
        this.centerAreaEl.appendChild(this.viewportEl);

        this.canvasContainerEl = document.createElement('div');
        this.canvasContainerEl.className = 'canvas-container';
        this.viewportEl.appendChild(this.canvasContainerEl);

        this.canvasContentEl = document.createElement('div');
        this.canvasContentEl.className = 'canvas-content';
        this.canvasContainerEl.appendChild(this.canvasContentEl);

        this._updateCanvasHeader();

        // Canvas interactions
        this.canvasContentEl.addEventListener('pointerdown', this._onCanvasPointerDown);
        this.canvasContentEl.addEventListener('pointermove', this._onCanvasPointerMove);
        this.canvasContentEl.addEventListener('pointerup', this._onCanvasPointerUp);
        this.canvasContentEl.addEventListener('pointerleave', this._onCanvasPointerLeave);
        this.canvasContentEl.addEventListener('wheel', this._onWheel, { passive: false });

        this.viewportEl.addEventListener('pointerdown', (e) => {
            const isPan = this.isSpacePressed || this.toolManager?.activeToolName === 'pan';
            if (isPan && (e.target === this.viewportEl || e.target === this.canvasContainerEl)) {
                this._onCanvasPointerDown(e);
            }
        });

        // Renderer (pinContent: true so canvas drawings stay pinned to canvas top-left)
        this.renderer = new CanvasRenderer({
            container: this.canvasContentEl,
            camera: this.camera,
            level: this.level,
            width: 640,
            height: 480,
            pinContent: true
        });
        this._updateCanvasDimensions();
        this._updateCanvasPosition();
        this.selectionManager.setRenderer(this.renderer);
        this.toolManager.setRenderer(this.renderer);
        this.toolManager.viewport = this.viewportEl;
        this.toolManager.canvasContainer = this.canvasContainerEl;

        this.toolManager.onToolChange((toolName) => {
            const isPan = toolName === 'pan';
            const cursor = isPan ? 'grab' : '';
            if (this.canvasContentEl) {
                this.canvasContentEl.style.cursor = cursor;
            }
            if (this.viewportEl) {
                this.viewportEl.style.cursor = cursor;
            }
        });

        // 6. Right Dock (Layers + Properties)
        this.layersPanel = new LayersPanel({
            renderer: this.renderer,
            level: this.level,
            selectionManager: this.selectionManager
        });

        this.propertiesInspector = new PropertiesInspector({
            selectionManager: this.selectionManager,
            level: this.level,
            onPropertyChange: () => {
                if (this.renderer) this.renderer.render();
                if (this.layersPanel) this.layersPanel.update();
            }
        });

        this.dockPanel = new DockPanel({
            layersPanel: this.layersPanel,
            propertiesInspector: this.propertiesInspector
        });
        this.workspaceEl.appendChild(this.dockPanel.render());

        // 7. Bottom StatusBar
        this.statusBar = new StatusBar({
            camera: this.camera,
            selectionManager: this.selectionManager,
            level: this.level
        });
        this.container.appendChild(this.statusBar.render());

        // Hidden file input for file:open dialog
        this.fileInputEl = document.createElement('input');
        this.fileInputEl.type = 'file';
        this.fileInputEl.accept = '.json,application/json';
        this.fileInputEl.style.display = 'none';
        this.fileInputEl.addEventListener('change', (e) => this._onFileInputChange(e));
        this.container.appendChild(this.fileInputEl);
    }

    /**
     * Load and bind a LevelModel or canonical JSON into the editor.
     * @param {LevelModel|Object|string} levelOrJSON
     */
    loadLevel(levelOrJSON) {
        let model;
        if (levelOrJSON instanceof LevelModel) {
            model = levelOrJSON;
        } else if (typeof levelOrJSON === 'string' || (typeof levelOrJSON === 'object' && levelOrJSON !== null)) {
            model = parseLevelJSON(levelOrJSON);
        } else {
            throw new Error('Invalid level data provided to loadLevel');
        }

        // Ensure level has editable dimensions (e.g. empty blank_level template)
        if (model.width <= 0 || model.height <= 0) {
            model.resize(20, 15);
        }

        this.level = model;
        this.selectionManager.level = model;
        this.selectionManager.deselect();

        this.toolManager.level = model;
        for (const tool of this.toolManager.tools.values()) {
            tool.level = model;
        }

        if (this.renderer) {
            this.renderer.level = model;
            this._updateCanvasDimensions();
            this.renderer.render();
        }

        if (this.layersPanel) {
            this.layersPanel.setLevel(model);
        }
        if (this.propertiesInspector) {
            this.propertiesInspector.setLevel(model);
        }
        if (this.statusBar) {
            this.statusBar.setLevel(model);
        }

        this._updateCanvasHeader();
    }

    /**
     * Update visual dimensions of canvas container, canvas content, background grid, and renderer.
     * @private
     */
    _updateCanvasDimensions() {
        const baseW = this.level ? (this.level.width * (this.level.tilewidth || 32)) : 640;
        const baseH = this.level ? (this.level.height * (this.level.tileheight || 32)) : 480;
        const scale = this.camera ? this.camera.scale : 1.0;

        const scaledW = Math.round(baseW * scale);
        const scaledH = Math.round(baseH * scale);
        const gridSize = Math.round(32 * scale);

        if (this.canvasContainerEl) {
            this.canvasContainerEl.style.width = `${scaledW}px`;
            this.canvasContainerEl.style.height = `${scaledH}px`;
        }
        if (this.canvasContentEl) {
            this.canvasContentEl.style.width = `${scaledW}px`;
            this.canvasContentEl.style.height = `${scaledH}px`;
            this.canvasContentEl.style.backgroundSize = `${gridSize}px ${gridSize}px`;
        }
        if (this.renderer) {
            this.renderer.resize(scaledW, scaledH);
        }
    }

    /**
     * Update transform position of canvas container based on camera pan.
     * @private
     */
    _updateCanvasPosition() {
        if (this.canvasContainerEl) {
            const x = this.camera ? this.camera.x : 0;
            const y = this.camera ? this.camera.y : 0;
            this.canvasContainerEl.style.transform = `translate(${x}px, ${y}px)`;
        }
    }

    /**
     * Update the canvas header title and zoom info.
     * @private
     */
    _updateCanvasHeader() {
        if (!this.canvasHeaderEl) return;
        const w = this.level ? this.level.width : 0;
        const h = this.level ? this.level.height : 0;
        const pw = this.level ? (this.level.width * (this.level.tilewidth || 32)) : 0;
        const ph = this.level ? (this.level.height * (this.level.tileheight || 32)) : 0;
        const zoom = this.statusBar ? this.statusBar.getZoomPercentage() : '100%';

        this.canvasHeaderEl.innerHTML = `
            <span>Level (${w}×${h} tiles, ${pw}×${ph} px)</span>
            <span>${zoom}</span>
        `;
    }

    /**
     * Create a new blank level template.
     */
    newLevel() {
        const model = new LevelModel(20, 15);
        this.resetView();
        this.loadLevel(model);
    }

    /**
     * Reload/spawn the canonical tutorial level data.
     * @returns {Promise<LevelModel|null>}
     */
    async loadTutorialLevel() {
        try {
            const res = await fetch('./data/example_level.json');
            if (res.ok) {
                const json = await res.json();
                this.openedFileName = 'example_level.json';
                this.resetView();
                this.loadLevel(json);
                this.statusBar?.showMessage?.('Loaded tutorial level');
                return this.level;
            }
        } catch {
            // fetch failed
        }
        return null;
    }

    /**
     * Open the browser file dialog to open a JSON level.
     */
    openLevelFile() {
        if (this.fileInputEl) {
            this.fileInputEl.value = '';
            this.fileInputEl.click();
        }
    }

    /**
     * Read an opened File instance as JSON level.
     * @param {File} file
     * @returns {Promise<LevelModel>}
     */
    async openFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    this.currentFileName = file.name || 'level.json';
                    this.loadLevel(text);
                    this.statusBar?.showMessage?.(`Loaded ${this.currentFileName}`);
                    resolve(this.level);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = (err) => reject(err);
            reader.readAsText(file);
        });
    }

    /**
     * Handle file input change event.
     * @private
     */
    _onFileInputChange(e) {
        const file = e.target.files?.[0];
        if (file) {
            this.openFile(file);
        }
    }

    /**
     * Serialize current level to canonical Tiled JSON and trigger download.
     * @returns {Object|null}
     */
    saveLevel() {
        if (!this.level) return null;
        const serialized = serializeLevelToJSON(this.level);
        const jsonStr = JSON.stringify(serialized, null, 2);
        const downloadName = this.currentFileName || 'level.json';

        if (typeof document !== 'undefined') {
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = downloadName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.statusBar?.showMessage?.(`Saved ${downloadName}`);
        }

        return serialized;
    }

    /**
     * Export canonical level JSON string to clipboard.
     * @returns {Promise<string>}
     */
    async exportToClipboard() {
        if (!this.level) return '';
        const serialized = serializeLevelToJSON(this.level);
        const jsonStr = JSON.stringify(serialized, null, 2);

        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(jsonStr);
        }

        this.statusBar?.showMessage?.('Level copied to clipboard!');
        return jsonStr;
    }

    /**
     * Export URL-safe encoded level JSON string to clipboard (no whitespace/newlines, encoded).
     * @returns {Promise<string>}
     */
    async exportToClipboardUrlSafe() {
        if (!this.level) return '';
        const serialized = serializeLevelToJSON(this.level);
        const jsonStr = JSON.stringify(serialized);
        const urlSafeStr = encodeURIComponent(jsonStr);

        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(urlSafeStr);
        }

        this.statusBar?.showMessage?.('URL-safe level copied to clipboard!');
        return urlSafeStr;
    }

    /**
     * Delete currently selected object if not locked.
     */
    deleteSelected() {
        const selected = this.selectionManager?.selectedObject;
        if (!selected || !this.level) return;

        const layerName = selected.layer || 'Objects';
        if (this.renderer?.isLayerLocked(layerName)) {
            return;
        }

        if (selected.id !== undefined && selected.id !== null) {
            this.level.removeObject(selected.id);
        } else {
            this.level.removeObject(selected);
        }

        this.selectionManager.deselect();
        if (this.renderer) this.renderer.render();
        if (this.layersPanel) this.layersPanel.update();
        if (this.statusBar) this.statusBar.update();
    }

    /**
     * Zoom in viewport around center.
     */
    zoomIn() {
        const nextScale = this.camera.scale * 1.2;
        this.camera.scale = Math.min(Math.max(nextScale, this.camera.minScale), this.camera.maxScale);

        this._updateCanvasDimensions();
        this._updateCanvasPosition();

        if (this.renderer) this.renderer.render();
        this.selectionManager.refreshHighlight();
        if (this.statusBar) this.statusBar.update();
        this._updateCanvasHeader();
    }

    /**
     * Zoom out viewport around center.
     */
    zoomOut() {
        const nextScale = this.camera.scale / 1.2;
        this.camera.scale = Math.min(Math.max(nextScale, this.camera.minScale), this.camera.maxScale);

        this._updateCanvasDimensions();
        this._updateCanvasPosition();

        if (this.renderer) this.renderer.render();
        this.selectionManager.refreshHighlight();
        if (this.statusBar) this.statusBar.update();
        this._updateCanvasHeader();
    }

    /**
     * Reset camera view to 100% scale and (0, 0) origin.
     */
    resetView() {
        this.camera.x = 0;
        this.camera.y = 0;
        this.camera.scale = 1.0;
        this._updateCanvasDimensions();
        this._updateCanvasPosition();
        if (this.viewportEl) {
            this.viewportEl.scrollLeft = 0;
            this.viewportEl.scrollTop = 0;
        }
        if (this.renderer) this.renderer.render();
        this.selectionManager.refreshHighlight();
        if (this.statusBar) this.statusBar.update();
        this._updateCanvasHeader();
    }

    /**
     * Dispatch MenuBar actions to handlers.
     * @param {string} action
     */
    handleMenuAction(action) {
        switch (action) {
            case 'file:new':
                this.newLevel();
                break;
            case 'file:tutorial-level':
                this.loadTutorialLevel();
                break;
            case 'file:open':
                this.openLevelFile();
                break;
            case 'file:save':
            case 'file:export':
                this.saveLevel();
                break;
            case 'file:export-clipboard':
                this.exportToClipboard();
                break;
            case 'file:export-clipboard-url':
                this.exportToClipboardUrlSafe();
                break;
            case 'edit:delete':
                this.deleteSelected();
                break;
            case 'edit:undo':
            case 'edit:redo':
            case 'edit:select-all':
                break;
            case 'view:zoom-in':
                this.zoomIn();
                break;
            case 'view:zoom-out':
                this.zoomOut();
                break;
            case 'view:reset-view':
                this.resetView();
                break;
            case 'view:toggle-grid': {
                const curSnap = this.toolManager.snapSize;
                this.toolManager.setSnapSize(curSnap === 0 ? 32 : 0);
                this.toolOptionsBar?.update(this.toolManager.activeToolName);
                break;
            }
            case 'level:resize': {
                if (!this.level) break;
                const modal = new LevelResizeModal({
                    currentWidth: this.level.width,
                    currentHeight: this.level.height,
                    onConfirm: (newW, newH) => {
                        this.level.resize(newW, newH);
                        this.loadLevel(this.level);
                        this.statusBar?.showMessage?.(`Resized level to ${newW}×${newH}`);
                    }
                });
                document.body.appendChild(modal.render());
                break;
            }
            default:
                break;
        }
    }

    /**
     * Keyboard down routing: shortcuts and navigation.
     * @private
     */
    _onKeyDown(e) {
        const targetTag = e.target?.tagName?.toLowerCase();
        if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
            return;
        }

        // Space key: activate pan navigation mode
        if (e.code === 'Space' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (!this.isSpacePressed) {
                this.isSpacePressed = true;
                if (this.canvasContentEl) {
                    this.canvasContentEl.style.cursor = 'grab';
                }
            }
            e.preventDefault();
            return;
        }

        // Modifiers: Ctrl or Cmd
        if (e.ctrlKey || e.metaKey) {
            const key = e.key.toLowerCase();
            if (key === 's') {
                e.preventDefault();
                this.saveLevel();
                return;
            }
            if (key === 'o') {
                e.preventDefault();
                this.openLevelFile();
                return;
            }
            if (e.key === '0') {
                e.preventDefault();
                this.resetView();
                return;
            }
            if (e.key === '=' || e.key === '+') {
                e.preventDefault();
                this.zoomIn();
                return;
            }
            if (e.key === '-') {
                e.preventDefault();
                this.zoomOut();
                return;
            }
        }

        // Delete / Backspace
        if (e.key === 'Delete' || e.key === 'Backspace') {
            this.deleteSelected();
            e.preventDefault();
            return;
        }

        // Forward to ToolManager for single-key tool switching and tool events
        this.toolManager.onKeyDown(e);
    }

    /**
     * Keyboard up routing.
     * @private
     */
    _onKeyUp(e) {
        if (e.code === 'Space') {
            this.isSpacePressed = false;
            if (this.canvasContentEl) {
                this.canvasContentEl.style.cursor = '';
            }
        }
    }

    /**
     * Pointer down on canvas content.
     * @private
     */
    _onCanvasPointerDown(e) {
        if (e.button === 1 || this.isSpacePressed || this.toolManager?.activeToolName === 'pan') {
            this._isPanning = true;
            this._panStartX = e.clientX;
            this._panStartY = e.clientY;
            if (this.canvasContentEl) {
                this.canvasContentEl.style.cursor = 'grabbing';
            }
            if (this.viewportEl) {
                this.viewportEl.style.cursor = 'grabbing';
            }
            this.toolManager.onPointerDown(e);
            e.preventDefault();
            return;
        }

        // Check boundary: clicks outside the canvasContentEl are ignored for non-pan tools
        if (this.canvasContentEl) {
            const rect = this.canvasContentEl.getBoundingClientRect();
            if (
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom
            ) {
                return;
            }
        }

        this.toolManager.onPointerDown(e);
        if (this.statusBar) this.statusBar.update();
        this._updateCanvasHeader();
    }

    /**
     * @private
     */
    _onCanvasPointerMove(e) {
        e._handledByEditorCanvas = true;
        this._processPointerMove(e, true);
    }

    /**
     * @private
     */
    _onWindowPointerMove(e) {
        if (e._handledByEditorCanvas) return;
        this._processPointerMove(e, false);
    }

    /**
     * @private
     */
    _processPointerMove(e, isOverCanvas) {
        if (this._isPanning) {
            const dx = e.clientX - this._panStartX;
            const dy = e.clientY - this._panStartY;
            this._panStartX = e.clientX;
            this._panStartY = e.clientY;

            this.camera.pan(dx, dy);
            this._updateCanvasPosition();
            if (this.statusBar) this.statusBar.update();
            this._updateCanvasHeader();
            return;
        }

        if (this.canvasContentEl) {
            const rect = this.canvasContentEl.getBoundingClientRect();
            const inside = isOverCanvas || (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            );
            if (inside) {
                const canvasX = e.clientX - rect.left;
                const canvasY = e.clientY - rect.top;
                const scale = this.camera ? this.camera.scale : 1.0;
                const worldX = canvasX / scale;
                const worldY = canvasY / scale;
                if (this.statusBar) this.statusBar.setCursor(worldX, worldY);
            }
        }

        this.toolManager.onPointerMove(e);
    }

    /**
     * @private
     */
    _onCanvasPointerUp(e) {
        e._handledByEditorCanvas = true;
        this._processPointerUp(e);
    }

    /**
     * @private
     */
    _onWindowPointerUp(e) {
        if (e._handledByEditorCanvas) return;
        this._processPointerUp(e);
    }

    /**
     * @private
     */
    _processPointerUp(e) {
        if (this._isPanning) {
            this._isPanning = false;
            const isPan = this.isSpacePressed || this.toolManager?.activeToolName === 'pan';
            const cursor = isPan ? 'grab' : '';
            if (this.canvasContentEl) {
                this.canvasContentEl.style.cursor = cursor;
            }
            if (this.viewportEl) {
                this.viewportEl.style.cursor = cursor;
            }
            this.toolManager.onPointerUp(e);
            return;
        }

        this.toolManager.onPointerUp(e);
        if (this.statusBar) this.statusBar.update();
        this._updateCanvasHeader();
    }

    /**
     * @private
     */
    _onCanvasPointerLeave() {
        if (this.statusBar) this.statusBar.setCursor(null, null);
    }

    /**
     * Wheel event: pointer-centered zoom invariant.
     * @private
     */
    _onWheel(e) {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.15 : (1 / 1.15);
        const nextScale = this.camera.scale * factor;
        this.camera.scale = Math.min(Math.max(nextScale, this.camera.minScale), this.camera.maxScale);

        this._updateCanvasDimensions();
        this._updateCanvasPosition();

        if (this.renderer) this.renderer.render();
        this.selectionManager.refreshHighlight();
        if (this.statusBar) this.statusBar.update();
        this._updateCanvasHeader();
    }

    /**
     * Clean up event listeners and child components.
     */
    destroy() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('keydown', this._onKeyDown);
            window.removeEventListener('keyup', this._onKeyUp);
            window.removeEventListener('pointermove', this._onWindowPointerMove);
            window.removeEventListener('pointerup', this._onWindowPointerUp);
        }

        if (this.canvasContentEl) {
            this.canvasContentEl.removeEventListener('pointerdown', this._onCanvasPointerDown);
            this.canvasContentEl.removeEventListener('pointermove', this._onCanvasPointerMove);
            this.canvasContentEl.removeEventListener('pointerup', this._onCanvasPointerUp);
            this.canvasContentEl.removeEventListener('pointerleave', this._onCanvasPointerLeave);
            this.canvasContentEl.removeEventListener('wheel', this._onWheel);
        }

        if (this.menuBar) this.menuBar.destroy();
        if (this.toolOptionsBar) this.toolOptionsBar.destroy();
        if (this.toolRail) this.toolRail.destroy();
        if (this.dockPanel) this.dockPanel.destroy();
        if (this.propertiesInspector) this.propertiesInspector.destroy();
        if (this.layersPanel) this.layersPanel.destroy();
        if (this.statusBar) this.statusBar.destroy();

        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

export default EditorApp;
