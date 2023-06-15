function createJSON(LevelTemplate, callback) {
    LevelTemplate.height = LEVEL.HEIGHT;
    LevelTemplate.width = LEVEL.WIDTH;
    LevelTemplate.layers[0].data = LEVEL.TILELAYER;
    LevelTemplate.layers[0].width = LEVEL.WIDTH;
    LevelTemplate.layers[0].height = LEVEL.HEIGHT;
    LevelTemplate.layers[2] = LEVEL.CHARSLAYER;
    LevelTemplate.layers[1] = LEVEL.OBJECTLAYER;

    // downloadObjectAsJson(LevelTemplate, 'level');
    return callback(LevelTemplate)
};

function exportLevel() {
    fetch('blank_level.json')
        .then(r => r.json())
        .then( LevelTemplate => createJSON(LevelTemplate, level => {
            downloadObjectAsJson(level, 'level')
        }))
};


function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function exportAsText() {
    fetch('blank_level.json')
        .then(r => r.json())
        .then( LevelTemplate => createJSON(LevelTemplate, level => {
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(level));
            navigator.clipboard.writeText(JSON.stringify(dataStr).replaceAll('"', '')).then(() => {
                alert('Level content copied to clipboard');
                /* Resolved - text copied to clipboard successfully */
              },() => {
                alert('Failed to copy');
                /* Rejected - text failed to copy to the clipboard */
              }); 
        }))
}

function initExport() {
    document.getElementById('export').addEventListener('click', exportLevel);
    document.getElementById('export-url').addEventListener('click', exportAsText);
}

initExport();