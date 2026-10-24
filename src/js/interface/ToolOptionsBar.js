/**
 * ToolOptionsBar provides the dynamic secondary header bar under the MenuBar,
 * exposing context-sensitive controls for the active tool.
 */
export class ToolOptionsBar {
    /**
     * @param {Object} [options]
     * @param {import('../tools/ToolManager.js').ToolManager} [options.toolManager]
     */
    constructor({ toolManager } = {}) {
        this.toolManager = toolManager || null;
        this.activeTool = this.toolManager?.activeToolName || 'select';
        this.element = null;
        this.optionsContainer = null;
        this.indicatorEl = null;

        if (this.toolManager && typeof this.toolManager.onToolChange === 'function') {
            this._unsubscribe = this.toolManager.onToolChange((name) => {
                this.update(name);
            });
        }
    }

    /**
     * Render the options bar.
     * @returns {HTMLElement}
     */
    render() {
        if (this.element) {
            return this.element;
        }

        const bar = document.createElement('div');
        bar.className = 'options-bar tool-options-bar';

        const indicator = document.createElement('div');
        indicator.className = 'tool-indicator';
        bar.appendChild(indicator);
        this.indicatorEl = indicator;

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'tool-options-container';
        bar.appendChild(optionsContainer);
        this.optionsContainer = optionsContainer;

        this.element = bar;
        this.update(this.activeTool);

        return this.element;
    }

    /**
     * Update controls reactively for active tool.
     * @param {string} toolName
     */
    update(toolName) {
        this.activeTool = toolName || 'select';
        if (!this.element) return;

        // Update tool indicator
        if (this.indicatorEl) {
            this.indicatorEl.textContent = this._getToolDisplayName(this.activeTool);
        }

        if (!this.optionsContainer) return;
        this.optionsContainer.innerHTML = '';

        const snapSize = this.toolManager?.snapSize ?? 32;

        // Render tool-specific controls
        switch (this.activeTool) {
            case 'brush':
                this._renderTileOptions();
                this._renderSnapOption(snapSize);
                break;

            case 'slope':
                this._renderSlopeOptions();
                this._renderSnapOption(snapSize);
                break;

            case 'fluid':
                this._renderFluidOptions();
                this._renderSnapOption(snapSize);
                break;

            case 'eraser':
                this._renderEraserOptions();
                this._renderSnapOption(snapSize);
                break;

            case 'platform':
                this._renderGroupOption();
                this._renderSnapOption(snapSize);
                break;

            case 'box':
                this._renderBoxOptions();
                this._renderSnapOption(snapSize);
                break;

            case 'lever':
                this._renderLeverOptions();
                this._renderGroupOption();
                this._renderSnapOption(snapSize);
                break;

            case 'door':
                this._renderDoorOptions();
                this._renderSnapOption(snapSize);
                break;

            case 'gem':
                this._renderGemOptions();
                this._renderSnapOption(snapSize);
                break;

            case 'text':
                this._renderTextOptions();
                this._renderSnapOption(snapSize);
                break;

            case 'select':
            case 'pan':
            default:
                this._renderSnapOption(snapSize);
                break;
        }
    }

    /**
     * @private
     */
    _getToolDisplayName(toolName) {
        const names = {
            select: 'Select Tool',
            pan: 'Hand / Pan Tool',
            hand: 'Hand / Pan Tool',
            brush: 'Tile Brush Tool',
            slope: 'Slope Brush Tool',
            fluid: 'Fluid Brush Tool',
            eraser: 'Eraser Tool',
            platform: 'Platform Tool',
            box: 'Box / Physics Tool',
            lever: 'Button / Lever Tool',
            door: 'Spawns & Doors Tool',
            gem: 'Gem / Diamond Tool',
            text: 'Text / Trigger Tool'
        };
        return names[toolName] || `${toolName.charAt(0).toUpperCase() + toolName.slice(1)} Tool`;
    }

