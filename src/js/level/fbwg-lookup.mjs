import { GROUP_LOOKUP, TILE_LOOKUP } from "./fbwg-lookup-table.mjs";

function getKey(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}

/**
 * 
 * @param {*} tileInternal 
 * @returns 
 */
export function tileLookup(tileInternal) {
    return getKey(TILE_LOOKUP, tileInternal);
};

/**
 * 
 * @param {number} tileExternal 
 * @returns {string}
 */
export function reverseTileLookup(tileExternal) {
    return TILE_LOOKUP[tileExternal];
};

/**
 * Look up the external reference based on the internal reference.
 * @param {string} groupInternal 
 * @returns {number}
 */
export function groupLookup(groupInternal) {
    return getKey(GROUP_LOOKUP, groupInternal);
};

/**
 * Look up the internal reference based on the external reference.
 * @param {number} groupExternal 
 * @returns {string}
 */
export function reverseGroupLookup(groupExternal) {
    return GROUP_LOOKUP[groupExternal];
};