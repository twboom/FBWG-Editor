export default class Level {
    constructor(width, height, tiles, objects, text) {
        this.width = width;
        this.height = height;
        this.tiles = tiles ? tiles : Array(height).fill(Array(width).fill('air'));
        this.objects = objects ? objects : [];
        this.text = text ? text : [];
    };
};