import { Level } from './Level.js';
import { TileRenderer } from './Renderer.js';
import { initEditor } from './editor.js';
import { initImport, importURL } from './import.js';
import { SESSION } from './session.js';

window.onbeforeunload = evt => {
    // evt.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
};

function init() {
    SESSION.TILE_CANVAS = document.getElementById('tiles');
    SESSION.TILE_CTX = SESSION.TILE_CANVAS.getContext('2d');
    SESSION.TEXT_CANVAS = document.getElementById('text');
    SESSION.TEXT_CTX = SESSION.TEXT_CANVAS.getContext('2d');
    SESSION.OBJECT_CANVAS = document.getElementById('objects');
    SESSION.OBJECT_CTX = SESSION.OBJECT_CANVAS.getContext('2d');
    SESSION.TILE_RENDERER = new TileRenderer();
    SESSION.LEVEL = new Level();
    initImport();
    initEditor();
    importURL('example_level.json');
};

init();