    /**
     * @private
     */
    _renderSnapOption(currentSnap) {
        const group = document.createElement('div');
        group.className = 'option-group';

        const label = document.createElement('span');
        label.className = 'option-label';
        label.textContent = 'Snap:';
        group.appendChild(label);

        const select = document.createElement('select');
        select.className = 'option-select snap-select';
        select.setAttribute('data-option', 'snap');

        const snapOptions = [
            { label: '32px Grid', value: '32' },
            { label: '16px Grid', value: '16' },
            { label: '8px Grid', value: '8' },
            { label: 'None', value: '0' }
        ];

        for (const opt of snapOptions) {
            const optEl = document.createElement('option');
            optEl.value = opt.value;
            optEl.textContent = opt.label;
            if (Number(opt.value) === currentSnap || (opt.value === '0' && currentSnap === 0)) {
                optEl.selected = true;
            }
            select.appendChild(optEl);
        }

        select.addEventListener('change', (e) => {
            const size = Number(e.target.value);
            if (this.toolManager && typeof this.toolManager.setSnapSize === 'function') {
                this.toolManager.setSnapSize(size);
            }
        });

        group.appendChild(select);
        this.optionsContainer.appendChild(group);
    }

    /**
     * @private
     */
    _renderTileOptions() {
        const group = document.createElement('div');
        group.className = 'option-group';

        const label = document.createElement('span');
        label.className = 'option-label';
        label.textContent = 'Tile:';
        group.appendChild(label);

        const select = document.createElement('select');
        select.className = 'option-select tile-select';
        select.setAttribute('data-option', 'tile');

        const tileOptions = [
            { label: 'Ground / Solid Block (1)', value: '1' }
        ];

        for (const opt of tileOptions) {
            const optEl = document.createElement('option');
            optEl.value = opt.value;
            optEl.textContent = opt.label;
            select.appendChild(optEl);
        }

        select.addEventListener('change', (e) => {
            const val = Number(e.target.value) || 1;
            const tool = this.toolManager?.getTool('brush');
            if (tool && typeof tool.setTileId === 'function') {
                tool.setTileId(val);
            } else if (tool) {
                tool.tileId = val;
            }
        });

        group.appendChild(select);
        this.optionsContainer.appendChild(group);
    }

    /**
     * @private
     */
    _renderSlopeOptions() {
        const group = document.createElement('div');
        group.className = 'option-group';

        const label = document.createElement('span');
        label.className = 'option-label';
        label.textContent = 'Slope:';
        group.appendChild(label);

        const select = document.createElement('select');
        select.className = 'option-select slope-select';
        select.setAttribute('data-option', 'slope');

        const slopeOptions = [
            { label: '◢ Top-Right (2)', value: '2' },
            { label: '◣ Top-Left (3)', value: '3' },
            { label: '◥ Bottom-Right (4)', value: '4' },
            { label: '◤ Bottom-Left (5)', value: '5' }
        ];

        const tool = this.toolManager?.getTool('slope');
        const currentId = tool?.tileId ?? 2;

        for (const opt of slopeOptions) {
            const optEl = document.createElement('option');
            optEl.value = opt.value;
            optEl.textContent = opt.label;
            if (Number(opt.value) === currentId) {
                optEl.selected = true;
            }
            select.appendChild(optEl);
        }

        select.addEventListener('change', (e) => {
            const val = Number(e.target.value) || 2;
            const t = this.toolManager?.getTool('slope');
            if (t && typeof t.setTileId === 'function') {
                t.setTileId(val);
            } else if (t) {
                t.tileId = val;
            }
        });

        group.appendChild(select);
        this.optionsContainer.appendChild(group);
    }

    /**
     * @private
     */
    _renderFluidOptions() {
        const group = document.createElement('div');
        group.className = 'option-group';

        const label = document.createElement('span');
        label.className = 'option-label';
        label.textContent = 'Fluid:';
        group.appendChild(label);

        const select = document.createElement('select');
        select.className = 'option-select fluid-select';
        select.setAttribute('data-option', 'fluid');

        const fluidOptions = [
            { label: 'Water (Blue, 6)', value: '6' },
            { label: 'Lava / Fire (Red, 7)', value: '7' },
            { label: 'Acid / Toxic Mud (Green, 8)', value: '8' },
            { label: 'Ice (Cyan, 15)', value: '15' }
        ];

        const tool = this.toolManager?.getTool('fluid');
        const currentId = tool?.tileId ?? 6;

        for (const opt of fluidOptions) {
            const optEl = document.createElement('option');
            optEl.value = opt.value;
            optEl.textContent = opt.label;
            if (Number(opt.value) === currentId) {
                optEl.selected = true;
            }
            select.appendChild(optEl);
        }

        select.addEventListener('change', (e) => {
            const val = Number(e.target.value) || 6;
            const t = this.toolManager?.getTool('fluid');
            if (t && typeof t.setTileId === 'function') {
                t.setTileId(val);
            } else if (t) {
                t.tileId = val;
            }
        });

        group.appendChild(select);
        this.optionsContainer.appendChild(group);
    }

