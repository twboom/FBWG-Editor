import { render } from "./Renderer.js";
import { highlightCanvas, highlightCtx, resizeCanvas } from "./canvas.js";
import { BLOCK_COLOR, BLOCK_SIZE } from "./lookup.js";
import { SESSION } from "./session.js";
import * as Objects from './Object.js';
import { clearHighlight, objectHighlight } from "./highlight_renderer.js";
import { BasicModal, BoxModal, DiamondModal, GroupedObjectModal, LeverModal, MoveModal, PlatformModal, RotationMirrorModal } from "./modal.js";
import { exportTEXT, exportJSON } from "./export.js";

function mouseIntersectsObject(object) {
    const mouseX = SESSION.MOUSE_POS_X;
    const mouseY = SESSION.MOUSE_POS_Y;
    let posX = object.x;
    let posY = object.y;
    let width = 64;
    let height = 64;
    if (object instanceof Objects.Platform) {
        width = object.width;
        height = object.height;
        posY = posY + height;
    };

    if (
        (mouseX > posX) &&
        (mouseX < posX + width) &&
        (mouseY < posY) &&
        (mouseY > posY - height)
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
        default: return BasicModal;
    };
};

function handleEdit(evt) {
    const objects = SESSION.LEVEL.objects;
    const int = objects.find(mouseIntersectsObject);
    if (int) {
        objectHighlight(int, 'handleEdit');
        const CorrectModal = getModal(int);
        const popup = new CorrectModal(int.x, int.y, int.id);
        popup.showOnly();
    } else {
        SESSION.SELECTED_OBJECT_ID = undefined;
        clearHighlight();
    };
};

function handleMove(evt) {
    let obj = SESSION.LEVEL.objects.find(({ id }) => id === SESSION.SELECTED_OBJECT_ID);
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
                render({do_tiles: true, do_objects: false}, 'click')
                break;
            case 'objects':
                // set objects
                const mouseX = evt.offsetX;
                const mouseY = evt.offsetY             
                switch(SESSION.SELECTED_OBJECT_TYPE) {
                    case 'diamond':
                        new Objects.Diamond(mouseX, mouseY, 0, 0);
                        break;
                    case 'spawnFB' :
                        if (!SESSION.ALLOW_MULTIPLE_LEVELPOINTS) {
                            for (let i = SESSION.LEVEL.objects.length - 1; i >= 0 ; i-- ) {
                                if (SESSION.LEVEL.objects[i].constructor.name == 'LevelPoints' && SESSION.LEVEL.objects[i].type == 'spawnFB') {
                                    SESSION.LEVEL.objects.splice(i, 1);
                                };
                            };
                        };
                        new Objects.LevelPoints(mouseX, mouseY, 0, 'spawnFB');
                        break;
                    case 'spawnWG' :
                        if (!SESSION.ALLOW_MULTIPLE_LEVELPOINTS) {
                            for (let i = SESSION.LEVEL.objects.length - 1; i >= 0 ; i-- ) {
                                if (SESSION.LEVEL.objects[i].constructor.name == 'LevelPoints'&& SESSION.LEVEL.objects[i].type == 'spawnWG') {
                                    SESSION.LEVEL.objects.splice(i, 1);
                                };
                            };
                        };
                        new Objects.LevelPoints(mouseX, mouseY, 0, 'spawnWG');
                        break;
                    case 'doorFB' :
                        if (!SESSION.ALLOW_MULTIPLE_LEVELPOINTS) {
                            for (let i = SESSION.LEVEL.objects.length - 1; i >= 0 ; i-- ) {
                                if (SESSION.LEVEL.objects[i].constructor.name == 'LevelPoints' && SESSION.LEVEL.objects[i].type == 'doorFB') {
                                    SESSION.LEVEL.objects.splice(i, 1);
                                };
                            };
                        };
                        new Objects.LevelPoints(mouseX, mouseY, 0, 'doorFB');
                        break;
                    case 'doorWG' :
                        if (!SESSION.ALLOW_MULTIPLE_LEVELPOINTS) {
                            for (let i = SESSION.LEVEL.objects.length - 1; i >= 0 ; i-- ) {
                                if (SESSION.LEVEL.objects[i].constructor.name == 'LevelPoints' && SESSION.LEVEL.objects[i].type == 'doorWG') {
                                    SESSION.LEVEL.objects.splice(i, 1);
                                };
                            };
                        };
                        new Objects.LevelPoints(mouseX, mouseY, 0, 'doorWG');
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
                        handleEdit(evt);
                        break;
                };
                if (!['edit', 'move'].includes(SESSION.SELECTED_OBJECT_TYPE)) {
                    render({do_tiles: false, do_objects: true}, 'click')
                };
                break;
        };
    });

    // Add the eventlistener for right click
    highlightCanvas.addEventListener('contextmenu', evt => {
        if (SESSION.SELECTED_TOOL_TYPE == 'tiles') {
            SESSION.LEVEL.tiles[Math.floor(evt.offsetY / BLOCK_SIZE)][Math.floor(evt.offsetX / BLOCK_SIZE)] = 0
            render({do_tiles: true, do_objects: false}, 'contextmenu')
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

        if (SESSION.SELECTED_TOOL_TYPE === 'objects' && ['edit', 'move'].includes(SESSION.SELECTED_OBJECT_TYPE)) {
            const objects = SESSION.LEVEL.objects;
            const int = objects.find(mouseIntersectsObject);
            if (int) {
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
            render({do_tiles: true, do_objects: false}, 'mousedown tiles')
        };
        if (SESSION.SELECTED_TOOL_TYPE === 'objects') {
            if (SESSION.SELECTED_OBJECT_TYPE === 'move') {
                const objects = SESSION.LEVEL.objects;
                const int = objects.find(mouseIntersectsObject);
                if (int) {
                    SESSION.SELECTED_OBJECT_ID = int.id;
                    SESSION.MOVE_HANDLE_OFFSET_X = int.x - evt.offsetX;
                    SESSION.MOVE_HANDLE_OFFSET_Y = int.y - evt.offsetY;
                    objectHighlight(int, 'mousedown objects move');
                    SESSION.DO_RENDER = true;
                    render({do_tiles: false, do_objects: true}, 'mousedown objects move');
                } else {
                    SESSION.SELECTED_OBJECT_ID = undefined;
                    clearHighlight();
                };
            };
        };
        if (document.getElementsByClassName('modal-container')) {
            [...document.getElementsByClassName('modal-container')].forEach(el => { el.remove(); });
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
        render({do_tiles: true, do_objects: true}, 'resize')
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
                if (SESSION.PLATFROM_PREVIEWS) {
                    SESSION.PLATFROM_PREVIEWS = false;
                    el.classList.remove('active');
                } else {
                    SESSION.PLATFROM_PREVIEWS = true;
                    el.classList.add('active');
                };
                render(false, true);
            };
            if (el.dataset.action == 'wind-previews') {
                if (SESSION.WIND_PREVEIWS) {
                    SESSION.WIND_PREVEIWS = false;
                    el.classList.remove('active');
                } else {
                    SESSION.WIND_PREVEIWS = true;
                    el.classList.add('active');
                };
                render(false, true);
            };
            if (el.dataset.action == 'cover-previews') {
                if(SESSION.COVER_PREVIEWS) {
                    SESSION.COVER_PREVIEWS = false;
                    el.classList.remove('active');
                } else {
                    SESSION.COVER_PREVIEWS = true;
                    el.classList.add('active');
                };
                render(false, true);
            };
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