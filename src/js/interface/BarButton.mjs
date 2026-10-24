import { SESSION } from "../main.js";

export class BarButton {
    /**
     * A button in the menu and toolbar.
     * @param {string} name Name of the button.
     * @param {string} iconSrc Source location of the icon.
     * @param {string} iconTxt Text content in case of no icon.
     * @param {function} action Function when triggered
     */
    constructor(name, iconSrc, iconTxt='', action) {
        this.name = name;
        this.iconSrc = iconSrc;
        this.iconTxt = iconTxt;
        this.action = action;
    };

    /**
     * Trigger this button's functionality.
     */
    trigger() {
        if (typeof this.action == 'function') {
            this.action()
        } else {

        };
    };

    /**
     * Get the DOM element associated with this button.
     */
    get html() {
        const el = document.createElement('button');
        if (!this.iconSrc) {
            el.innerText = this.iconTxt;
        } else {
            const imgEl = document.createElement('img');
            imgEl.src = this.imgSrc;
            el.appendChild(imgEl);
        };
        return el;
    };
};

export class BarButtonPopout {
    constructor() {
        this.BarButtons = [];
    };

    open() {

    };

    close() {

    };
};
