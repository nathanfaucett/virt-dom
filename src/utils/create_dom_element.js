var virt = require("virt"),
    isString = require("is_string"),

    DOM_ID_NAME = require("../dom_id_name"),
    nodeCache = require("./node_cache"),

    applyProperties = require("../apply_properties");


var View = virt.View,
    isPrimativeView = View.isPrimativeView;


module.exports = createDOMElement;


function createDOMElement(view, id, document) {
    var node;

    if (isPrimativeView(view)) {
        return document.createTextNode(view);
    } else if (isString(view.type)) {
        node = document.createElement(view.type);

        applyProperties(node, id, view.props, undefined);

        node.setAttribute(DOM_ID_NAME, id);
        nodeCache[id] = node;

        return node;
    } else {
        throw new TypeError("Arguments is not a valid view");
    }
}
