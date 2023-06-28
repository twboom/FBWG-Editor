export class Level {
    constructor(width, height, tiles, objects) {
        this.width = width;
        this.height = height;
        this.tiles = tiles ? tiles : Array(height).fill(Array(width).fill(0));
        this.objects = objects ? objects : [];
    };
};