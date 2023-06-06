const CONFIG = {
    SLOPE_STEEPNESS: 0.6
}


const LEVEL = {
    BLOCK_SIZE: 32,
    WIDTH: 0,
    HEIGHT: 0
}

function renderTileLayer(tileLayer) {
    function drawTile([x, y], blockId, index) {
        if (blockId >= 2 && blockId <= 5) {
            drawTriangle(blockId, [x, y]);

        } else if (blockId >= 6 && blockId <= 8) {
            prevId = tileLayer.data[index - 1]
            nextId = tileLayer.data[index + 1]
            drawFluid(blockId, prevId, nextId ,[x, y]);
        } else{
            const COLOR_LOOKUP = [
                'black', // Air
                'white', // Ground
                'gray', // Top slope right
                'gray', // Top slope left
                'gray', // Bottom slope left
                'gray', // Bottom slope right
                'blue', // Water
                'red', // Lava
                'green', // Toxin
            ];
    
            //console.log(x, y, 'type', blockId)
            ctx.beginPath();
            ctx.rect(x*LEVEL.BLOCK_SIZE, y*LEVEL.BLOCK_SIZE, LEVEL.BLOCK_SIZE, LEVEL.BLOCK_SIZE);
            ctx.fillStyle = COLOR_LOOKUP[blockId];
            ctx.fill();
        }
        ctx.beginPath();
        ctx.rect(x*LEVEL.BLOCK_SIZE, y*LEVEL.BLOCK_SIZE, LEVEL.BLOCK_SIZE, LEVEL.BLOCK_SIZE);
        ctx.strokeStyle = '#333333';
        ctx.stroke();
    };

    const tiles = tileLayer.data;
    for (let i = 0; i < tiles.length; i++) {
        const tileCoordinates = [i%LEVEL.WIDTH, Math.floor(i/LEVEL.WIDTH)];
        drawTile(tileCoordinates, tiles[i], i)
    }
};

function renderObjectLayer(layer) {
    const objects = layer.objects;
    objects.forEach(obj => {
        console.log(obj);
        objCtx.beginPath();
        if (obj.type === 'platform') {
            obj.y += obj.height;
        };
        objCtx.rect(obj.x, obj.y, obj.width, -obj.height)
        objCtx.fillStyle = 'purple';
        objCtx.fill();
    });
};

