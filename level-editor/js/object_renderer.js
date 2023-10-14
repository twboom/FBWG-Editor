import { drawImage } from "./canvas.js";
import { BLOCK_SIZE, GROUP_COLOR, GROUP_HIGHLIGHTS } from "./lookup.js";
import { SESSION } from "./session.js";
import { drawObject } from "./render_objects.js";

function rotationFix(object) {
    if (!object.rotation) { return 0; }
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
    ctx.rect(previewX, previewY, object.width, object.height);
    ctx.fillStyle = object.group > 8 ? '#FFFF00' : GROUP_COLOR[object.group - 1];
    ctx.fill();

    // Draw the edges
    ctx.beginPath();
    ctx.rect(previewX + 4, previewY + 4, object.width - 8, object.height - 8);
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Draw the dottet line
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#404040';
    ctx.moveTo(object.x + 0.5 * object.width, object.y + 0.5 * object.height);
    ctx.lineTo(previewX + 0.5 * object.width, previewY + 0.5 * object.height);
    ctx.stroke();

    // Reset the linedash
    ctx.setLineDash([]);
};

export function render_object(object, ctx) {
    // Get the object's type
    let type = object.constructor.name;
    let rotation = rotationFix(object);
    // console.log(rotation, object);
    
    switch(type) {
        case 'LevelPoints' :
            drawObject(object.type, '', object.x, object.y - 64, ctx);
            break;
        case 'Diamond':
            ctx.beginPath();
            switch(object.type) {
                case 0:
                    drawObject('diamond', 'fb', object.x, object.y - 64, ctx);
                    break;
                case 1:
                    drawObject('diamond', 'wg', object.x, object.y - 64, ctx);
                    break;
                case 2:
                    drawObject('diamond', 'silver', object.x, object.y - 64, ctx);
                    break;
                case 3:
                    drawObject('diamond', 'fbwg', object.x, object.y - 64, ctx);
                    break;
            };
            break;
        case 'Button':
            drawObject('button', object.group > 8 ? 4 : object.group, object.x, object.y - 64, ctx);
            break;
        case 'TimerButton':
            drawImage("assets/objects/button.svg", 64, 64, object.x, object.y - 64, rotation, ctx);

            ctx.beginPath();
            ctx.arc(object.x + BLOCK_SIZE, object.y - 1.5 * BLOCK_SIZE, 0.4 * BLOCK_SIZE, 0, 2 * Math.PI);
            ctx.fillStyle = GROUP_COLOR[object.group - 1];
            ctx.strokeStyle = GROUP_HIGHLIGHTS[object.group - 1];
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();
            break;
        case 'Lever':
            let direction = 'right';
            if (object.direction == 1) {
                direction = 'left';
            };
            drawObject('lever_' + direction, object.group > 8 ? 4 : object.group, object.x, object.y - 64, ctx, object.rotationObject);
            break;
        case 'Platform':
            // Draw the colored part
            ctx.beginPath();
            ctx.rect(object.x, object.y, object.width, object.height);
            ctx.fillStyle = object.group > 8 ? '#FFFF00' : GROUP_COLOR[object.group - 1];
            ctx.fillStyle = object.group == 0 ? '#FFFFFF' : ctx.fillStyle;
            ctx.fill();

            // Draw the edges
            ctx.beginPath();
            ctx.rect(object.x + 4, object.y + 4, object.width - 8, object.height - 8);
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
            ctx.beginPath();
            ctx.moveTo(object.x + object.pos[0][0], object.y + object.pos[0][1]);
            ctx.lineTo(object.x + object.pos[1][0], object.y + object.pos[1][1]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#333333';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(object.x + object.pos[1][0] - BLOCK_SIZE * (object.barWidth / 2), object.y + object.pos[1][1]);
            ctx.lineTo(object.x + object.pos[1][0] + BLOCK_SIZE * (object.barWidth / 2), object.y + object.pos[1][1]);
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#999999';
            ctx.stroke();
            break;
        case 'Slider':
            ctx.beginPath();
            // Vertical
            if (object.pos[0][0] == object.pos[1][0]) {
                ctx.rect(object.x + object.pos[0][0] - 2, object.y + object.pos[0][1], object.pos[1][0] - object.pos[0][0] + 4, object.pos[1][1] - object.pos[0][1]);
            } 
            // Horizontal
            else if (object.pos[0][1] == object.pos[1][1]) {
                ctx.rect(object.x + object.pos[0][0], object.y + object.pos[0][1] - 2, object.pos[1][0] - object.pos[0][0], object.pos[1][1] - object.pos[0][1] + 4);
            };
            ctx.fillStyle = GROUP_COLOR[object.group - 1];
            ctx.strokeStyle = 'gray';
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(object.x + (object.pos[0][0] + object.pos[1][0]) / 2, object.y + (object.pos[0][1] + object.pos[1][1]) / 2, 0.25 * BLOCK_SIZE, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            break;
        case 'Ball':
            ctx.beginPath();
            ctx.arc(object.x + 0.5 * BLOCK_SIZE, object.y - 0.5 * BLOCK_SIZE, 0.5 * BLOCK_SIZE, 0, 360);
            ctx.fillStyle = '#777777';
            ctx.fill();
            break;
        case 'Box':
            drawObject('box', object.type, object.x, object.y - 64, ctx);
            break;
        case 'PortalLeft':
            drawImage('assets/objects/portal_left.svg' ,2 * BLOCK_SIZE, 3 * BLOCK_SIZE, object.x, object.y -3 * BLOCK_SIZE, rotation, ctx);
            break;
        case 'PortalRight':
            drawImage('assets/objects/portal_right.svg' ,2 * BLOCK_SIZE, 3 * BLOCK_SIZE, object.x, object.y -3 * BLOCK_SIZE, rotation, ctx);
            break;
        case 'LightEmitter':
            drawImage("assets/objects/light_emitter.svg", 2 * BLOCK_SIZE, 2 * BLOCK_SIZE, object.x, object.y - 2 * BLOCK_SIZE, rotation, ctx);

            ctx.beginPath();
            ctx.fillStyle = object.color == 'blue' || 'red' ? object.color : '#AAAA00';
            ctx.arc(object.x + BLOCK_SIZE, object.y - 1.5 * BLOCK_SIZE, 0.5 * BLOCK_SIZE, Math.PI, 2 * Math.PI);
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

            if (object.initialState == 1 || SESSION.WIND_PREVIEWS) { draw_wind(object, rotation, ctx); };
            break;
        case 'Window':
            ctx.beginPath();
            if (object.width > object.height) { ctx.rect(object.x, object.y + 2, object.width, object.height - 4); }
            else { ctx.rect(object.x + 2, object.y, object.width - 4, object.height); };
            ctx.fillStyle = '#ADD8E6AA';
            ctx.fill();
            break;
        case 'Cover':
            if (SESSION.COVER_PREVIEWS) {
                ctx.beginPath();
                ctx.rect(object.x, object.y, object.width, -object.height);
                ctx.fillStyle = 'black';
                ctx.fill();
            };
            break;
        case 'Pulley':
            ctx.beginPath();
            ctx.moveTo(object.x + object.pos[0][0], object.y + object.pos[0][1]);

            for (let i = 1; i < object.pos.length; i ++) {
                ctx.lineTo(object.x + object.pos[i][0], object.y + object.pos[i][1]);
            };
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(object.x + object.pos[0][0] - 1.5 * BLOCK_SIZE, object.y + object.pos[0][1]);
            ctx.lineTo(object.x + object.pos[0][0] + 1.5 * BLOCK_SIZE, object.y + object.pos[0][1]);
            ctx.strokeStyle = 'gray';
            ctx.lineWidth = 8;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(object.x + object.pos[object.pos.length - 1][0] - 1.5 * BLOCK_SIZE, object.y + object.pos[object.pos.length - 1][1]);
            ctx.lineTo(object.x + object.pos[object.pos.length - 1][0] + 1.5 * BLOCK_SIZE, object.y + object.pos[object.pos.length - 1][1]);
            ctx.stroke();

            ctx.fillStyle = '#333333';
            for (let i = 1; i + 1 < object.pos.length; i ++) {
                ctx.beginPath();
                ctx.arc(object.x + object.pos[i][0], object.y + object.pos[i][1], 0.25 * BLOCK_SIZE, 0, 2 * Math.PI);
                ctx.fill();
            };
            break;
    };  
};