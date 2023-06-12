const CONFIG = {
    SLOPE_STEEPNESS: 0.6
};

const LEVEL = {
    BLOCK_SIZE: 32,
    WIDTH: 0,
    HEIGHT: 0,
    TILELAYER: [],
    OBJECTLAYER: {},
    CHARSLAYER: {}
};

const SESSION = {
    MOUSEDOWN: false,
    MOUSEDOWNX: 0,
    MOUSEDOWNY: 0,
    MOUSEX: 0,
    MOUSEY: 0,
    TILEX: 0,
    TILEY: 0,
    SELECTED_TOOL_TYPE: undefined,
    SELECTED_TILE_TYPE: undefined,
    SELECTED_CHAR_TYPE: undefined,
    SELECTED_OBJE_TYPE: undefined,
    SELECTED_CHAR_ID: undefined,
    ALLOWMULTIPLESPAWNS: false
};

const CACHE = {};

function renderTileLayer() {
    function drawTile([x, y], blockId, index) {
        if (blockId >= 2 && blockId <= 5) { // Slopes
            drawTriangle(blockId, [x, y]);
        } else if (blockId >= 6 && blockId <= 8) { // Fluids
            prevId = LEVEL.TILELAYER[index - 1]
            nextId = LEVEL.TILELAYER[index + 1]
            drawFluid(blockId, prevId, nextId ,[x, y]);
        } else{
            const COLOR_LOOKUP = [
                'black', // Air
                'white', // Ground
            ];
            tileCtx.beginPath();
            tileCtx.rect(x*LEVEL.BLOCK_SIZE, y*LEVEL.BLOCK_SIZE, LEVEL.BLOCK_SIZE, LEVEL.BLOCK_SIZE);
            tileCtx.fillStyle = COLOR_LOOKUP[blockId];
            tileCtx.fill();
        }
        tileCtx.beginPath();
        tileCtx.rect(x*LEVEL.BLOCK_SIZE, y*LEVEL.BLOCK_SIZE, LEVEL.BLOCK_SIZE, LEVEL.BLOCK_SIZE);
        tileCtx.strokeStyle = '#333333';
        tileCtx.stroke();
    };
    for (let i = 0; i < LEVEL.TILELAYER.length; i++) {
        const tileCoordinates = [i%LEVEL.WIDTH, Math.floor(i/LEVEL.WIDTH)];
        drawTile(tileCoordinates, LEVEL.TILELAYER[i], i)
    }
};

function drawPlatform(obj, ctx) {
    const COLOR_LOOKUP = [
        'red',
        'green',
        'blue',
        'yellow',
        'magenta',
        'lightskyblue',
        'blueviolet',
        'white',
    ]
    ctx.beginPath();
    ctx.rect(obj.x, obj.y + obj.height, obj.width, -obj.height)
    ctx.fillStyle = COLOR_LOOKUP[obj.properties.group - 1];
    ctx.fill();
    const strokeWidth = 8;
    const strokeOffset = strokeWidth / 2
    ctx.beginPath();
    ctx.rect(obj.x + strokeOffset, obj.y + obj.height - strokeOffset, obj.width - strokeWidth, -obj.height + strokeWidth);
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
};

function renderObjectLayer(layer) {
    const objects = layer.objects;
    objects.forEach(obj => {
        let group;
        if (obj.properties) { group = obj.properties.group; };
        if (obj.type == 'platform') { // Platform
            drawPlatform(obj, objCtx);
        } else if (obj.gid) {
            switch (obj.gid) {
                case 24: // Button
                    drawImage(`assets/objects/button_${group}.svg`, 64, 64, obj.x, obj.y - 64, objCtx);
                    return;
                case 25: // Lever (off is to left)
                    drawImage(`assets/objects/lever_left_${group}.svg`, 64, 64, obj.x, obj.y - 64, objCtx);
                    return;
                case 26: // Lever (off is to right)
                    drawImage(`assets/objects/lever_right_${group}.svg`, 64, 64, obj.x, obj.y - 64, objCtx);
                    return;
                case 28: // Box normal
                    drawImage('assets/objects/box_normal.svg', 64, 64, obj.x, obj.y - 64, objCtx);
                    return;
                case 29: //licht emitter
                    break;
                case 30: //rotation boxmirror
                    break;
                case 31: //light receiver
                    break;
                case 34: //ball
                    break;
                case 35: //rotation mirror
                    break;
                case 36: //boxmirror
                    break;
                case 37: // Box heavy
                    drawImage('assets/objects/box_heavy.svg', 64, 64, obj.x, obj.y - 64, objCtx);
                    return
                case 38: //timed button
                    break;
                case 39: //wind generator
                    break;
                default:
                    objCtx.beginPath();
                    objCtx.rect(obj.x, obj.y, obj.width, -obj.height)
                    objCtx.fillStyle = 'purple';
                    objCtx.fill();
            };
        };
    });
};

