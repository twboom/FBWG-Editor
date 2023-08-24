export function drawObject(object, variant, posX, posY, ctx, rotation) {
    ctx.translate(posX, posY);

	
    if (rotation) {
		const {degrees, centerOffsetX, centerOffsetY} = rotation;
		ctx.translate(centerOffsetX, centerOffsetY);
        ctx.rotate(degrees * Math.PI / 180);
		ctx.translate(-centerOffsetX, -centerOffsetY);
    };

    const functionName = object + '_' + variant;
    switch(functionName) {
        case 'switch_content': break;
    };

    ctx.resetTransform();
};