import { TILE_LOOKUP } from "./fbwg-lookup-table.mjs";

function getKey(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}

/**
 * 
 * @param {*} tileInternal 
 * @returns 
 */
export function tileLookup(tileInternal) {
    return TILE_LOOKUP[tileInternal];
};

/**
 * 
 * @param {number} tileExternal 
 * @returns {string}
 */
export function reverseTileLookup(tileExternal) {
    return getKey(TILE_LOOKUP, tileExternal);
};