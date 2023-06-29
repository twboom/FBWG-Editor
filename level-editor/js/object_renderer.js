import { drawImage } from "./canvas.js";
import { BLOCK_SIZE, FB_WG_COLOR } from "./lookup.js";

export function render_object(object, ctx) {
    // Get the object's type
    let type = object.constructor.name;
    
    ctx.beginPath();
    switch(type) {
        case 'SpawnFB':
            drawImage('assets/objects/spawn_fb.svg', 64, 64, object.x, object.y - 64, ctx);
            break;
        case 'SpawnWG':
            drawImage('assets/objects/spawn_wg.svg', 64, 64, object.x, object.y - 64, ctx);
            break;
        case 'DoorFB':
            drawImage('assets/objects/door_fb.svg', 64, 64, object.x, object.y - 64, ctx);
            break;
        case 'DoorWG':
            drawImage('assets/objects/door_wg.svg', 64, 64, object.x, object.y - 64, ctx);
            break;
        case 'Diamond':
            ctx.beginPath();
            switch(object.type) {
                case 0:
                    // FB diamond
                    drawImage('assets/objects/diamond_fb.svg', 64, 64, object.x, object.y - 64, ctx);
                    break;
                case 1:
                    // WG diamond
                    drawImage('assets/objects/diamond_wg.svg', 64, 64, object.x, object.y - 64, ctx);
                    break;
                case 2:
                    // Silver diamond
                    drawImage('assets/objects/diamond_silver.svg', 64, 64, object.x, object.y - 64, ctx);
                    break;
                case 3:
                    // FBWG diamond
                    drawImage('assets/objects/diamond_fbwg.svg', 64, 64, object.x, object.y - 64, ctx);
                    break;
            };
            break;
        case 'Button':
            drawImage(`assets/objects/button_${object.group}.svg`, 64, 64, object.x, object.y - 64, ctx);
            break;
        case 'TimerButton':
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
            break;
        case 'Lever':
            if (object.direction == 0) {
                drawImage(`assets/objects/lever_left_${object.group}.svg`, 64, 64, object.x, object.y - 64, ctx);
            } else {
                drawImage(`assets/objects/lever_right_${object.group}.svg`, 64, 64, object.x, object.y - 64, ctx);
            };
            break;
        case 'Platform':
            ctx.rect(object.x, object.y, object.width, object.heigth);
            ctx.fillStyle = '#FF00FF';
            break;
        case 'RotationMirror':
            break;
        case 'RotationBoxMirror':
            break;
        case 'Hanger':
            break;
        case 'Slider':
            break;
        case 'Ball':
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
            break;
        case 'Box':
            drawImage('assets/objects/box_normal.svg', 64, 64, object.x, object.y - 64, ctx);
            break;
        case 'HeavyBox':
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
            break;
        case 'MirrorBox':
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
            break;
        case 'PortalLeft':
            break;
        case 'PortalRight':
            break;
        case 'LightEmitter':
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
            break;
        case 'LightReceiver':
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
            break;
        case 'Fan':
            break;
    };
    ctx.fill();
};