var virt = require("virt"),
    Adaptor = require("./adaptor"),
    getRootNodeInContainer = require("./utils/get_root_node_in_container"),
    getNodeId = require("./utils/get_node_id");


var rootsById = {};


module.exports = render;


function render(nextView, containerDOMNode) {
    var rootDOMNode = getRootNodeInContainer(containerDOMNode),
        id = getNodeId(rootDOMNode),
        root;

    if (id === null || rootsById[id] === undefined) {
        root = new virt.Root();
        root.adaptor = new Adaptor(root, containerDOMNode);
        id = root.id;
        rootsById[id] = root;
    } else {
        root = rootsById[id];
    }

    root.render(nextView, id);

    return root;
}

render.unmount = function(containerDOMNode) {
    var rootDOMNode = getRootNodeInContainer(containerDOMNode),
        id = getNodeId(rootDOMNode),
        root = rootsById[id];

    if (root !== undefined) {
        root.unmount();
        delete rootsById[id];
    }
};