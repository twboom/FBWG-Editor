const IMPORT_CONFIG = {
    BLANK_LEVEL: 'blank_level.json',
    EXAMPLE_LEVEL: 'example_level.json',
};

function importJSON(json) {
    const proceed = confirm('Are you sure?\nThis will delete your current progress!');
    if (!proceed) { alert('Alright, nothing happend!'); return; };
    // Potential for file checks

    // Init app
    init(json, true)
};

function importLocal(evt) {
    const input = evt.target;

    const reader = new FileReader();
    reader.onload = _ => {
        const text = reader.result;
        const json = JSON.parse(text);
        importJSON(json);
    };
    reader.readAsText(input.files[0]);
};

function importURL(src) {
    fetch(src)
        .then(r => r.json())
        .then(importJSON);
};

function initImport() {
    document.getElementById('create-empty').addEventListener('click', _ => {
        importURL(IMPORT_CONFIG.BLANK_LEVEL);
    });
    document.getElementById('import-tutorial').addEventListener('click', _ => {
        importURL(IMPORT_CONFIG.EXAMPLE_LEVEL);
    });
    document.getElementById('import-file').addEventListener('change', importLocal);
};

initImport();