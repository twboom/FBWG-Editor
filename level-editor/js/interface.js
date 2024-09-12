import { resizeCanvas } from "./canvas.js";
import { resizeLevel } from "./editor.js";
import { SESSION } from "./session.js";
import { exportTEXT, exportJSON } from "./export.js";
import { Modal } from "./modal.js";
import { clearHighlight } from "./highlight_renderer.js";


export function initInterface() {
    resizeCanvas();
    window.addEventListener('resize', _ => { resizeCanvas(); });

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
        resizeLevel();
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

    // Hide all tools
    Array.from(document.getElementsByClassName('tool-layer')).forEach(el => {
        el.style.display = 'none';
    });

    // Add the eventlistener for the editor functions
    Array.from(document.getElementsByClassName('editor-function')).forEach(el => {
        el.addEventListener('click', _ => {
            // Remove selected object
            SESSION.SELECTED_OBJECT_ID = undefined;
            clearHighlight();
            Modal.removeAll();

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
                    div.style.display = 'block';
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