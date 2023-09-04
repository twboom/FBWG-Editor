import { LightEmitter, LightReceiver, PortalLeft, PortalRight } from "./Object.js";
import { SESSION } from "./session.js";

// Format the JSON file function
function createJSON(LevelTemplate, callback) {
    console.log(SESSION.LEVEL);


    LevelTemplate.height = SESSION.LEVEL.height;
    LevelTemplate.width = SESSION.LEVEL.width;
    LevelTemplate.layers[0].data = formatTileLayer();
    LevelTemplate.layers[0].width = SESSION.LEVEL.width;
    LevelTemplate.layers[0].height = SESSION.LEVEL.height;
    let charAndObj = formatObjectsLayer();
    LevelTemplate.layers[1].objects = charAndObj[0];
    LevelTemplate.layers[2].objects = charAndObj[1];
    
    // downloadObjectAsJson(LevelTemplate, 'level');
    return callback(LevelTemplate)
};

// Export to json file function
export function exportJSON() {
    fetch('blank_level.json')
        .then( r => r.json())
        .then( LevelTemplate => createJSON(LevelTemplate, level => {
            downloadObjectAsJson(level, 'level')
        }))
};

// Download file function
function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

// Format tilelayer function
function formatTileLayer() {
    let tilelayer = [];

    // Go through the y layers
    for(let y = 0; y < SESSION.LEVEL.height; y++ ) {

        // Go through the x layers
        for(let x = 0; x < SESSION.LEVEL.width; x++ ) {

            // Write the tile to the tilelayer
            tilelayer[y * SESSION.LEVEL.width + x] = SESSION.LEVEL.tiles[y][x];
        };
    };

    // Return the tilelayer
    return tilelayer;
};