function renderCharsLayer(layer) {
    const chars = layer.objects;
    chars.forEach(obj => {
        console.log(obj);
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
                charCtx.rect(obj.x + 0.25 * obj.width, obj.y - 0.25 * obj.height, 0.5 * obj.width, -0.5 * obj.height);
                charCtx.fillStyle = 'red';
                break;
            case 21:
                charCtx.rect(obj.x + 0.25 * obj.width, obj.y - 0.25 * obj.height, 0.5 * obj.width, -0.5 * obj.height);
                charCtx.fillStyle = 'blue';
                break;
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

function render(levelJSON) {
    // Set correct width and height
    LEVEL.WIDTH = levelJSON.width;
    LEVEL.HEIGHT = levelJSON.height;
    canvas.width = LEVEL.WIDTH * LEVEL.BLOCK_SIZE;
    canvas.height = LEVEL.HEIGHT * LEVEL.BLOCK_SIZE;
    objectsCanvas.width = LEVEL.WIDTH * LEVEL.BLOCK_SIZE;
    objectsCanvas.height = LEVEL.HEIGHT * LEVEL.BLOCK_SIZE;
    charsCanvas.width = LEVEL.WIDTH * LEVEL.BLOCK_SIZE;
    charsCanvas.height = LEVEL.HEIGHT * LEVEL.BLOCK_SIZE;

    // Render tiles
    const tileLayers = levelJSON.layers.filter( ({ type }) => type === 'tilelayer' );
    console.log(tileLayers)
    tileLayers.forEach(layer => {
        renderTileLayer(layer);
    });

    // Render objects
    const objectLayers = levelJSON.layers.filter( ({ name }) => name === 'Objects');
    console.log(objectLayers);
    objectLayers.forEach(layer => {
        renderObjectLayer(layer);
    });

    // Render objects
    const charsLayers = levelJSON.layers.filter( ({ name }) => name === 'Chars');
    console.log(charsLayers);
    charsLayers.forEach(layer => {
        renderCharsLayer(layer);
    });
};

function drawTriangle(id, [x, y], isBackground=false) {
    x *= LEVEL.BLOCK_SIZE
    y *= LEVEL.BLOCK_SIZE
    ctx.beginPath();
    switch (id) {
        case 2:
            ctx.moveTo(x, y + LEVEL.BLOCK_SIZE);
            ctx.lineTo(x + LEVEL.BLOCK_SIZE, y  + LEVEL.BLOCK_SIZE);
            ctx.lineTo(x + LEVEL.BLOCK_SIZE, y);
            break
        case 3:
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + LEVEL.BLOCK_SIZE);
            ctx.lineTo(x + LEVEL.BLOCK_SIZE, y + LEVEL.BLOCK_SIZE);
            break
        case 4:
            ctx.moveTo(x, y);
            ctx.lineTo(x + LEVEL.BLOCK_SIZE, y);
            ctx.lineTo(x + LEVEL.BLOCK_SIZE, y + LEVEL.BLOCK_SIZE);
            break
        case 5:
            ctx.moveTo(x, y);
            ctx.lineTo(x + LEVEL.BLOCK_SIZE, y);
            ctx.lineTo(x , y + LEVEL.BLOCK_SIZE);
            break    
    }
    if (isBackground) {
        ctx.fillStyle = 'black';
    } else {
        ctx.fillStyle = 'white';
    }
    ctx.fill();
    if (!isBackground) {
        drawTriangle(7-id, [x/LEVEL.BLOCK_SIZE, y/LEVEL.BLOCK_SIZE], true);
    }
}

function drawFluid(id, prevId, nextId, [x, y]) {
    if (x == 0) {
        prevId = null;
        console.log('left edge')
    } if (x == LEVEL.WIDTH - 1) {
        nextId = null;
        console.log('right edge')
    };
    x *= LEVEL.BLOCK_SIZE;
    y *= LEVEL.BLOCK_SIZE;
    console.log(x, LEVEL.WIDTH - 1)
    ctx.beginPath();
    ctx.rect(x, y, LEVEL.BLOCK_SIZE, LEVEL.BLOCK_SIZE);
    const COLOR_LOOKUP = ['blue', 'red', 'green']
    ctx.fillStyle = COLOR_LOOKUP[id - 6];
    ctx.fill();
    if (prevId != id) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + LEVEL.BLOCK_SIZE);
        ctx.lineTo(x + LEVEL.BLOCK_SIZE, y + LEVEL.BLOCK_SIZE);
        ctx.lineTo(x + LEVEL.BLOCK_SIZE, y + CONFIG.SLOPE_STEEPNESS * LEVEL.BLOCK_SIZE);
        ctx.fillStyle = 'white';
        ctx.fill();
    } if (nextId != id) {
        ctx.beginPath();
        ctx.moveTo(x + LEVEL.BLOCK_SIZE, y);
        ctx.lineTo(x + LEVEL.BLOCK_SIZE, y + LEVEL.BLOCK_SIZE);
        ctx.lineTo(x, y + LEVEL.BLOCK_SIZE);
        ctx.lineTo(x, y + CONFIG.SLOPE_STEEPNESS * LEVEL.BLOCK_SIZE);
        ctx.fillStyle = 'white';
        ctx.fill();
    } if (prevId == id && nextId == id) {
        ctx.beginPath();
        ctx.rect(x, y + CONFIG.SLOPE_STEEPNESS * LEVEL.BLOCK_SIZE, LEVEL.BLOCK_SIZE, (1 - CONFIG.SLOPE_STEEPNESS) * LEVEL.BLOCK_SIZE);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}