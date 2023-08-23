import { SESSION } from "./session.js";
import { render } from "./Renderer.js";
import { clearHighlight } from "./highlight_renderer.js";

// Base classes
export class Modal {
    constructor(x, y, fields=[]) {
        this.x = x;
        this.y = y;
        this.fields = fields;
    };

    removeAll() {
        [...document.getElementsByClassName('modal-container')].forEach(el => el.remove());
    };

    show() {
        let html = this.html;
        document.body.appendChild(html);
    };

    showOnly() {
        this.removeAll();
        this.show();
    };

    get html() {
        const popup = document.createElement('div');
        popup.classList.add('modal-container');

        this.fields.forEach(field => {
            const container = document.createElement('div');
            container.classList.add('modal-field');
            const label = document.createElement('label');
            label.innerText = field.name;
            container.appendChild(label);
            let input = document.createElement('input');
            input.type = field.type;
            field.attributes.forEach(attr => {
                input.setAttribute(attr.type, attr.value);
            });
            input.addEventListener(field.evtType, field.evtCallback);
            container.appendChild(input);
            popup.appendChild(container);
        });

        popup.style.left = this.x + 'px';
        popup.style.top = this.y + 'px';

        return popup;
    };
};

class ModalField {
    constructor(name, type, attributes, evtType, evtCallback) {
        this.name = name;
        this.type = type;
        this.attributes = attributes;
        this.evtType = evtType;
        this.evtCallback = evtCallback;
    };
};

class ModalFieldAttribute {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    };
};


// Modals
export class BasicModal extends Modal {
    constructor(x, y, objectId, fields=[]) {
        let newFields = fields;
        newFields.push(new DeleteField(objectId));
        newFields.push(new CloseField());
        super(x, y, newFields);
    };
};


// Fields
class CloseField extends ModalField {
    constructor() {
        const CloseValueAttribute = new ValueAttribute('Close');
        const callback = evt => {
            evt.target.closest('.modal-container').remove();
        };

        super('', 'button', [CloseValueAttribute], 'click', callback);
    };
};

class DeleteField extends ModalField {
    constructor(objectId) {
        const DeleteValueAttribute = new ValueAttribute('Delete');
        const callback = _ => {
            SESSION.LEVEL.objects = SESSION.LEVEL.objects.filter(obj => obj.id !== objectId);
            Modal.prototype.removeAll();
            clearHighlight();
            render({}, 'DeleteField Popup')
        };

        super('', 'button', [DeleteValueAttribute], 'click', callback)
    };
};


// Attributes
class MinAttribute extends ModalFieldAttribute {
    constructor(value) {
        super('min', value);
    };
};

class MaxAttribute extends ModalFieldAttribute {
    constructor(value) {
        super('max', value);
    };
};

class ValueAttribute extends ModalFieldAttribute {
    constructor(value) {
        super('value', value);
    };
};