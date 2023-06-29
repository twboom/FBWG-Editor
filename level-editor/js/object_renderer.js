import { BLOCK_SIZE, FB_WG_COLOR } from "./lookup.js";

export function render_object(object, ctx) {
    // Get the object's type
    let type = object.constructor.name;
    
    ctx.beginPath();
    switch(type) {
        case 'SpawnFB':
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = FB_WG_COLOR[0];
            break;
        case 'SpawnWG':
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = FB_WG_COLOR[1];
            break;
        case 'DoorFB':
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = FB_WG_COLOR[0];
            break;
        case 'DoorWG':
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = FB_WG_COLOR[1];
            break;
        case 'Diamond':
            ctx.beginPath();
            switch(object.type) {
                case 0:
                    // FB diamond
                    ctx.rect(object.x + 0.5 * BLOCK_SIZE, object.y -  0.5 * BLOCK_SIZE, BLOCK_SIZE, -BLOCK_SIZE);
                    ctx.fillStyle = FB_WG_COLOR[0];
                    break;
                case 1:
                    // WG diamond
                    ctx.rect(object.x + 0.5 * BLOCK_SIZE, object.y -  0.5 * BLOCK_SIZE, BLOCK_SIZE, -BLOCK_SIZE);
                    ctx.fillStyle = FB_WG_COLOR[1];
                    break;
                case 2:
                    // Silver diamond
                    ctx.rect(object.x + 0.5 * BLOCK_SIZE, object.y -  0.5 * BLOCK_SIZE, BLOCK_SIZE, -BLOCK_SIZE);
                    ctx.fillStyle = '#AAAAAA';
                    break;
                case 3:
                    // FBWG diamond
                    console.log('FBWG DIAMOND');
                    ctx.rect(object.x + 0.5 * BLOCK_SIZE, object.y - 0.5 * BLOCK_SIZE, 0.5 * BLOCK_SIZE, -BLOCK_SIZE);
                    ctx.fillStyle = FB_WG_COLOR[0];
                    ctx.fill();
                    ctx.beginPath();
                    ctx.rect(object.x + BLOCK_SIZE, object.y - 0.5 * BLOCK_SIZE, 0.5 * BLOCK_SIZE, -BLOCK_SIZE );
                    ctx.fillStyle = FB_WG_COLOR[1];
                    break;
            };
            break;
        case 'Button':
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
            break;
        case 'TimerButton':
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
            break;
        case 'Lever':
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
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
            ctx.rect(object.x, object.y, 2 * BLOCK_SIZE, -2 * BLOCK_SIZE);
            ctx.fillStyle = '#FF00FF';
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