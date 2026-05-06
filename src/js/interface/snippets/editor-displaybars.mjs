import { INTERFACE } from "../../main.js";
import { DisplayBar } from "../../Interface.mjs";
import { BarButton } from "../BarButton.mjs";

export function createMenuBar() {
    const bar = new DisplayBar(INTERFACE.root, {id: 'menu-bar'});
    bar.addButton(new BarButton('menu-home', undefined, 'H', undefined));
    bar.addButton(new BarButton('menu-file', undefined, 'File', undefined));
    bar.addButton(new BarButton('menu-level', undefined, 'Level', undefined));
    return bar;
};

export function createToolBar() {
    const bar = new DisplayBar(INTERFACE.root, {id: 'tool-bar'});
    bar.addButton(new BarButton('tool-move', undefined, 'M', undefined));
    bar.addButton(new BarButton('tool-edit', undefined, 'E', undefined));
    bar.addButton(new BarButton('tool-tile', undefined, 't', undefined));
    bar.addButton(new BarButton('tool-fluid', undefined, 'f', undefined));
    return bar;
};