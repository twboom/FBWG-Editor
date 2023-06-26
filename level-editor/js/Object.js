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

export class FBDiamond extends Diamond {
    constructor(X, y, type) {
        super(x, y, type);
    };
};

export class WGDiamond extends Diamond {
    constructor(x, y, type) {
        super(x, y, type);
    };
};

export class SilverDiamond extends Diamond {
    constructor(x, y, type) {
        super(x, y, type);
    };
};

export class FBWGDiamond extends Diamond {
    constructor(X, y, type) {
        super(x, y, type);
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

/* Polyline objects */
export class Polyline extends Object {
    constructor(x, y, group, [x1, y1], [x2, y2]) {
        super(x, y);
        this.group = group;
        this.pos1 = [x1, y1];
        this.pos2 = [x2, y2];
    };
};

export class Hanger extends Polyline {
    constructor(x, y, group, [x1, y1], [x2, y2], barWidth, density, fullRotation) {
        super(x, y, group, [x1, y1], [x2, y2]);
        this.barWidth = barWidth;
        this.density = density;
        this.fullRotation = fullRotation;
    };
};

export class Slider extends Polyline {
    constructor(x, y, group, [x1, y1], [x2, y2], max, min) {
        super(x, y, group, [x1, y1], [x2, y2]);
        this.max = max;
        this.min = min;
    };
};