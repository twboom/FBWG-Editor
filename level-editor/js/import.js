import * as Objects from './Object.js'
import { SESSION } from './session.js';
import { Level } from './Level.js';
import { render } from './Renderer.js';
import { resizeCanvas } from './canvas.js';

export const IMPORT_CONFIG = {
    BLANK_LEVEL: 'blank_level.json',
    EXAMPLE_LEVEL: 'example_level.json',
};

function importJSON(json) {
    const proceed = confirm('Are you sure?\nThis will delete your current progress!');
    if (!proceed) { alert('Alright, nothing happend!'); return; };
    // Potential for file checks

    // Init app
    importLevelFile(json);
    resizeCanvas();
    render(true, true);
};

function importLocal(evt) {
    const input = evt.target;

    const reader = new FileReader();
    reader.onload = _ => {
        const text = reader.result;
        const json = JSON.parse(text);
        importJSON(json);
        // Remove file from file field
        input.value = '';
    };
    reader.readAsText(input.files[0]);
};

export function importURL(src) {
    fetch(src)
        .then(r => r.json())
        .then(importJSON);
};

export function initImport() {
    // Import the blank level
    document.getElementById('create-empty').addEventListener('click', _ => {
        importURL(IMPORT_CONFIG.BLANK_LEVEL);
    });

    // Import the tutorial level
    document.getElementById('import-tutorial').addEventListener('click', _ => {
        console.log('loading exmaple level');
        importURL(IMPORT_CONFIG.EXAMPLE_LEVEL);
    });

    // Import a level file
    document.getElementById('import-file').addEventListener('change', importLocal);
};