function drawImage(src, sizeX, sizeY, x, y, ctx) {
    let img = new Image(sizeX, sizeY);
    if (src in CACHE) {
        img = CACHE[src].cloneNode(true)
    } else {
        img.src = src;
        CACHE[src] = img;
    };
    img.onload = _ => {
        ctx.drawImage(img, x, y);
    };
};

function drawChar(gid, x, y, ctx) {
    switch (gid){
        case 16: // Spawn FB
            drawImage('assets/chars/spawn_fb.svg', 64, 64, x, y - 64, ctx);
            break;
        case 17: // Spawn FB
            drawImage('assets/chars/spawn_wg.svg', 64, 64, x, y - 64, ctx);
            break;
        case 18:
            drawImage('assets/chars/door_fb.svg', 64, 64, x, y - 64, ctx);
            break;
        case 19: // Door WG
            drawImage('assets/chars/door_wg.svg', 64, 64, x, y - 64, ctx);
            break;
        case 20: // Diamond FB
            drawImage('assets/chars/diamond_fb.svg', 64, 64, x, y - 64, ctx);
            break;
        case 21: // Diamond WG
            drawImage('assets/chars/diamond_wg.svg', 64, 64, x, y - 64, ctx);
            break;
        case 22: // Diamond silver
            drawImage('assets/chars/diamond_silver.svg', 64, 64, x, y - 64, ctx);
            break;
        case 23: // Diamond FBWG
            drawImage('assets/chars/diamond_fbwg.svg', 64, 64, x, y - 64, ctx);
            break;
    }
}

function renderCharsLayer() {
    const chars = LEVEL.CHARSLAYER.objects;
    chars.forEach(obj => {
        if (!obj.visible) { return };
        drawChar(obj.gid, obj.x, obj.y, charCtx);
    });
};

function init(levelJSON) {
    
    LEVEL.BLOCK_SIZE = levelJSON.tileheight;
    LEVEL.WIDTH = levelJSON.width;
    LEVEL.HEIGHT = levelJSON.height;

    resizeCanvas();

    LEVEL.TILELAYER = levelJSON.layers.find( ({ type }) => type === 'tilelayer' ).data;
    LEVEL.OBJECTLAYER = levelJSON.layers.find( ({ name }) => name === 'Objects');
    LEVEL.CHARSLAYER = levelJSON.layers.find( ({ name }) => name === 'Chars');
    render(LEVEL);

    initEditor();
};

function resizeCanvas() {
    const width = LEVEL.WIDTH * LEVEL.BLOCK_SIZE;
    const height = LEVEL.HEIGHT * LEVEL.BLOCK_SIZE;

    
    tileCanvas.width = width;
    tileCanvas.height = height;


    objectsCanvas.width = width;
    objectsCanvas.height = height;

    charsCanvas.width = width;
    charsCanvas.height = height;

    highlightCanvas.width = width;
    highlightCanvas.height = height;
};

function render(renderTiles=true, renderObjs=true, renderChars=true) {
    if (renderTiles) {
        tileCtx.clearRect(0, 0, tileCanvas.width, tileCanvas.height);
        renderTileLayer(LEVEL.TILELAYER);
        console.log('Rendered Tile Layer')
    };
    
    if (renderObjs) {
        objCtx.clearRect(0, 0, objectsCanvas.width, objectsCanvas.height);
        renderObjectLayer(LEVEL.OBJECTLAYER);
        console.log('Rendered Object Layer')
    };
    
    if (renderChars) {
        charCtx.clearRect(0, 0, charsCanvas.width, charsCanvas.height);
        renderCharsLayer();
        console.log('Rendered Char Layer')
    };
};

