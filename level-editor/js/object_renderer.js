import { drawImage } from "./canvas.js";
import { BLOCK_SIZE, GROUP_COLOR } from "./lookup.js";
import { SESSION } from "./session.js";

function rotationFix(object) {
    let rotation = object.rotation;
    if (rotation > 360) {
        while (rotation > 360) {
            rotation -= 360;
        };
    } else if (rotation <= -360) {
        while (rotation <= -360) {
            rotation += 360;
        };
    };

    if (rotation == -180) { rotation = 180; };
    if (rotation == 270) { rotation = -90; };
    if (rotation == -270) { rotation = 90; };
    return rotation;
};

function draw_wind(object, rotation, ctx) {
    ctx.beginPath();
    switch(rotation) {
        case 0:
            ctx.rect(object.x + BLOCK_SIZE, object.y, object.length * BLOCK_SIZE, -3 * BLOCK_SIZE);
            break;
        case 90:
            ctx.rect(object.x, object.y - BLOCK_SIZE, -3 * BLOCK_SIZE, object.length * BLOCK_SIZE);
            break;
        case 180:
            ctx.rect(object.x - BLOCK_SIZE, object.y, -object.length * BLOCK_SIZE, 3 * BLOCK_SIZE);
            break;
        case -90:
            ctx.rect(object.x, object.y - BLOCK_SIZE, -3 * BLOCK_SIZE, -object.length * BLOCK_SIZE);
            break;
    };
    ctx.fillStyle = '#AAAAAA55';
    ctx.fill();
}