    /**
     * @private
     */
    _renderEraserOptions() {
        const group = document.createElement('div');
        group.className = 'option-group';

        const label = document.createElement('span');
        label.className = 'option-label';
        label.textContent = 'Mode:';
        group.appendChild(label);

        const select = document.createElement('select');
        select.className = 'option-select mode-select';
        select.setAttribute('data-option', 'mode');

        const modeOptions = [
            { label: 'Tile Map', value: 'tiles' },
            { label: 'Objects', value: 'objects' },
            { label: 'All', value: 'all' }
        ];

        for (const opt of modeOptions) {
            const optEl = document.createElement('option');
            optEl.value = opt.value;
            optEl.textContent = opt.label;
            select.appendChild(optEl);
        }

        group.appendChild(select);
        this.optionsContainer.appendChild(group);
    }

    /**
     * @private
     */
    _renderGroupOption() {
        const group = document.createElement('div');
        group.className = 'option-group';

        const label = document.createElement('span');
        label.className = 'option-label';
        label.textContent = 'Color Group:';
        group.appendChild(label);

        const select = document.createElement('select');
        select.className = 'option-select group-select';
        select.setAttribute('data-option', 'group');

        const colors = [
            'Red (1)',
            'Green (2)',
            'Blue (3)',
            'Yellow (4)',
            'Purple (5)',
            'Cyan (6)',
            'Orange (7)',
            'White (8)'
        ];

        for (let i = 1; i <= 8; i++) {
            const optEl = document.createElement('option');
            optEl.value = String(i);
            optEl.textContent = colors[i - 1] || `Group ${i}`;
            select.appendChild(optEl);
        }

        select.addEventListener('change', (e) => {
            const grp = Number(e.target.value);
            const activeTool = this.toolManager?.activeTool;
            if (activeTool && activeTool.defaultProperties) {
                activeTool.defaultProperties.group = grp;
            }
        });

        group.appendChild(select);
        this.optionsContainer.appendChild(group);
    }

    /**
     * @private
     */
    _renderBoxOptions() {
        const group = document.createElement('div');
        group.className = 'option-group';

        const label = document.createElement('span');
        label.className = 'option-label';
        label.textContent = 'Box:';
        group.appendChild(label);

        const select = document.createElement('select');
        select.className = 'option-select box-select';
        select.setAttribute('data-option', 'box');

        const options = [
            { label: 'Normal Box (28)', value: '28' },
            { label: 'Heavy Box (37)', value: '37' },
            { label: 'Mirror Box (36)', value: '36' }
        ];

        const tool = this.toolManager?.getTool('box');
        const curGid = String(tool?.gid ?? 28);

        for (const opt of options) {
            const optEl = document.createElement('option');
            optEl.value = opt.value;
            optEl.textContent = opt.label;
            if (opt.value === curGid) optEl.selected = true;
            select.appendChild(optEl);
        }

        select.addEventListener('change', (e) => {
            const t = this.toolManager?.getTool('box');
            if (t) {
                t.gid = Number(e.target.value);
                t.objectType = '';
                t.layer = 'Objects';
                t.defaultWidth = 64;
                t.defaultHeight = 64;
                t.defaultProperties = {};
            }
        });

        group.appendChild(select);
        this.optionsContainer.appendChild(group);
    }

    /**
     * @private
     */
    _renderLeverOptions() {
        const group = document.createElement('div');
        group.className = 'option-group';

        const label = document.createElement('span');
        label.className = 'option-label';
        label.textContent = 'Mechanism:';
        group.appendChild(label);

        const select = document.createElement('select');
        select.className = 'option-select mechanism-select';
        select.setAttribute('data-option', 'mechanism');

        const options = [
            { label: 'Lever Off-Left (25)', value: '25' },
            { label: 'Lever Off-Right (26)', value: '26' },
            { label: 'Button (24)', value: '24' },
            { label: 'Timed Button (38)', value: '38' }
        ];

        const tool = this.toolManager?.getTool('lever');
        const curGid = String(tool?.gid ?? 25);

        for (const opt of options) {
            const optEl = document.createElement('option');
            optEl.value = opt.value;
            optEl.textContent = opt.label;
            if (opt.value === curGid) optEl.selected = true;
            select.appendChild(optEl);
        }

        select.addEventListener('change', (e) => {
            const t = this.toolManager?.getTool('lever');
            if (t) {
                t.gid = Number(e.target.value);
                t.objectType = '';
                t.layer = 'Objects';
                t.defaultWidth = 64;
                t.defaultHeight = 64;
            }
        });

        group.appendChild(select);
        this.optionsContainer.appendChild(group);
    }

