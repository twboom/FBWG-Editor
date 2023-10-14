import { GROUP_COLOR } from "./lookup.js";

export function render_text(obj, textmenu, ctx) {
    // Highlight the text and activation trigger

    if (textmenu) {
        if (!obj.text) {
            ctx.strokeStyle = GROUP_COLOR[obj.txtId];
            ctx.lineWidth = 5;
            ctx.strokeRect(obj.x + 5, obj.y + 5, obj.width - 10, obj.height - 10);
            return;
        };

        ctx.strokeStyle = GROUP_COLOR[obj.txtId];
        ctx.lineWidth = 1;
        ctx.strokeRect(obj.x + 1, obj.y + 1, obj.width - 2, obj.height - 2);
    };

    if (!obj.text) { return; };


    ctx.font = (obj.text.bold ? "bold " : "") + (1.25 * obj.text.pixelsize) + "px " + obj.text.fontfamily;
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.fillText(obj.text.text, obj.x, obj.y + obj.height);
    ctx.strokeText(obj.text.text, obj.x, obj.y + obj.height);
};