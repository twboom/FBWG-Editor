const CONFIG = {
    BLOCK_SIZE: 32,
}

const LEVEL = {
    WIDTH: 0,
    HEIGHT: 0
}

function renderTileLayer(tileLayer) {
    function drawTile([x, y], color) {
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

        console.log(x, y, 'type', color)
        ctx.beginPath();
        ctx.rect(x*CONFIG.BLOCK_SIZE, y*CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
        ctx.fillStyle = COLOR_LOOKUP[color];
        ctx.fill();
        ctx.strokeStyle = '#333333'
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
    canvas.width = LEVEL.WIDTH * CONFIG.BLOCK_SIZE;
    canvas.height = LEVEL.HEIGHT * CONFIG.BLOCK_SIZE;

    // Render tiles
    const tileLayers = levelJSON.layers.filter( ({ type }) => type === 'tilelayer' );
    console.log(tileLayers)
    tileLayers.forEach(layer => {
        renderTileLayer(layer);
    });
};