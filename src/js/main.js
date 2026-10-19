import SessionManager from "./Session.mjs";
import Interface from "./interface/Interface.mjs";

import { createMenuBar, createToolBar } from "./interface/snippets/editor-displaybars.mjs";
import { createCanvases } from "./interface/snippets/editor-canvas.mjs";

import { convertFromOriginalLevelFileObject } from "./level/fbwg-level.mjs";

export let SESSION = window.session;
export let INTERFACE = window.interface

/**
 * Initialize the entire application
 */
function init() {
    window.session = new SessionManager();
    SESSION = window.session;

    window.interface = new Interface(document.getElementById('application'));
    INTERFACE = window.interface;
    generateInterface();
    INTERFACE.render();

    fetch('data/example_level.json')
        .then(r => r.json())
        .then(json => {
            const lvl = convertFromOriginalLevelFileObject(json);
            console.log(lvl)
        });
};

/**
 * Generate all of the interface
 */
function generateInterface() {
    INTERFACE.addComponent(createMenuBar());
    INTERFACE.addComponent(createToolBar());
    INTERFACE.addComponent(createCanvases())
};


init();