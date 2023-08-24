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
            let input;
            if (field.type === 'select') {
                input = document.createElement('select');
                field.attributes.forEach(opt => {
                    const option = document.createElement('option');
                    option.innerText = opt.name;
                    option.value = opt.value;
                    if (opt.selected) { option.selected = 'selected'; };
                    input.appendChild(option);
                });
            } else {
                input = document.createElement('input');
                input.type = field.type;
                field.attributes.forEach(attr => {
                    input.setAttribute(attr.type, attr.value);
                });
            }
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

class SelectField extends ModalField {
    constructor(name, options, selected, evtCallback) {
        options.forEach(opt => {
            if (opt.value === selected) { opt.selected = true };
        });
        super(name, 'select', options, 'change', evtCallback)
    };
};

class SelectFieldOption {
    constructor(name, value, selected=false) {
        this.name = name;
        this.value = value;
        this.selected = selected;
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

export class DiamondModal extends BasicModal {
    constructor(x, y, objectId) {
        const obj = SESSION.LEVEL.objects.find(({ id }) => id === objectId);

        const typeSelectOptions = [
            new SelectFieldOption('Fireboy', 0),
            new SelectFieldOption('Watergirl', 1),
            new SelectFieldOption('Silver', 2),
            new SelectFieldOption('Both', 3),
        ];
        const callback = evt => { obj.type = parseInt(evt.target.value); render({do_tiles: false, do_objects: true}, 'DiamondModal change type') };

        const typeSelect = new SelectField('Type', typeSelectOptions, obj.type, callback);

        super(x, y, objectId, [typeSelect]);
    };
};

export class GroupedObjectModal extends BasicModal {
    constructor(x, y, objectId) {
        const obj = SESSION.LEVEL.objects.find(({ id }) => id === objectId);

        const callback = evt => { obj.group = parseInt(evt.target.value); render({do_tiles: false, do_objects: true}, 'GroupedObjectModal change group')};
        const groupIdField = new NumberField('Group', 1, null, 1, obj.group, callback);

        super(x, y, objectId, [groupIdField])
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

class NumberField extends ModalField {
    constructor(name, min, max, step, value, evtCallback) {
        const attributes = []

        if (min !== null) { attributes.push(new ModalFieldAttribute('min', min)) };
        if (max !== null) { attributes.push(new ModalFieldAttribute('step', step)) };
        if (step !== null) { attributes.push(new ModalFieldAttribute('step', step)) };
        if (value !== null) { attributes.push(new ValueAttribute(value)) };

        super(name, 'number', attributes, 'change', evtCallback)
    };
}


// Attributes
class ValueAttribute extends ModalFieldAttribute {
    constructor(value) {
        super('value', value);
    };
};