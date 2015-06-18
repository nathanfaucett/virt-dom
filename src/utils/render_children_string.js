var virt = require("virt");


var getChildKey = virt.getChildKey;


module.exports = renderChildrenString;


var renderString = require("./render_string");


function renderChildrenString(children, parentProps, id) {
    var out = "",
        i = -1,
        il = children.length - 1,
        child;

    while (i++ < il) {
        child = children[i];
        out += renderString(child, parentProps, getChildKey(id, child, i));
    }

    return out;
}