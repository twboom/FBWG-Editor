import { Level } from './Level.js';
import { SESSION } from './session.js';

window.onbeforeunload = evt => {
    evt.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
}