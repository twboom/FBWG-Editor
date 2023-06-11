function exportLevel() {
    function createJSON(LevelTemplate) {
        LevelTemplate.height = LEVEL.HEIGHT;
        LevelTemplate.width = LEVEL.WIDTH;
        LevelTemplate.layers[0].data = LEVEL.TILELAYER;
        LevelTemplate.layers[0].width = LEVEL.WIDTH;
        LevelTemplate.layers[0].height = LEVEL.HEIGHT;
        LevelTemplate.layers[2] = LEVEL.CHARSLAYER;
        LevelTemplate.layers[1] = LEVEL.OBJECTLAYER;

        console.log(LevelTemplate)
        downloadObjectAsJson(LevelTemplate, 'level');
    };

    fetch('blank_level.json')
        .then(r => r.json())
        .then( LevelTemplate => createJSON(LevelTemplate))
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

function initExport() {
    document.getElementById('export').addEventListener('click', exportLevel);
}

initExport();