/**
 * ToolRail provides a vertical icon rail for tool selection.
 */
export class ToolRail {
    /**
     * @param {Object} [options]
     * @param {import('../tools/ToolManager.js').ToolManager} [options.toolManager]
     */
    constructor({ toolManager } = {}) {
        this.toolManager = toolManager || null;
        this.activeTool = this.toolManager?.activeToolName || 'select';
        this.element = null;

        this.tools = [
            {
                id: 'select',
                title: 'Move / Select (V)',
                shortcut: 'V',
                icon: '<svg viewBox="0 0 24 24"><path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2 1-3.2-7.4L7 18.5V2z"/></svg>'
            },
            {
                id: 'pan',
                title: 'Hand / Pan (H)',
                shortcut: 'H',
                icon: '<svg viewBox="0 0 24 24"><path d="M10 2a2 2 0 00-2 2v8H7a2 2 0 00-2 2v2l4 7a2 2 0 001.7 1h6.6a2 2 0 002-1.6l1.3-6.4a2 2 0 00-2-2.4h-1V4a2 2 0 00-2-2h-1a2 2 0 00-2 2v6h-1V4a2 2 0 00-2-2h-1z"/></svg>'
            },
            { type: 'divider' },
            {
                id: 'brush',
                title: 'Tile Brush (B)',
                shortcut: 'B',
                icon: '<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>'
            },
            {
                id: 'slope',
                title: 'Slope Brush (S)',
                shortcut: 'S',
                icon: '<svg viewBox="0 0 24 24"><polygon points="3,21 21,21 21,3" fill="currentColor"/></svg>'
            },
            {
                id: 'fluid',
                title: 'Fluid Brush (F)',
                shortcut: 'F',
                icon: '<svg viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>'
            },
            {
                id: 'eraser',
                title: 'Eraser (E)',
                shortcut: 'E',
                icon: '<svg viewBox="0 0 24 24"><path d="M15.14 3c-.51 0-1.02.2-1.41.59L2.59 14.73c-.78.78-.78 2.05 0 2.83L6.44 21.4c.39.39.9.59 1.41.59H20v-2h-9.59l8.14-8.14c.78-.78.78-2.05 0-2.83l-4-4c-.39-.39-.9-.6-1.41-.6z"/></svg>'
            },
            { type: 'divider' },
            {
                id: 'platform',
                title: 'Platform Tool (P)',
                shortcut: 'P',
                icon: '<svg viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="6" rx="2"/></svg>'
            },
            {
                id: 'box',
                title: 'Box / Physics Object (O)',
                shortcut: 'O',
                icon: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
            },
            {
                id: 'lever',
                title: 'Button / Lever (L)',
                shortcut: 'L',
                icon: '<svg viewBox="0 0 24 24"><path d="M12 2a5 5 0 00-5 5c0 2 1.3 3.8 3.2 4.6L7 21h10l-3.2-9.4C15.7 10.8 17 9 17 7a5 5 0 00-5-5z"/></svg>'
            },
            { type: 'divider' },
            {
                id: 'door',
                title: 'Spawns & Doors (D)',
                shortcut: 'D',
                icon: '<svg viewBox="0 0 24 24"><path d="M19 19V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14H3v2h18v-2h-2zm-4-7a1 1 0 110-2 1 1 0 010 2z"/></svg>'
            },
            {
                id: 'gem',
                title: 'Diamond Tool (G)',
                shortcut: 'G',
                icon: '<svg viewBox="0 0 24 24"><path d="M12 2L4 9l8 13 8-13-8-7z"/></svg>'
            },
            { type: 'divider' },
            {
                id: 'text',
                title: 'Text / Trigger (T)',
                shortcut: 'T',
                icon: '<svg viewBox="0 0 24 24"><path d="M5 4v3h5.5v12h3V7H19V4H5z"/></svg>'
            }
        ];

        if (this.toolManager && typeof this.toolManager.onToolChange === 'function') {
            this._unsubscribe = this.toolManager.onToolChange((name) => {
                this.updateActiveTool(name);
            });
        }
    }

    /**
     * Render the tool rail.
     * @returns {HTMLElement}
     */
    render() {
        if (this.element) {
            return this.element;
        }

        const rail = document.createElement('div');
        rail.className = 'tool-rail toolbar';

        for (const item of this.tools) {
            if (item.type === 'divider') {
                const divider = document.createElement('div');
                divider.className = 'toolbar-divider';
                rail.appendChild(divider);
                continue;
            }

            const btn = document.createElement('button');
            btn.className = `tool-btn${this._matchesActive(item.id) ? ' active' : ''}`;
            btn.setAttribute('data-tool', item.id);
            btn.setAttribute('title', item.title);
            btn.innerHTML = item.icon;

            btn.addEventListener('click', () => {
                if (this.toolManager && typeof this.toolManager.setActiveTool === 'function') {
                    this.toolManager.setActiveTool(item.id);
                }
                this.updateActiveTool(item.id);
            });

            rail.appendChild(btn);
        }

        this.element = rail;
        return this.element;
    }

    /**
     * Update active tool highlight.
     * @param {string} name
     */
    updateActiveTool(name) {
        this.activeTool = name;
        if (!this.element) return;

        const buttons = this.element.querySelectorAll('.tool-btn');
        for (const btn of buttons) {
            const toolId = btn.getAttribute('data-tool');
            if (this._matchesActive(toolId)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    }

    /**
     * Check if a tool ID matches current active tool.
     * @private
     * @param {string} toolId
     * @returns {boolean}
     */
    _matchesActive(toolId) {
        if (toolId === this.activeTool) return true;
        if (toolId === 'pan' && this.activeTool === 'hand') return true;
        if (toolId === 'hand' && this.activeTool === 'pan') return true;
        return false;
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

export default ToolRail;
