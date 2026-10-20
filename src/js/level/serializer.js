import { LevelModel } from './LevelModel.js';
import { LevelObject } from './LevelObject.js';
import { TileMap } from './TileMap.js';

export const CANONICAL_LAYERS = ['Ground', 'Chars', 'Objects', 'Tutorial_keyboard'];

export const DEFAULT_TILESETS = [
    {
        firstgid: 1,
        source: '../../../assets/tilemaps/tilesets/Ground.json'
    },
    {
        firstgid: 16,
        source: '../../../assets/tilemaps/tilesets/Chars.json'
    },
    {
        firstgid: 24,
        source: '../../../assets/tilemaps/tilesets/Objects.json'
    },
    {
        firstgid: 40,
        source: '../../../assets/tilemaps/tilesets/LargeObjects.json'
    }
];

/**
 * Format a LevelObject into a standard Tiled JSON object representation.
 * @param {LevelObject} obj
 * @param {string} layerName
 * @returns {Object}
 */
function serializeObject(obj, layerName) {
    const raw = {
        height: obj.height ?? 0,
        id: obj.id,
        name: obj.name ?? '',
        rotation: obj.rotation ?? 0,
        type: obj.type ?? '',
        visible: obj.visible !== false,
        width: obj.width ?? 0,
        x: obj.x ?? 0,
        y: obj.y ?? 0
    };

    if (obj.gid !== undefined) {
        raw.gid = obj.gid;
        // In canonical FBWG, objects identified by GID have type: ""
        if (
            raw.type === 'box' || raw.type === 'heavyBox' || raw.type === 'mirrorBox' ||
            raw.type === 'button' || raw.type === 'lever' || raw.type === 'leverLeft' || raw.type === 'leverRight' ||
            raw.type === 'spawnFB' || raw.type === 'spawnWG' || raw.type === 'doorFB' || raw.type === 'doorWG' ||
            raw.type?.startsWith('spawn-') || raw.type?.startsWith('door-') || raw.type?.startsWith('diamond-')
        ) {
            raw.type = '';
        }
    }

    if (obj.polyline !== undefined) {
        raw.polyline = obj.polyline.map(p => ({ ...p }));
    }

    if (obj.text !== undefined) {
        raw.text = { ...obj.text };
    }

    if (obj.properties && Object.keys(obj.properties).length > 0) {
        const cleanProps = {};
        for (const [k, v] of Object.entries(obj.properties)) {
            if (v === undefined || v === null) continue;
            // Map dX/dY to canonical lowercase dx/dy
            if (k === 'dX') {
                if (cleanProps.dx === undefined) cleanProps.dx = v;
            } else if (k === 'dY') {
                if (cleanProps.dy === undefined) cleanProps.dy = v;
            } else if (k !== 'dx' && k !== 'dy') {
                cleanProps[k] = v;
            } else {
                cleanProps[k] = v;
            }
        }

        if (Object.keys(cleanProps).length > 0) {
            raw.properties = cleanProps;
            raw.propertytypes = {};
            for (const [k, v] of Object.entries(cleanProps)) {
                if (typeof v === 'number') {
                    raw.propertytypes[k] = Number.isInteger(v) ? 'int' : 'float';
                } else if (typeof v === 'boolean') {
                    raw.propertytypes[k] = 'bool';
                } else {
                    raw.propertytypes[k] = 'string';
                }
            }
        }
    }

    return raw;
}

/**
 * Parses canonical Tiled JSON into a LevelModel instance.
 * @param {string|Object} jsonInput
 * @returns {LevelModel}
 */
