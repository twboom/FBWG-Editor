const LEVEL = {
    BLOCK_SIZE: 32,
    WIDTH: 0,
    HEIGHT: 0
}

function renderTileLayer(tileLayer) {
    function drawTile([x, y], blockId) {
        if (blockId >= 2 && blockId <= 5) {
            drawtriangle(blockId, [x, y]);

        } else {
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
    
            console.log(x, y, 'type', blockId)
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
        drawTile(tileCoordinates, tiles[i])
    }
};

function render(levelJSON) {
    // Set correct width and height
    LEVEL.WIDTH = levelJSON.width;
    LEVEL.HEIGHT = levelJSON.height;
    canvas.width = LEVEL.WIDTH * LEVEL.BLOCK_SIZE;
    canvas.height = LEVEL.HEIGHT * LEVEL.BLOCK_SIZE;

    // Render tiles
    const tileLayers = levelJSON.layers.filter( ({ type }) => type === 'tilelayer' );
    console.log(tileLayers)
    tileLayers.forEach(layer => {
        renderTileLayer(layer);
    });
};

function drawtriangle(id, [x, y], isBackground=false) {
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
        ctx.fillStyle = 'black'
    } else {
        ctx.fillStyle = 'white'
    }
    ctx.fill();
    if (!isBackground) {
        drawtriangle(7-id, [x/LEVEL.BLOCK_SIZE, y/LEVEL.BLOCK_SIZE], true)
    }
}
