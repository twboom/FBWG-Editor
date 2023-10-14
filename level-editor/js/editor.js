import { render } from "./Renderer.js";
import { highlightCanvas, highlightCtx, resizeCanvas } from "./canvas.js";
import { BLOCK_COLOR, BLOCK_SIZE } from "./lookup.js";
import { SESSION } from "./session.js";
import * as Objects from './Object.js';
import { clearHighlight, objectHighlight } from "./highlight_renderer.js";
import { BasicModal, BoxModal, CoverModal, DiamondModal, GroupedObjectModal, LevelPointModal, LeverModal, MoveModal, PlatformModal, RotationMirrorModal , TextFieldModal, TextTriggerModal} from "./modal.js";
import { exportTEXT, exportJSON } from "./export.js";

function mouseIntersectsObject(object, text =  0) {
    const mouseX = SESSION.MOUSE_POS_X;
    const mouseY = SESSION.MOUSE_POS_Y;
    let posX = object.x;
    let posY = object.y;
    let width = object.width;
    let height = object.height;
    if (object instanceof Objects.Platform) {
        width = object.width;
        height = object.height;
        posY = posY + height;
    };

    if (((text == 2) && object.constructor.name == 'TextTrigger') || ((text == 1) && object.constructor.name == 'TextField')) {
        if (
            (mouseX > posX) &&
            (mouseX < posX + width) &&
            (mouseY > posY) &&
            (mouseY < posY + height)
        ) { return true } else { return false };
    };

    if ((text == 0) &&
        ((mouseX > posX) &&
        (mouseX < posX + width) &&
        (mouseY < posY) &&
        (mouseY > posY - height))
    ) { return true } else { return false };
};

function getModal(object) {
    switch(object.constructor.name) {
        case 'Diamond': return DiamondModal;
        case 'RotationMirror':
        case 'RotationBoxMirror': return RotationMirrorModal;
        case 'Lever': return LeverModal;
        case 'Platform': return PlatformModal;
        case 'TimerButton':
        case 'Button': return GroupedObjectModal;
        case 'Box': return BoxModal;
        case 'LevelPoints': return LevelPointModal;
        case 'TextField': return TextFieldModal;
        case 'TextTrigger': return TextTriggerModal;
        case 'Cover': return CoverModal;
        default: return BasicModal;
    };
};

function handleEdit(evt, text = 0) {
    const objects = text != 0 ? SESSION.LEVEL.text : SESSION.LEVEL.objects;
    const int = objects.find((obj) => mouseIntersectsObject(obj, text));
    if (int) {
        console.log(int);
        objectHighlight(int, 'handleEdit');
        const CorrectModal = getModal(int);
        const popup = new CorrectModal(int.x, int.y, int.id);
        popup.showOnly();
    } else {
        SESSION.SELECTED_OBJECT_ID = undefined;
        clearHighlight();
    };
};

function handleMove(evt, text = 0) {
    let obj = text != 0 ? SESSION.LEVEL.text.find(({ id}) => id === SESSION.SELECTED_OBJECT_ID) : SESSION.LEVEL.objects.find(({ id }) => id === SESSION.SELECTED_OBJECT_ID);
    if (!obj) { return };
    let newX = SESSION.MOUSE_POS_X + SESSION.MOVE_HANDLE_OFFSET_X;
    let newY = SESSION.MOUSE_POS_Y + SESSION.MOVE_HANDLE_OFFSET_Y;
    if (SESSION.SNAP_X > 0) {
        newX = Math.round((newX / SESSION.SNAP_X)) * SESSION.SNAP_X;
    };
    if (SESSION.SNAP_Y > 0) {
        newY = Math.round((newY / SESSION.SNAP_Y)) * SESSION.SNAP_Y;
    };
    obj.x = newX;
    obj.y = newY;
    objectHighlight(obj, 'handleMove');
};