function drawTriangle(id, [x, y], isBackground=false) {
    x *= LEVEL.BLOCK_SIZE
    y *= LEVEL.BLOCK_SIZE
    tileCtx.beginPath();
    switch (id) {
        case 2:
            tileCtx.moveTo(x, y + LEVEL.BLOCK_SIZE);
            tileCtx.lineTo(x + LEVEL.BLOCK_SIZE, y  + LEVEL.BLOCK_SIZE);
            tileCtx.lineTo(x + LEVEL.BLOCK_SIZE, y);
            break
        case 3:
            tileCtx.moveTo(x, y);
            tileCtx.lineTo(x, y + LEVEL.BLOCK_SIZE);
            tileCtx.lineTo(x + LEVEL.BLOCK_SIZE, y + LEVEL.BLOCK_SIZE);
            break
        case 4:
            tileCtx.moveTo(x, y);
            tileCtx.lineTo(x + LEVEL.BLOCK_SIZE, y);
            tileCtx.lineTo(x + LEVEL.BLOCK_SIZE, y + LEVEL.BLOCK_SIZE);
            break
        case 5:
            tileCtx.moveTo(x, y);
            tileCtx.lineTo(x + LEVEL.BLOCK_SIZE, y);
            tileCtx.lineTo(x , y + LEVEL.BLOCK_SIZE);
            break    
    }
    if (isBackground) {
        tileCtx.fillStyle = 'black';
    } else {
        tileCtx.fillStyle = 'white';
    }
    tileCtx.fill();
    if (!isBackground) {
        drawTriangle(7-id, [x/LEVEL.BLOCK_SIZE, y/LEVEL.BLOCK_SIZE], true);
    }
};

function drawFluid(id, prevId, nextId, [x, y]) {
    if (x == 0) {
        prevId = null;
    } if (x == LEVEL.WIDTH - 1) {
        nextId = null;
   };
    x *= LEVEL.BLOCK_SIZE;
    y *= LEVEL.BLOCK_SIZE;
    tileCtx.beginPath();
    tileCtx.rect(x, y, LEVEL.BLOCK_SIZE, LEVEL.BLOCK_SIZE);
    const COLOR_LOOKUP = ['blue', 'red', 'green']
    tileCtx.fillStyle = COLOR_LOOKUP[id - 6];
    tileCtx.fill();
    if (prevId != id) {
        tileCtx.beginPath();
        tileCtx.moveTo(x, y);
        tileCtx.lineTo(x, y + LEVEL.BLOCK_SIZE);
        tileCtx.lineTo(x + LEVEL.BLOCK_SIZE, y + LEVEL.BLOCK_SIZE);
        tileCtx.lineTo(x + LEVEL.BLOCK_SIZE, y + CONFIG.SLOPE_STEEPNESS * LEVEL.BLOCK_SIZE);
        tileCtx.fillStyle = 'white';
        tileCtx.fill();
    } if (nextId != id) {
        tileCtx.beginPath();
        tileCtx.moveTo(x + LEVEL.BLOCK_SIZE, y);
        tileCtx.lineTo(x + LEVEL.BLOCK_SIZE, y + LEVEL.BLOCK_SIZE);
        tileCtx.lineTo(x, y + LEVEL.BLOCK_SIZE);
        tileCtx.lineTo(x, y + CONFIG.SLOPE_STEEPNESS * LEVEL.BLOCK_SIZE);
        tileCtx.fillStyle = 'white';
        tileCtx.fill();
    } if (prevId == id && nextId == id) {
        tileCtx.beginPath();
        tileCtx.rect(x, y + CONFIG.SLOPE_STEEPNESS * LEVEL.BLOCK_SIZE, LEVEL.BLOCK_SIZE, (1 - CONFIG.SLOPE_STEEPNESS) * LEVEL.BLOCK_SIZE);
        tileCtx.fillStyle = 'white';
        tileCtx.fill();
    }
};

