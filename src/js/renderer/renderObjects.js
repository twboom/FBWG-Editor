/**
 * Vector rendering routines for all Fireboy & Watergirl game entities and tiles.
 * Ported from level-editor/js/render_objects.js with ES module architecture.
 */

// Color palettes for buttons and levers (groups 1 through 8)
const PALETTE = [
    { fill: 'red', stroke: 'darkred' },
    { fill: 'green', stroke: 'darkgreen' },
    { fill: 'blue', stroke: 'darkblue' },
    { fill: 'yellow', stroke: 'yellowgreen' },
    { fill: 'magenta', stroke: 'purple' },
    { fill: 'lightskyblue', stroke: 'blue' },
    { fill: 'blueviolet', stroke: 'purple' },
    { fill: 'white', stroke: 'gray' }
];

export function spawn_fb(ctx) {
    ctx.beginPath();
    ctx.arc(32, 20, 12, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(32, 32);
    ctx.lineTo(32, 56);
    ctx.moveTo(24, 44);
    ctx.lineTo(32, 36);
    ctx.lineTo(40, 44);
    ctx.moveTo(26, 64);
    ctx.lineTo(32, 56);
    ctx.lineTo(38, 64);
    ctx.strokeStyle = 'firebrick';
    ctx.lineWidth = 4;
    ctx.stroke();
}

export function spawn_wg(ctx) {
    ctx.beginPath();
    ctx.arc(32, 20, 12, 0, Math.PI * 2);
    ctx.fillStyle = 'lightblue';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(32, 32);
    ctx.lineTo(32, 56);
    ctx.moveTo(24, 44);
    ctx.lineTo(32, 36);
    ctx.lineTo(40, 44);
    ctx.moveTo(26, 64);
    ctx.lineTo(32, 56);
    ctx.lineTo(38, 64);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 4;
    ctx.stroke();
}

export function diamond_fb(ctx) {
    ctx.beginPath();
    ctx.moveTo(16, 24);
    ctx.lineTo(24, 16);
    ctx.lineTo(40, 16);
    ctx.lineTo(48, 24);
    ctx.lineTo(32, 44);
    ctx.lineTo(16, 24);
    ctx.lineTo(24, 16);
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'firebrick';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();
}

export function diamond_wg(ctx) {
    ctx.beginPath();
    ctx.moveTo(16, 24);
    ctx.lineTo(24, 16);
    ctx.lineTo(40, 16);
    ctx.lineTo(48, 24);
    ctx.lineTo(32, 44);
    ctx.lineTo(16, 24);
    ctx.lineTo(24, 16);
    ctx.fillStyle = 'lightblue';
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();
}

export function diamond_fbwg(ctx) {
    ctx.beginPath();
    ctx.moveTo(48, 24);
    ctx.lineTo(32, 44);
    ctx.lineTo(16, 24);
    ctx.lineTo(24, 16);
    ctx.lineTo(32, 16);
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'firebrick';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(32, 16);
    ctx.lineTo(40, 16);
    ctx.lineTo(48, 24);
    ctx.lineTo(32, 44);
    ctx.fillStyle = 'lightblue';
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();
}

export function diamond_silver(ctx) {
    ctx.beginPath();
    ctx.moveTo(12, 24);
    ctx.lineTo(24, 12);
    ctx.lineTo(40, 12);
    ctx.lineTo(52, 24);
    ctx.lineTo(32, 48);
    ctx.lineTo(12, 24);
    ctx.lineTo(24, 12);
    ctx.fillStyle = 'lightgray';
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();
}

export function door_fb(ctx) {
    ctx.beginPath();
    ctx.rect(8, 8, 48, 56);
    ctx.fillStyle = 'firebrick';
    ctx.fill();
    ctx.beginPath();
    ctx.rect(16, 16, 32, 48);
    ctx.fillStyle = 'red';
    ctx.fill();
}

export function door_wg(ctx) {
    ctx.beginPath();
    ctx.rect(8, 8, 48, 56);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.beginPath();
    ctx.rect(16, 16, 32, 48);
    ctx.fillStyle = 'lightblue';
    ctx.fill();
}

function drawButton(ctx, colorIndex) {
    const palette = PALETTE[Math.max(0, Math.min(colorIndex, PALETTE.length - 1))];

    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.lineTo(16, 16);
    ctx.lineTo(48, 16);
    ctx.lineTo(64, 32);
    ctx.lineTo(0, 32);
    ctx.lineTo(16, 16);
    ctx.fillStyle = 'orange';
    ctx.strokeStyle = '#a25900';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, 16);
    ctx.lineTo(22, 12);
    ctx.lineTo(42, 12);
    ctx.lineTo(44, 16);
    ctx.lineTo(38, 24);
    ctx.lineTo(26, 24);
    ctx.lineTo(20, 16);
    ctx.fillStyle = palette.fill;
    ctx.strokeStyle = palette.stroke;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
}

