/**
 * MenuBar provides the top application menu
 * with pruned functional menus (File, Edit, View, Level).
 */
export class MenuBar {
    /**
     * @param {Object} [options]
     * @param {function(string): void} [options.onAction]
     */
    constructor({ onAction } = {}) {
        this.onAction = onAction || null;
        this.activeMenu = null;
        this.element = null;

        /** @type {Array<{ key: string, label: string, items: Array<{ label: string, action: string, shortcut?: string, divider?: boolean }> }>} */
        this.menus = [
            {
                key: 'File',
                label: 'File',
                items: [
                    { label: 'New Level', action: 'file:new' },
                    { label: 'Reset to Tutorial Level', action: 'file:tutorial-level' },
                    { label: 'Open Level', action: 'file:open' },
                    { label: 'Save / Export', action: 'file:save', shortcut: 'Ctrl+S' },
                    { label: 'Export to Clipboard', action: 'file:export-clipboard' },
                    { label: 'Export to Clipboard (URL-safe)', action: 'file:export-clipboard-url' }
                ]
            },
            {
                key: 'Edit',
                label: 'Edit',
                items: [
                    { label: 'Undo (future)', action: 'edit:undo', shortcut: 'Ctrl+Z' },
                    { label: 'Redo (future)', action: 'edit:redo', shortcut: 'Ctrl+Y' },
                    { divider: true },
                    { label: 'Delete', action: 'edit:delete', shortcut: 'Delete' },
                    { label: 'Select All', action: 'edit:select-all', shortcut: 'Ctrl+A' }
                ]
            },
            {
                key: 'View',
                label: 'View',
                items: [
                    { label: 'Zoom In', action: 'view:zoom-in', shortcut: 'Ctrl++' },
                    { label: 'Zoom Out', action: 'view:zoom-out', shortcut: 'Ctrl+-' },
                    { label: 'Reset View', action: 'view:reset-view', shortcut: 'Ctrl+0' }
                ]
            },
            {
                key: 'Level',
                label: 'Level',
                items: [
                    { label: 'Resize Dimensions', action: 'level:resize' }
                ]
            }
        ];

        this._onDocumentClick = this._onDocumentClick.bind(this);
    }

    /**
     * Render the menu bar element.
     * @returns {HTMLElement}
     */
    render() {
        if (this.element) {
            return this.element;
        }

        const bar = document.createElement('div');
        bar.className = 'menu-bar';

        // Logo
        const logo = document.createElement('div');
        logo.className = 'menu-logo';
        logo.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span>FBWG Editor</span>
        `;
        bar.appendChild(logo);

        // Menu items
        const menuItemsContainer = document.createElement('div');
        menuItemsContainer.className = 'menu-items';

        for (const menu of this.menus) {
            const menuEl = document.createElement('div');
            menuEl.className = 'menu-item';
            menuEl.setAttribute('data-menu', menu.key);

            const title = document.createElement('span');
            title.className = 'menu-item-title';
            title.textContent = menu.label;
            menuEl.appendChild(title);

            const dropdown = document.createElement('div');
            dropdown.className = 'menu-dropdown';
            dropdown.style.display = 'none';

            for (const item of menu.items) {
                if (item.divider) {
                    const div = document.createElement('div');
                    div.className = 'menu-divider';
                    dropdown.appendChild(div);
                    continue;
                }

                const itemEl = document.createElement('div');
                itemEl.className = 'menu-dropdown-item';
                itemEl.setAttribute('data-action', item.action);

                const labelSpan = document.createElement('span');
                labelSpan.className = 'menu-dropdown-label';
                labelSpan.textContent = item.label;
                itemEl.appendChild(labelSpan);

                if (item.shortcut) {
                    const shortcutSpan = document.createElement('span');
                    shortcutSpan.className = 'menu-dropdown-shortcut';
                    shortcutSpan.textContent = item.shortcut;
                    itemEl.appendChild(shortcutSpan);
                }

                itemEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.closeMenu();
                    this.triggerAction(item.action);
                });

                dropdown.appendChild(itemEl);
            }

            menuEl.appendChild(dropdown);

            title.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.activeMenu === menu.key) {
                    this.closeMenu();
                } else {
                    this.openMenu(menu.key);
                }
            });

            menuItemsContainer.appendChild(menuEl);
        }

        bar.appendChild(menuItemsContainer);
        this.element = bar;

        // Global click listener to close open menus
        if (typeof document !== 'undefined') {
            document.addEventListener('click', this._onDocumentClick);
        }

        return this.element;
    }

    /**
     * Open a menu dropdown by key.
     * @param {string} menuKey
     */
    openMenu(menuKey) {
        this.closeMenu();
        if (!this.element) return;

        const menuEl = this.element.querySelector(`[data-menu="${menuKey}"]`);
        if (menuEl) {
            menuEl.classList.add('open');
            const dropdown = menuEl.querySelector('.menu-dropdown');
            if (dropdown) {
                dropdown.style.display = 'block';
            }
            this.activeMenu = menuKey;
        }
    }

    /**
     * Close any currently open menu dropdown.
     */
    closeMenu() {
        if (!this.element) return;
        const openMenus = this.element.querySelectorAll('.menu-item.open');
        for (const menuEl of openMenus) {
            menuEl.classList.remove('open');
            const dropdown = menuEl.querySelector('.menu-dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        }
        this.activeMenu = null;
    }

    /**
     * Trigger an action by name and notify listeners.
     * @param {string} action
     */
    triggerAction(action) {
        if (typeof this.onAction === 'function') {
            this.onAction(action);
        }
    }

    /**
     * Handle global click to dismiss dropdowns.
     * @private
     */
    _onDocumentClick(e) {
        if (this.element && !this.element.contains(e.target)) {
            this.closeMenu();
        }
    }

    /**
     * Clean up listeners when destroying component.
     */
    destroy() {
        if (typeof document !== 'undefined') {
            document.removeEventListener('click', this._onDocumentClick);
        }
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}

export default MenuBar;
