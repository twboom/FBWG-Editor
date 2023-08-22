export function drawObject(object, variant, posX, posY, ctx) {
    ctx.translate(posX, posY);

    const functionName = object + '_' + variant;
    switch(functionName) {
        case 'switch_content': break;
    };

    ctx.resetTransform();
};