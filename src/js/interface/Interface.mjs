import { SESSION } from "../main.js";
import { BarButton, BarButtonPopout } from "./BarButton.mjs";

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
     * @param {GenericInterfaceComponent} component Component to add to the interface.
     */
    addComponent(component) {
        if (component instanceof GenericInterfaceComponent) {
            this.#componentsInternal.push(component);
            SESSION.logger.info(`Added component "${component.name}" to the interface.`, 'Interface Manager');
        } else {
            SESSION.logger.error('"component" is not an "InterfaceComponent".');
            throw new TypeError('"component" is not an "InterfaceComponent".');
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

export class GenericInterfaceComponent {
    /**
     * 
     * @param {Element} renderTarget Parent for this element to render into.
     * @param {Object} options Generic options for the element that could be used in rendering.
     */
    constructor(name, renderTarget, options) {
        this.name = name;
        this.renderTarget = renderTarget;

        if (options) {
            if (options.id) { this.id = options.id; };
            if (options.class) { this.class = options.class; };
        };
    };

    /**
     * Placeholder for rendering the component.
     */
    render() {
        SESSION.logger.error('Tried to render component without render function.', 'Interface Manager');
        throw new Error('Placeholder render function was not overwritten.');
    };
};

export class InterfaceComponent extends GenericInterfaceComponent {
    #internalElement = '';
    #internalElementType = '';

    constructor(name, renderTarget, elementType, options) {
        super(name, renderTarget, options);
        this.#internalElementType = elementType;
        this.#internalElement = document.createElement(elementType);
        this.subComponents = [];

        if (renderTarget instanceof InterfaceComponent) {
            this.renderTarget.addSubComponent(this);
        };
    };

    /**
     * HTML DOM element for this component.
     */
    get element() {
        return this.#internalElement;
    };

    /**
     * Element type of this component.
     */
    get elementType() {
        return this.#internalElementType
    };

    addSubComponent(component) {
        if (component instanceof GenericInterfaceComponent) {
            this.subComponents.push(component);
        } else {
            // ERROR
        };
    };

    /**
     * Render this component.
     */
    render() {
        const el = this.#internalElement;
        if (this.id) { el.id = this.id; };
        if (this.class) { el.classList.add(this.class); };

        if (this.renderTarget instanceof InterfaceComponent) {
            this.renderTarget.element.appendChild(el);
        } else {
            this.renderTarget.appendChild(el);
        };

        if (this.subComponents.length > 0) {
            this.subComponents.forEach(cpnt => {
                cpnt.render();
            });
        };
        SESSION.logger.info(`Rendered component ${this.name}.`, 'Interface Manager');
    };
};

export class DisplayBar extends GenericInterfaceComponent {
    #internalElement;

    /**
     * A bar, horizontal or vertical, to house different elemnents.
     * @param {Element} renderTarget Parent for this element to render into.
     * @param {string} orientation Orientation of the bar, either 'horizontal' or 'vertical'.
     * @param {Object} options Generic options for the element that could be used in rendering.
     */
    constructor(name, renderTarget, orientation, options) {
        super(name, renderTarget, options)
        this.buttons = [];
        this.orientation = orientation;
        this.#internalElement = document.createElement('div');
    };

    /**
     * Add buttons to the bar.
     * @param {BarButton} button Button to add to the bar.
     */
    addButton(button) {
        if (button instanceof BarButton) {
            this.buttons.push(button);
            SESSION.logger.info(`Added BarButton ${button.name} to DisplayBar ${this.name}.`, 'Interface Manager');
        } else {

        };
    };

    /**
     * Render the bar to the specified target.
     */
    render() {
        if (this.renderTarget instanceof Element) {
            this.#internalElement.classList.add(this.orientation);
            this.#internalElement.classList.add(this.class);
            this.renderTarget.appendChild(this.#internalElement);
            this.#internalElement.innerHTML = '';
            if (this.buttons instanceof Array) {
                this.buttons.forEach(btn => {
                    if (btn instanceof BarButton) {
                        this.#internalElement.appendChild(btn.html);
                        SESSION.logger.info(`Rendered BarButton ${btn.name}.`, 'Interface Manager');
                    } else {
                        // ERROR
                    };
                });
            } else {
                // ERROR
            };
        } else {
            // ERROR
        };
        SESSION.logger.info(`Rendered component ${this.name}.`, 'Interface Manager');
    };
};
