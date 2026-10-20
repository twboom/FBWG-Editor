export class LevelObject {
    constructor(x, y, options) {

    };
};

/*
    LEVELPOINT OBJECTS
    These objects describe levelpoints; spawnpoints, endpoints and diamonds.
*/

export class LevelPoint extends LevelObject {
    VARIANT_OPTIONS = [
        'fire',
        'water',
        'silver',
        'duo',
    ];

    constructor(x, y, type, variant) {
        super(x, y);
        this.type = type;
        this.variant = variant;
    };
};

export class Diamond extends LevelObject {
    VARIANT_OPTIONS = [
        'fire',
        'water',
        'silver',
        'duo',
    ];

    constructor(x, y, variant) {
        super(x, y, 'diamond', variant);
    };
};