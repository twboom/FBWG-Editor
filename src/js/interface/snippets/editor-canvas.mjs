import { INTERFACE } from "../../main.js";
import { InterfaceComponent } from "../Interface.mjs";

export function createCanvases() {
    const container = new InterfaceComponent(INTERFACE.root, 'div', {id: 'canvas-container'});
    const canvas = new InterfaceComponent(container, 'canvas', {id: 'canvas'});
    return container;
};