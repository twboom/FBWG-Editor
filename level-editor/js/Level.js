export class Level {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = Array(height).fill(Array(width).fill(0));
        this.objects = [];
    };
};