// Format objects function
function formatObjectsLayer() {

    // Id for objects
    let id = 0;

    // Format char object
    function formatChar(char, charId) {
        // Standard char format
        let charsformat = {
            "gid":0,
            "height":64,
            "id":0,
            "name":"",
            "rotation":0,
            "type":"",
            "visible":true,
            "width":64,
            "x":0,
            "y":0
         };
         charsformat.id = id; id++;
         charsformat.x = char.x;
         charsformat.y = char.y;

         if (charId || charId == 0) {
            charsformat.gid = (charId + 16);
         } else {
            charsformat.gid = (char.type + 20);
        };

        // Return the chars
        return charsformat;
    };
    let charslayer = [];
    
    // Format object object
    function formatObject(object, objectId, Box) {
        // Standard object format
        let objectsformat = {
            "gid": 0,
            "height": 0,
            "id": 0,
            "name": "",
            "polyline":[
               {
                  "x":0,
                  "y":0,
               },
               {
                  "x":0,
                  "y":0,
               }
            ],
            "properties":{
               "dx": 0,
               "dy": 0,
               "group": 0,
               "barWidth":0,
               "density":0,
               "fullRotation":false,
               "max":0,
               "min":0,
               "color":"",
               "time":0,
            },
            "propertytypes":{
               "dx": "int",
               "dy":" int",
               "group": "int",
               "barWidth": "float",
               "density": "float",
               "fullRotation": "bool",
               "max": "float",
               "min": "float",
               "color": "string",
               "time": "int",
            },
            "rotation": 0,
            "type": "",
            "visible": true,
            "width": 0,
            "x": 0,
            "y": 0
         };

         // Properties all objects have
         if (Box) {
            objectsformat.gid = objectId ==  'normal' ? 8 : objectId == 'heavy' ? 37 : 36; 
         } else {
             typeof objectId == "number" ? objectsformat.gid = objectId + 24 : delete objectsformat.gid;
         };
         objectsformat.height = object.height;
         objectsformat.id = id; id++;
         objectsformat.rotation = object.rotation;
         objectsformat.width = object.width;
         objectsformat.x = object.x;
         objectsformat.y = object.y;

         // Properties not all objects have

         // Polyline
         if (objectId == 'slider' || objectId == 'pulley' || objectId == 'hanging') {
             for (let i = 0; object.pos.length; i++ ) {
                objectsformat.polyline[i] = {
                    x: object.pos[i][0],
                    y: object.pos[i][1]
                };
             };
        } else {
            delete objectsformat.polyline;
        };

        // Properties & ProptertyTypes
        if (objectId == 4 || objectId == 10 || objectId == 12 || objectId == 13 || objectId == 'cover' || objectId == 'window') {
            delete objectsformat.properties;
            delete objectsformat.propertytypes;
        } else {
            // Dx & Dy
            if (objectId == 'platform') {
                objectsformat.properties.dx = object.dx;
                objectsformat.properties.dy = object.dy;
            } else {
                delete objectsformat.properties.dx;
                delete objectsformat.properties.dy;
                delete objectsformat.propertytypes.dx;
                delete objectsformat.propertytypes.dy;
            };

            // Group
            objectsformat.properties.group = object.group;

            // Barwidth & Density & Fullrotational
            if (objectId == 'hanging') {
                objectsformat.properties.barWidth = object.barWidth;
                objectsformat.properties.density = object.density;
                objectsformat.properties.fullRotation = object.fullRotation;
            } else {
                delete objectsformat.properties.barWidth;
                delete objectsformat.properties.density;
                delete objectsformat.properties.fullRotation;
                delete objectsformat.propertytypes.barWidth;
                delete objectsformat.propertytypes.density;
                delete objectsformat.propertytypes.fullRotation;
            };

            // Max & Min
            if (objectId == 'slider') {
                objectsformat.properties.max = object.max;
                objectsformat.properties.min = object.min;
            } else {
                delete objectsformat.properties.max;
                delete objectsformat.properties.min;
                delete objectsformat.propertytypes.max;
                delete objectsformat.propertytypes.min;
            };

            // Color
            if (objectId == 5 || objectId == 7 ) {
                objectsformat.properties.color = object.color;
            } else {
                delete objectsformat.properties.color;
                delete objectsformat.propertytypes.color;
            };

            // Time
            if (objectId == 14 ) {
                objectsformat.properties.time = object.time;
            } else {
                delete objectsformat.properties.time;
                delete objectsformat.propertytypes.time;
            };
        };

        // Type
        if (objectId == 'platform' || objectId == 'hanging' || objectId == 'pulley' || objectId == 'pusher') {
            objectsformat.type = objectId;
        };

        return objectsformat;
    };
    let objectslayer = [];

    for(let i = 0; i < SESSION.LEVEL.objects.length; i++) {
        let IObject = SESSION.LEVEL.objects[i];
        switch (IObject.constructor.name) {
            case 'SpawnFB':
                charslayer.push(formatChar(IObject, 0));
                break;
            case 'SpawnWG' :
                charslayer.push(formatChar(IObject, 1));
                break;
            case 'DoorFB' :
                charslayer.push(formatChar(IObject, 2));
                break;
            case 'DoorWG' :
                charslayer.push(formatChar(IObject, 3));
                break;
            case 'Diamond' :
                charslayer.push(formatChar(IObject));
                break;
            case 'Button' :
                objectslayer.push(formatObject(IObject, 0));
                break;
            case 'TimerButton' :
                objectslayer.push(formatObject(IObject, 14));
                break;
            case 'Lever' :
                objectslayer.push(formatObject(IObject, IObject.direction == 1 ? 2 : 1));
                break;
            case 'Platform' :
                objectslayer.push(formatObject(IObject, "platform"));
                break;
            case 'RotationMirror' :
                objectslayer.push(formatObject(IObject, 11));
                break;
            case 'RotationBoxMirror' :
                objectslayer.push(formatObject(IObject, 6));
                break;
            case 'Hanger' :
                objectslayer.push(formatObject(IObject, "hanging"));
                break;
            case 'Slider' :
                objectslayer.push(formatObject(IObject, "slider"));
                break;
            case 'Pulley' :
                objectslayer.push(formatObject(IObject, "pulley"));
                break;
            case 'Ball' :
                objectslayer.push(formatObject(IObject, 10));
                break;
            case 'Box' :
                objectslayer.push(formatObject(IObject, IObject, true));
                break;
            case 'PortalLeft' :
                objectslayer.push(formatObject(IObject, 16));
                break;
            case 'PortalRight' :
                objectslayer.push(formatObject(IObject, 17));
                break;
            case 'LightEmitter' :
                objectslayer.push(formatObject(IObject, 5));
                break;
            case 'LightReceiver' :
                objectslayer.push(formatObject(IObject, 7));
                break;
            case 'Fan' :
                objectslayer.push(formatObject(IObject, 15));
                break;
            case 'Window' :
                objectslayer.push(formatObject(IObject, "window"));
                break;
            case 'Cover' :
                objectslayer.push(formatObject(IObject, "cover"));
                break;
        };
    };

    return [charslayer, objectslayer];
};

// Export to text function
export function exportTEXT() {
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