function resizeLevel() {
    if (!confirm('This action may result in a loss of content.\nAnything outside the new level border will be removed. This action is irreversible.')) {
        alert('Resizing is cancelled!')
        return
    };

    const newWidth = parseInt(document.getElementById('level-width').value);
    const newHeight = parseInt(document.getElementById('level-height').value);

    
    // Unfuckup tiles
    const newTiles = new Array(newWidth * newHeight).fill(0);
    // Remove tiles out of bounds
    for (let i = 0; i < LEVEL.TILELAYER.length; i++) {
        const coordX = i%LEVEL.WIDTH;
        const coordY = Math.floor(i/LEVEL.WIDTH);

        if (coordX >= newWidth || coordY >= newHeight) { // Then remove tile
            continue
        } else {
            newTiles[coordX + (coordY * newWidth)] = LEVEL.TILELAYER[i]
        };
    };

    // Unfuckup objects and chars
    function isOutside(x, y) {
        const canvasWidth = LEVEL.WIDTH * LEVEL.BLOCK_SIZE;
        const canvasHeight = LEVEL.HEIGHT * LEVEL.BLOCK_SIZE;

        if (
            x < 0 ||
            x > canvasWidth ||
            y < 0 ||
            y > canvasHeight
        ) {
            return true
        } else {
            return false
        };
    };
    
    const newObjects = [];
    LEVEL.OBJECTLAYER.objects.forEach(obj => {
        const objIsOutside = !isOutside(obj.x, obj.y, obj.width, obj.height);
        if (!isOutside(obj.x, obj.y, obj.width, obj.height)) {
            newObjects.push(obj)
        }
    })
    
    const newChars = [];
    LEVEL.CHARSLAYER.objects.forEach(obj => {
        if (!isOutside(obj.x, obj.y, obj.width, obj.height)) {
            newChars.push(obj)
        }
    })
        
    LEVEL.TILELAYER = newTiles;
    LEVEL.OBJECTLAYER.objects = newObjects;
    LEVEL.CHARSLAYER.objects = newChars;
    LEVEL.WIDTH = newWidth;
    LEVEL.HEIGHT = newHeight;

    resizeCanvas();
    render();
}

function setBlock([x, y], id) {
    const pos = x + (y * LEVEL.WIDTH);

    if (LEVEL.TILELAYER[pos] == id) { return };

    LEVEL.TILELAYER[pos] = id;
    render(true, false, false);
};

function setObject({gid, height, id, name, properties, rotation, type, visible, width}, x, y, deleting = false) {
    if (deleting) {
        for (let i = 0; LEVEL.OBJECTLAYER.length; i++){
            if (LEVEL.OBJECTLAYER[i].id == id) {
                LEVEL.CHARSLAYER.splice(i, 1);
                render(false, true, false);
                return;
            };
        };
    };
    let objectTemplate = {
       "gid":gid,
       "height":height,
       "id":id,
       "name":name,
       "properties": properties,
       "propertytypes":{
         "dx":"int",
         "dy":"int",
         "group":"int"
       },
       "rotation":rotation,
       "type":type,
       "visible":visible,
       "width":width,
       "x":x,
       "y":y
    };
    // if (!dx && !dy) {
    //     if (!group) {
    //         objectTemplate.Array.splice(4, 2);
    //     } else {
    //         objectTemplate.properties.Array.splice(0, 2);
    //         objectTemplate.propertytypes.Array.splice(0,2);
    //     };
    // } 
    if (objectTemplate.type == "platform") {
        objectTemplate.Array.splice(0, 1);
        objectTemplate.Array.type = objType;
    };
    LEVEL.OBJECTLAYER.objects.push(objectTemplate);
    render(false, true, false);
};

function addObjectObj(objType, [x, y], [width, height], autoDeleteOthers=true, [dx, dy, group] ) {
    let  options = {
        "gid":objType,
        "height":height,
        "id":Date.now(),
        "name":"",
        "properties":{
          "dx":dx,
          "dy":dy,
          "group":group
        },
        "propertytypes":{
          "dx":"int",
          "dy":"int",
          "group":"int"
        },
        "rotation":0,
        "type":"",
        "visible":visible,
        "width":width,
        "x":x,
        "y":y
    }
    if (!dx && !dy) {
        if (!group) {
            options.Array.splice(4, 2);
        } else {
            options.properties.Array.splice(0, 2);
            options.propertytypes.Array.splice(0,2);
        };
    } 
    if (objType == "platform") {
        options.Array.splice(0, 1);
        options.Array.type = objType;
    };
    if (autoDeleteOthers) {
        if (typeof gid == Number){
            const others  = LEVEL.CHARSLAYER.objects.filter(({ gid }) => gid == objType);
            others.forEach(el => {
                setChar({id: el.id}, null, null, true);
            });    
        } else {
            const others = LEVEL.CHARSLAYER.objects.filter(({ type }) => type = objType);
            others.forEach(el => {
                setObject({id: el.id}, null, null, true);
            })
        }
    }
    setObject(options, x, y);
};

