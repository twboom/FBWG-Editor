import { render } from "./Renderer.js";
import { highlightCanvas, resizeCanvas } from "./canvas.js";
import { BLOCK_COLOR, BLOCK_SIZE } from "./lookup.js";
import { SESSION } from "./session.js";
import * as Objects from './Object.js';


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
                        new Objects.Box(mouseX, mouseY, 0);
                        break;
                    case 'box_heavy':
                        new Objects.HeavyBox(mouseX, mouseY, 0);
                        break;
                    case 'ball':
                        new Objects.Ball(mouseX, mouseY, 0);
                        break;
                    case 'box_mirror':
                        new Objects.MirrorBox(mouseX, mouseY, 0);
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
                    case 'Cover':
                        new Objects.Cover(mouseX, mouseY, BLOCK_SIZE, BLOCK_SIZE);
                        break;
                };
                render({do_tiles: false, do_objects: true}, 'click')
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
    });

    // Add the eventlistener for pressing your mouse
    highlightCanvas.addEventListener('mousedown', evt => {
        if (evt.button == 0) { SESSION.MOUSE_DOWN = true; } 
        else if (evt.button == 2) { 
            SESSION.RIGHT_MOUSE_DOWN = true;
        };
        if (SESSION.SELECTED_TOOL_TYPE === 'tiles') {
            SESSION.DO_RENDER = true;
            render({do_tiles: true, do_objects: false}, 'mousedown')
        };
        if (SESSION.SELECTED_TOOL_TYPE === 'objects') {
            render({do_tiles: false, do_objects: true}, 'mousedown')
        }
    });

    // Add the eventlistener for releasing your mouse
    highlightCanvas.addEventListener('mouseup', evt => {
        SESSION.MOUSE_DOWN = false;
        SESSION.RIGHT_MOUSE_DOWN = false;
        SESSION.DO_RENDER = false;
    });


    // Add the resize function
    document.getElementById('resize').addEventListener('click', _ => {
        // Confirm the action
        if (!confirm('This may result in a loss of contend.\nAnything outside the new level border will be removed.\nThis action in irreverisble.'));

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
};