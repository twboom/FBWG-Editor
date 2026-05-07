import { GROUP_LOOKUP, TILE_LOOKUP } from "./fbwg-lookup-table.mjs";

/**
 * Get a key based on the value in an object.
 * @param {Object} obj Object to get key from.
 * @param {*} value Value assiociated with the key.
 * @returns {*}
 */
function getKey(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}

/**
 * Look up the external reference based on the internal reference.
 * @param {string} tileInternal Internal reference for the tile.
 * @returns {number}
 */
export function tileLookup(tileInternal) {
    return getKey(TILE_LOOKUP, tileInternal);
};

/**
 * Look up the internal reference based on the external reference.
 * @param {number} tileExternal External reference for the tile.
 * @returns {string}
 */
export function reverseTileLookup(tileExternal) {
    return TILE_LOOKUP[tileExternal];
};

/**
 * Look up the external reference based on the internal reference.
 * @param {string} groupInternal Internal reference for the group.
 * @returns {number}
 */
export function groupLookup(groupInternal) {
    return getKey(GROUP_LOOKUP, groupInternal);
};

/**
 * Look up the internal reference based on the external reference.
 * @param {number} groupExternal External reference for the group.
 * @returns {string}
 */
export function reverseGroupLookup(groupExternal) {
    return GROUP_LOOKUP[groupExternal];
};
