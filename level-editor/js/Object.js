import { FIRST_FREE_ID, LEVEL } from './session.js';

export class Object {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = FIRST_FREE_ID;
        FIRST_FREE_ID++;
        LEVEL.objects.push(this);
    };
};

/* LevelPoint Objects */
export class LevelPoints extends Object {
    constructor(x, y) {
        super(x, y);
    };
};

export class SpawnFB extends LevelPoints {
    constructor(x, y) {
        super(x, y);
    };
};

export class SpawnWG extends LevelPoints {
    constructor(x, y) {
        super(x, y);
    };
};

export class DoorFB extends LevelPoints {
    constructor(x, y) {
        super(x, y);
    };
};

export class DoorWG extends LevelPoints {
    constructor(x, y) {
        super(x, y);
    };
};

/* Diamonds */
export class Diamond extends Object {
    constructor(x, y, type) {
        super(x, y);
        this.type = type;
    };
};

/* Mechanical objects */
export class Mechanics extends Object {
    constructor(x, y, group) {
        super(x, y);
        this.group = group;
    };
};

export class Button extends Mechanics {
    constructor(x, y, group) {
        super(x, y, group);
    };
};

export class Lever extends Mechanics {
    constructor(x, y, group, direction) {
        super(x, y, group);
        this.direction = direction;
    };
};

export class Platform extends Mechanics {
    constructor(x, y, group, dx, dy) {
        super(x, y, group);
        this.dx = dx;
        this.dy = dy;
    };
};