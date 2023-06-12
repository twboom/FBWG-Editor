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
    SELECTED_TILE_TYPE: 0,
    SELECTED_CHAR_TYPE: 20,
    SELECTED_CHAR_ID: undefined,
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

function renderObjectLayer(layer) {
    const objects = layer.objects;
    objects.forEach(obj => {
        objCtx.beginPath();
        let objY = obj.y;
        if (obj.type === 'platform') {
            objY += obj.height;
        };
        objCtx.rect(obj.x, obj.y, obj.width, -obj.height)
        objCtx.fillStyle = 'purple';
        objCtx.fill();
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

function renderCharsLayer(layer) {
    const chars = layer.objects;
    chars.forEach(obj => {
        if (!obj.visible) { return };
        switch (obj.gid){
            case 16: // Spawn FB
                drawImage('assets/chars/spawn_fb.svg', 64, 64, obj.x, obj.y - 64, charCtx);
                break;
            case 17: // Spawn FB
                drawImage('assets/chars/spawn_wg.svg', 64, 64, obj.x, obj.y - 64, charCtx);
                break;
            case 18:
                drawImage('assets/chars/door_fb.svg', 64, 64, obj.x, obj.y - 64, charCtx);
                break;
            case 19: // Door WG
                drawImage('assets/chars/door_wg.svg', 64, 64, obj.x, obj.y - 64, charCtx);
                break;
            case 20: // Diamond FB
                drawImage('assets/chars/diamond_fb.svg', 64, 64, obj.x, obj.y - 64, charCtx);
                break;
            case 21: // Diamond WG
                drawImage('assets/chars/diamond_wg.svg', 64, 64, obj.x, obj.y - 64, charCtx);
                break;
            case 22: // Diamond silver
                drawImage('assets/chars/diamond_silver.svg', 64, 64, obj.x, obj.y - 64, charCtx);
                break;
            case 23: // Diamond FBWG
                drawImage('assets/chars/diamond_fbwg.svg', 64, 64, obj.x, obj.y - 64, charCtx);
                break;
        };
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
        renderCharsLayer(LEVEL.CHARSLAYER);
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

function setObject({gid, height, id, name, dx, dy, group, rotation, type, visible, width}, x, y, deleting = false) {
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
       "rotation":rotation,
       "type":type,
       "visible":visible,
       "width":width,
       "x":x,
       "y":y
    };
    if (!dx && !dy) {
        if (!group) {
            objectTemplate.Array.splice(4, 2);
        } else {
            objectTemplate.properties.Array.splice(0, 2);
            objectTemplate.propertytypes.Array.splice(0,2);
        };
    } 
    if (objType == "platform") {
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
}


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
    if (SESSION.SELECTED_CHAR_TYPE >= 16 && SESSION.SELECTED_CHAR_TYPE <= 19 && autoDeleteOthers) {
        const others  = LEVEL.CHARSLAYER.objects.filter(({ gid }) => gid == type);
        others.forEach(el => {
            setChar({id: el.id}, null, null, true);
        });
    };
    setChar(options, x, y);
};

function collidesWithCursor(obj, x, y) {
    if (
        x >= obj.x &&
        x <= obj.x + obj.width &&
        y <= obj.y &&
        y >= obj.y - obj.height
    ) { return true; }
    else { return false; };
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
    console.log()
    const x = SESSION.MOUSEX;
    const y = SESSION.MOUSEY;
    const obj = LEVEL.CHARSLAYER.objects.find(({ id }) => id === objId)
    if (obj) {
        obj.x = (x - SESSION.MOUSEDOWNX) + obj.x;
        obj.y = (y - SESSION.MOUSEDOWNY) + obj.y;
        render(false, false, true);
        SESSION.MOUSEDOWNX = x;
        SESSION.MOUSEDOWNY = y;
    };
}

function highlightChar(x, y) {
    const obj = LEVEL.CHARSLAYER.objects.find(obj => {
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
        
        if (SESSION.SELECTED_TOOL_TYPE === 'TILE') { highlightTile(tileX, tileY); };
        if (SESSION.SELECTED_TOOL_TYPE === 'CHAR') { highlightChar(mouseX, mouseY); };

        // Dragging function
        if (SESSION.MOUSEDOWN && SESSION.SELECTED_TOOL_TYPE === 'TILE') {
            setBlock([SESSION.TILEX, SESSION.TILEY], SESSION.SELECTED_TILE_TYPE)
        };

        if (SESSION.MOUSEDOWN && SESSION.SELECTED_TOOL_TYPE === 'CHAR' && SESSION.SELECTED_CHAR_TYPE === 'm') {
            moveChar(SESSION.SELECTED_CHAR_ID);
        };
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
                if (SESSION.SELECTED_CHAR_TYPE === 's') { // Select
                    return;
                };
                if (SESSION.SELECTED_CHAR_TYPE >= 16 && SESSION.SELECTED_CHAR_TYPE <= 24) { // Spawns and doors and diamonds
                    addCharObj(SESSION.SELECTED_CHAR_TYPE, [SESSION.MOUSEX - 32, SESSION.MOUSEY + 32])
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
                SESSION.SELECTED_CHAR_ID = obj.id;
            } else {
                SESSION.SELECTED_CHAR_ID = undefined;
            }
        };
    });

    document.addEventListener('mouseup', _ => {
        SESSION.SELECTED_CHAR_ID = undefined;
        SESSION.MOUSEDOWN = false;
    });

    highlightCanvas.addEventListener('mouseleave', _ => {
        SESSION.MOUSEDOWN = false;
        hlCtx.clearRect(0, 0, LEVEL.WIDTH * LEVEL.BLOCK_SIZE, LEVEL.HEIGHT * LEVEL.BLOCK_SIZE);
    });

    function setSelectedClass(el) {
        Array.from(document.getElementsByClassName('tool')).forEach(btn => {
            btn.classList.remove('selected');
        });
        el.classList.add('selected');
    };

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
    document.getElementById('resize').addEventListener('click', resizeLevel);

    document.getElementById('level-width').value = LEVEL.WIDTH;
    document.getElementById('level-height').value = LEVEL.HEIGHT;
};