import { SESSION } from "./main.js";
import { BarButton, BarButtonPopout } from "./interface/BarButton.mjs";

export default class Interface {
    #componentsInternal = []

    /**
     * Class responsible for creating and controlling interface.
     * @param {Element} root Root element of the application interface.
     */
    constructor(root) {
        this.root = root;
    };

    /**
     * Get all of the components in the interface.
     */
    get components() {
        return Array(this.#componentsInternal);
    };

    /**
     * 
     * @param {InterfaceComponent} component Component to add to the interface.
     */
    addComponent(component) {
        if (component instanceof InterfaceComponent) {
            this.#componentsInternal.push(component);
        } else {
            SESSION.logger.error('"component" is not an "InterfaceComponent"');
            throw new TypeError('"component" is not an "InterfaceComponent"');
        };
    };

    /**
     * Render all interfaces.
     */
    render() {
        this.#componentsInternal.forEach(cpnt => {
            cpnt.render();
        });
    };
};

export class InterfaceComponent {
    /**
     * 
     * @param {Element} renderTarget Parent for this element to render into.
     * @param {Object} options 
     */
    constructor(renderTarget, options) {
        this.renderTarget = renderTarget;

        if (options.id) { this.id = options.id; };
        if (options.class) { this.id = options.class; };
    };

    /**
     * Placeholder for rendering the component.
     */
    render() {
        SESSION.logger.error('Tried to render component without render function', 'Interface Manager');
        throw new Error('Placeholder render function was not overwritten.')
    };
};

export class DisplayBar extends InterfaceComponent {
    /**
     * A bar, horizontal or vertical, to house different elemnents.
     * @param {Element} renderTarget Parent for this element to render into.
     */
    constructor(renderTarget, options) {
        super(renderTarget, options)
        this.buttons = [];
        this.container = document.createElement('div');
    };

    /**
     * Add buttons to the bar.
     * @param {BarButton} button Button to add to the bar.
     */
    addButton(button) {
        if (button instanceof BarButton) {
            this.buttons.push(button);
        } else {

        };
    };

    /**
     * Render the bar to the specified target.
     */
    render() {
        if (this.renderTarget instanceof Element) {
            this.container.id = this.id;
            this.renderTarget.appendChild(this.container);
            this.container.innerHTML = '';
            if (this.buttons instanceof Array) {
                this.buttons.forEach(btn => {
                    if (btn instanceof BarButton) {
                        this.container.appendChild(btn.html);
                    } else {

                    };
                });
            } else {

            };
        } else {

        };
    };
};
