import Level from "./Level.mjs";

import { reverseTileLookup } from './fbwg-lookup.mjs'

/**
 * 
 * @param {Object} originalFile Orginal level file object from the game.
 * @returns {Level} A level object to be used within the editor.
 */
export function convertFromOriginalLevelFileObject(originalFile) {
    // Extract basic metadata
    const meta = {
        width: originalFile.width,
        height: originalFile.height,
    };
    let tiles;

    // Process layers
    originalFile.layers.forEach(layer => {
        switch (layer.type) {
            case 'tilelayer':
                tiles = readTileLayer(layer).tiles;
                break;
        
            default:
                break;
        }
    });

    let level = new Level(meta.width, meta.height, tiles);

    return level;
};

/**
 * 
 * @param {Object} tileLayer 
 * @returns Width, height and contents of the tilelayer, converted into the internal format.
 */
export function readTileLayer(tileLayer) {
    const width = tileLayer.width;
    const height = tileLayer.height;
    let tiles = Array(height).fill(Array(width).fill('air'));

    // Move through Y layers
    for (let y = 0; y < height; y++) {
        tiles[y] =[];
        for (let x = 0; x < width; x++) {
            
            tiles[y][x] = reverseTileLookup(tileLayer.data[x + y * width]);
        };
    };

    return {width, height, tiles};
};


export function readObjectLayer(objectLayer) {

}