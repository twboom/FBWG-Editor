const CONFIG = {
    SLOPE_STEEPNESS: 0.6
}


const LEVEL = {
    BLOCK_SIZE: 32,
    WIDTH: 0,
    HEIGHT: 0,
    TILELAYER: [],
    OBJECTLAYER: {},
    CHARSLAYER: {}
}

const SESSION = {
    MOUSEDOWN: false,
    MOUSEX: 0,
    MOUSEY: 0,
    TILEX: 0,
    TILEY: 0,
    SELECTED_TOOL_TYPE: 'TILE',
    SELECTED_TILE_TYPE: 0,
    SELECTED_OBJE_TYPE: 20,
}

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

function renderCharsLayer(layer) {
    const chars = layer.objects;
    chars.forEach(obj => {
        charCtx.beginPath();
        switch (obj.gid){
            case 16:
                charCtx.fillStyle = 'red';
                break;
            case 17:
                charCtx.fillStyle = 'blue';
                break;
            case 18:
                charCtx.fillStyle = 'red';
                break;
            case 19:
                charCtx.fillStyle = 'blue';
                break;
            case 20:
                console.log('red diamond');
                const img1 = new Image(2048,2048);
                img1.src = "assets/atlasses/CharAssets.png";
                img1.onload = charCtx.drawImage(img1, 1086, 1339, 113, 114, obj.x - 0.8*LEVEL.BLOCK_SIZE, (obj.y - obj.width) - 0.8*LEVEL.BLOCK_SIZE, 1.8*obj.width, 1.8*obj.height);
                return;
            case 21:
                console.log('blue diamond');
                const img2 = new Image(2048,2048);
                img2.src = "assets/atlasses/CharAssets.png";
                img2.onload = charCtx.drawImage(img2, 969, 1339, 112, 112, obj.x - 0.8*LEVEL.BLOCK_SIZE, (obj.y - obj.width) - 0.8*LEVEL.BLOCK_SIZE, 1.8*obj.width, 1.8*obj.height);
                return;
            case 22:
                charCtx.rect(obj.x + 0.125 * obj.width, obj.y - 0.125 * obj.height, 0.75 * obj.width, -0.75 * obj.height);
                charCtx.fillStyle = 'white';
                break;
            case 23:
                charCtx.rect(obj.x + 0.125 * obj.width, obj.y - 0.125 * obj.height, 0.375 * obj.width, -0.75 * obj.height);
                charCtx.fillStyle = 'red';
                charCtx.fill();
                charCtx.beginPath();
                charCtx.rect(obj.x + 0.5 * obj.width, obj.y - 0.125 * obj.height, 0.375 * obj.width, -0.75 * obj.height);
                charCtx.fillStyle = 'blue';
                charCtx.fill();
                return;
        };
        if (obj.gid >= 16 && obj.gid <= 19) {
            charCtx.rect(obj.x, obj.y, obj.width, -obj.height);
        };
        charCtx.fill();
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

function render() {
    // Clear canvas
    tileCtx.clearRect(0, 0, tileCanvas.width, tileCanvas.height);
    objCtx.clearRect(0, 0, objectsCanvas.width, objectsCanvas.height);
    charCtx.clearRect(0, 0, charsCanvas.width, charsCanvas.height);

    // Render layers
    renderTileLayer(LEVEL.TILELAYER);
    renderObjectLayer(LEVEL.OBJECTLAYER);
    renderCharsLayer(LEVEL.CHARSLAYER);
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

    LEVEL.TILELAYER[pos] = id;
    render();
};

function setObject(gid, height, id, name, dx, dy, group, rotation, type, visible, width, x, y, deleting = false) {
    if (deleting) {
        for (let i = 0; LEVEL.OBJECTLAYER.length; i++){
            if (LEVEL.OBJECTLAYER[i].id == id) {
                LEVEL.CHARSLAYER.splice(i, 1);
                render();
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
    LEVEL.OBJECTLAYER.objects.push(objectTemplate);
    render();
};

function setChar({gid, height, id, name, rotation, type, visible, width}, x, y, deleting = false) {
    if (deleting) {
        for (let i = 0; LEVEL.CHARSLAYER.objects.length; i++){
            if (LEVEL.CHARSLAYER.objects[i].id == id) {
                LEVEL.CHARSLAYER.objects.splice(i, 1);
                render();
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
    render();
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
    if (SESSION.SELECTED_OBJE_TYPE >= 16 && SESSION.SELECTED_OBJE_TYPE <= 19 && autoDeleteOthers) {
        const others  = LEVEL.CHARSLAYER.objects.filter(({ gid }) => gid == type);
        others.forEach(el => {
            console.log(el)
            setChar({id: el.id}, null, null, true);
        });
    };
    setChar(options, x, y);
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
        hlCtx.beginPath()
        hlCtx.rect(tileX * blockSize, tileY * blockSize, blockSize, blockSize);
        hlCtx.fillStyle = 'cyan'
        if (SESSION.SELECTED_TOOL_TYPE === 'TILE') { hlCtx.fill() };

        if (SESSION.MOUSEDOWN && SESSION.SELECTED_TOOL_TYPE) {
            setBlock([SESSION.TILEX, SESSION.TILEY], SESSION.SELECTED_TILE_TYPE)
        }
    });

    highlightCanvas.addEventListener('click', _ => {
        switch(SESSION.SELECTED_TOOL_TYPE) {
            case 'TILE':
                setBlock([SESSION.TILEX, SESSION.TILEY], SESSION.SELECTED_TILE_TYPE);
                break;

            case 'OBJE':
                if (SESSION.SELECTED_OBJE_TYPE >= 16 && SESSION.SELECTED_OBJE_TYPE <= 24) {
                    addCharObj(SESSION.SELECTED_OBJE_TYPE, [SESSION.MOUSEX - 32, SESSION.MOUSEY + 32])
                }
                break;
        };
    });

    highlightCanvas.addEventListener('mousedown', _ => {
        SESSION.MOUSEDOWN = true;
    });

    document.addEventListener('mouseup', _ => {
        SESSION.MOUSEDOWN = false;
    });

    highlightCanvas.addEventListener('mouseleave', _ => {
        SESSION.MOUSEDOWN = false;
        hlCtx.clearRect(0, 0, LEVEL.WIDTH * LEVEL.BLOCK_SIZE, LEVEL.HEIGHT * LEVEL.BLOCK_SIZE);
    });

    Array.from(document.getElementsByClassName('tile-option')).forEach(el => {
        el.addEventListener('click', _ => {
            SESSION.SELECTED_TILE_TYPE = parseInt(el.dataset.tid);
            SESSION.SELECTED_TOOL_TYPE = 'TILE'
        });
    });

    Array.from(document.getElementsByClassName('obje-option')).forEach(el => {
        el.addEventListener('click', _ => {
            SESSION.SELECTED_OBJE_TYPE = parseInt(el.dataset.gid);
            SESSION.SELECTED_TOOL_TYPE = 'OBJE'
        });
    });
    document.getElementById('resize').addEventListener('click', resizeLevel);

    document.getElementById('level-width').value = LEVEL.WIDTH;
    document.getElementById('level-height').value = LEVEL.HEIGHT;
};