export function button_1(ctx) { drawButton(ctx, 0); }
export function button_2(ctx) { drawButton(ctx, 1); }
export function button_3(ctx) { drawButton(ctx, 2); }
export function button_4(ctx) { drawButton(ctx, 3); }
export function button_5(ctx) { drawButton(ctx, 4); }
export function button_6(ctx) { drawButton(ctx, 5); }
export function button_7(ctx) { drawButton(ctx, 6); }
export function button_8(ctx) { drawButton(ctx, 7); }

function drawLeverLeft(ctx, colorIndex) {
    const palette = PALETTE[Math.max(0, Math.min(colorIndex, PALETTE.length - 1))];

    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.lineTo(16, 48);
    ctx.lineTo(48, 48);
    ctx.lineTo(64, 32);
    ctx.lineTo(0, 32);
    ctx.moveTo(32, 32);
    ctx.lineTo(56, 8);
    ctx.fillStyle = 'orange';
    ctx.strokeStyle = '#a25900';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(52, 12, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(52, 12, 6, 0, Math.PI * 2);
    ctx.moveTo(22, 36);
    ctx.lineTo(42, 36);
    ctx.lineTo(44, 44);
    ctx.lineTo(20, 44);
    ctx.lineTo(22, 36);
    ctx.lineTo(42, 36);
    ctx.fillStyle = palette.fill;
    ctx.strokeStyle = palette.stroke;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
}

export function lever_left_1(ctx) { drawLeverLeft(ctx, 0); }
export function lever_left_2(ctx) { drawLeverLeft(ctx, 1); }
export function lever_left_3(ctx) { drawLeverLeft(ctx, 2); }
export function lever_left_4(ctx) { drawLeverLeft(ctx, 3); }
export function lever_left_5(ctx) { drawLeverLeft(ctx, 4); }
export function lever_left_6(ctx) { drawLeverLeft(ctx, 5); }
export function lever_left_7(ctx) { drawLeverLeft(ctx, 6); }
export function lever_left_8(ctx) { drawLeverLeft(ctx, 7); }

function drawLeverRight(ctx, colorIndex) {
    const palette = PALETTE[Math.max(0, Math.min(colorIndex, PALETTE.length - 1))];

    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.lineTo(16, 48);
    ctx.lineTo(48, 48);
    ctx.lineTo(64, 32);
    ctx.lineTo(0, 32);
    ctx.moveTo(32, 32);
    ctx.lineTo(8, 8);
    ctx.fillStyle = 'orange';
    ctx.strokeStyle = '#a25900';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(12, 12, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(12, 12, 6, 0, Math.PI * 2);
    ctx.moveTo(22, 36);
    ctx.lineTo(42, 36);
    ctx.lineTo(44, 44);
    ctx.lineTo(20, 44);
    ctx.lineTo(22, 36);
    ctx.lineTo(42, 36);
    ctx.fillStyle = palette.fill;
    ctx.strokeStyle = palette.stroke;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
}

export function lever_right_1(ctx) { drawLeverRight(ctx, 0); }
export function lever_right_2(ctx) { drawLeverRight(ctx, 1); }
export function lever_right_3(ctx) { drawLeverRight(ctx, 2); }
export function lever_right_4(ctx) { drawLeverRight(ctx, 3); }
export function lever_right_5(ctx) { drawLeverRight(ctx, 4); }
export function lever_right_6(ctx) { drawLeverRight(ctx, 5); }
export function lever_right_7(ctx) { drawLeverRight(ctx, 6); }
export function lever_right_8(ctx) { drawLeverRight(ctx, 7); }

export function box_normal(ctx) {
    ctx.beginPath();
    ctx.rect(0, 0, 64, 64);
    ctx.fillStyle = 'goldenrod';
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(44, 0);
    ctx.lineTo(64, 20);
    ctx.lineTo(64, 44);
    ctx.lineTo(44, 64);
    ctx.lineTo(20, 64);
    ctx.lineTo(0, 44);
    ctx.lineTo(0, 20);
    ctx.lineTo(20, 0);
    ctx.lineTo(44, 0);
    ctx.fillStyle = 'lightgray';
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
}

export function box_heavy(ctx) {
    ctx.beginPath();
    ctx.rect(0, 0, 64, 64);
    ctx.fillStyle = 'goldenrod';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(44, 0);
    ctx.lineTo(64, 20);
    ctx.lineTo(64, 44);
    ctx.lineTo(44, 64);
    ctx.lineTo(20, 64);
    ctx.lineTo(0, 44);
    ctx.lineTo(0, 20);
    ctx.lineTo(20, 0);
    ctx.lineTo(44, 0);
    ctx.fillStyle = 'gray';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
}

export function box_mirror(ctx) {
    ctx.beginPath();
    ctx.rect(0, 0, 64, 64);
    ctx.fillStyle = 'lightgray';
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(44, 0);
    ctx.lineTo(64, 20);
    ctx.lineTo(64, 44);
    ctx.lineTo(44, 64);
    ctx.lineTo(20, 64);
    ctx.lineTo(0, 44);
    ctx.lineTo(0, 20);
    ctx.lineTo(20, 0);
    ctx.lineTo(44, 0);
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(8, 8);
    ctx.lineTo(56, 56);
    ctx.fillStyle = 'silver';
    ctx.strokeStyle = 'silver';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();
}

export function tile_fluid_edge_left_water(ctx) {
    ctx.beginPath();
    ctx.lineTo(32, 16);
    ctx.lineTo(32, 32);
    ctx.lineTo(0, 32);
    ctx.lineTo(0, 0);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.lineTo(32, 0);
    ctx.lineTo(32, 16);
    ctx.lineTo(0, 0);
    ctx.fillStyle = 'red';
    ctx.fill();
}
export function tile_fluid_edge_left_fire(ctx) { tile_fluid_edge_left_water(ctx); }
export function tile_fluid_edge_left_acid(ctx) { tile_fluid_edge_left_water(ctx); }
export function tile_fluid_edge_left_ice(ctx) { tile_fluid_edge_left_water(ctx); }

export function tile_fluid_edge_middle_water(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(32, 16);
    ctx.lineTo(32, 32);
    ctx.lineTo(0, 32);
    ctx.lineTo(0, 16);
    ctx.fillStyle = 'white';
    ctx.fill();
}
export function tile_fluid_edge_middle_fire(ctx) { tile_fluid_edge_middle_water(ctx); }
export function tile_fluid_edge_middle_acid(ctx) { tile_fluid_edge_middle_water(ctx); }
export function tile_fluid_edge_middle_ice(ctx) { tile_fluid_edge_middle_water(ctx); }

export function tile_fluid_edge_right_water(ctx) {
    ctx.beginPath();
    ctx.moveTo(32, 0);
    ctx.lineTo(32, 32);
    ctx.lineTo(0, 32);
    ctx.lineTo(0, 16);
    ctx.lineTo(32, 0);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.lineTo(32, 0);
    ctx.lineTo(0, 16);
    ctx.lineTo(0, 0);
    ctx.fillStyle = 'red';
    ctx.fill();
}
export function tile_fluid_edge_right_fire(ctx) { tile_fluid_edge_right_water(ctx); }
export function tile_fluid_edge_right_acid(ctx) { tile_fluid_edge_right_water(ctx); }
export function tile_fluid_edge_right_ice(ctx) { tile_fluid_edge_right_water(ctx); }

export function tile_block(ctx) {
    ctx.beginPath();
    ctx.lineTo(32, 0);
    ctx.lineTo(32, 32);
    ctx.lineTo(0, 32);
    ctx.lineTo(0, 0);
    ctx.fillStyle = 'white';
    ctx.fill();
}

export function tile_slope(ctx) {
    ctx.beginPath();
    ctx.moveTo(32, 0);
    ctx.lineTo(32, 32);
    ctx.lineTo(0, 32);
    ctx.lineTo(32, 0);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.lineTo(32, 0);
    ctx.lineTo(0, 32);
    ctx.lineTo(0, 0);
    ctx.fillStyle = 'black';
    ctx.fill();
}

// Registry map of routine names
const ROUTINES = {
    spawn_fb,
    spawn_wg,
    diamond_fb,
    diamond_wg,
    diamond_fbwg,
    diamond_silver,
    door_fb,
    door_wg,
    button_1,
    button_2,
    button_3,
    button_4,
    button_5,
    button_6,
    button_7,
    button_8,
    lever_left_1,
    lever_left_2,
    lever_left_3,
    lever_left_4,
    lever_left_5,
    lever_left_6,
    lever_left_7,
    lever_left_8,
    lever_right_1,
    lever_right_2,
    lever_right_3,
    lever_right_4,
    lever_right_5,
    lever_right_6,
    lever_right_7,
    lever_right_8,
    box_normal,
    box_heavy,
    box_mirror,
    tile_fluid_edge_left_water,
    tile_fluid_edge_left_fire,
    tile_fluid_edge_left_acid,
    tile_fluid_edge_left_ice,
    tile_fluid_edge_middle_water,
    tile_fluid_edge_middle_fire,
    tile_fluid_edge_middle_acid,
    tile_fluid_edge_middle_ice,
    tile_fluid_edge_right_water,
    tile_fluid_edge_right_fire,
    tile_fluid_edge_right_acid,
    tile_fluid_edge_right_ice,
    tile_block,
    tile_slope
};

/**
 * Normalizes input entity type and variant into a resolved routine key.
 * @param {string} type
 * @param {string|number} variant
 * @returns {string}
 */
function resolveRoutineKey(type, variant) {
    let t = String(type || '').trim();
    let v = variant !== undefined && variant !== null ? String(variant).trim() : '';

    // Handle camelCase aliases
    switch (t) {
        case 'spawnFB':
            return 'spawn_fb';
        case 'spawnWG':
            return 'spawn_wg';
        case 'doorFB':
            return 'door_fb';
        case 'doorWG':
            return 'door_wg';
        case 'diamondFB':
            return 'diamond_fb';
        case 'diamondWG':
            return 'diamond_wg';
        case 'diamondSilver':
            return 'diamond_silver';
        case 'diamondDuo':
            return 'diamond_fbwg';
        case 'leverLeft':
            t = 'lever_left';
            break;
        case 'leverRight':
            t = 'lever_right';
            break;
        case 'heavyBox':
            return 'box_heavy';
        case 'mirrorBox':
        case 'rotatingMirrorBox':
            return 'box_mirror';
        default:
            break;
    }

    if (t === 'box' && !v) {
        return 'box_normal';
    }

    // Wrap or clamp group variants > 8 (e.g. 1..8)
    if (t === 'button' || t === 'lever_left' || t === 'lever_right') {
        let num = parseInt(v, 10);
        if (Number.isNaN(num) || num <= 0) {
            num = 1;
        } else if (num > 8) {
            num = 4;
        }
        v = String(num);
    }

    let key = t;
    if (v !== '') {
        key += '_' + v;
    }

    return key;
}

/**
 * Draw an object onto the canvas context.
 * Supports both modern: drawObject(ctx, objectType, variant, x, y, options)
 * and legacy: drawObject(objectType, variant, x, y, ctx, rotation)
 *
 * @param {CanvasRenderingContext2D|string} arg0
 * @param {string} arg1
 * @param {string|number} arg2
 * @param {number} arg3
 * @param {number|CanvasRenderingContext2D} arg4
 * @param {Object|number} [arg5]
 */
export function drawObject(...args) {
    let ctx, objectType, variant, x, y, options;

    // Check if called as drawObject(objectType, variant, posX, posY, ctx, rotation)
    if (typeof args[0] === 'string' && args[4] && typeof args[4].beginPath === 'function') {
        objectType = args[0];
        variant = args[1] ?? '';
        x = args[2] ?? 0;
        y = args[3] ?? 0;
        ctx = args[4];
        options = args[5] ?? {};
    } else {
        // Called as drawObject(ctx, objectType, variant, x, y, options)
        ctx = args[0];
        objectType = args[1] ?? '';
        variant = args[2] ?? '';
        x = args[3] ?? 0;
        y = args[4] ?? 0;
        options = args[5] ?? {};
    }

    if (!ctx) return;

    ctx.save();
    ctx.translate(x, y);

    // Apply rotation
    let rot = null;
    if (typeof options === 'number') {
        rot = { degrees: options, centerOffsetX: 0, centerOffsetY: 0 };
    } else if (options && typeof options.rotation === 'number') {
        rot = {
            degrees: options.rotation,
            centerOffsetX: options.centerOffsetX ?? 0,
            centerOffsetY: options.centerOffsetY ?? 0
        };
    } else if (options && typeof options.rotation === 'object') {
        rot = options.rotation;
    } else if (options && typeof options.degrees === 'number') {
        rot = options;
    }

    if (rot && rot.degrees) {
        const cx = rot.centerOffsetX || 0;
        const cy = rot.centerOffsetY || 0;
        ctx.translate(cx, cy);
        ctx.rotate((rot.degrees * Math.PI) / 180);
        ctx.translate(-cx, -cy);
    }

    const key = resolveRoutineKey(objectType, variant);
    const routine = ROUTINES[key];

    if (typeof routine === 'function') {
        routine(ctx);
    }

    ctx.restore();
}

export default {
    drawObject,
    spawn_fb,
    spawn_wg,
    diamond_fb,
    diamond_wg,
    diamond_fbwg,
    diamond_silver,
    door_fb,
    door_wg,
    button_1,
    button_2,
    button_3,
    button_4,
    button_5,
    button_6,
    button_7,
    button_8,
    lever_left_1,
    lever_left_2,
    lever_left_3,
    lever_left_4,
    lever_left_5,
    lever_left_6,
    lever_left_7,
    lever_left_8,
    lever_right_1,
    lever_right_2,
    lever_right_3,
    lever_right_4,
    lever_right_5,
    lever_right_6,
    lever_right_7,
    lever_right_8,
    box_normal,
    box_heavy,
    box_mirror,
    tile_block,
    tile_slope
};
