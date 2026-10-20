/**
 * PropertiesInspector provides a live reactive inspector form for single-object
 * selection properties (coordinates, dimensions, travel dX/dY, wire group, timing).
 */
export class PropertiesInspector {
    /**
     * @param {Object} [options]
     * @param {import('../../core/SelectionManager.js').SelectionManager} [options.selectionManager]
     * @param {import('../../level/LevelModel.js').LevelModel} [options.level]
     * @param {function(string, any, Object): void} [options.onPropertyChange]
     */
    constructor({ selectionManager, level, onPropertyChange } = {}) {
        this.selectionManager = selectionManager || null;
        this.level = level || null;
        this.onPropertyChange = onPropertyChange || null;

        /** @type {import('../../level/LevelObject.js').LevelObject|null} */
        this.selectedObject = null;

        this.element = null;
        this.titleEl = null;
        this.bodyEl = null;

        if (this.selectionManager && typeof this.selectionManager.onSelectionChange === 'function') {
            this._unsubscribeSelection = this.selectionManager.onSelectionChange((obj) => {
                this.bind(obj);
            });
        }

        if (this.selectionManager?.selectedObject) {
            this.bind(this.selectionManager.selectedObject);
        }
    }

    /**
     * Bind an object to the inspector.
     * @param {import('../../level/LevelObject.js').LevelObject|null} selectedObj
     */
    bind(selectedObj) {
        this.selectedObject = selectedObj || null;
        if (this.element) {
            this._refreshContent();
        }
    }

    /**
     * Set level model reference.
     * @param {import('../../level/LevelModel.js').LevelModel|null} level
     */
    setLevel(level) {
        this.level = level;
    }

    /**
     * Update a property field on the currently selected object.
     * @param {string} prop
     * @param {any} val
     */
    updateField(prop, val) {
        if (!this.selectedObject) return;

        const obj = this.selectedObject;
        const numVal = typeof val === 'number' ? val : Number(val);
        const isNumeric = !Number.isNaN(numVal) && typeof val !== 'boolean' && val !== '';

        switch (prop) {
            case 'x':
                obj.x = isNumeric ? numVal : val;
                break;
            case 'y':
                obj.y = isNumeric ? numVal : val;
                break;
            case 'width':
                obj.width = isNumeric ? numVal : val;
                break;
            case 'height':
                obj.height = isNumeric ? numVal : val;
                break;
            case 'dX':
            case 'dx': {
                const finalDx = isNumeric ? numVal : val;
                obj.dX = finalDx;
                if (obj.properties) {
                    obj.properties.dX = finalDx;
                    obj.properties.dx = finalDx;
                }
                break;
            }
            case 'dY':
            case 'dy': {
                const finalDy = isNumeric ? numVal : val;
                obj.dY = finalDy;
                if (obj.properties) {
                    obj.properties.dY = finalDy;
                    obj.properties.dy = finalDy;
                }
                break;
            }
            case 'group': {
                const finalGroup = isNumeric ? numVal : val;
                obj.group = finalGroup;
                if (obj.properties) {
                    obj.properties.group = finalGroup;
                }
                break;
            }
            case 'rotation': {
                const finalRot = isNumeric ? numVal : val;
                obj.rotation = finalRot;
                break;
            }
            case 'text':
                if (!obj.text) obj.text = {};
                obj.text.text = String(val);
                break;
            case 'fontSize':
            case 'pixelsize': {
                const fs = isNumeric ? numVal : parseInt(val, 10);
                if (!obj.text) obj.text = {};
                obj.text.pixelsize = fs;
                break;
            }
            case 'triggerId': {
                const tid = isNumeric ? numVal : parseInt(val, 10);
                if (!obj.properties) obj.properties = {};
                obj.properties.id = tid;
                break;
            }
            default:
                if (prop in obj) {
                    obj[prop] = isNumeric ? numVal : val;
                } else if (obj.properties) {
                    obj.properties[prop] = isNumeric ? numVal : val;
                }
                break;
        }

        // Notify callback
        if (typeof this.onPropertyChange === 'function') {
            this.onPropertyChange(prop, isNumeric ? numVal : val, obj);
        }

        // Refresh selection highlight
        if (this.selectionManager && typeof this.selectionManager.refreshHighlight === 'function') {
            this.selectionManager.refreshHighlight();
        }

        // Trigger renderer re-render if available
        const renderer = this.selectionManager?.renderer;
        if (renderer && typeof renderer.render === 'function') {
            renderer.render();
        }
    }