function importLevelFile(LEVELSJON) {
    // Get the height and width of the level
    let height = LEVELSJON.height;
    let width = LEVELSJON.width;

    // Find the data, objects and chars
    let data;
    let objects;
    let chars;
    for (let i = 0; i < LEVELSJON.layers.length; i++) {
        if (LEVELSJON.layers[i].type === 'tilelayer') {
            data = LEVELSJON.layers[i].data;
        } else if (LEVELSJON.layers[i].name === 'Objects') {
            objects = LEVELSJON.layers[i].objects;
        } else if (LEVELSJON.layers[i].name === 'Chars') {
            chars = LEVELSJON.layers[i].objects;
        };
    };

    
    // Find the firstchar, firstobj and firstlargeobj
    let firstGround
    let firstChar
    let firstObj
    let firstLargeObj
    for (let i = 0; i < LEVELSJON.tilesets.length; i++) {
        if (String(LEVELSJON.tilesets[i].source).includes('/assets/tilemaps/tilesets/Ground.json')) {
            firstGround = LEVELSJON.tilesets[i].firstgid;
        } else if (String(LEVELSJON.tilesets[i].source).includes('/assets/tilemaps/tilesets/Chars.json')) {
            firstChar = LEVELSJON.tilesets[i].firstgid;
        } else if (String(LEVELSJON.tilesets[i].source).includes('/assets/tilemaps/tilesets/Objects.json')) {
            firstObj = LEVELSJON.tilesets[i].firstgid;
        } else if (String(LEVELSJON.tilesets[i].source).includes('/assets/tilemaps/tilesets/LargeObjects.json')) {
            firstLargeObj = LEVELSJON.tilesets[i].firstgid;
        };
    };

    // Set firstlargeobj to a high value so it doesn't break
    if (firstLargeObj == undefined) {firstLargeObj = 100;};
    
    
    // Write existing data if there are any
    let tiles = []
    if (data) {
        // Move trough y layers
        for (let y = 0; y < height; y++) {
            tiles[y] = [];

            // Move trough x layers
            for (let x = 0; x < width; x++) {

                // Fix random numbers
                if (data[x + y*width] - firstGround + 1 > 15) {
                    tiles[y][x] = 1;
                } else {
                    tiles[y][x] = data[x + y * width] == 0 ? 0 : data[x + y * width] - firstGround + 1;
                };
            };
        };
    };

    // Write existing objects if there are any
    let levelObjects = []; 
    if (objects) {
        // Iterate trough objects
        for (let i = 0; i < objects.length; i ++) {
            // Get the object
            let object = objects[i];

            // Check if the object is a platform, silder or hanger
            if (!object.gid) {
                let pos = [];
                switch(object.type) {
                    case 'platform':
                        levelObjects[i] = new Objects.Platform(object.x, object.y, object.rotation, object.width, object.height, object.properties.group ? object.properties.group : 0, object.properties.dx ? object.properties.dx : 0, object.properties.dy ? object.properties.dy : 0);
                        break;
                    case 'slider':
                        for (let i = 0; i < object.polyline.length; i ++) {
                            console.log(object.polyline[i], object.polyline[i].x, object.polyline[i].y);
                            pos[i] = [object.polyline[i].x, object.polyline[i].y];
                        };
                        levelObjects[i] = new Objects.Slider(object.x, object.y, object.rotation, object.properties ? object.properties.group ? object.properties.group : 0 : 0, pos, object.properties ? object.properties.max ? object.properties.max : 1 : 1, object.properties ? object.properties.min ? object.properties.min : -1 : -1);
                        break;
                    case 'hanging':
                        for (let i = 0; i < object.polyline.length; i ++) {
                            console.log(object.polyline[i], object.polyline[i].x, object.polyline[i].y);
                            pos[i] = [object.polyline[i].x, object.polyline[i].y];
                        };
                        levelObjects[i] = new Objects.Hanger(object.x, object.y, object.rotation, object.properties ? object.properties.group ? object.properties.group : 0 : 0, pos , object.properties.barWidth, object.properties.density, object.properties.fullRotation ? object.properties.fullRotation : 0);
                        break;
                    case 'window':
                        levelObjects[i] = new Objects.Window(object.x, object.y, object.width, object.height);
                };
            } else {
                if (object.gid >= firstObj && (
                (object.gid > firstChar && object.gid > firstLargeObj) ||
                (object.gid < firstChar && object.gid < firstLargeObj) ||
                (object.gid < firstLargeObj && object.gid > firstChar) ||
                (object.gid > firstLargeObj && object.gid < firstChar))) {
                    // Object is a normal object
                    switch (object.gid - firstObj) {
                        case 0:
                            // Button
                            levelObjects[i] =new Objects.Button(object.x, object.y, object.rotation, object.properties ? object.properties.group ? object.properties.group : 0 : 0);
                            break;
                        case 1:
                            // Lever left
                            levelObjects[i] =new Objects.Lever(object.x, object.y, object.rotation, object.properties ? object.properties.group ? object.properties.group : 0 : 0, 0);
                            break;
                        case 2:
                            // Lever right
                            levelObjects[i] =new Objects.Lever(object.x, object.y, object.rotation, object.properties ? object.properties.group ? object.properties.group : 0 : 0, 1);
                            break;
                        case 4:
                            // Box
                            levelObjects[i] =new Objects.Box(object.x, object.y, object.rotation);
                            break;
                        case 5:
                            // Light emitter
                            levelObjects[i] =new Objects.LightEmitter(object.x, object.y, object.rotation, object.properties.color ? object.properties.color : "yellow", object.properties.initialState ? object.properties.initialState : 0, object.properties ? object.properties.group ? object.properties.group : 0 : 0);
                            break;
                        case 6:
                            // Rotation box mirror
                            levelObjects[i] =new Objects.RotationBoxMirror(object.x, object.y, object.rotation, object.properties ? object.properties.group ? object.properties.group : 0: 0);
                            break;
                        case 7:
                            // Light receiever
                            levelObjects[i] =new Objects.LightReceiver(object.x, object.y, object.rotation, object.properties.color ? object.properties.color : "yellow", object.properties.group);
                            break;
                        case 10:
                            // Ball
                            levelObjects[i] =new Objects.Ball(object.x, object.y, object.rotation);
                            break;
                        case 11:
                            // Rotation mirror
                            levelObjects[i] =new Objects.RotationMirror(object.x, object.y, object.rotation, object.properties.group);
                            break;
                        case 12:
                            // Boxmirror
                            levelObjects[i] =new Objects.MirrorBox(object.x, object.y, object.rotation);
                            break;
                        case 13:
                            // Heavy box
                            levelObjects[i] =new Objects.HeavyBox(object.x, object.y, object.rotation);
                            break;
                        case 14:
                            // Timed button
                            levelObjects[i] =new Objects.TimerButton(object.x, object.y, object.rotation, object.properties ? object.properties.group ? object.properties.group : 0 : 0, object.properties ? object.properties.time ? object.properties.time : 300 : 300);
                            break;
                        case 15:
                            // Fan
                            levelObjects[i] =new Objects.Fan(object.x, object.y, object.rotation, object.properties ? object.properties.group ? object.properties.group : 0 : 0, object.properties.initialState ? object.properties.initialState : 0, object.properties.length ? object.properties.length : 8);
                            console.log(object);
                            break;
                    };
                };
                if (object.gid >= firstLargeObj && (
                (object.gid > firstChar && object.gid > firstObj) ||
                (object.gid < firstChar && object.gid < firstObj) ||
                (object.gid < firstObj && object.gid > firstChar) ||
                (object.gid > firstObj && object.gid < firstChar))) {
                    // Object is a large object
                    switch (object.gid - firstLargeObj) {
                        case 0:
                            // Portal left
                            levelObjects[i] =new Objects.PortalLeft(object.x, object.y, object.rotation, object.properties ? object.properties.group ? object.properties.group : 0 : 0, object.properties ? object.properties.initialState ? object.properties.initialState : 0: 0, object.properties ? object.properties.portalId ? object.properties.portalId : 0 : 0);
                            break;
                        case 1:
                            // Portal right
                            levelObjects[i] =new Objects.PortalRight(object.x, object.y, object.rotation, object.properties ? object.properties.group ? object.properties.group : 0 : 0, object.properties ? object.properties.initialState ? object.properties.initialState : 0: 0, object.properties ? object.properties.portalId ? object.properties.portalId : 0 : 0);
                            break;
                        case 2:
                            // Fan
                            levelObjects[i] =new Objects.Fan(object.x, object.y, object.rotation, object.properties ? object.properties.group ? object.properties.group : 0 : 0, object.properties ? object.properties.initialState ? object.properties.initialState: 0 : 0, object.properties ? object.properties.length ? object.properties.length : 8 : 8);
                            break;
                    };
                };
            };
        };
    };
    if (chars) {
        // Make sure objects are added behind existing objects
        let add = levelObjects.length
        for (let i = 0; i < chars.length; i++) {
            let char = chars[i];
            switch(char.gid - firstChar) {
                case 0:
                    // Spawn FB
                    levelObjects[i + add] =new Objects.SpawnFB(char.x, char.y, char.rotation);
                    break;
                case 1:
                    // Spawn WG
                    levelObjects[i + add] =new Objects.SpawnWG(char.x, char.y, char.rotation);
                    break;
                case 2:
                    // Door FB
                    levelObjects[i + add] =new Objects.DoorFB(char.x, char.y, char.rotation);
                    break;
                case 3:
                    // Door WG
                    levelObjects[i + add] =new Objects.DoorWG(char.x, char.y, char.rotation);
                    break;
                case 4:
                    // Diamond FB
                    levelObjects[i + add] =new Objects.Diamond(char.x, char.y, char.rotation, 0);
                    break;
                case 5:
                    // Diamond WG
                    levelObjects[i + add] =new Objects.Diamond(char.x, char.y, char.rotation, 1);
                    break;
                case 6:
                    // Diamond Silver
                    levelObjects[i + add] =new Objects.Diamond(char.x, char.y, char.rotation, 2);
                    break;
                case 7:
                    // Diamond FWG
                    levelObjects[i + add] =new Objects.Diamond(char.x, char.y, char.rotation, 3);
                    break;
            };
        };
    };

    // Check for undefined objects
    for (let i = 0; i < levelObjects.length; i++) {
        let stop = false;
        if (levelObjects[i] == undefined) {
            console.warn(objects[i], 'at place ',i);
            stop = true
        };
        if (!stop) {
            for (let j = 0; j < Object.keys(levelObjects[i]).length && !stop; j++) {
                if (Object.values(levelObjects[i])[j] == undefined) {
                    console.warn(levelObjects[i], objects[i]);
                    stop = true
                };
            };
        };
    };



    SESSION.LEVEL = new Level(width, height, tiles, levelObjects);
    console.log(SESSION.LEVEL);
};