function addObject(type, [x, y]) {
    const NO_GROUP_REQUIRED = new Set(['box'])
    const GID_LOOKUP = {
        'button': 24,
        'lever': 25,
        'box_normal': 28,
        'box_heavy': 37,
        'platform': undefined,
    }
    let options = {
        "gid": GID_LOOKUP[type],
        "height": 64,
        "id": Date.now(),
        "name": "",
        "properties":{
          "group": 1
        },
        "propertytypes":{
          "group": "int"
        },
        "rotation": 0,
        "type": "",
        "visible": true,
        "width": 64,
    };

    if (NO_GROUP_REQUIRED.has(type)) {
        options.properties = undefined;
        options.propertytypes = undefined;
    };

    if (type === 'platform') {
        options.properties.dx = 0;
        options.properties.dy = 0;
        options.propertytypes.dx = 'int';
        options.propertytypes.dx = 'int';
    };

    setObject(options, x, y);

    SESSION.SELECTED_OBJE_TYPE = 'e';
    setSelectedClass(document.querySelector('button.tool.obje-option[data-aid="e"]'));
};

function setChar({gid, height, id, name, rotation, type, visible, width}, x, y, deleting = false) {
    if (deleting) {
        for (let i = 0; LEVEL.CHARSLAYER.objects.length; i++){
            if (LEVEL.CHARSLAYER.objects[i].id == id) {
                LEVEL.CHARSLAYER.objects.splice(i, 1);
                render(false, false, true);
                return;
            };
        };
    };
    let charTemplate = {
       "gid":gid,
       "height":height,
       "id":id,
       "name":name,
       "rotation":rotation,
       "type":type,
       "visible":visible,
       "width":width,
       "x":x,
       "y":y
    };
    LEVEL.CHARSLAYER.objects.push(charTemplate);
    render(false, false, true); 
};

function addCharObj(type, [x, y], autoDeleteOthers=true) {
    const options = {
        "gid": type,
        "height": 64,
        "id": Date.now(),
        "name": "",
        "rotation": 0,
        "type": "",
        "visible": true,
        "width": 64,
    };
    if (SESSION.SELECTED_CHAR_TYPE >= 16 && SESSION.SELECTED_CHAR_TYPE <= 19 && autoDeleteOthers && !SESSION.ALLOWMULTIPLESPAWNS) {
        const others  = LEVEL.CHARSLAYER.objects.filter(({ gid }) => gid == type);
        others.forEach(el => {
            setChar({id: el.id}, null, null, true);
        });
    };
    setChar(options, x, y);
    SESSION.SELECTED_OBJE_TYPE = 'e';
};

function collidesWithCursor(obj, x, y, mayBePlatform=false) {
    if (
        x >= obj.x &&
        x <= obj.x + obj.width &&
        y <= obj.y &&
        y >= obj.y - obj.height
    ) {
        if (mayBePlatform) {
            if (obj.type === 'platform') { return false; }
            else { return true; };
        } else { return true; };
    }
    else if (mayBePlatform) {
        if (
            x >= obj.x &&
            x <= obj.x + obj.width &&
            y <= obj.y + obj.height &&
            y >= obj.y - obj.height
        ) { return true };
    } else { return false; };
};

function deleteChar(x, y) {
    const int = LEVEL.CHARSLAYER.objects.find(obj => {
        return collidesWithCursor(obj, x, y);
    });
    if (int) {
        setChar({id: int.id}, null, null, true);
    };
};

function moveChar(objId) {
    const x = SESSION.MOUSEX;
    const y = SESSION.MOUSEY;
    const obj = LEVEL.CHARSLAYER.objects.find(({ id }) => id === objId)
    if (obj) {
        obj.x = (x - SESSION.MOUSEDOWNX) + obj.x;
        obj.y = (y - SESSION.MOUSEDOWNY) + obj.y;
        drawChar(obj.gid, obj.x, obj.y, hlCtx)
        SESSION.MOUSEDOWNX = x;
        SESSION.MOUSEDOWNY = y;
    };
}

