import * as Objects from './Objects.js'
import { SESSION } from './session.js';
import { Level } from '/Level.js'

const IMPORT_CONFIG = {
    BLANK_LEVEL: 'blank_level.json',
    EXAMPLE_LEVEL: 'example_level.json',
};

function importJSON(json) {
    const proceed = confirm('Are you sure?\nThis will delete your current progress!');
    if (!proceed) { alert('Alright, nothing happend!'); return; };
    // Potential for file checks

    // Init app
    
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

function importURL(src) {
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
        importURL(IMPORT_CONFIG.EXAMPLE_LEVEL);
    });

    // Import a level file
    document.getElementById('import-file').addEventListener('change', importLocal);
};

function importLevelFile(width, height, data, {objects, chars}, {firstChar, firstLargeObj, firstObj}) {
    // Write existing data if there are any
    let tiles = []
    if (data) {
        // Move trough y layers
        for (let y = 0; y < height; y++) {
            tiles[y] = [];

            // Move trough x layers
            for (let x = 0; x < width; x++) {
                tiles[y][x] = data[x + y*height]
            };
        };
    };

    // Write existing objects if there are any
    let levelObjects = []; 
    if (objects) {
        // Iterate trough objects
        for (let i = 0; i < objects.length; i ++) {
            let object = objects[i]
            if (object.gid >= firstObj && (
            (object.gid > firstChar && object.gid > firstLargeObj) ||
            (object.gid < firstChar && object.gid < firstLargeObj) ||
            (object.gid < firstLargeObj && object.gid > firstChar) ||
            (object.gid > firstLargeObj && object.gid < firstChar))) {
                // Object is a normal object
                switch (object.gid - firstObj){
                    case 0:
                        // Button
                        levelObjects[i] = Objects.Button(object.x, object.y, object.rotation, object.properties.group);
                        break;
                    case 1:
                        // Lever left
                        levelObjects[i] = Objects.Lever(object.x, object.y, object.rotation, object.properties.group, 0);
                        break;
                    case 2:
                        // Lever right
                        levelObjects[i] = Objects.Lever(object.x, object.y, object.rotation, object.properties.group, 1);
                        break;
                    case 4:
                        // Box
                        levelObjects[i] = Objects.Box(object.x, object.y, object.rotation);
                        break;
                    case 5:
                        // Light emitter
                        levelObjects[i] = Objects.LightEmitter(object.x, object.y, object.rotation, object.properties.color, object.properties.initialSate, object.properties.group);
                        break;
                    case 6:
                        // Rotation box mirror
                        levelObjects[i] = Objects.RotationBoxMirror(object.x, object.y, object.rotation, object.properties.group);
                        break;
                    case 7:
                        // Light receiever
                        levelObjects[i] = Objects.LigthReceiver(object.x, object.y, object.rotation, object.properties.color, object.properties.group);
                        break;
                    case 10:
                        // Ball
                        levelObjects[i] = Objects.Ball(object.x, object.y, object.rotation);
                        break;
                    case 11:
                        // Rotation mirror
                        levelObjects[i] = Objects.RotationMirror(object.x, object.y, object.rotation, object.properties.group);
                        break;
                    case 12:
                        // Boxmirror
                        levelObjects[i] = Objects.MirrorBox(object.x, object.y, object.rotation);
                        break;
                    case 13:
                        // Heavy box
                        levelObjects[i] = Objects.HeavyBox(object.x, object.y, object.rotation);
                        break;
                    case 14:
                        // Timed button
                        levelObjects[i] = Objects.TimerButton(object.x, object.y, object.rotation, object.properties.group, object.properties.time);
                        break;
                    case 15:
                        // Fan
                        levelObjects[i] = Objects.Fan(object.x, object.y, object.rotation, object.properties.group, object.proceed.initialSate, obj.proceed.length);
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
                        levelObjects[i] = Objects.PortalLeft(object.x, object.y, object.rotation, object.properties.group, object.properties.initialSate, object.properties.portalId);
                        break;
                    case 1:
                        // Portal right
                        levelObjects[i] = Objects.PortalRight(object.x, object.y, object.rotation, object.properties.group, object.properties.initialSate, object.properties.portalId);
                        break;
                    case 2:
                        // Fan
                        levelObjects[i] = Objects.Fan(object.x, object.y, object.rotation, object.properties.group, object.proceed.initialSate, obj.proceed.length);
                        break;
                };
            };
        };
    };
    if (chars) {
        // Make sure objects are added behind existing objects
        let add = levelObjects.length
        for (let i = 0; i <= chars.length; i++) {
            let char = chars[i];
            switch(char.gid - firstChar) {
                case 0:
                    // Spawn FB
                    levelObjects[i + add] = Objects.SpawnFB(char.x, char.y);
                    break;
                case 1:
                    // Spawn WG
                    levelObjects[i + add] = Objects.SpawnWG(char.x, char.y);
                    break;
                case 2:
                    // Door FB
                    levelObjects[i + add] = Objects.DoorFB(char.x, char.y);
                    break;
                case 3:
                    // Door WG
                    levelObjects[i + add] = Objects.DoorWG(char.x, char.y);
                    break;
                case 4:
                    // Diamond FB
                    levelObjects[i + add] = Objects.Diamond(char.x, char.y, 0);
                    break;
                case 5:
                    // Diamond WG
                    levelObjects[i + add] = Objects.Diamond(char.x, char.y, 1);
                    break;
                case 6:
                    // Diamond Silver
                    levelObjects[i + add] = Objects.Diamond(char.x, char.y, 2);
                    break;
                case 7:
                    // Diamond FWG
                    levelObjects[i + add] = Objects.Diamond(char.x, chary, 3);
                    break;
            };
        };
    };
    SESSION.LEVEL = new Level(width, height, tiles, levelObjects);
};