    /**
     * @private
     */
    _renderDoorOptions() {
        const group = document.createElement('div');
        group.className = 'option-group';

        const label = document.createElement('span');
        label.className = 'option-label';
        label.textContent = 'Type:';
        group.appendChild(label);

        const select = document.createElement('select');
        select.className = 'option-select door-select';
        select.setAttribute('data-option', 'door');

        const options = [
            { label: 'Fireboy Spawn (16)', value: '16' },
            { label: 'Watergirl Spawn (17)', value: '17' },
            { label: 'Fireboy Door (18)', value: '18' },
            { label: 'Watergirl Door (19)', value: '19' }
        ];

        const tool = this.toolManager?.getTool('door');
        const curGid = String(tool?.gid ?? 16);

        for (const opt of options) {
            const optEl = document.createElement('option');
            optEl.value = opt.value;
            optEl.textContent = opt.label;
            if (opt.value === curGid) optEl.selected = true;
            select.appendChild(optEl);
        }

        select.addEventListener('change', (e) => {
            const t = this.toolManager?.getTool('door');
            if (t) {
                t.gid = Number(e.target.value);
                t.objectType = '';
                t.layer = 'Chars';
                t.defaultWidth = 64;
                t.defaultHeight = 64;
                t.defaultProperties = {};
            }
        });

        group.appendChild(select);
        this.optionsContainer.appendChild(group);
    }

    /**
     * @private
     */
    _renderGemOptions() {
        const group = document.createElement('div');
        group.className = 'option-group';

        const label = document.createElement('span');
        label.className = 'option-label';
        label.textContent = 'Gem:';
        group.appendChild(label);

        const select = document.createElement('select');
        select.className = 'option-select gem-select';
        select.setAttribute('data-option', 'gem');

        const options = [
            { label: 'Red Diamond (Fireboy, 20)', value: '20' },
            { label: 'Blue Diamond (Watergirl, 21)', value: '21' },
            { label: 'Silver Diamond (22)', value: '22' },
            { label: 'FBWG Diamond (Split, 23)', value: '23' }
        ];

        const tool = this.toolManager?.getTool('gem');
        const curGid = String(tool?.gid ?? 20);

        for (const opt of options) {
            const optEl = document.createElement('option');
            optEl.value = opt.value;
            optEl.textContent = opt.label;
            if (opt.value === curGid) optEl.selected = true;
            select.appendChild(optEl);
        }

        select.addEventListener('change', (e) => {
            const t = this.toolManager?.getTool('gem');
            if (t) {
                t.gid = Number(e.target.value);
                t.objectType = '';
                t.layer = 'Chars';
                t.defaultWidth = 64;
                t.defaultHeight = 64;
                t.defaultProperties = {};
            }
        });

        group.appendChild(select);
        this.optionsContainer.appendChild(group);
    }

