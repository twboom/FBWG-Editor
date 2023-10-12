export function render_text(obj, ctx) {
    if (!obj.text) {
        console.log("object has no text", obj);
        return;
    };

    console.log('rendering text', obj, obj.text, obj.text.pixelsize);

    let font

    // if (obj.text.bold) {
    //     font = "bold "
    // };

    font = /*font + */obj.text.pixelsize + "px " + 'Arial' /*obj.text.fontfamily;*/

    console.log(font);
    ctx.font = font;
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.fillText(obj.text.text, obj.x, obj.y + 32/*, obj.width*/);
    ctx.strokeText(obj.text.text, obj.x, obj.y + 32/*, obj.width*/);
};