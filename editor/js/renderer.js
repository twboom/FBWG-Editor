const CONFIG = {
    SLOPE_STEEPNESS: 0.6,
    OBJ_NO_GROUP_REQUIRED: ['box_normal', 'box_heavy'],
    OBJ_NO_GROUP_FIELD_GID: [28, 37],
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
    SELECTED_ELEMENT_ID: undefined,
    SELECTED_LAYER_TYPE: undefined,
    SNAPY: 0,
    SNAPX: 0,
    CURRENTLY_DRAGGING: false,
};

const EDITORCONFIG = {
    ALLOWMULTIPLESPAWNS: false,
    PLATFORMPREVIEWS: false,
}

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
        '#FF0000', //red
        '#008000', //green
        '#0000FF', //blue
        '#FFFF00', //yellow
        '#FF00FF', //magenta
        '#87CEFA', //lightskyblue
        '#8A2BE2', //blueviolet
        '#FFFFFF', //white
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

    if (EDITORCONFIG.PLATFORMPREVIEWS) {drawPlatformPreview(obj, ctx);};
};

function drawPlatformPreview(obj, ctx) {
    const COLOR_LOOKUP = [
        '#FF0000', //red
        '#008000', //green
        '#0000FF', //blue
        '#FFFF00', //yellow
        '#FF00FF', //magenta
        '#87CEFA', //lightskyblue
        '#8A2BE2', //blueviolet
        '#FFFFFF', //white
    ];
    //draw the preview
    const dx = obj.properties.dx;
    const dy = obj.properties.dy;
    const strokeWidth = 8;
    const strokeOffset = strokeWidth / 2
    ctx.beginPath();
    ctx.rect(obj.x + dx*LEVEL.BLOCK_SIZE, obj.y + obj.height - dy*LEVEL.BLOCK_SIZE, obj.width, -obj.height)
    ctx.fillStyle = COLOR_LOOKUP[obj.properties.group - 1] + '07f';
    console.log(COLOR_LOOKUP[obj.properties.group - 1] + '07f');
    ctx.fill();
    ctx.beginPath();
    ctx.rect(obj.x + strokeOffset + dx*LEVEL.BLOCK_SIZE, obj.y + obj.height - strokeOffset - dy*LEVEL.BLOCK_SIZE, obj.width - strokeWidth, -obj.height + strokeWidth);
    ctx.strokeStyle = '#8080807f';
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    //draw the dottet line
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#404040';
    ctx.moveTo(obj.x + 0.5*obj.width, obj.y + 0.5*obj.height);
    ctx.lineTo(obj.x + 0.5*obj.width + dx*LEVEL.BLOCK_SIZE, obj.y + 0.5*obj.height - dy*LEVEL.BLOCK_SIZE);
    ctx.stroke();
    ctx.setLineDash([]);
};

function drawObj(obj, ctx) {
    let group;
    if (obj.properties) { group = obj.properties.group; };
    if (obj.type == 'platform') { // Platform
        drawPlatform(obj, ctx);
    } else if (obj.gid) {
        switch (obj.gid) {
            case 24: // Button
                drawImage(`assets/objects/button_${group}.svg`, 64, 64, obj.x, obj.y - 64, ctx);
                break;
            case 25: // Lever (off is to left)
                drawImage(`assets/objects/lever_left_${group}.svg`, 64, 64, obj.x, obj.y - 64, ctx);
                break;
            case 26: // Lever (off is to right)
                drawImage(`assets/objects/lever_right_${group}.svg`, 64, 64, obj.x, obj.y - 64, ctx);
                break;
            case 28: // Box normal
                drawImage('assets/objects/box_normal.svg', 64, 64, obj.x, obj.y - 64, ctx);
                break;
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
                drawImage('assets/objects/box_heavy.svg', 64, 64, obj.x, obj.y - 64, ctx);
                break
            case 38: //timed button
                break;
            case 39: //wind generator
                break;
            default:
                ctx.beginPath();
                ctx.rect(obj.x, obj.y, obj.width, -obj.height)
                ctx.fillStyle = 'purple';
                ctx.fill();
        };
    };
};

