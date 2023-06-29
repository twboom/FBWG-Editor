import { render } from "./Renderer.js";
import { highlightCanvas } from "./canvas.js";
import { BLOCK_SIZE } from "./lookup.js";
import { SESSION } from "./session.js"


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
                    case 'lava':
                        tile = 6
                        break;
                    case 'water':
                        tile = 7
                        break;
                    case 'acid':
                        tile = 8
                        break;
                };
                SESSION.LEVEL.tiles[tileY][tileX] = tile;
                render(true, false);
                break;
            case 'objects':
                // set objects
                break;
        };
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
                console.log(el);
                console.log(SESSION.SELECTED_TOOL_TYPE, SESSION.SELECTED_TYLE_TYPE);
            };
        });
    });
};