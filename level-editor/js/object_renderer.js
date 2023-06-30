import { drawImage } from "./canvas.js";
import { BLOCK_SIZE, GROUP_COLOR } from "./lookup.js";
import { SESSION } from "./session.js";

function draw_platform_preview(object, ctx) {
    // Get the preview's location
    let previewX = object.x + object.dx * BLOCK_SIZE;
    let previewY = object.y + -object.dy * BLOCK_SIZE;

    // Draw the colored part
    ctx.beginPath();
    ctx.rect(previewX, previewY, object.width, object.heigth);
    ctx.fillStyle = GROUP_COLOR[object.group - 1];
    ctx.fill();

    // Draw the edges
    ctx.beginPath();
    ctx.rect(previewX + 4, previewY + 4, object.width - 8, object.heigth - 8);
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Draw the dottet line
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#404040';
    ctx.moveTo(object.x + 0.5 * object.width, object.y + 0.5 * object.heigth);
    ctx.lineTo(previewX + 0.5 * object.width, previewY + 0.5 * object.heigth);
    ctx.stroke();

    // Reset the linedash
    ctx.setLineDash([]);
};

export function render_object(object, ctx) {
    // Get the object's type
    let type = object.constructor.name;
    
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
            ctx.beginPath();
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
            ctx.fill();
            break;
        case 'Lever':
            if (object.direction == 0) {
                drawImage(`assets/objects/lever_left_${object.group}.svg`, 64, 64, object.x, object.y - 64, ctx);
            } else {
                drawImage(`assets/objects/lever_right_${object.group}.svg`, 64, 64, object.x, object.y - 64, ctx);
            };
            break;
        case 'Platform':
            // Draw the colored part
            ctx.beginPath();
            ctx.rect(object.x, object.y, object.width, object.heigth);
            ctx.fillStyle = GROUP_COLOR[object.group - 1];
            ctx.fill();

            // Draw the edges
            ctx.beginPath();
            ctx.rect(object.x + 4, object.y + 4, object.width - 8, object.heigth - 8);
            ctx.strokeStyle = 'gray';
            ctx.lineWidth = 8;
            ctx.stroke();

            // Draw the preview
            if (SESSION.PLATFROM_PREVIEWS) {draw_platform_preview(object, ctx);};
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
            ctx.beginPath();
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
            ctx.fill();
            break;
        case 'Box':
            drawImage('assets/objects/box_normal.svg', 64, 64, object.x, object.y - 64, ctx);
            break;
        case 'HeavyBox':
            drawImage('assets/objects/box_heavy.svg', 64, 64, object.x, object.y - 64, ctx);
            break;
        case 'MirrorBox':
            ctx.beginPath();
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
            ctx.fill();
            break;
        case 'PortalLeft':
            break;
        case 'PortalRight':
            break;
        case 'LightEmitter':
            ctx.beginPath();
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
            ctx.fill();
            break;
        case 'LightReceiver':
            ctx.beginPath();
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
            ctx.fill();
            break;
        case 'Fan':
            break;
    };  
};