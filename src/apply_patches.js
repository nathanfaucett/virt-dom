var getNodeById = require("./utils/get_node_by_id"),
    applyPatch = require("./apply_patch");


module.exports = applyPatches;


function applyPatches(hash, rootDOMNode, document) {
    var id;

    for (id in hash) {
        if (hash[id] !== undefined) {
            applyPatchIndices(getNodeById(id) || rootDOMNode, hash[id], id, document);
        }
    }
}

function applyPatchIndices(DOMNode, patchArray, id, document) {
    var i = -1,
        length = patchArray.length - 1;

    while (i++ < length) {
        applyPatch(patchArray[i], DOMNode, id, document);
    }
}