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
            switch(SESSION.SELECTED_TOOL_TYPE) {
                case 'tile':
                    SESSION.SELECTED_TYLE_TYPE = tool;
                    break;
                    
                case 'object':
                    SESSION.SELECTED_OBJECT_TYPE = tool;
                    break;

                case 'text':
                    SESSION.SELECTED_TEXT_TYPE = tool;
                    break;
            };
        });
    });
};
