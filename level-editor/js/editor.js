import { render } from "./Renderer.js";
import { highlightCanvas } from "./canvas.js";
import { BLOCK_SIZE } from "./lookup.js";
import { SESSION } from "./session.js";
import * as Objects from './Object.js';
import { clearHighlight, objectHighlight } from "./highlight_renderer.js";
import { BasicModal, BoxModal, CoverModal, DiamondModal, GroupedObjectModal, LevelPointModal, LeverModal, MoveModal, PlatformModal, RotationMirrorModal , TextFieldModal, TextTriggerModal} from "./modal.js";
import { selectTool } from './interface.js';

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
        case 'RotationMirror': return;
        case 'RotationBoxMirror': return RotationMirrorModal;
        case 'Lever': return LeverModal;
        case 'Platform': return PlatformModal;
        case 'TimerButton': return;
        case 'Button': return GroupedObjectModal;
        case 'Box': return BoxModal;
        case 'LevelPoints': return LevelPointModal;
        case 'TextField': return TextFieldModal;
        case 'TextTrigger': return TextTriggerModal;
        case 'Cover': return CoverModal;
        case 'Window': return CoverModal;
        default: return BasicModal;
    };
};

function handleEdit(evt, text = 0) {
    console.log(evt)
    const objects = text != 0 ? SESSION.LEVEL.text : SESSION.LEVEL.objects;
    const int = objects.find((obj) => mouseIntersectsObject(obj, text));
    if (int) {
        console.log(int);
        objectHighlight(int, 'handleEdit');
        const CorrectModal = getModal(int);
        const popup = new CorrectModal(evt.clientX, evt.clientY, int.id);
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

export function resizeLevel() {
    // Correct the tiles and objects

    // Get the new and old with and heigth
    let oldWidth = SESSION.LEVEL.tiles[0] ? SESSION.LEVEL.tiles[0].length : 0;
    let oldHeight = SESSION.LEVEL.tiles.length;

    let newWidth = SESSION.LEVEL.width;
    let newHeight = SESSION.LEVEL.height;

    // Decreasing width
    if (oldWidth > newWidth) {
        for (let i = 0; i < oldHeight; i++) {
            for (let j = newWidth; j <= oldWidth; j++) {
                SESSION.LEVEL.tiles[i] = SESSION.LEVEL.tiles[i].splice(0, newWidth);
            };
        };

        // Remove objects outside the level
        let newObjects = [];
        for (let i = 0; i < SESSION.LEVEL.objects.length; i++) {
            if (SESSION.LEVEL.objects[i].x < newWidth * BLOCK_SIZE) {
                newObjects.push(SESSION.LEVEL.objects[i]);
            };
        };
        SESSION.LEVEL.objects = newObjects;

    // Increasing width
    } else if (oldWidth < newWidth) {
        for (let i = 0; i < oldHeight; i++) {
            for (let j = oldWidth; j <= newWidth; j++) {
                SESSION.LEVEL.tiles[i][j] = 0;
            };
        };
    };

    // Decreasing heigth
    if (oldHeight > newHeight) {
        SESSION.LEVEL.tiles = SESSION.LEVEL.tiles.splice(0, newHeight);
        
        // Remove objects outside the level
        let newObjects = [];
        for (let i = 0; i < SESSION.LEVEL.objects.length; i++) {
            if (SESSION.LEVEL.objects[i].y < newHeight * BLOCK_SIZE) {
                newObjects.push(SESSION.LEVEL.objects[i]);
            };
        };
        SESSION.LEVEL.objects = newObjects;
        
    // Increasing heigth 
    } else if (oldHeight < newHeight) {
        for (let i = oldHeight; i < newHeight; i++) {
            SESSION.LEVEL.tiles[i] = new Array(newWidth).fill(0);
        };
    };
};

function getCorrectedMousePosition(evt) {
    let mouseX = evt.offsetX;
    let mouseY = evt.offsetY;

    mouseX -= SESSION.CAMERA_POSITION[0]
    mouseY -= SESSION.CAMERA_POSITION[1]

    mouseX /= SESSION.CAMERA_ZOOM;
    mouseY /= SESSION.CAMERA_ZOOM;

    const tileX = Math.floor(mouseX / BLOCK_SIZE);
    const tileY = Math.floor(mouseY / BLOCK_SIZE);

    return { mouseX, mouseY, tileX, tileY };
};

export function initEditor(){
    highlightCanvas.addEventListener('click', evt => {
        if (evt.button === 1) { return; };
        const mouse = getCorrectedMousePosition(evt)
        switch(SESSION.SELECTED_TOOL_TYPE) {
            case 'tile':
                let tile;
                switch(SESSION.SELECTED_TYLE_TYPE) {
                    case 'air':
                        tile = 0
                        break;
                    case 'ground':
                        tile = 1
                        break;
                    case 'slope_tr':
                        tile = 2
                        break;
                    case 'slope_tl':
                        tile = 3
                        break;
                    case 'slope_br':
                        tile = 4
                        break;
                    case 'slope_bl':
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
                SESSION.LEVEL.tiles[mouse.tileY][mouse.tileX] = tile;
                render({do_tiles: true, do_objects: false, do_text: false}, 'click')
                break;
            case 'object':
                // set objects
                let mouseX = mouse.mouseX - 32;
                let mouseY = mouse.mouseY + 32;            
                switch(SESSION.SELECTED_OBJECT_TYPE) {
                    case 'diamond_fb':
                        new Objects.Diamond(mouseX, mouseY, 0, 0);
                        break;
                    case 'diamond_wg':
                        new Objects.Diamond(mouseX, mouseY, 0, 1);
                        break;
                    case 'diamond_silver':
                        if (!SESSION.ALLOW_MULTIPLE_LEVELPOINTS) {
                            for (let i = SESSION.LEVEL.objects.length -  1; i >= 0; i-- ) {
                                if (SESSION.LEVEL.objects[i].type == 2) {
                                    SESSION.LEVEL.objects.splice(i, 1);
                                };
                            };
                        };
                        new Objects.Diamond(mouseX, mouseY, 0, 2);
                        break;
                    case 'diamond_fbwg':
                        new Objects.Diamond(mouseX, mouseY, 0, 3);
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
                        new Objects.Platform(mouseX - 16, mouseY - 48, 0, 3*BLOCK_SIZE, BLOCK_SIZE, 1, 0, 3);
                        break;
                    case 'box_normal':
                        new Objects.Box(mouseX, mouseY, 0, 'normal');
                        break;
                    case 'box_heavy':
                        new Objects.Box(mouseX, mouseY, 0, 'heavy');
                        break;
                    case 'box_mirror':
                        new Objects.Box(mouseX, mouseY, 0, 'mirror');
                        break;
                    case 'ball':
                        new Objects.Ball(mouseX + 16, mouseY - 16, 0);
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
                    handleEdit(evt);
                    selectTool('object:edit')
                    render({do_tiles: false, do_objects: true, do_text: false}, 'click');
                };
                break;
            case 'text':
                let mouse_x = mouse.mouseX;
                let mouse_y = mouse.mouseY;
                let texts = SESSION.LEVEL.text;
                switch (SESSION.SELECTED_TEXT_TYPE){
                    case 'text':
                        let textobject = new Objects.TextObject(false, 'Trajan Pro', 'centre', 24, 'Placeholder Text', true)
                        new Objects.TextField(mouse_x - 160, mouse_y - 16, 320, 32, 0, 0, textobject);
                        handleEdit(evt, 1)
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
                        new Objects.TextTrigger(mouse_x - 160, mouse_y - 32, 320, 64, 0, 0);
                        handleEdit(evt, 2);
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
        if (SESSION.SELECTED_TOOL_TYPE == 'tile') {
            const mouse = getCorrectedMousePosition(evt);
            SESSION.LEVEL.tiles[mouse.tileY][mouse.tileX] = 0
            render({do_tiles: true, do_objects: false, do_text: false}, 'contextmenu')
        };
    });

    // Add the eventlistener for dragging
    highlightCanvas.addEventListener('mousemove', evt => {
        const mouse = getCorrectedMousePosition(evt);
        SESSION.MOUSE_POS_X = mouse.mouseX;
        SESSION.MOUSE_POS_Y = mouse.mouseY;
        
        if ((SESSION.MOUSE_DOWN || SESSION.RIGHT_MOUSE_DOWN) && SESSION.SELECTED_TOOL_TYPE == 'tile') {
            if (SESSION.RIGHT_MOUSE_DOWN) {
                SESSION.LEVEL.tiles[mouse.tileY][mouse.tileX] = 0;
            } else {
                let tile;
                switch(SESSION.SELECTED_TYLE_TYPE) {
                    case 'air':
                        tile = 0;
                        break;
                    case 'ground':
                        tile = 1;
                        break;
                    case 'slope_tr':
                        tile = 2;
                        break;
                    case 'slope_tl':
                        tile = 3;
                        break;
                    case 'slope_br':
                        tile = 4;
                        break;
                    case 'slope_bl':
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
                SESSION.LEVEL.tiles[mouse.tileY][mouse.tileX] = tile;
            };
            render({}, 'mousemove')
        };
        if (SESSION.MOUSE_DOWN && SESSION.SELECTED_TOOL_TYPE === 'object' && SESSION.SELECTED_OBJECT_TYPE === 'move') {
            handleMove(evt);
        };
        if (SESSION.MOUSE_DOWN && SESSION.SELECTED_TOOL_TYPE === 'text' && SESSION.SELECTED_TEXT_TYPE === 'move-text') {
            handleMove(evt, 1);
        };
        if (SESSION.MOUSE_DOWN && SESSION.SELECTED_TOOL_TYPE === 'text' && SESSION.SELECTED_TEXT_TYPE === 'move-text-trigger') {
            handleMove(evt, 2);
        };

        if (SESSION.SELECTED_TOOL_TYPE === 'object' && ['edit', 'move'].includes(SESSION.SELECTED_OBJECT_TYPE)) {
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

        if (SESSION.MIDDLE_MOUSE_DOWN) {
            SESSION.CAMERA_POSITION[0] += evt.movementX;
            SESSION.CAMERA_POSITION[1] += evt.movementY;
            render({do_tiles: true, do_objects: true, do_text: true}, 'Canvas translate');
        };
    });

    // Add the eventlistener for pressing your mouse
    highlightCanvas.addEventListener('mousedown', evt => {
        const mouse = getCorrectedMousePosition(evt);
        SESSION.SELECTED_OBJECT_ID = undefined;
        clearHighlight();
        if (evt.button == 0) { SESSION.MOUSE_DOWN = true; }
        else if (evt.button == 1) {
            SESSION.MIDDLE_MOUSE_DOWN = true;
        }
        else if (evt.button == 2) { 
            SESSION.RIGHT_MOUSE_DOWN = true;
        };
        if (SESSION.SELECTED_TOOL_TYPE === 'tiles') {
            SESSION.DO_RENDER = true;
            render({do_tiles: true, do_objects: false, do_text: false}, 'mousedown tiles')
        };
        if (SESSION.SELECTED_TOOL_TYPE === 'object') {
            if (SESSION.SELECTED_OBJECT_TYPE === 'move') {
                const objects = SESSION.LEVEL.objects;
                const int = objects.find((obj) => mouseIntersectsObject(obj));
                if (int) {
                    SESSION.SELECTED_OBJECT_ID = int.id;
                    SESSION.MOVE_HANDLE_OFFSET_X = int.x - mouse.mouseX;
                    SESSION.MOVE_HANDLE_OFFSET_Y = int.y - mouse.mouseY;
                    objectHighlight(int, 'mousedown object move');
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
                    SESSION.MOVE_HANDLE_OFFSET_X = txt.x - mouse.mouseX;
                    SESSION.MOVE_HANDLE_OFFSET_Y = txt.y - mouse.mouseY;
                    objectHighlight(txt, 'mousedown objects move');
                    SESSION.DO_RENDER = true;
                    render({do_tiles: false, do_objects: false, do_text: true}, 'mousedown text move');
                };
            } else if (SESSION.SELECTED_TEXT_TYPE === 'move-text-trigger') {
                const texts = SESSION.LEVEL.text;
                const txt = texts.find((text) => mouseIntersectsObject(text, 2));
                if (txt) {
                    SESSION.SELECTED_OBJECT_ID = txt.id;
                    SESSION.MOVE_HANDLE_OFFSET_X = txt.x - mouse.mouseX;
                    SESSION.MOVE_HANDLE_OFFSET_Y = txt.y - mouse.mouseY;
                    objectHighlight(txt, 'mousedown objects move');
                    SESSION.DO_RENDER = true;
                    render({do_tiles: false, do_objects: false, do_text: true}, 'mousedown text move');
                };
            };
        };

        if (document.getElementsByClassName('modal-container').length > 0) {
            [...document.getElementsByClassName('modal-container')].forEach(el => { el.remove(); });
            if (!SESSION.SETTING_PLATFORM_PREVIEWS) {
                SESSION.RENDER_PLATFROM_PREVIEWS = false;
                render({do_tiles: false, do_objects: true, do_text: false}, 'remove temporary previews');
            };
        };
    });

    // Add the eventlistener for releasing your mouse
    highlightCanvas.addEventListener('mouseup', evt => {
        if (SESSION.SELECTED_TOOL_TYPE === 'objects' && SESSION.SELECTED_OBJECT_TYPE === 'move') {
            const objects = SESSION.LEVEL.objects;
            const int = objects.find((obj) => mouseIntersectsObject(obj));
            if (int) {
                const popup = new MoveModal(evt.clientX, evt.clientY, int.id);
                popup.showOnly();
            };
        };

        if (SESSION.SELECTED_TOOL_TYPE === 'text' && SESSION.SELECTED_OBJECT_TYPE === 'move-text') {
            const objects = SESSION.LEVEL.objects;
            const int = objects.find(mouseIntersectsObject);
            if (int) {
                const popup = new MoveModal(evt.clientX, evt.clientY, int.id);
                popup.showOnly();
            };
        };

        SESSION.MOUSE_DOWN = false;
        SESSION.RIGHT_MOUSE_DOWN = false;
        SESSION.MIDDLE_MOUSE_DOWN = false;
        SESSION.DO_RENDER = false;
    });

    // Canvas zoom
    window.addEventListener('wheel', evt => {
        const currentWidth = SESSION.LEVEL.width * BLOCK_SIZE * SESSION.CAMERA_ZOOM;
        const currentHeight = SESSION.LEVEL.height * BLOCK_SIZE * SESSION.CAMERA_ZOOM;

        if (evt.deltaY > 0) {
            SESSION.CAMERA_ZOOM -= 0.01
        } else if (evt.deltaY < 0) {
            SESSION.CAMERA_ZOOM += 0.01
        };

        const newWidth = SESSION.LEVEL.width * BLOCK_SIZE * SESSION.CAMERA_ZOOM;
        const newHeight = SESSION.LEVEL.height * BLOCK_SIZE * SESSION.CAMERA_ZOOM;

        const deltaWidth = currentWidth - newWidth;
        const deltaHeight = currentHeight - newHeight;

        SESSION.CAMERA_POSITION[0] += deltaWidth / 2;
        SESSION.CAMERA_POSITION[1] += deltaHeight / 2;

        render({do_tiles: true, do_objects: true, do_text: true}, 'Canvas scale');
    });

    // Canvas translate
    window.addEventListener('keydown', evt => {
        if (['KeyA', 'KeyW', 'KeyS', 'KeyD'].includes(evt.code)) {
            SESSION.DO_RENDER = true;
            switch (evt.code) {
                case 'KeyA':
                    SESSION.CAMERA_MOVE_LEFT = true;
                    break;
                    
                case 'KeyW':
                    SESSION.CAMERA_MOVE_UP = true;
                    break;

                case 'KeyS':
                    SESSION.CAMERA_MOVE_DOWN = true;
                    break;

                case 'KeyD':
                    SESSION.CAMERA_MOVE_RIGHT = true;
                    break;
            };

            render({do_tiles: true, do_objects: true, do_text: true}, 'Canvas translate');
        };
    });

    window.addEventListener('keyup', evt => {
        if (['KeyA', 'KeyW', 'KeyS', 'KeyD'].includes(evt.code)) {
            switch (evt.code) {
                case 'KeyA':
                    SESSION.CAMERA_MOVE_LEFT = false;
                    break;
                    
                case 'KeyW':
                    SESSION.CAMERA_MOVE_UP = false;
                    break;

                case 'KeyS':
                    SESSION.CAMERA_MOVE_DOWN = false;
                    break;

                case 'KeyD':
                    SESSION.CAMERA_MOVE_RIGHT = false;
                    break;
            };

            if (!(
                SESSION.CAMERA_MOVE_LEFT ||
                SESSION.CAMERA_MOVE_RIGHT ||
                SESSION.CAMERA_MOVE_UP ||
                SESSION.CAMERA_MOVE_DOWN
            )) {
                SESSION.DO_RENDER = false;
            }
        };
    });
};