function highlight(x, y, layer) {
    const obj = layer.objects.find(obj => {
        return collidesWithCursor(obj, x, y);
    });
    if (obj) {
        hlCtx.beginPath();
        hlCtx.rect(obj.x, obj.y - obj.height, obj.width, obj.height)
        hlCtx.strokeStyle = 'cyan';
        hlCtx.lineWidth = 8;
        hlCtx.stroke();
    };
};

function highlightTile(x, y) {
    const blockSize = LEVEL.BLOCK_SIZE;
    hlCtx.beginPath();
    hlCtx.rect(x * blockSize, y * blockSize, blockSize, blockSize);
    hlCtx.fillStyle = 'cyan';
    hlCtx.fill();
};

function selectChar(objId) {
    obj = LEVEL.CHARSLAYER.objects.find(({ id }) => id === objId);
    if (!obj) { return; };
    SESSION.SELECTED_CHAR_ID = obj.id;
    obj.visible = false;
    render(false, false, true)
};

function deselectChar() {
    if (!SESSION.SELECTED_CHAR_ID) {
        return
    };
    obj = LEVEL.CHARSLAYER.objects.find(({ id }) => id === SESSION.SELECTED_CHAR_ID);
    obj.visible = true;
    SESSION.SELECTED_CHAR_ID = undefined;
    render(false, false, true);
};

function createObjPopup(x, y, fields) {
    const popup = document.createElement('div');
    popup.id = 'popup';
    fields.forEach(field => {
        const container = document.createElement('div');
        container.classList.add('popup-field');
        const label = document.createElement('label');
        label.innerText = field.name;
        const input = document.createElement('input');
        input.type = fields.type;
        field.attributes.forEach(attr => {
            input.setAttribute(attr.type, attr.value);
        });
        input.addEventListener(field.evtType, field.callback);
        container.appendChild(label);
        container.appendChild(input);
        popup.appendChild(container);
    });
    const close = document.createElement('button');
    close.innerText = 'Close';
    close.addEventListener('click', _ => {
        popup.remove();
    });
    popup.appendChild(close);
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    return popup;
};

function showObjPopup() {
    const obj = LEVEL.OBJECTLAYER.objects.find(obj => {
        return collidesWithCursor(obj, SESSION.MOUSEX, SESSION.MOUSEY, true);
    });
    console.log(obj)
    if (document.getElementById('popup')) {
        document.getElementById('popup').remove();
    };
    if (!obj) { return; };
    const groupField = {
        name: 'group',
        type: 'number',
        attributes: [
            {
                type: 'min',
                value: 1,
            },
            {
                type: 'max',
                value: 8,
            },
        ],
        evtType: 'change',
        callback: evt => {
            const newGroup = parseInt(evt.srcElement.value);
            obj.properties.group = newGroup;
            render(false, true, false);
        }
    }
    const fields = [groupField];
    const popup = createObjPopup(obj.x + obj.width, obj.y, fields);
    document.body.appendChild(popup);
};

function setSelectedClass(el) {
    Array.from(document.getElementsByClassName('tool')).forEach(btn => {
        btn.classList.remove('selected');
    });
    el.classList.add('selected');
};