    /**
     * @private
     */
    _renderTextOptions() {
        const tool = this.toolManager?.getTool('text');
        const currentMode = tool?.mode || 'text';

        // 1. Type (Text Object vs Trigger Zone)
        const typeGroup = document.createElement('div');
        typeGroup.className = 'option-group';
        const typeLabel = document.createElement('span');
        typeLabel.className = 'option-label';
        typeLabel.textContent = 'Type:';
        typeGroup.appendChild(typeLabel);

        const typeSelect = document.createElement('select');
        typeSelect.className = 'option-select text-type-select';
        typeSelect.setAttribute('data-option', 'text-type');
        typeSelect.innerHTML = `
            <option value="text"${currentMode === 'text' ? ' selected' : ''}>Text Object</option>
            <option value="trigger"${currentMode === 'trigger' ? ' selected' : ''}>Trigger Zone</option>
        `;

        typeSelect.addEventListener('change', (e) => {
            const nextMode = e.target.value;
            if (tool) {
                tool.mode = nextMode;
            }
            this.update('text');
        });

        typeGroup.appendChild(typeSelect);
        this.optionsContainer.appendChild(typeGroup);

        // 2. If Text Object: Content Input & Font Size
        if (currentMode === 'text') {
            const contentGroup = document.createElement('div');
            contentGroup.className = 'option-group';
            const contentLabel = document.createElement('span');
            contentLabel.className = 'option-label';
            contentLabel.textContent = 'Text:';
            contentGroup.appendChild(contentLabel);

            const contentInput = document.createElement('input');
            contentInput.type = 'text';
            contentInput.className = 'option-input text-content-input';
            contentInput.setAttribute('data-option', 'text-content');
            contentInput.value = tool?.textContent || 'Tutorial Text';
            contentInput.addEventListener('input', (e) => {
                if (tool) tool.textContent = e.target.value;
            });
            contentGroup.appendChild(contentInput);
            this.optionsContainer.appendChild(contentGroup);

            const fontSizeGroup = document.createElement('div');
            fontSizeGroup.className = 'option-group';
            const fontLabel = document.createElement('span');
            fontLabel.className = 'option-label';
            fontLabel.textContent = 'Size:';
            fontSizeGroup.appendChild(fontLabel);

            const fontSizeSelect = document.createElement('select');
            fontSizeSelect.className = 'option-select font-size-select';
            fontSizeSelect.setAttribute('data-option', 'font-size');
            const fontSizes = [16, 20, 24, 32];
            const curSize = tool?.fontSize || 24;
            for (const s of fontSizes) {
                const opt = document.createElement('option');
                opt.value = s;
                opt.textContent = `${s}px`;
                if (s === curSize) opt.selected = true;
                fontSizeSelect.appendChild(opt);
            }
            fontSizeSelect.addEventListener('change', (e) => {
                if (tool) tool.fontSize = parseInt(e.target.value, 10);
            });
            fontSizeGroup.appendChild(fontSizeSelect);
            this.optionsContainer.appendChild(fontSizeGroup);
        } else {
            // Trigger Zone Width & Height
            const wGroup = document.createElement('div');
            wGroup.className = 'option-group';
            const wLabel = document.createElement('span');
            wLabel.className = 'option-label';
            wLabel.textContent = 'W:';
            wGroup.appendChild(wLabel);
            const wInput = document.createElement('input');
            wInput.type = 'number';
            wInput.className = 'option-input';
            wInput.setAttribute('data-option', 'trigger-width');
            wInput.value = tool?.triggerWidth || 128;
            wInput.style.width = '48px';
            wInput.addEventListener('input', (e) => {
                const v = parseInt(e.target.value, 10);
                if (tool && !Number.isNaN(v)) tool.triggerWidth = v;
            });
            wGroup.appendChild(wInput);
            this.optionsContainer.appendChild(wGroup);

            const hGroup = document.createElement('div');
            hGroup.className = 'option-group';
            const hLabel = document.createElement('span');
            hLabel.className = 'option-label';
            hLabel.textContent = 'H:';
            hGroup.appendChild(hLabel);
            const hInput = document.createElement('input');
            hInput.type = 'number';
            hInput.className = 'option-input';
            hInput.setAttribute('data-option', 'trigger-height');
            hInput.value = tool?.triggerHeight || 64;
            hInput.style.width = '48px';
            hInput.addEventListener('input', (e) => {
                const v = parseInt(e.target.value, 10);
                if (tool && !Number.isNaN(v)) tool.triggerHeight = v;
            });
            hGroup.appendChild(hInput);
            this.optionsContainer.appendChild(hGroup);
        }

        // 3. Trigger ID (applies to both text object and trigger zone)
        const idGroup = document.createElement('div');
        idGroup.className = 'option-group';
        const idLabel = document.createElement('span');
        idLabel.className = 'option-label';
        idLabel.textContent = 'Trigger ID:';
        idGroup.appendChild(idLabel);

        const idInput = document.createElement('input');
        idInput.type = 'number';
        idInput.className = 'option-input';
        idInput.setAttribute('data-option', 'trigger-id');
        idInput.value = tool?.triggerId ?? 0;
        idInput.style.width = '48px';
        idInput.addEventListener('input', (e) => {
            const v = parseInt(e.target.value, 10);
            if (tool && !Number.isNaN(v)) tool.triggerId = v;
        });
        idGroup.appendChild(idInput);
        this.optionsContainer.appendChild(idGroup);
    }

    /**
     * Clean up listeners.
     */
    destroy() {
        if (typeof this._unsubscribe === 'function') {
            this._unsubscribe();
        }
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}

export default ToolOptionsBar;