function draw_platform_preview(object, ctx) {
    // Get the preview's location
    let previewX = object.x + -object.dx * BLOCK_SIZE;
    let previewY = object.y + -object.dy * BLOCK_SIZE;

    // Draw the colored part
    ctx.beginPath();
    ctx.rect(previewX, previewY, object.width, object.heigth);
    ctx.fillStyle = object.group > 8 ? '#FFFF00' : GROUP_COLOR[object.group - 1];
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
    let type = object == 'pulley' ? ' pulley' : object.constructor.name;
    let rotation = rotationFix(object);
    
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
            drawImage(`assets/objects/button_${object.group > 8 ? 4 : object.group}.svg`, 64, 64, object.x, object.y - 64, ctx);
            break;
        case 'TimerButton':
            ctx.beginPath();
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
            ctx.fill();
            break;
        case 'Lever':
            if (object.direction == 1) {
                drawImage(`assets/objects/lever_left_${object.group > 8 ? 4 : object.group}.svg`, 64, 64, object.x, object.y - 64, ctx);
            } else {
                drawImage(`assets/objects/lever_right_${object.group > 8 ? 4 : object.group}.svg`, 64, 64, object.x, object.y - 64, ctx);
            };
            break;
        case 'Platform':
            // Draw the colored part
            ctx.beginPath();
            ctx.rect(object.x, object.y, object.width, object.heigth);
            ctx.fillStyle = object.group > 8 ? '#FFFF00' : GROUP_COLOR[object.group - 1];
            ctx.fillStyle = object.group == 0 ? '#FFFFFF' : ctx.fillStyle;
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
            ctx.beginPath();
            ctx.fillStyle = object.group > 8 ? '#FFFF00BB': GROUP_COLOR[object.group - 1] + 'BB';
            switch(rotation) {
                case 0:
                    // Render background circle
                    ctx.arc(object.x + BLOCK_SIZE, object.y - BLOCK_SIZE, 1.5 * BLOCK_SIZE, 0, 360);
                    ctx.fill();

                    // Render the mirror
                    ctx.beginPath();
                    ctx.moveTo(object.x, object.y - 2 * BLOCK_SIZE);
                    ctx.lineTo(object.x + 2 * BLOCK_SIZE, object.y);
                    ctx.lineWidth = 8
                    ctx.strokeStyle = '#FFFFFF';
                    break;
                case 90: /* untested */
                    // Render background circle
                    ctx.arc(object.x + BLOCK_SIZE, object.y + BLOCK_SIZE, 1.5 * BLOCK_SIZE, 0, 360);
                    ctx.fill();
                
                    // Render the mirror
                    ctx.beginPath();
                    ctx.moveTo(object.x, object.y + 2 * BLOCK_SIZE);
                    ctx.lineTo(object.x + 2 * BLOCK_SIZE, object.y);
                    ctx.lineWidth = 8
                    ctx.strokeStyle = '#FFFFFF';
                    break;
                case 180: /* untested */
                    // Render backgorund circle
                    ctx.arc(object.x - BLOCK_SIZE, object.y - BLOCK_SIZE, 1.5 * BLOCK_SIZE, 0, 360);
                    ctx.fill();
                
                    // Render the mirror
                    ctx.beginPath();
                    ctx.moveTo(object.x, object.y - 2 * BLOCK_SIZE);
                    ctx.lineTo(object.x + 2 * BLOCK_SIZE, object.y);
                    ctx.lineWidth = 8
                    ctx.strokeStyle = '#FFFFFF';
                    break;
                case -90:
                    // Render background circle
                    ctx.arc(object.x - BLOCK_SIZE, object.y - BLOCK_SIZE, 1.5 * BLOCK_SIZE, 0, 360);
                    ctx.fill();
                
                    // Render the mirror
                    ctx.beginPath();
                    ctx.moveTo(object.x - 2 * BLOCK_SIZE, object.y);
                    ctx.lineTo(object.x, object.y - 2 * BLOCK_SIZE);
                    ctx.lineWidth = 8
                    ctx.strokeStyle = '#FFFFFF';
                    break;
            };
            ctx.stroke();
            break;
        case 'RotationBoxMirror':
            ctx.beginPath();
            ctx.fillStyle = object.group > 8 ? '#FFFF00BB': GROUP_COLOR[object.group - 1] + 'BB';
            switch(rotation) {
                case 0:
                    // Render background circle
                    ctx.arc(object.x + BLOCK_SIZE, object.y - BLOCK_SIZE, 1.5 * BLOCK_SIZE, 0, 360);
                    ctx.fill();
                    
                    // Render the box
                    ctx.beginPath();
                    ctx.fillStyle = '#FF00FF';
                    ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
                    ctx.fill();
                    
                    // Render the mirror
                    ctx.beginPath();
                    ctx.moveTo(object.x, object.y - 2 * BLOCK_SIZE);
                    ctx.lineTo(object.x + 2 * BLOCK_SIZE, object.y);
                    ctx.lineWidth = 8
                    ctx.strokeStyle = '#FFFFFF';
                    break;
                case 90: /* untested */
                    // Render background circle
                    ctx.arc(object.x + BLOCK_SIZE, object.y + BLOCK_SIZE, 1.5 * BLOCK_SIZE, 0, 360);
                    ctx.fill();
                
                    // Render the box
                    ctx.beginPath();
                    ctx.fillStyle = '#FF00FF';
                    ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, 2 * BLOCK_SIZE);
                    ctx.fill();

                    // Render the mirror
                    ctx.beginPath();
                    ctx.moveTo(object.x + 2 * BLOCK_SIZE, object.y);
                    ctx.lineTo(object.x, object.y + 2 * BLOCK_SIZE);
                    ctx.lineWidth = 8
                    ctx.strokeStyle = '#FFFFFF';
                    break;
                case 180: /* untested */
                    // Render backgorund circle
                    ctx.arc(object.x - BLOCK_SIZE, object.y + BLOCK_SIZE, 1.5 * BLOCK_SIZE, 0, 360);
                    ctx.fill();
                
                    // Render the box
                    ctx.beginPath();
                    ctx.fillStyle = '#FF00FF';
                    ctx.rect(object.x, object.y, -2 * BLOCK_SIZE, 2 * BLOCK_SIZE);
                    ctx.fill();

                    // Render the mirror
                    ctx.beginPath();
                    ctx.moveTo(object.x, object.y + 2 * BLOCK_SIZE);
                    ctx.lineTo(object.x - 2 * BLOCK_SIZE, object.y);
                    ctx.lineWidth = 8
                    ctx.strokeStyle = '#FFFFFF';
                break;
                case -90:
                    // Render background circle
                    ctx.arc(object.x - BLOCK_SIZE, object.y - BLOCK_SIZE, 1.5 * BLOCK_SIZE, 0, 360);
                    ctx.fill();
                    
                    // Render the box
                    ctx.beginPath();
                    ctx.fillStyle = '#FF00FF';
                    ctx.rect(object.x, object.y, -2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
                    ctx.fill();
                    
                    // Render the mirror
                    ctx.beginPath();
                    ctx.moveTo(object.x - 2 * BLOCK_SIZE, object.y);
                    ctx.lineTo(object.x, object.y - 2 * BLOCK_SIZE);
                    ctx.lineWidth = 8
                    ctx.strokeStyle = '#FFFFFF';
                    break;
            };
            ctx.stroke();
            break;
        case 'Hanger':
            break;
        case 'Slider':
            break;
        case 'Ball':
            ctx.beginPath();
            ctx.arc(object.x + 0.5 * BLOCK_SIZE, object.y - 0.5 * BLOCK_SIZE, 0.5 * BLOCK_SIZE, 0, 360);
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
            switch(rotation) {
                case 0:
                    ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
                    break;
                case 90:
                    ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, 2 * BLOCK_SIZE);
                    break;
                case 180:
                    ctx.rect(object.x, object.y, -2 * BLOCK_SIZE, 2 * BLOCK_SIZE);
                    break;
                case -90:
                    ctx.rect(object.x, object.y, -2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            };
            ctx.fillStyle = '#FF00FF';
            ctx.fill();

            ctx.beginPath();
            switch(rotation) {
                case 0:
                    ctx.moveTo(object.x, object.y - 2 * BLOCK_SIZE);
                    ctx.lineTo(object.x + 2 * BLOCK_SIZE, object.y);
                    break;
                case 180:
                    ctx.moveTo(object.x, object.y);
                    ctx.lineTo(object.x - 2 * BLOCK_SIZE, object.y + 2 * BLOCK_SIZE);
                    break;
                case 90:
                    ctx.moveTo(object.x, object.y + 2 * BLOCK_SIZE);
                    ctx.lineTo(object.x + 2 * BLOCK_SIZE, object.y);
                    break;
                case -90:
                    ctx.moveTo(object.x, object.y - 2 * BLOCK_SIZE);
                    ctx.lineTo(object.x - 2 * BLOCK_SIZE, object.y);
                    break;
            };
            ctx.lineWidth = 8;
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
            break;
        case 'PortalLeft': 
            // Draw the black part
            ctx.beginPath();
            switch(rotation) {
                case 0:
                    ctx.rect(object.x, object.y, BLOCK_SIZE, -3 * BLOCK_SIZE);
                    break;
                case 90:
                    ctx.rect(object.x, object.y, 3 * BLOCK_SIZE, BLOCK_SIZE);
                    break;
                case 180:
                    ctx.rect(object.x, object.y, -BLOCK_SIZE, 3 * BLOCK_SIZE);
                    break;
                case -90:
                    ctx.rect(object.x, object.y, -3 * BLOCK_SIZE, -BLOCK_SIZE);
                    break;
            };
            ctx.fillStyle = object.initialState == 1 ? '#000000' : '#000000AA';
            ctx.fill();

            // Draw the white part
            ctx.beginPath();
            switch(rotation) {
                case 0:
                    ctx.rect(object.x + BLOCK_SIZE, object.y, BLOCK_SIZE, -3 * BLOCK_SIZE);
                    break;
                case 90:
                    ctx.rect(object.x, object.y + BLOCK_SIZE, 3 * BLOCK_SIZE, BLOCK_SIZE);
                    break;
                case 180:
                    ctx.rect(object.x - BLOCK_SIZE, object.y, -BLOCK_SIZE, 3 * BLOCK_SIZE);
                    break;
                case -90:
                    ctx.rect(object.x, object.y - BLOCK_SIZE, -3 * BLOCK_SIZE, -BLOCK_SIZE);
                    break;
            };
            ctx.fillStyle = object.initialState == 1 ? '#FFFFFF' : '#FFFFFFAA';
            ctx.fill();

            // Draw the outline
            ctx.beginPath();
            switch(rotation) {
                case 0:
                    ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -3 * BLOCK_SIZE);
                    break;
                case 90:
                    ctx.rect(object.x, object.y, 3 * BLOCK_SIZE, 2 * BLOCK_SIZE);
                    break;
                case 180:
                    ctx.rect(object.x, object.y, -2 * BLOCK_SIZE, 3 * BLOCK_SIZE);
                    break;
                case -90:
                    ctx.rect(object.x, object.y, -3 * BLOCK_SIZE, -2 * BLOCK_SIZE);
                    break;
            };
            ctx.strokeStyle = object.group ? GROUP_COLOR[object.group - 1] : 'white';
            ctx.lineWidth = 4;
            ctx.stroke();
            break;
        case 'PortalRight':
            // Draw the white part
            ctx.beginPath();
            switch(rotation) {
                case 0:
                    ctx.rect(object.x, object.y, BLOCK_SIZE, -3 * BLOCK_SIZE);
                    break;
                case 90:
                    ctx.rect(object.x, object.y, 3 * BLOCK_SIZE, BLOCK_SIZE);
                    break;
                case 180:
                    ctx.rect(object.x, object.y, -BLOCK_SIZE, 3 * BLOCK_SIZE);
                    break;
                case -90:
                    ctx.rect(object.x, object.y, -3 * BLOCK_SIZE, -BLOCK_SIZE);
                    break;
            };
            ctx.fillStyle = object.initialState == 1 ? '#FFFFFF' : ' #FFFFFFAA';
            ctx.fill();

            // Draw the black part
            ctx.beginPath();
            switch(rotation) {
                case 0:
                    ctx.rect(object.x + BLOCK_SIZE, object.y, BLOCK_SIZE, -3 * BLOCK_SIZE);
                    break;
                case 90:
                    ctx.rect(object.x, object.y + BLOCK_SIZE, 3 * BLOCK_SIZE, BLOCK_SIZE);
                    break;
                case 180:
                    ctx.rect(object.x - BLOCK_SIZE, object.y, -BLOCK_SIZE, 3 * BLOCK_SIZE);
                    break;
                case -90:
                    ctx.rect(object.x, object.y - BLOCK_SIZE, -3 * BLOCK_SIZE, -BLOCK_SIZE);
                    break;
            };
            ctx.fillStyle = object.initialState == 1 ? '#000000': '#000000AA';
            ctx.fill();

            // Draw the outline
            ctx.beginPath();
            switch(rotation) {
                case 0:
                    ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -3 * BLOCK_SIZE);
                    break;
                case 90:
                    ctx.rect(object.x, object.y, 3 * BLOCK_SIZE, 2 * BLOCK_SIZE);
                    break;
                case 180:
                    ctx.rect(object.x, object.y, -2 * BLOCK_SIZE, 3 * BLOCK_SIZE);
                    break;
                case -90:
                    ctx.rect(object.x, object.y, -3 * BLOCK_SIZE, -2 * BLOCK_SIZE);
                    break;
            };
            ctx.strokeStyle = object.group ? GROUP_COLOR[object.group - 1] : 'white';
            ctx.lineWidth = 4;
            ctx.stroke();
            break;
        case 'LightEmitter':
            ctx.beginPath();
            ctx.fillStyle = object.color == 'blue' || 'red' ? object.color : '#AAAA00';
            switch(rotation) {
                case 0:
                    ctx.rect(object.x + BLOCK_SIZE, object.y, BLOCK_SIZE, -2 * BLOCK_SIZE);
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.rect(object.x, object.y, BLOCK_SIZE, -2 * BLOCK_SIZE);
                    ctx.fillStyle = '#FF00FF';
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(object.x + BLOCK_SIZE, object.y - BLOCK_SIZE, 0.5 * BLOCK_SIZE, 0, 360);
                    break;
                case 90: /* untested */
                    ctx.rect(object.x, object.y + 2 * BLOCK_SIZE, 2 * BLOCK_SIZE, -1 * BLOCK_SIZE);
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.rect(object.x, object.y + BLOCK_SIZE, 2 * BLOCK_SIZE, -1 * BLOCK_SIZE);
                    ctx.fillStyle = '#FF00FF';
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(object.x + BLOCK_SIZE, object.y + BLOCK_SIZE, 0.5 * BLOCK_SIZE, 0, 360);
                    break;
                case 180:
                    ctx.rect(object.x - BLOCK_SIZE, object.y, -1 * BLOCK_SIZE, 2 * BLOCK_SIZE);
                    ctx.fill();

                    ctx.beginPath();
                    ctx.rect(object.x, object.y, -1 * BLOCK_SIZE, 2 * BLOCK_SIZE);
                    ctx.fillStyle = '#FF00FF';
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(object.x - BLOCK_SIZE, object.y + BLOCK_SIZE, 0.5 * BLOCK_SIZE, 0 , 360);
                    break;
                case -90: /* untested */
                    ctx.rect(object.x, object.y - 2 * BLOCK_SIZE, -2 * BLOCK_SIZE, BLOCK_SIZE);
                    ctx.fill();

                    ctx.beginPath();
                    ctx.rect(object.x, object.y, -2 * BLOCK_SIZE, -BLOCK_SIZE);
                    ctx.fillStyle = '#FF00FF';
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(object.x - BLOCK_SIZE, object.y - BLOCK_SIZE, 0.5 * BLOCK_SIZE, 0, 360);
                    break;
            };
            ctx.fillStyle = object.group > 8 ? '#FFFF00' : GROUP_COLOR[object.group - 1];
            ctx.fill();
            break;
        case 'LightReceiver':
            ctx.beginPath();
            ctx.fillStyle = object.color;
            switch(rotation) {
                case 0:
                    ctx.rect(object.x, object.y - BLOCK_SIZE, 2 * BLOCK_SIZE, -1 * BLOCK_SIZE);
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -1 * BLOCK_SIZE);
                    ctx.fillStyle = '#FF00FF';
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(object.x + BLOCK_SIZE, object.y - BLOCK_SIZE, 0.5 * BLOCK_SIZE, 0, 360);
                    break;
                case 90:
                    ctx.rect(object.x + BLOCK_SIZE, object.y, BLOCK_SIZE, 2 * BLOCK_SIZE);
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.rect(object.x, object.y, BLOCK_SIZE, 2 * BLOCK_SIZE);
                    ctx.fillStyle = '#FF00FF';
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(object.x + BLOCK_SIZE, object.y + BLOCK_SIZE, 0.5 * BLOCK_SIZE, 0, 360);
                    break;
                case 180:
                    ctx.rect(object.x, object.y + BLOCK_SIZE, -2 * BLOCK_SIZE, BLOCK_SIZE);
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.rect(object.x, object.y, -2 * BLOCK_SIZE, BLOCK_SIZE);
                    ctx.fillStyle = '#FF00FF';
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(object.x - BLOCK_SIZE, object.y + BLOCK_SIZE, 0.5 * BLOCK_SIZE, 0, 360);
                    break;
                case -90:
                    ctx.rect(object.x - BLOCK_SIZE, object.y, -1 * BLOCK_SIZE, -2 * BLOCK_SIZE);
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.rect(object.x, object.y, -1 * BLOCK_SIZE, -2 * BLOCK_SIZE);
                    ctx.fillStyle = '#FF00FF';
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(object.x - BLOCK_SIZE, object.y - BLOCK_SIZE, 0.5 * BLOCK_SIZE, 0 , 360);
                    break;
            };
            ctx.fillStyle = object.group > 8 ? '#FFFF00' : GROUP_COLOR[object.group - 1];
            ctx.fill();
            break;
        case 'Fan': /* Wind length may be wrong */
            ctx.beginPath();
            switch(rotation) {
                case 0:
                    ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -3 * BLOCK_SIZE);
                    ctx.fillStyle = '#FF00FF';
                    break;
                case 90:
                    ctx.rect(object.x, object.y, 3 * BLOCK_SIZE, -2 * BLOCK_SIZE);
                    ctx.fillStyle = '#FF00FF';
                    break;
                case 180:
                    ctx.rect(object.x, object.y, -2 * BLOCK_SIZE, 3 * BLOCK_SIZE);
                    ctx.fillStyle = '#FF00FF';
                    break;
                case -90:
                    ctx.rect(object.x, object.y, -3 * BLOCK_SIZE, -2 * BLOCK_SIZE);
                    ctx.fillStyle = '#FF00FF';
                    break;
            };
            ctx.fill();

            if (object.initialState == 1 || SESSION.WIND_PREVEIWS) { draw_wind(object, rotation, ctx); };
            break;
    };  
};