export function parseLevelJSON(jsonInput) {
    if (jsonInput === null || jsonInput === undefined) {
        throw new Error('Invalid level data: input is empty or null');
    }

    let data;
    if (typeof jsonInput === 'string') {
        if (!jsonInput.trim()) {
            throw new Error('Invalid level data: JSON string is empty');
        }
        try {
            data = JSON.parse(jsonInput);
        } catch (err) {
            throw new Error(`Malformed Tiled JSON string: ${err.message}`);
        }
    } else if (typeof jsonInput === 'object') {
        data = jsonInput;
    } else {
        throw new Error('Invalid level data: expected JSON string or object');
    }

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Invalid Tiled JSON: root must be an object');
    }

    if (typeof data.width !== 'number' || typeof data.height !== 'number') {
        throw new Error('Invalid Tiled JSON: "width" and "height" must be numbers');
    }

    if (!Array.isArray(data.layers)) {
        throw new Error('Invalid Tiled JSON: "layers" must be an array');
    }

    const groundLayer = data.layers.find(l => l.name === 'Ground' || l.type === 'tilelayer');
    if (!groundLayer) {
        throw new Error('Invalid Tiled JSON: missing required "Ground" tilelayer');
    }

    const width = data.width;
    const height = data.height;
    const tileData = Array.isArray(groundLayer.data) ? groundLayer.data : [];
    const tileMap = new TileMap(width, height, tileData);

    const objects = [];
    for (const layer of data.layers) {
        if (layer.type === 'objectgroup' && Array.isArray(layer.objects)) {
            for (const rawObj of layer.objects) {
                const props = rawObj.properties ? { ...rawObj.properties } : {};

                if (props.dx !== undefined && props.dX === undefined) {
                    props.dX = props.dx;
                } else if (props.dX !== undefined && props.dx === undefined) {
                    props.dx = props.dX;
                }

                if (props.dy !== undefined && props.dY === undefined) {
                    props.dY = props.dy;
                } else if (props.dY !== undefined && props.dy === undefined) {
                    props.dy = props.dY;
                }

                const obj = new LevelObject({
                    id: rawObj.id,
                    type: rawObj.type,
                    name: rawObj.name,
                    x: rawObj.x,
                    y: rawObj.y,
                    width: rawObj.width,
                    height: rawObj.height,
                    properties: props,
                    propertytypes: rawObj.propertytypes,
                    gid: rawObj.gid,
                    visible: rawObj.visible !== false,
                    rotation: rawObj.rotation || 0,
                    layer: layer.name,
                    text: rawObj.text,
                    polyline: rawObj.polyline
                });
                objects.push(obj);
            }
        }
    }

    return new LevelModel(width, height, {
        tileMap,
        objects,
        nextObjectId: data.nextobjectid,
        infinite: data.infinite,
        orientation: data.orientation,
        renderorder: data.renderorder,
        tiledversion: data.tiledversion,
        tileheight: data.tileheight,
        tilewidth: data.tilewidth,
        type: data.type,
        version: data.version,
        tilesets: data.tilesets
    });
}

/**
 * Serializes a LevelModel into canonical Tiled JSON object representation.
 * @param {LevelModel} level
 * @returns {Object} Canonical Tiled JSON object
 */
export function serializeLevelToJSON(level) {
    if (!level || typeof level !== 'object') {
        throw new Error('Invalid level instance provided to serializer');
    }

    const charsObjects = [];
    const objectsObjects = [];
    const tutorialObjects = [];

    const objectsList = Array.isArray(level.objects) ? level.objects : [];
    for (const obj of objectsList) {
        if (obj.layer === 'Tutorial_keyboard' || obj.text !== undefined || obj.type === 'text' || obj.type === 'text-trigger') {
            tutorialObjects.push(serializeObject(obj, 'Tutorial_keyboard'));
        } else if (
            obj.layer === 'Chars' ||
            (typeof obj.gid === 'number' && obj.gid >= 16 && obj.gid <= 23) ||
            ['spawnFB', 'spawnWG', 'doorFB', 'doorWG'].includes(obj.type)
        ) {
            charsObjects.push(serializeObject(obj, 'Chars'));
        } else {
            objectsObjects.push(serializeObject(obj, 'Objects'));
        }
    }

    const groundData = level.tileMap instanceof TileMap ? level.tileMap.to1DArray() : [];

    const layers = [
        {
            data: groundData,
            height: level.height,
            name: 'Ground',
            opacity: 1,
            type: 'tilelayer',
            visible: true,
            width: level.width,
            x: 0,
            y: 0
        },
        {
            draworder: 'topdown',
            name: 'Chars',
            objects: charsObjects,
            opacity: 1,
            type: 'objectgroup',
            visible: true,
            x: 0,
            y: 0
        },
        {
            draworder: 'topdown',
            name: 'Objects',
            objects: objectsObjects,
            opacity: 1,
            type: 'objectgroup',
            visible: true,
            x: 0,
            y: 0
        },
        {
            draworder: 'topdown',
            name: 'Tutorial_keyboard',
            objects: tutorialObjects,
            opacity: 1,
            type: 'objectgroup',
            visible: true,
            x: 0,
            y: 0
        }
    ];

    return {
        height: level.height,
        infinite: level.infinite !== undefined ? level.infinite : false,
        layers,
        nextobjectid: level.nextObjectId || 144,
        orientation: level.orientation || 'orthogonal',
        renderorder: level.renderorder || 'right-down',
        tiledversion: level.tiledversion || '1.1.6',
        tileheight: level.tileheight || 32,
        tilesets: level.tilesets && level.tilesets.length > 0 ? level.tilesets : DEFAULT_TILESETS,
        tilewidth: level.tilewidth || 32,
        type: level.type || 'map',
        version: level.version !== undefined ? level.version : 1,
        width: level.width
    };
}