function renderObjectLayer(layer) {
    const objects = layer.objects;
    objects.forEach(obj => {
        if (obj.visible === false) { return };
        drawObj(obj, objCtx);
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
        if (obj.visible === false) { return };
        drawChar(obj.gid, obj.x, obj.y, charCtx);
    });
};

function init(levelJSON, reload=false) {
    
    LEVEL.BLOCK_SIZE = levelJSON.tileheight;
    LEVEL.WIDTH = levelJSON.width;
    LEVEL.HEIGHT = levelJSON.height;

    resizeCanvas();

    LEVEL.TILELAYER = levelJSON.layers.find( ({ type }) => type === 'tilelayer' ).data;
    LEVEL.OBJECTLAYER = levelJSON.layers.find( ({ name }) => name === 'Objects');
    LEVEL.CHARSLAYER = levelJSON.layers.find( ({ name }) => name === 'Chars');
    render(LEVEL);

    if (!reload) {
        initEditor();
    };
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
        const canvasWidth = highlightCanvas.offsetWidth;
        const canvasHeight = highlightCanvas.offsetHeight;

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
        for (let i = 0; i < LEVEL.OBJECTLAYER.objects.length; i++){
            if (LEVEL.OBJECTLAYER.objects[i].id == id) {
                LEVEL.OBJECTLAYER.objects.splice(i, 1);
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
    // if (objectTemplate.type == "platform") {
    //     objectTemplate.Array.splice(0, 1);
    //     objectTemplate.Array.type = objType;
    // };
    LEVEL.OBJECTLAYER.objects.push(objectTemplate);
    render(false, true, false);
    return objectTemplate
};

function addObject(type, [x, y]) {
    const GID_LOOKUP = {
        'button': 24,
        'lever': 25,
        'box_normal': 28,
        'box_heavy': 37,
        'platform': '',
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

    if (CONFIG.OBJ_NO_GROUP_REQUIRED.includes(type)) {
        options.properties = undefined;
        options.propertytypes = undefined;
    };

    if (type === 'platform') {
        options.properties.dx = 0;
        options.properties.dy = 0;
        options.propertytypes.dx = 'int';
        options.propertytypes.dx = 'int';
        options.type = 'platform';
    };

    const obj = setObject(options, x, y);

    SESSION.SELECTED_OBJE_TYPE = 'e';
    setSelectedClass(document.querySelector('button.tool.obje-option[data-aid="e"]'));

    showObjPopup(obj);
};

function setChar({gid, height, id, name, rotation, type, visible, width}, x, y, deleting = false) {
    if (deleting) {
        for (let i = 0; i < LEVEL.CHARSLAYER.objects.length; i++){
            if (LEVEL.CHARSLAYER.objects[i].id == id) {
                LEVEL.CHARSLAYER.objects.splice(i, 1);
                render(false, false, true);
                return
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

function addCharObj(type, [x, y]) {
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
    if (SESSION.SELECTED_CHAR_TYPE >= 16 && SESSION.SELECTED_CHAR_TYPE <= 19  && !EDITORCONFIG.ALLOWMULTIPLESPAWNS) {
        console.log('no other spawns allowed');
        const others  = LEVEL.CHARSLAYER.objects.filter(({ gid }) => gid == type);
        others.forEach(el => {
            console.log('deleting', el, el.id)
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
            y >= obj.y - obj.height &&
            obj.type === 'platform'
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

function move(objId, layer, type) {
    const x = SESSION.MOUSEX;
    const y = SESSION.MOUSEY;
    let previews = false
    if (EDITORCONFIG.PLATFORMPREVIEWS == true) {
        previews = true};
    EDITORCONFIG.PLATFORMPREVIEWS = true
    const obj = layer.objects.find(({ id }) => id === objId);
    if (obj) {
        let xPos = (x - SESSION.MOUSEDOWNX) + obj.x;
        let yPos = (y - SESSION.MOUSEDOWNY) + obj.y;
        
        if (type === 'CHAR') {
            drawChar(obj.gid, xPos, yPos, hlCtx)
        } else if (type === 'OBJE') {
            drawObj(obj, hlCtx)
        };
                
        obj.x = xPos;
        obj.y = yPos;
        SESSION.MOUSEDOWNX = x;
        SESSION.MOUSEDOWNY = y;
        SESSION.CURRENTLY_DRAGGING = true;
    };
    if (!previews) {
        EDITORCONFIG.PLATFORMPREVIEWS = false;
    };
};

function highlight(x, y, layer, mayBePlatform=false) {
    const obj = layer.objects.find(obj => {
        return collidesWithCursor(obj, x, y, mayBePlatform);
    });
    if (obj) {
        hlCtx.beginPath();
        if (obj.type === 'platform') {
            hlCtx.rect(obj.x, obj.y + obj.height, obj.width, -obj.height)
        } else {
            hlCtx.rect(obj.x, obj.y - obj.height, obj.width, obj.height)
        }
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

function selectElement(objId, layerType) {
    const layer = layerType === 'CHAR' ? LEVEL.CHARSLAYER : LEVEL.OBJECTLAYER;
    obj = layer.objects.find(({ id }) => id === objId);
    if (!obj) { return; };
    SESSION.SELECTED_ELEMENT_ID = obj.id;
    obj.visible = false;
    SESSION.SELECTED_LAYER_TYPE = layerType
    if (SESSION.SELECTED_LAYER_TYPE === 'CHAR') {
        render(false, false, true);
        drawChar(obj.gid, obj.x, obj.y, hlCtx);
    } else if (SESSION.SELECTED_LAYER_TYPE === 'OBJE') {
        render(false, true, false);
        drawObj(obj, hlCtx);
    };
};

function deselectElement() {
    if (!SESSION.SELECTED_ELEMENT_ID) {
        return
    };
    const layer = SESSION.SELECTED_LAYER_TYPE === 'CHAR' ? LEVEL.CHARSLAYER : LEVEL.OBJECTLAYER;
    obj = layer.objects.find(({ id }) => id === SESSION.SELECTED_ELEMENT_ID);
    obj.visible = true;
    if (SESSION.CURRENTLY_DRAGGING) {
        if (SESSION.SNAPX !== 0) {
            obj.x = Math.round((obj.x / SESSION.SNAPX)) * SESSION.SNAPX;
        };

        if (SESSION.SNAPY !== 0) {
            obj.y = Math.round((obj.y / SESSION.SNAPY)) * SESSION.SNAPY;
        };
        // Clear hlCtx to prevent ghost object from appearing
        clearHighlight();
    };
    createMovementPopup(obj);
    SESSION.SELECTED_ELEMENT_ID = undefined;
    if (SESSION.SELECTED_LAYER_TYPE === 'CHAR') {
        render(false, false, true);
    } else if (SESSION.SELECTED_LAYER_TYPE === 'OBJE') {
        render(false, true, false);
    };
    SESSION.SELECTED_LAYER_TYPE = undefined;
};

function createPopup(x, y, fields, showInsideCanvas=true) {
    removePopup();
    const popup = document.createElement('div');
    popup.id = 'popup';
    fields.forEach(field => {
        const container = document.createElement('div');
        container.classList.add('popup-field');
        const label = document.createElement('label');
        label.innerText = field.name;
        container.appendChild(label);
        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            field.options.forEach(opt => {
                const option = document.createElement('option');
                option.innerText = opt.name;
                option.value = opt.value;
                if (opt.default) { option.selected = 'selected'; };
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
        }
        field.attributes.forEach(attr => {
            input.setAttribute(attr.type, attr.value);
        });
        input.addEventListener(field.evtType, field.callback);
        container.appendChild(input);
        popup.appendChild(container);
    });
    const close = document.createElement('button');
    close.innerText = 'Close';
    close.addEventListener('click', _ => {
        popup.remove();
    });

    // Show inside canavs
    document.body.appendChild(popup);
    const bounds = popup.getBoundingClientRect();
    document.body.removeChild(popup)

    if ((x + bounds.width) > highlightCanvas.getBoundingClientRect().right && showInsideCanvas) {
        popup.style.left = (x - bounds.width) + 'px';
        console.log((x - bounds.width) + 'px', x, bounds.width)
    } else {
        popup.style.left = x + 'px';
    }

    if ((y + bounds.height) > highlightCanvas.getBoundingClientRect().bottom && showInsideCanvas) {
        popup.style.top = (y - bounds.height) + 'px';
        console.log((y - bounds.height) + 'px', y, bounds.height)
    } else {
        console.log('y norm')
        popup.style.top = y + 'px';
    }

    popup.appendChild(close);
    return popup;
};

function removePopup() {
    if (document.getElementById('popup')) {
        document.getElementById('popup').remove();
    };
};

function showObjPopup() {
    const obj = LEVEL.OBJECTLAYER.objects.find(obj => {
        return collidesWithCursor(obj, SESSION.MOUSEX, SESSION.MOUSEY, true);
    });
    if (!obj) { return; };
    let groupField;
    if (!CONFIG.OBJ_NO_GROUP_FIELD_GID.includes(obj.gid)) {
        groupField = {
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
                {
                    type: 'value',
                    value: obj.properties.group,
                },
            ],
            evtType: 'change',
            callback: evt => {
                const newGroup = parseInt(evt.srcElement.value);
                obj.properties.group = newGroup;
                render(false, true, false);
            }
        };
    };
    const deleteField = {
        name: '',
        type: 'button',
        attributes: [
            {
                type: 'value',
                value: 'Delete',
            },
        ],
        evtType: 'click',
        callback: _ => {
            setObject({id: obj.id}, null, null, true);
            popup.remove();
        }
    };
    const fields = [];
    if (!CONFIG.OBJ_NO_GROUP_FIELD_GID.includes(obj.gid)) { fields.push(groupField); };
    if (obj.type === 'platform') {
        const widthField = {
            name: 'Width (tiles)',
            type: 'number',
            attributes: [
                {
                    type: 'min',
                    value: 1,
                },
                {
                    type: 'max',
                    value: LEVEL.WIDTH,
                },
                {
                    type: 'value',
                    value: obj.width / LEVEL.BLOCK_SIZE,
                },
            ],
            evtType: 'change',
            callback: evt => {
                const width = parseInt(evt.srcElement.value) * LEVEL.BLOCK_SIZE;
                obj.width = width;
                render(false, true, false)
            }
        };
        const heightField = {
            name: 'Height (tiles)',
            type: 'number',
            attributes: [
                {
                    type: 'min',
                    value: 1,
                },
                {
                    type: 'max',
                    value: LEVEL.HEIGHT,
                },
                {
                    type: 'value',
                    value: obj.height / LEVEL.BLOCK_SIZE,
                },
            ],
            evtType: 'change',
            callback: evt => {
                const height = parseInt(evt.srcElement.value) * LEVEL.BLOCK_SIZE;
                obj.height = height;
                render(false, true, false)
            }
        };
        const dxField = {
            name: 'dx (tiles)',
            type: 'number',
            attributes: [

                {
                    type: 'value',
                    value: obj.properties.dx,
                },
            ],
            evtType: 'change',
            callback: evt => {
                const dx = parseInt(evt.srcElement.value);
                obj.properties.dx = dx;
                render(false, true, false);
            }
        };
        const dyField = {
            name: 'dy (tiles)',
            type: 'number',
            attributes: [
                {
                    type: 'value',
                    value: obj.properties.dy,
                },
            ],
            evtType: 'change',
            callback: evt => {
                const dy = parseInt(evt.srcElement.value);
                obj.properties.dy = dy;
                render(false, true, false);
            }
        };
        fields.push(widthField, heightField, dxField, dyField);
    };
    fields.push(deleteField);
    const popup = createPopup(obj.x + obj.width, obj.y, fields);
    document.body.appendChild(popup);
};

function createMovementPopup(obj) {
    if (!obj) { return; };
    const currentLayer = SESSION.SELECTED_LAYER_TYPE;
    function renderCurrentLayer() {
        if (currentLayer === 'CHAR') {
            render(false, false, true);
        } else if (currentLayer === 'OBJE') {
            render(false, true, false);
        }
    }
    const xField = {
        name: 'x',
        type: 'number',
        attributes: [

            {
                type: 'value',
                value: obj.x,
            },
        ],
        evtType: 'change',
        callback: evt => {
            let x = parseInt(evt.srcElement.value);
            if (SESSION.SNAPX !== 0) {
                x = Math.round((x / SESSION.SNAPX)) * SESSION.SNAPX;
            };
            if (obj.x === x) { return };
            obj.x = x;
            renderCurrentLayer();
        }
    };
    const yField = {
        name: 'y',
        type: 'number',
        attributes: [
            {
                type: 'value',
                value: obj.y,
            },
        ],
        evtType: 'change',
        callback: evt => {
            let y = parseInt(evt.srcElement.value);
            if (SESSION.SNAPY !== 0) {
                y = Math.round((y / SESSION.SNAPY)) * SESSION.SNAPY;
            };
            if (obj.y === y) { return };
            obj.y = y;
            renderCurrentLayer();
        }
    };
    const popup = createPopup(obj.x + obj.width, obj.y, [xField, yField]);
    document.body.appendChild(popup);
};

function setSelectedClass(el) {
    Array.from(document.getElementsByClassName('tool')).forEach(btn => {
        btn.classList.remove('selected');
    });
    if (el) {
        el.classList.add('selected');
    };
};

function toggleActiveClass(el) {
    if (el) {
        el.classList.toggle('active');
        if (el.dataset.aid == 'multispawn') {
            if (!EDITORCONFIG.ALLOWMULTIPLESPAWNS) {
                el.classList.remove('active');
            }
        } else if (el.dataset.aid == 'previews') {
            if (!EDITORCONFIG.PLATFORMPREVIEWS) {
                el.classList.remove('active');
            }
        }
    };
};

function clearHighlight() {
    hlCtx.clearRect(0, 0, highlightCanvas.offsetWidth, highlightCanvas.offsetHeight);
}

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

        clearHighlight();

        // Dragging function
        if (SESSION.MOUSEDOWN && SESSION.SELECTED_TOOL_TYPE === 'TILE') {
            setBlock([SESSION.TILEX, SESSION.TILEY], SESSION.SELECTED_TILE_TYPE)
        };

        if (SESSION.MOUSEDOWN && SESSION.SELECTED_TOOL_TYPE === 'CHAR' && SESSION.SELECTED_CHAR_TYPE === 'm') {
            move(SESSION.SELECTED_ELEMENT_ID, LEVEL.CHARSLAYER, 'CHAR');
        };


        if (SESSION.MOUSEDOWN && SESSION.SELECTED_TOOL_TYPE === 'OBJE' && SESSION.SELECTED_OBJE_TYPE === 'm') {
            move(SESSION.SELECTED_ELEMENT_ID, LEVEL.OBJECTLAYER, 'OBJE');
        };

        // Highlight
        if (SESSION.SELECTED_TOOL_TYPE === 'TILE') { highlightTile(tileX, tileY); };
        if (SESSION.SELECTED_TOOL_TYPE === 'CHAR') { highlight(mouseX, mouseY, LEVEL.CHARSLAYER); };
        if (SESSION.SELECTED_TOOL_TYPE === 'OBJE') { highlight(mouseX, mouseY, LEVEL.OBJECTLAYER, true); };
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
                    let xPos = SESSION.MOUSEX;
                    let yPos = SESSION.MOUSEY;
                    if (SESSION.SNAPX !== 0) {
                        xPos = Math.round((xPos / SESSION.SNAPX)) * SESSION.SNAPX;
                    };
            
                    if (SESSION.SNAPY !== 0) {
                        yPos = Math.round((yPos / SESSION.SNAPY)) * SESSION.SNAPY;
                    };
                    addCharObj(SESSION.SELECTED_CHAR_TYPE, [xPos - 32, yPos + 32])
                };
                break;

            case 'OBJE':
                if (SESSION.SELECTED_OBJE_TYPE === 'e') {
                    showObjPopup();
                }
                else if (SESSION.SELECTED_OBJE_TYPE !== 'm') {
                    let xPos = SESSION.MOUSEX;
                    let yPos = SESSION.MOUSEY;
                    if (SESSION.SNAPX !== 0) {
                        xPos = Math.round((xPos / SESSION.SNAPX)) * SESSION.SNAPX;
                    };
            
                    if (SESSION.SNAPY !== 0) {
                        yPos = Math.round((yPos / SESSION.SNAPY)) * SESSION.SNAPY;
                    };
                    addObject(SESSION.SELECTED_OBJE_TYPE, [xPos - 32, yPos + 32])
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
                selectElement(obj.id, 'CHAR');
            } else {
                deselectElement();
            };
        };
        if (SESSION.SELECTED_TOOL_TYPE === 'OBJE' && SESSION.SELECTED_OBJE_TYPE === 'm') {
            const obj = LEVEL.OBJECTLAYER.objects.find(obj => {
                return collidesWithCursor(obj, mouseX, mouseY, true);
            });
            if (obj) {
                selectElement(obj.id, 'OBJE');
            } else {
                deselectElement();
            }
        };
        removePopup();
    });

    document.addEventListener('mouseup', _ => {
        SESSION.MOUSEDOWN = false;
        deselectElement();
        SESSION.CURRENTLY_DRAGGING = false;
    });

    highlightCanvas.addEventListener('mouseleave', _ => {
        SESSION.MOUSEDOWN = false;
        clearHighlight();
    });

    Array.from(document.getElementsByClassName('tile-option')).forEach(el => {
        el.addEventListener('click', _ => {
            if (SESSION.SELECTED_TILE_TYPE == parseInt(el.dataset.tid)) {
                SESSION.SELECTED_TILE_TYPE = undefined;
                SESSION.SELECTED_TOOL_TYPE = undefined;
                setSelectedClass(undefined);
            } else {
                SESSION.SELECTED_TILE_TYPE = parseInt(el.dataset.tid);
                SESSION.SELECTED_TOOL_TYPE = 'TILE';
                setSelectedClass(el);
            };
        });
    });

    Array.from(document.getElementsByClassName('char-option')).forEach(el => {
        el.addEventListener('click', _ => {
            if (SESSION.SELECTED_CHAR_TYPE == parseInt(el.dataset.gid) || SESSION.SELECTED_CHAR_TYPE == el.dataset.gid) {
                SESSION.SELECTED_CHAR_TYPE = undefined;
                SESSION.SELECTED_TOOL_TYPE = undefined;
                setSelectedClass(undefined);
            } else {
                SESSION.SELECTED_CHAR_TYPE = parseInt(el.dataset.gid);
                if (isNaN(SESSION.SELECTED_CHAR_TYPE)) {
                    SESSION.SELECTED_CHAR_TYPE = el.dataset.gid;
                }
                SESSION.SELECTED_TOOL_TYPE = 'CHAR';
                setSelectedClass(el);
            };
        });
    });

    Array.from(document.getElementsByClassName('obje-option')).forEach(el => {
        el.addEventListener('click', _ => {
            if (SESSION.SELECTED_OBJE_TYPE == el.dataset.aid) {
                console.log('bonjour')
                SESSION.SELECTED_OBJE_TYPE = undefined;
                SESSION.SELECTED_TOOL_TYPE = undefined;
                setSelectedClass(undefined);
            } else {
                SESSION.SELECTED_OBJE_TYPE = el.dataset.aid;
                SESSION.SELECTED_TOOL_TYPE = 'OBJE';
                setSelectedClass(el);
            };
        });
    });

    Array.from(document.getElementsByClassName('editor-option')).forEach(el => {
        el.addEventListener('click', _ => {
            if (el.dataset.aid == 'multispawn') {
                if (EDITORCONFIG.ALLOWMULTIPLESPAWNS) {
                    EDITORCONFIG.ALLOWMULTIPLESPAWNS = false;
                } else {
                    EDITORCONFIG.ALLOWMULTIPLESPAWNS = true;
                }
            } else {
                if (EDITORCONFIG.PLATFORMPREVIEWS) {
                    EDITORCONFIG.PLATFORMPREVIEWS = false;
                    render(false, true, false);
                } else {
                    EDITORCONFIG.PLATFORMPREVIEWS = true;
                    render(false, true, false);
                }
            }
            toggleActiveClass(el);
        })
    })

    document.getElementById('resize').addEventListener('click', resizeLevel);

    document.getElementById('level-width').value = LEVEL.WIDTH;
    document.getElementById('level-height').value = LEVEL.HEIGHT;

    document.getElementById('snap-x').addEventListener('change', evt => {
        SESSION.SNAPX = parseInt(evt.target.value);
    });
    document.getElementById('snap-y').addEventListener('change', evt => {
        SESSION.SNAPY = parseInt(evt.target.value);
    });

    document.addEventListener('mousedown', evt => {
        if (!document.getElementById('popup')) { return; };
        if (!evt.composedPath().includes(document.getElementById('popup'))) {
            document.getElementById('popup').remove();
        };
    });
};