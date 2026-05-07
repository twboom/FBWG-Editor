import { INTERFACE } from "../../main.js";
import { InterfaceComponent } from "../Interface.mjs";

export function createCanvases() {
    const container = new InterfaceComponent('canvas-container', INTERFACE.root, 'div', {id: 'canvas-container'});
    const canvas = new InterfaceComponent('canvas', container, 'canvas', {id: 'canvas'});
    return container;
};