    /**
     * Render the PropertiesInspector element.
     * @returns {HTMLElement}
     */
    render() {
        if (this.element) {
            return this.element;
        }

        const panel = document.createElement('div');
        panel.className = 'dock-panel properties-panel properties-inspector';

        // Header
        const header = document.createElement('div');
        header.className = 'dock-header';

        this.titleEl = document.createElement('span');
        this.titleEl.textContent = 'Properties';
        header.appendChild(this.titleEl);
        panel.appendChild(header);

        // Body
        this.bodyEl = document.createElement('div');
        this.bodyEl.className = 'dock-body';
        panel.appendChild(this.bodyEl);

        this.element = panel;
        this._refreshContent();

        return this.element;
    }

    /**
     * Refresh the body DOM based on current selection state.
     * @private
     */
    _refreshContent() {
        if (!this.bodyEl) return;
        this.bodyEl.innerHTML = '';

        if (!this.selectedObject) {
            if (this.titleEl) {
                this.titleEl.textContent = 'Properties';
            }
            const emptyEl = document.createElement('div');
            emptyEl.className = 'no-selection';
            emptyEl.style.color = 'var(--text-muted, #888)';
            emptyEl.style.fontSize = '11px';
            emptyEl.style.padding = '16px 0';
            emptyEl.style.textAlign = 'center';
            emptyEl.textContent = 'No selection';
            this.bodyEl.appendChild(emptyEl);
            return;
        }

        const obj = this.selectedObject;
        const isTutorial = obj.layer === 'Tutorial_keyboard' || obj.text !== undefined || obj.type === 'text' || obj.type === 'text-trigger';
        const isTextObj = obj.text !== undefined;
        const isPlatform = obj.type === 'platform';
        const hasWiring = isPlatform || obj.gid === 24 || obj.gid === 25 || obj.gid === 26 || obj.gid === 38 || obj.type === 'button' || obj.type === 'lever' || obj.properties?.group !== undefined;

        const GID_NAMES = {
            16: 'Fireboy Spawn',
            17: 'Watergirl Spawn',
            18: 'Fireboy Door',
            19: 'Watergirl Door',
            20: 'Fireboy Diamond',
            21: 'Watergirl Diamond',
            22: 'Silver Diamond',
            23: 'FBWG Diamond',
            24: 'Button',
            25: 'Lever (Left)',
            26: 'Lever (Right)',
            28: 'Box',
            36: 'Mirror Box',
            37: 'Heavy Box',
            38: 'Timed Button'
        };

        let titleName = obj.name || obj.type || (obj.gid ? GID_NAMES[obj.gid] : null) || 'Object';
        if (isTextObj) {
            titleName = 'Text Object';
        } else if (isTutorial) {
            titleName = 'Trigger Zone';
        }

        if (this.titleEl) {
            this.titleEl.textContent = `Properties (${titleName})`;
        }

        const grid = document.createElement('div');
        grid.className = 'prop-grid';

        const fields = [];

        if (isTextObj) {
            fields.push({ label: 'Text:', prop: 'text', type: 'text', value: obj.text?.text || '' });
            fields.push({ label: 'Font Size:', prop: 'fontSize', type: 'number', value: obj.text?.pixelsize || 24 });
            fields.push({ label: 'Trigger ID:', prop: 'triggerId', type: 'number', value: obj.properties?.id ?? 0 });
            fields.push({ label: 'Position X:', prop: 'x', type: 'number', value: obj.x ?? 0 });
            fields.push({ label: 'Position Y:', prop: 'y', type: 'number', value: obj.y ?? 0 });
            fields.push({ label: 'Width:', prop: 'width', type: 'number', value: obj.width ?? 0 });
            fields.push({ label: 'Height:', prop: 'height', type: 'number', value: obj.height ?? 0 });
        } else if (isTutorial) {
            fields.push({ label: 'Trigger ID:', prop: 'triggerId', type: 'number', value: obj.properties?.id ?? 0 });
            fields.push({ label: 'Position X:', prop: 'x', type: 'number', value: obj.x ?? 0 });
            fields.push({ label: 'Position Y:', prop: 'y', type: 'number', value: obj.y ?? 0 });
            fields.push({ label: 'Width:', prop: 'width', type: 'number', value: obj.width ?? 0 });
            fields.push({ label: 'Height:', prop: 'height', type: 'number', value: obj.height ?? 0 });
        } else if (isPlatform || obj.dX !== 0 || obj.dY !== 0 || obj.properties?.dx !== undefined || obj.properties?.dX !== undefined) {
            fields.push({ label: 'Position X:', prop: 'x', type: 'number', value: obj.x ?? 0 });
            fields.push({ label: 'Position Y:', prop: 'y', type: 'number', value: obj.y ?? 0 });
            fields.push({ label: 'Width:', prop: 'width', type: 'number', value: obj.width ?? 0 });
            fields.push({ label: 'Height:', prop: 'height', type: 'number', value: obj.height ?? 0 });
            fields.push({ label: 'Travel dX:', prop: 'dX', type: 'number', value: obj.dX ?? obj.properties?.dx ?? 0 });
            fields.push({ label: 'Travel dY:', prop: 'dY', type: 'number', value: obj.dY ?? obj.properties?.dy ?? 0 });
        } else {
            fields.push({ label: 'Position X:', prop: 'x', type: 'number', value: obj.x ?? 0 });
            fields.push({ label: 'Position Y:', prop: 'y', type: 'number', value: obj.y ?? 0 });
            fields.push({ label: 'Width:', prop: 'width', type: 'number', value: obj.width ?? 0 });
            fields.push({ label: 'Height:', prop: 'height', type: 'number', value: obj.height ?? 0 });
        }

        for (const field of fields) {
            const label = document.createElement('span');
            label.className = 'prop-label';
            label.textContent = field.label;
            grid.appendChild(label);

            const input = document.createElement('input');
            input.className = 'prop-input';
            input.type = field.type;
            input.dataset.prop = field.prop;
            input.value = String(field.value);

            const handleUpdate = () => {
                const val = field.type === 'number'
                    ? (input.value === '' ? 0 : Number(input.value))
                    : input.value;
                this.updateField(field.prop, val);
            };

            input.addEventListener('input', handleUpdate);
            input.addEventListener('change', handleUpdate);

            grid.appendChild(input);
        }

        // Group / Wire select field only for objects with wiring (platforms, levers, buttons, etc.)
        if (!isTutorial && hasWiring) {
            const groupLabel = document.createElement('span');
            groupLabel.className = 'prop-label';
            groupLabel.textContent = 'Group / Wire:';
            grid.appendChild(groupLabel);

            const groupSelect = document.createElement('select');
            groupSelect.className = 'prop-input';
            groupSelect.dataset.prop = 'group';

            const groupOptions = [
                { value: 0, text: 'None / Default' },
                { value: 1, text: 'Group 1 (Red)' },
                { value: 2, text: 'Group 2 (Green)' },
                { value: 3, text: 'Group 3 (Blue)' },
                { value: 4, text: 'Group 4 (Yellow)' },
                { value: 5, text: 'Group 5 (Magenta)' },
                { value: 6, text: 'Group 6 (Cyan)' },
                { value: 7, text: 'Group 7 (Violet)' },
                { value: 8, text: 'Group 8 (White)' }
            ];

            const currentGroup = obj.group ?? obj.properties?.group ?? 0;
            for (const opt of groupOptions) {
                const optEl = document.createElement('option');
                optEl.value = String(opt.value);
                optEl.textContent = opt.text;
                if (Number(currentGroup) === opt.value) {
                    optEl.selected = true;
                }
                groupSelect.appendChild(optEl);
            }

            const handleGroupChange = () => {
                const val = Number(groupSelect.value);
                this.updateField('group', val);
            };
            groupSelect.addEventListener('change', handleGroupChange);
            grid.appendChild(groupSelect);
        }

        this.bodyEl.appendChild(grid);
    }

    /**
     * Clean up listeners.
     */
    destroy() {
        if (typeof this._unsubscribeSelection === 'function') {
            this._unsubscribeSelection();
            this._unsubscribeSelection = null;
        }
    }
}

export default PropertiesInspector;
