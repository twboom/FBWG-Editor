import { resizeCanvas } from "./canvas.js";
import { resizeLevel } from "./editor.js";
import { SESSION } from "./session.js";
import { exportTEXT, exportJSON } from "./export.js";
import { Modal } from "./modal.js";
import { clearHighlight } from "./highlight_renderer.js";


function openPopout(popout) {
    document.querySelectorAll('div.popout.active').forEach(popoutToRemove => {
        popoutToRemove.classList.remove('active')
    });

    const anchor = document.querySelector(`button[data-popout=${popout}]`);
    const container = document.querySelector(`div.popout[data-anchor=${popout}]`);
    
    container.classList.add('active');

    const anchorBoundingBox = anchor.getBoundingClientRect();
    const containerBoundingBox = container.getBoundingClientRect();

    container.style.left = anchorBoundingBox.right + 16 + 'px';
    container.style.top = anchorBoundingBox.top + (anchorBoundingBox.height / 2) - (containerBoundingBox.height / 2) + 'px';
};

export function initInterface() {
    resizeCanvas();
    window.addEventListener('resize', _ => { resizeCanvas(); });

    document.querySelectorAll('button[data-popout]').forEach(btn => {
        const popout = btn.dataset.popout
        if (document.getElementById('popout-container').querySelector(`div[data-anchor=${popout}]`))
        btn.addEventListener('click', _ => { openPopout(popout); });
        
        const container = document.querySelector(`div.popout[data-anchor=${popout}]`);
        if (!container) { return; };
        container.querySelectorAll('button').forEach(popoutBtn => {
            popoutBtn.addEventListener('click', _ => {
                btn.children[0].src = popoutBtn.children[0].src;
                btn.dataset.tool = popoutBtn.dataset.tool;
                container.classList.remove('active');
            });
        });
    });

    document.querySelectorAll('button[data-tool]').forEach(btn => {
        btn.addEventListener('click', _ => {
            SESSION.SELECTED_TOOL_TYPE = btn.dataset.tool.split(':')[0];
            const tool = btn.dataset.tool.split(':')[1];
            SESSION.SELECTED_TYLE_TYPE = tool;
            SESSION.SELECTED_OBJECT_TYPE = tool;
            SESSION.SELECTED_TEXT_TYPE = tool;
            switch(SESSION.SELECTED_TOOL_TYPE) {
                case 'tile':
                    break;
                    
                case 'object':
                    break;

                case 'text':
                    break;
            };
            btn.classList.add('selected')
        });
    });

    document.addEventListener('click', _ => {
        [...document.getElementById('tool-bar').getElementsByClassName('selected')].forEach(selBtn => {
            if (selBtn.dataset.tool) {
                if (
                    !(selBtn.dataset.tool.includes(SESSION.SELECTED_TYLE_TYPE) ||
                    selBtn.dataset.tool.includes(SESSION.SELECTED_OBJECT_TYPE) ||
                    selBtn.dataset.tool.includes(SESSION.SELECTED_TEXT_TYPE))
                ) {
                    selBtn.classList.remove('selected');
                };
            };
        });
    });
};
