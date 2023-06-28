import { SESSION } from './session.js';

export class Object {
    constructor(x, y, rotation) {
        this.x = x;
        this.y = y;
        this.rotation = rotation
        this.id = SESSION.FIRST_FREE_ID;
        SESSION.FIRST_FREE_ID++;
        SESSION.LEVEL.objects.push(this);
    };
};

/* LevelPoint Objects */
export class LevelPoints extends Object {
    constructor(x, y, rotation) {
        super(x, y, rotation);
    };
};

export class SpawnFB extends LevelPoints {
    constructor(x, y, rotation) {
        super(x, y, rotation);
    };
};

export class SpawnWG extends LevelPoints {
    constructor(x, y, rotation) {
        super(x, y, rotation);
    };
};

export class DoorFB extends LevelPoints {
    constructor(x, y, rotation) {
        super(x, y, rotation);
    };
};

export class DoorWG extends LevelPoints {
    constructor(x, y, rotation) {
        super(x, y, rotation);
    };
};

/* Diamonds */
export class Diamond extends Object {
    constructor(x, y, rotation, type) {
        super(x, y, rotation);
        this.type = type;
    };
};

/* Mechanical objects */
export class Mechanics extends Object {
    constructor(x, y, rotation, group) {
        super(x, y, rotation);
        this.group = group;
    };
};

export class Button extends Mechanics {
    constructor(x, y, rotation, group) {
        super(x, y, rotation, group);
    };
};

export class TimerButton extends Mechanics {
    constructor(x, y, rotation, group, time) {
        super(x, y, rotation, group);
        this.time = time;
    };
};

export class Lever extends Mechanics {
    constructor(x, y, rotation, group, direction) {
        super(x, y, rotation, group);
        this.direction = direction;
    };
};

export class Platform extends Mechanics {
    constructor(x, y, rotation, group, dx, dy) {
        super(x, y, rotation, group);
        this.dx = dx;
        this.dy = dy;
    };
};

export class RotationMirror extends Mechanics {
    constructor(x, y, rotation, group) {
        super(x, y, rotation, group);
    };
};

export class RotationBoxMirror extends Mechanics {
    constructor(x, y, rotation, group){
        super(x, y, rotation ,group);
    };
};

/* Polyline objects */
export class Polyline extends Object {
    constructor(x, y, rotation, group, [x1, y1], [x2, y2]) {
        super(x, y, rotation);
        this.group = group;
        this.pos1 = [x1, y1];
        this.pos2 = [x2, y2];
    };
};

export class Hanger extends Polyline {
    constructor(x, y, rotation, group, [x1, y1], [x2, y2], barWidth, density, fullRotation) {
        super(x, y, rotation, group, [x1, y1], [x2, y2]);
        this.barWidth = barWidth;
        this.density = density;
        this.fullRotation = fullRotation;
    };
};

export class Slider extends Polyline {
    constructor(x, y, rotation, group, [x1, y1], [x2, y2], max, min) {
        super(x, y, rotation, group, [x1, y1], [x2, y2]);
        this.max = max;
        this.min = min;
    };
};

/* Moveable objects */
export class MoveableObject extends Object {
    constructor(x, y, rotation) {
        super(x, y, rotation);
    };
};

export class Ball extends MoveableObject {
    constructor(x, y, rotation) {
        super(x, y, rotation);
    };
};

export class Box extends MoveableObject {
    constructor(x, y, rotation) {
        super(x, y, rotation);
    };
};

export class HeavyBox extends MoveableObject {
    constructor(x, y, rotation) {
        super(x, y, rotation);
    };
};

export class MirrorBox extends MoveableObject {
    constructor(x, y, rotation) {
        super(x, y, rotation);
    };
};

/* Portal objects */
export class Portal extends Object {
    constructor(x, y, rotation, group, initialState, portalId) {
        super(x, y, rotation);
        this.group = group;
        this.initialState = initialState;
        this.portalId = portalId;
        this.rotation = rotation
    };
};

export class PortalLeft extends Portal {
    constructor(x, y, rotation, group, initialState, portalId) {
        super(x, y, rotation, group, initialState, portalId);
    };
};

export class PortalRight extends Portal {
    constructor(x, y, rotation, group, initialState, portalId) {
        super(x, y, rotation, group, initialState, portalId);
    };
};

/* Light objects */
export class Lights extends Object {
    constructor(x, y, rotation, color, group) {
        super(x, y, rotation);
        this.color = color;
        this.group = group
    };
};

export class LightEmitter extends Lights {
    constructor(x, y, rotation, color, initialState, group) {
        super(x, y, rotation, color, group);
        this.initialState = initialState;
    };
};

export class LightReceiver extends Lights {
    constructor(x, y, rotation, color, group) {
        super(x, y, rotation, color, group);
    };
};

/* Wind objects */
export class WindObjects extends Object {
    constructor(x, y, rotation, group, initialState, length) {
        super(x, y, rotation);
        this.group = group;
        this.initialState = initialState;
        this.length = length;
    };
};

export class Fan extends WindObjects {
    constructor(x, y, rotation, group, initialState, length) {
        super(x, y, rotation, group, initialState, length);
    };
};