import { SESSION } from "./session.js";
import { render } from "./Renderer.js";
import { clearHighlight, objectHighlight } from "./highlight_renderer.js";

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
        popup.dataset.constructor = this.constructor.name;

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
export class MoveModal extends Modal {
    constructor(x, y, objectId) {
        const obj = SESSION.LEVEL.objects.find(({ id }) => id === objectId);

        const fields = [];

        const xCallback = evt => { obj.x = parseInt(evt.target.value); render({do_tiles: false, do_objects: true}, 'MoveModal change x'); objectHighlight(obj, 'MoveModal change x'); };
        const yCallback = evt => { obj.y = parseInt(evt.target.value); render({do_tiles: false, do_objects: true}, 'MoveModal change y'); objectHighlight(obj, 'MoveModal change x'); };

        const xField = new NumberField('Pos X', 0, SESSION.LEVEL.width - obj.width, null, obj.x, xCallback);
        const yField = new NumberField('Pos Y', 0, SESSION.LEVEL.height, null, obj.y, yCallback);

        fields.push(xField);
        fields.push(yField);
        fields.push(new CloseField);

        console.log(obj);
        if (obj.constructor.name == "Platform") {
            SESSION.PLATFROM_PREVIEWS = true;
            render(false, true);
        };

        super(x, y, fields)
    };
};

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
        const callback = evt => { 
            SESSION.LAST_PLACED_DIAMOND = parseInt(evt.target.value);
            if (!SESSION.ALLOW_MULTIPLE_LEVELPOINTS && parseInt(evt.target.value) == 2) {
                for( let i = SESSION.LEVEL.objects.length - 1; i >= 0; i-- ) {
                    if (SESSION.LEVEL.objects[i].type == 2 && SESSION.LEVEL.objects[i].id != objectId) {
                        SESSION.LEVEL.objects.splice(i, 1);
                    };
                };
            };
            obj.type = parseInt(evt.target.value); 
            render({do_tiles: false, do_objects: true}, 'DiamondModal change type'); 
        };

        const typeSelect = new SelectField('Type', typeSelectOptions, obj.type, callback);

        super(x, y, objectId, [typeSelect]);
    };
};

export class GroupedObjectModal extends BasicModal {
    constructor(x, y, objectId, fields=[]) {
        const obj = SESSION.LEVEL.objects.find(({ id }) => id === objectId);

        const callback = evt => { obj.group = parseInt(evt.target.value); render({do_tiles: false, do_objects: true}, 'GroupedObjectModal change group')};
        const GroupIdField = new NumberField('Group', 1, null, 1, obj.group, callback);

        fields.push(GroupIdField)

        super(x, y, objectId, fields)
    };
};

export class LeverModal extends GroupedObjectModal {
    constructor(x, y, objectId) {
        const obj = SESSION.LEVEL.objects.find(({ id }) => id === objectId);

        const rotationCallback = evt => { obj.rotation = parseInt(evt.target.value); render({do_tiles: false, do_objects: true}, 'LeverModal change rotation'); };
        const RotationField = new NumberField('Rotation', 0, 360, 1, obj.rotation, rotationCallback);

        const directionCallback = evt => { obj.direction = parseInt(evt.target.value); render({do_tiles: false, do_objects: true}, 'LeverModal change direction'); };
        const directionSelectOptions = [
            new SelectFieldOption('Left', 0),
            new SelectFieldOption('Right', 1),
        ];
        const DirectionSelectField = new SelectField('Direction', directionSelectOptions, obj.direction, directionCallback);

        super(x, y, objectId, [RotationField, DirectionSelectField])
    };
};

export class PlatformModal extends GroupedObjectModal {
    constructor(x, y, objectId) {
        const obj = SESSION.LEVEL.objects.find(({ id }) => id === objectId);

        const widthCallback = evt => { obj.width = parseInt(evt.target.value); render({do_tiles: false, do_objects: true}, 'PlatformModal change width'); };
        const heightCallback = evt => { obj.height = parseInt(evt.target.value); render({do_tiles: false, do_objects: true}, 'PlatformModal change width'); };
        const dxCallback = evt => { obj.dx = parseInt(evt.target.value); render({do_tiles: false, do_objects: true}, 'PlatformModal change width'); };
        const dyCallback = evt => { obj.dy = parseInt(evt.target.value); render({do_tiles: false, do_objects: true}, 'PlatformModal change width'); };

        const WidthField = new NumberField('Width', 0, null, 32, obj.width, widthCallback);
        const HeightField = new NumberField('Height', 0, null, 32, obj.height, heightCallback);
        const DxField = new NumberField('dx', null, null, null, obj.dx, dxCallback);
        const DyField = new NumberField('dy', null, null, null, obj.dy, dyCallback);

        SESSION.PLATFROM_PREVIEWS = true;
        render(false, true);

        super(x, y, objectId, [WidthField, HeightField, DxField, DyField])
    };
};

export class RotationMirrorModal extends GroupedObjectModal {
    constructor(x, y , objectId) {
        const obj = SESSION.LEVEL.objects.find(({ id }) => id === objectId);

        const rotationCallback = evt => { obj.rotation = parseInt(evt.target.value); render({do_tiles: false, do_objects: true}, 'LeverModal change rotation'); };
        const RotationField = new NumberField('Rotation', 0, 360, 1, obj.rotation, rotationCallback);

        super(x, y, objectId, [RotationField]);
    };
};

export class BoxModal extends BasicModal {
    constructor(x, y, objectId) {
        const obj = SESSION.LEVEL.objects.find(({ id }) => id === objectId);

        const typeSelectOptions = [
            new SelectFieldOption('Normal', 'normal'),
            new SelectFieldOption('Heavy', 'heavy'),
            new SelectFieldOption('Mirror', 'mirror'),
        ];
        const callback = evt => { obj.type = evt.target.value; render({do_tiles: false, do_objects: true}, 'BoxModal change type'); };

        const typeSelect = new SelectField('Type', typeSelectOptions, obj.type, callback);

        super(x, y, objectId, [typeSelect]);
    };
};

export class LevelPointModal extends BasicModal {
    constructor(x, y, objectId) {
        const obj = SESSION.LEVEL.objects.find(({ id }) => id === objectId);

        const typeSelectOptions = [
            new SelectFieldOption('Spawn FB', 'spawn_fb'),
            new SelectFieldOption('Spawn WG', 'spawn_wg'),
            new SelectFieldOption('Door FB', 'door_fb'),
            new SelectFieldOption('Door WG', 'door_wg'),
        ];
        const callback = evt => { obj.type = evt.target.value; render({do_tiles: false, do_objects: true}, 'LevelPointModal change type'); };

        const typeSelect = new SelectField('Type', typeSelectOptions, obj.type, callback);

        super(x, y, objectId, [typeSelect]);
    };
};


// Fields
class CloseField extends ModalField {
    constructor() {
        const CloseValueAttribute = new ValueAttribute('Close');
        const callback = evt => {
            SESSION.PLATFROM_PREVIEWS = false;
            render(false, true);

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
};


// Attributes
class ValueAttribute extends ModalFieldAttribute {
    constructor(value) {
        super('value', value);
    };
};