export function initEditor(){
    highlightCanvas.addEventListener('click', evt => {
        switch(SESSION.SELECTED_TOOL_TYPE) {
            case 'tiles':
                // set tiles
                let mousex = evt.offsetX;
                let mousey = evt.offsetY;
                let tileX = Math.floor(mousex / BLOCK_SIZE);
                let tileY = Math.floor(mousey / BLOCK_SIZE);
                let tile;
                switch(SESSION.SELECTED_TYLE_TYPE) {
                    case 'air':
                        tile = 0
                        break;
                    case 'block':
                        tile = 1
                        break;
                    case 'slopeTR':
                        tile = 2
                        break;
                    case 'slopeTL':
                        tile = 3
                        break;
                    case 'slopeBR':
                        tile = 4
                        break;
                    case 'slopeBL':
                        tile = 5
                        break;
                    case 'water':
                        tile = 6
                        break;
                    case 'lava':
                        tile = 7
                        break;
                    case 'acid':
                        tile = 8
                        break;
                    case 'ice':
                        tile = 15
                        break;
                };
                SESSION.LEVEL.tiles[tileY][tileX] = tile;
                render({do_tiles: true, do_objects: false, do_text: false}, 'click')
                break;
            case 'objects':
                // set objects
                let mouseX = evt.offsetX;
                let mouseY = evt.offsetY;            
                switch(SESSION.SELECTED_OBJECT_TYPE) {
                    case 'diamond':
                        if (!SESSION.ALLOW_MULTIPLE_LEVELPOINTS && SESSION.LAST_PLACED_DIAMOND == 2) {
                            for (let i = SESSION.LEVEL.objects.length -  1; i >= 0; i-- ) {
                                if (SESSION.LEVEL.objects[i].type == 2) {
                                    SESSION.LEVEL.objects.splice(i, 1);
                                };
                            };
                        };  
                        new Objects.Diamond(mouseX, mouseY, 0, SESSION.LAST_PLACED_DIAMOND);
                        break;
                    case 'spawns' :
                        if (!SESSION.ALLOW_MULTIPLE_LEVELPOINTS) {
                            for (let i = SESSION.LEVEL.objects.length - 1; i >= 0 ; i-- ) {
                                if (SESSION.LEVEL.objects[i].constructor.name == 'LevelPoints' && SESSION.LEVEL.objects[i].type == (SESSION.LAST_PLACED_SPAWN == 0 ? 'spawnFB' : 'spawnWG')) {
                                    SESSION.LEVEL.objects.splice(i, 1);
                                };
                            };
                        };
                        new Objects.LevelPoints(mouseX, mouseY, 0, SESSION.LAST_PLACED_SPAWN == 0 ? 'spawnFB' : 'spawnWG');
                        break;
                    case 'doors' :
                        if (!SESSION.ALLOW_MULTIPLE_LEVELPOINTS) {
                            for (let i = SESSION.LEVEL.objects.length - 1; i >= 0 ; i-- ) {
                                if (SESSION.LEVEL.objects[i].constructor.name == 'LevelPoints' && SESSION.LEVEL.objects[i].type == (SESSION.LAST_PLACED_SPAWN == 0 ? 'doorFB' : 'doorWG')) {
                                    SESSION.LEVEL.objects.splice(i, 1);
                                };
                            };
                        };
                        new Objects.LevelPoints(mouseX, mouseY, 0, SESSION.LAST_PLACED_SPAWN == 0 ? 'doorFB' : 'doorWG');
                        break;
                    case 'button':
                        new Objects.Button(mouseX, mouseY, 0, 1);
                        break;
                    case 'timer_button':
                        new Objects.TimerButton(mouseX, mouseY, 0, 1, 100);
                        break;
                    case 'lever':
                        new Objects.Lever(mouseX, mouseY, 0, 1, 1);
                        break;
                    case 'platform':
                        new Objects.Platform(mouseX, mouseY, 0, 3*BLOCK_SIZE, BLOCK_SIZE, 1, 0, 3);
                        break;
                    case 'box_normal':
                        new Objects.Box(mouseX, mouseY, 0, 'normal');
                        break;
                    case 'ball':
                        new Objects.Ball(mouseX, mouseY, 0);
                        break;
                    case 'rotation_mirror':
                        new Objects.RotationMirror(mouseX, mouseY, 0, 1);
                        break;
                    case 'rotation_boxmirror':
                        new Objects.RotationBoxMirror(mouseX, mouseY, 0, 1);
                        break;
                    case 'hanger': // Idk man
                        new Objects.Hanger();
                        break;
                    case 'slider': // Idk
                        new Objects.Slider();
                        break;
                    case 'light_emitter': // Idk
                        new Objects.LightEmitter();
                        break;
                    case 'light_receiver': // Idk
                        new Objects.LightReceiver();
                        break;
                    case 'portal': // Idk
                        new Objects.Portal();
                        break;
                    case 'fan': // Idk, but i'm a huge fan
                        new Objects.Fan();
                        break;
                    case 'window':
                        new Objects.Window(mouseX, mouseY, BLOCK_SIZE, BLOCK_SIZE);
                        break;
                    case 'cover':
                        new Objects.Cover(mouseX, mouseY, BLOCK_SIZE, BLOCK_SIZE);
                        break;
                    case 'edit':
                        console.log("edeting");
                        handleEdit(evt);
                        break;
                };
                if (!['edit', 'move'].includes(SESSION.SELECTED_OBJECT_TYPE)) {
                    render({do_tiles: false, do_objects: true, do_text: false}, 'click')
                };
                break;
            case 'text':
                let mouse_x = evt.offsetX;
                let mouse_y = evt.offsetY;
                let texts = SESSION.LEVEL.text;
                switch (SESSION.SELECTED_TEXT_TYPE){
                    case 'text':
                        let textobject = new Objects.TextObject(false, 'Trajan Pro', 'centre', 24, 'Placeholder Text', true)
                        new Objects.TextField(mouse_x, mouse_y, 320, 32, 0, 0, textobject);
                        break;
                    case 'edit-text':
                        handleEdit(evt, 1);
                        break;
                    // case 'move-text':
                    //     let text__ = texts.find((obj) => mouseIntersectsObject(obj, 1));
                    //     if (text__) {
                    //         SESSION.SELECTED_OBJECT_ID = text__.id;
                    //         handleMove(evt, 1);
                    //     };
                    //     break;
                    case 'delete-text':
                        let text = texts.find((obj) => mouseIntersectsObject(obj, 1));
                        if (text) { SESSION.LEVEL.text = SESSION.LEVEL.text.filter(obj => obj.id !== text.id);};
                        break;
                    case 'text-trigger':
                        new Objects.TextTrigger(mouse_x, mouse_y, 320, 64, 0, 0);
                        break;
                    case 'edit-text-trigger':
                        handleEdit(evt, 2);
                        break;
                    // case 'move-text-trigger':
                    //     let text___ = texts.find((obj) => mouseIntersectsObject(obj, 2));
                    //     if (text_) { 
                    //         SESSION.SELECTED_OBJECT_ID = text___.id;
                    //         handleMove(evt, 2);
                    //     };
                        break;
                    case 'delete-text-trigger':
                        let text_ = texts.find((obj) => mouseIntersectsObject(obj, 2));
                        if (text_) { 
                            SESSION.LEVEL.text = SESSION.LEVEL.text.filter(obj => obj.id !== text_.id);
                        };
                        break;
                };
                render({do_tiles: false, do_objects: false, do_text: true}, 'text edit');
        };
    });

    // Add the eventlistener for right click
    highlightCanvas.addEventListener('contextmenu', evt => {
        if (SESSION.SELECTED_TOOL_TYPE == 'tiles') {
            SESSION.LEVEL.tiles[Math.floor(evt.offsetY / BLOCK_SIZE)][Math.floor(evt.offsetX / BLOCK_SIZE)] = 0
            render({do_tiles: true, do_objects: false, do_text: false}, 'contextmenu')
        };
    });

    // Add the eventlistener for dragging
    highlightCanvas.addEventListener('mousemove', evt => {
        SESSION.MOUSE_POS_X = evt.offsetX;
        SESSION.MOUSE_POS_Y = evt.offsetY;
        let tileX = Math.floor(evt.offsetX / BLOCK_SIZE);
        let tileY = Math.floor(evt.offsetY / BLOCK_SIZE);

        if ((SESSION.MOUSE_DOWN || SESSION.RIGHT_MOUSE_DOWN) && SESSION.SELECTED_TOOL_TYPE == 'tiles') {
            if (SESSION.RIGHT_MOUSE_DOWN) {
                SESSION.LEVEL.tiles[tileY][tileX] = 0;
            } else {
                let tile
                switch(SESSION.SELECTED_TYLE_TYPE) {
                    case 'air':
                        tile = 0;
                        break;
                    case 'block':
                        tile = 1;
                        break;
                    case 'slopeTR':
                        tile = 2;
                        break;
                    case 'slopeTL':
                        tile = 3;
                        break;
                    case 'slopeBR':
                        tile = 4;
                        break;
                    case 'slopeBL':
                        tile = 5;
                        break;
                    case 'water':
                        tile = 6;
                        break;
                    case 'lava':
                        tile = 7;
                        break;
                    case 'acid':
                        tile = 8;
                        break;
                    case 'ice':
                        console.log('ice');
                        tile = 15;
                };
                SESSION.LEVEL.tiles[tileY][tileX] = tile;
            };
        };
        if (SESSION.MOUSE_DOWN && SESSION.SELECTED_TOOL_TYPE === 'objects' && SESSION.SELECTED_OBJECT_TYPE === 'move') {
            handleMove(evt);
        };
        if (SESSION.MOUSE_DOWN && SESSION.SELECTED_TOOL_TYPE === 'text' && SESSION.SELECTED_TEXT_TYPE === 'move-text') {
            handleMove(evt, 1);
        };
        if (SESSION.MOUSE_DOWN && SESSION.SELECTED_TOOL_TYPE === 'text' && SESSION.SELECTED_TEXT_TYPE === 'move-text-trigger') {
            handleMove(evt, 2);
        };

        if (SESSION.SELECTED_TOOL_TYPE === 'objects' && ['edit', 'move'].includes(SESSION.SELECTED_OBJECT_TYPE)) {
            const objects = SESSION.LEVEL.objects;
            const int = objects.find((objet) => mouseIntersectsObject(objet));
            if (int) {
                objectHighlight(int, 'mousemove highlight');
            } else {
                clearHighlight();
            };
        };

        if (SESSION.SELECTED_TOOL_TYPE === 'text' && ['edit-text', 'move-text', 'edit-text-trigger', 'move-text-trigger'].includes(SESSION.SELECTED_TEXT_TYPE)) {
            console.log('edeting or moving text', SESSION.SELECTED_TEXT_TYPE);
            const objects = SESSION.LEVEL.text;
            const txt = (SESSION.SELECTED_TEXT_TYPE == 'edit-text' || SESSION.SELECTED_TEXT_TYPE == 'move-text') ? 1 : 2;
            const int = objects.find((objet) => mouseIntersectsObject(objet, txt));
            if (int) {
                console.log(int);
                objectHighlight(int, 'mousemove highlight');
            } else {
                clearHighlight();
            };
        };
    });

    // Add the eventlistener for pressing your mouse
    highlightCanvas.addEventListener('mousedown', evt => {
        SESSION.SELECTED_OBJECT_ID = undefined;
        clearHighlight();
        if (evt.button == 0) { SESSION.MOUSE_DOWN = true; } 
        else if (evt.button == 2) { 
            SESSION.RIGHT_MOUSE_DOWN = true;
        };
        if (SESSION.SELECTED_TOOL_TYPE === 'tiles') {
            SESSION.DO_RENDER = true;
            render({do_tiles: true, do_objects: false, do_text: false}, 'mousedown tiles')
        };
        if (SESSION.SELECTED_TOOL_TYPE === 'objects') {
            if (SESSION.SELECTED_OBJECT_TYPE === 'move') {
                const objects = SESSION.LEVEL.objects;
                const int = objects.find((obj) => mouseIntersectsObject(obj));
                if (int) {
                    console.log(int);
                    SESSION.SELECTED_OBJECT_ID = int.id;
                    SESSION.MOVE_HANDLE_OFFSET_X = int.x - evt.offsetX;
                    SESSION.MOVE_HANDLE_OFFSET_Y = int.y - evt.offsetY;
                    objectHighlight(int, 'mousedown objects move');
                    SESSION.DO_RENDER = true;
                    render({do_tiles: false, do_objects: true, do_text: false}, 'mousedown objects move');
                } else {
                    SESSION.SELECTED_OBJECT_ID = undefined;
                    clearHighlight();
                };
            };
        };
        if (SESSION.SELECTED_TOOL_TYPE === 'text') {
            if (SESSION.SELECTED_TEXT_TYPE === 'move-text') {
                const texts = SESSION.LEVEL.text;
                const txt = texts.find((text) => mouseIntersectsObject(text, 1));
                if (txt) {
                    SESSION.SELECTED_OBJECT_ID = txt.id;
                    SESSION.MOVE_HANDLE_OFFSET_X = txt.x - evt.offsetX;
                    SESSION.MOVE_HANDLE_OFFSET_Y = txt.y - evt.offsetY;
                    objectHighlight(txt, 'mousedown objects move');
                    SESSION.DO_RENDER = true;
                    render({do_tiles: false, do_objects: false, do_text: true}, 'mousedown text move');
                };
            } else if (SESSION.SELECTED_TEXT_TYPE === 'move-text-trigger') {
                const texts = SESSION.LEVEL.text;
                const txt = texts.find((text) => mouseIntersectsObject(text, 2));
                if (txt) {
                    SESSION.SELECTED_OBJECT_ID = txt.id;
                    SESSION.MOVE_HANDLE_OFFSET_X = txt.x - evt.offsetX;
                    SESSION.MOVE_HANDLE_OFFSET_Y = txt.y - evt.offsetY;
                    objectHighlight(txt, 'mousedown objects move');
                    SESSION.DO_RENDER = true;
                    render({do_tiles: false, do_objects: false, do_text: true}, 'mousedown text move');
                };
            };
        };

        if (document.getElementsByClassName('modal-container')) {
            [...document.getElementsByClassName('modal-container')].forEach(el => { el.remove(); });
            if (!(document.getElementById('previews').classList.contains('active'))) {
                SESSION.PLATFROM_PREVIEWS = false;
                render({do_tiles: false, do_objects: true, do_text: false});
            };
        };
    });

    // Add the eventlistener for releasing your mouse
    highlightCanvas.addEventListener('mouseup', evt => {
        if (SESSION.SELECTED_TOOL_TYPE === 'objects' && SESSION.SELECTED_OBJECT_TYPE === 'move') {
            const objects = SESSION.LEVEL.objects;
            const int = objects.find(mouseIntersectsObject);
            if (int) {
                const popup = new MoveModal(int.x, int.y, int.id);
                popup.showOnly();
            };
        };

        if (SESSION.SELECTED_TOOL_TYPE === 'text' && SESSION.SELECTED_OBJECT_TYPE === 'move-text') {
            const objects = SESSION.LEVEL.objects;
            const int = objects.find(mouseIntersectsObject);
            if (int) {
                const popup = new MoveModal(int.x, int.y, int.id);
                popup.showOnly();
            };
        };

        SESSION.MOUSE_DOWN = false;
        SESSION.RIGHT_MOUSE_DOWN = false;
        SESSION.DO_RENDER = false;
    });


    // Add the resize function
    document.getElementById('resize').addEventListener('click', _ => {
        // Confirm the action
        if (!confirm('This action may result in a loss of content.\nAnything outside the new level border will be removed. This action is irreversible.')) {
            alert('Resizing is cancelled!')
            return
        };

        // Get the width and heigth
        SESSION.LEVEL.width = parseInt(document.getElementById('level-width').value);
        SESSION.LEVEL.height = parseInt(document.getElementById('level-height').value);

        // Re-render the canvas
        resizeCanvas();
        render({do_tiles: true, do_objects: true, do_text: true}, 'resize')
    });

    // Add the eventlistener for the editor settings
    Array.from(document.getElementsByClassName('editor-option')).forEach(el => {
        el.addEventListener('click', _ => {
            if (el.dataset.action == 'multispawn') {
                if (SESSION.ALLOW_MULTIPLE_LEVELPOINTS) {
                    SESSION.ALLOW_MULTIPLE_LEVELPOINTS = false;
                    el.classList.remove('active');
                } else {
                    SESSION.ALLOW_MULTIPLE_LEVELPOINTS = true;
                    el.classList.add('active');
                };
            };
            if (el.dataset.action == 'previews') {
                if (el.classList.contains('active')) {
                    SESSION.PLATFROM_PREVIEWS = false;
                    el.classList.remove('active');
                } else {
                    SESSION.PLATFROM_PREVIEWS = true;
                    el.classList.add('active');
                };
                render({do_tiles: false, do_objects: true, do_text: false});
            };
            if (el.dataset.action == 'wind-previews') {
                if (SESSION.WIND_PREVEIWS) {
                    SESSION.WIND_PREVEIWS = false;
                    el.classList.remove('active');
                } else {
                    SESSION.WIND_PREVEIWS = true;
                    el.classList.add('active');
                };
                render({do_tiles: false, do_objects: true, do_text: false});
            };
            if (el.dataset.action == 'cover-previews') {
                if(SESSION.COVER_PREVIEWS) {
                    SESSION.COVER_PREVIEWS = false;
                    el.classList.remove('active');
                } else {
                    SESSION.COVER_PREVIEWS = true;
                    el.classList.add('active');
                };
                render({do_tiles: false, do_objects: true, do_text: false});
            };
        });
    });

    // Add the eventlistener for the editor functions
    Array.from(document.getElementsByClassName('editor-function')).forEach(el => {
        el.addEventListener('click', _ => {
            // Remove enabled from all editor functions
            Array.from(document.getElementsByClassName('editor-function')).forEach(button => {
                button.classList.remove('enabled');
            });
            // Hide all tile buttons
            Array.from(document.getElementsByClassName('tiles')).forEach(div => {
                div.style.display = 'none';
            });
            SESSION.SELECTED_TYLE_TYPE = null;
            // Hide all object buttons
            Array.from(document.getElementsByClassName('objects')).forEach(div => {
                div.style.display = 'none';
            });
            // Hide all text buttons
            Array.from(document.getElementsByClassName('texts')).forEach(div => {
                div.style.display = 'none';
            });
            // Disable all buttons
            Array.from(document.getElementsByClassName('tool')).forEach(btn => {
                btn.classList.remove('selected');
            });
            SESSION.SELECTED_TYLE_TYPE = undefined;
            SESSION.SELECTED_OBJECT_TYPE = undefined;
            SESSION.SELECTED_TOOL_TYPE = undefined;
            // If we press the button twice
            if (el.dataset.action == SESSION.EDITOR_FUNCTION) {
                // Set the current function to null
                SESSION.EDITOR_FUNCTION = 'all';
                Array.from(document.getElementsByClassName('editor-function')).forEach(btn => {
                    if (btn.dataset.action == 'view-all') {
                        btn.classList.add('enabled');
                    };
                });
            // If we press another button
            } else {
                // Set the editor function
                SESSION.EDITOR_FUNCTION = el.dataset.action;
                el.classList.add('enabled');
                let type;
                switch (el.dataset.action){
                    case 'tile-editor':
                        type = 'tiles';
                        break;
                    case 'object-editor':
                        type = 'objects';
                        break;
                    case 'text-editor':
                        type = 'texts';
                        break;
                    case 'view-all':
                        SESSION.EDITOR_FUNCTION = 'all';
                        render({do_tiles: true, do_objects: true, do_text: true}, 'Editor view all');
                        return;
                    };
                // Show the correct buttons
                Array.from(document.getElementsByClassName(type)).forEach(div => {
                    div.style.display = 'flex';
                });
            };
            // Re-render the level
            render({do_tiles: true, do_objects: true, do_text: true}, 'Editor function change');
        });
    });

    // Add the eventlistener for the tile buttons
    Array.from(document.getElementsByClassName('tile-option')).forEach(el => {
        el.addEventListener('click', _ => {
            // Deselect other selected buttons
            Array.from(document.getElementsByClassName('tool')).forEach(btn => {
                btn.classList.remove('selected');
            });

            // Check if the button is pressed twice
            if (SESSION.SELECTED_TYLE_TYPE == el.dataset.action) {
                SESSION.SELECTED_TOOL_TYPE = undefined;
                SESSION.SELECTED_TYLE_TYPE = undefined;
            } else {
                el.classList.add('selected');
                SESSION.SELECTED_TOOL_TYPE = 'tiles';
                SESSION.SELECTED_TYLE_TYPE = el.dataset.action;
            };
        });
    });

    // Add the evenlistener for the object buttons
    Array.from(document.getElementsByClassName('obje-option')).forEach(el => {
        el.addEventListener('click', _ => {
            // Deselect other selected buttons
            Array.from(document.getElementsByClassName('tool')).forEach(btn => {
                btn.classList.remove('selected');
            });

            // Check if the button is pressed twice
            if (SESSION.SELECTED_OBJECT_TYPE ==  el.dataset.action) {
                SESSION.SELECTED_TOOL_TYPE = undefined; 
                SESSION.SELECTED_OBJECT_TYPE = undefined;
            } else {
                el.classList.add('selected');
                SESSION.SELECTED_TOOL_TYPE = 'objects';
                SESSION.SELECTED_OBJECT_TYPE = el.dataset.action;
            };
        });
    });

    // Add the eventlistener for the export buttons
    Array.from(document.getElementsByClassName('export')).forEach(el => {
        el.addEventListener('click', _ => {
            if (el.id == "save") {
                alert("This function does not exist yet");
            } else if (el.id == "share") {
                alert("This function does not exist yet");
            } else if (el.id == "export") {
                exportJSON();
            } else if (el.id == "export-text") {
                exportTEXT();
            };
        });
    });

    // Add the eventlistener for the text buttons
    Array.from(document.getElementsByClassName('text-option')).forEach(el => {
        el.addEventListener('click', _ => {
            // Deselect other selected buttons
            Array.from(document.getElementsByClassName('tool')).forEach(btn => {
                btn.classList.remove('selected');
            });

            // Check if the button is pressed twice
            if (SESSION.SELECTED_TEXT_TYPE ==  el.dataset.action) {
                SESSION.SELECTED_TEXT_TYPE = undefined; 
                SESSION.SELECTED_OBJECT_TYPE = undefined;
            } else {
                el.classList.add('selected');
                SESSION.SELECTED_TOOL_TYPE = 'text';
                SESSION.SELECTED_TEXT_TYPE = el.dataset.action;
            };
        });
    });


    // Snap
    document.getElementById('snap-x').value = SESSION.SNAP_X;
    document.getElementById('snap-x').addEventListener('change', evt => {
        SESSION.SNAP_X = parseInt(evt.target.value);
    });
    document.getElementById('snap-y').value = SESSION.SNAP_Y;
    document.getElementById('snap-y').addEventListener('change', evt => {
        SESSION.SNAP_Y = parseInt(evt.target.value);
    });
};