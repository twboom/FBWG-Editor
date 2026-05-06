import SessionManager from "./Session.mjs";
import Interface from "./Interface.mjs";

import { createMenuBar, createToolBar } from "./interface/snippets/editor-displaybars.mjs";

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
};

/**
 * Generate all of the interface
 */
function generateInterface() {
    INTERFACE.addComponent(createMenuBar());
    INTERFACE.addComponent(createToolBar());
};


init();