function initEditor() {
    highlightCanvas.addEventListener('mousemove', evt => {
        const blockSize = LEVEL.BLOCK_SIZE;

        const mouseX = evt.offsetX > 0 ? evt.offsetX : 0;
        const mouseY = evt.offsetY > 0 ? evt.offsetY : 0;
        SESSION.MOUSEX = mouseX;
        SESSION.MOUSEY = mouseY;
        
        const tileX = Math.floor(mouseX / blockSize);
        const tileY = Math.floor(mouseY / blockSize);
        SESSION.TILEX = tileX;
        SESSION.TILEY = tileY;

        hlCtx.clearRect(0, 0, LEVEL.WIDTH * blockSize, LEVEL.HEIGHT * blockSize);

        // Dragging function
        if (SESSION.MOUSEDOWN && SESSION.SELECTED_TOOL_TYPE === 'TILE') {
            setBlock([SESSION.TILEX, SESSION.TILEY], SESSION.SELECTED_TILE_TYPE)
        };

        if (SESSION.MOUSEDOWN && SESSION.SELECTED_TOOL_TYPE === 'CHAR' && SESSION.SELECTED_CHAR_TYPE === 'm') {
            moveChar(SESSION.SELECTED_CHAR_ID);
        };

        // Highlight
        if (SESSION.SELECTED_TOOL_TYPE === 'TILE') { highlightTile(tileX, tileY); };
        if (SESSION.SELECTED_TOOL_TYPE === 'CHAR') { highlight(mouseX, mouseY, LEVEL.CHARSLAYER); };
    });

    highlightCanvas.addEventListener('click', _ => {
        switch(SESSION.SELECTED_TOOL_TYPE) {
            case 'TILE':
                setBlock([SESSION.TILEX, SESSION.TILEY], SESSION.SELECTED_TILE_TYPE);
                break;

            case 'CHAR':
                if (SESSION.SELECTED_CHAR_TYPE === 'd') { // Delete
                    deleteChar(SESSION.MOUSEX, SESSION.MOUSEY)
                    return;
                };
                if (SESSION.SELECTED_CHAR_TYPE >= 16 && SESSION.SELECTED_CHAR_TYPE <= 24) { // Spawns and doors and diamonds
                    addCharObj(SESSION.SELECTED_CHAR_TYPE, [SESSION.MOUSEX - 32, SESSION.MOUSEY + 32])
                };
                break;

            case 'OBJE':
                if (SESSION.SELECTED_OBJE_TYPE === 'e') {
                    showObjPopup();
                }
                else {
                    addObject(SESSION.SELECTED_OBJE_TYPE, [SESSION.MOUSEX - 32, SESSION.MOUSEY + 32])
                };
                break;
        };
    });

    highlightCanvas.addEventListener('mousedown', evt => {
        SESSION.MOUSEDOWN = true;
        const mouseX = evt.offsetX > 0 ? evt.offsetX : 0;
        const mouseY = evt.offsetY > 0 ? evt.offsetY : 0;
        SESSION.MOUSEDOWNX = mouseX;
        SESSION.MOUSEDOWNY = mouseY;
        if (SESSION.SELECTED_TOOL_TYPE === 'CHAR' && SESSION.SELECTED_CHAR_TYPE === 'm') {
            const obj = LEVEL.CHARSLAYER.objects.find(obj => {
                return collidesWithCursor(obj, mouseX, mouseY);
            });
            if (obj) {
                selectChar(obj.id);
            } else {
                deselectChar();
            }
        };
    });

    document.addEventListener('mouseup', _ => {
        SESSION.MOUSEDOWN = false;
        deselectChar();
    });

    highlightCanvas.addEventListener('mouseleave', _ => {
        SESSION.MOUSEDOWN = false;
        hlCtx.clearRect(0, 0, LEVEL.WIDTH * LEVEL.BLOCK_SIZE, LEVEL.HEIGHT * LEVEL.BLOCK_SIZE);
    });

    Array.from(document.getElementsByClassName('tile-option')).forEach(el => {
        el.addEventListener('click', _ => {
            SESSION.SELECTED_TILE_TYPE = parseInt(el.dataset.tid);
            SESSION.SELECTED_TOOL_TYPE = 'TILE';
            setSelectedClass(el);
        });
    });

    Array.from(document.getElementsByClassName('char-option')).forEach(el => {
        el.addEventListener('click', _ => {
            SESSION.SELECTED_CHAR_TYPE = parseInt(el.dataset.gid);
            if (isNaN(SESSION.SELECTED_CHAR_TYPE)) {
                SESSION.SELECTED_CHAR_TYPE = el.dataset.gid;
            }
            SESSION.SELECTED_TOOL_TYPE = 'CHAR';
            setSelectedClass(el);
        });
    });

    Array.from(document.getElementsByClassName('obje-option')).forEach(el => {
        el.addEventListener('click', _ => {
            SESSION.SELECTED_OBJE_TYPE = el.dataset.aid;
            SESSION.SELECTED_TOOL_TYPE = 'OBJE';
            setSelectedClass(el);
        });
    });

    document.getElementById('resize').addEventListener('click', resizeLevel);

    document.getElementById('level-width').value = LEVEL.WIDTH;
    document.getElementById('level-height').value = LEVEL.HEIGHT;
};