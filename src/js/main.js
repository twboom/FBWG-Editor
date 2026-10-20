import { EditorApp } from './EditorApp.js';

let app = null;

/**
 * Initialize and mount the FBWG Editor application.
 */
function bootstrap() {
    const container = document.getElementById('application');
    if (container) {
        app = new EditorApp(container);
        app.init().catch(err => {
            console.error('Failed to initialize EditorApp:', err);
        });
        if (typeof window !== 'undefined') {
            window.app = app;
        }
    }
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
}

export { app, EditorApp };
