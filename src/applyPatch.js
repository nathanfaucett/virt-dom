var virt = require("@nathanfaucett/virt"),
    isNull = require("@nathanfaucett/is_null"),
    isUndefined = require("@nathanfaucett/is_undefined"),
    isNullOrUndefined = require("@nathanfaucett/is_null_or_undefined"),
    arrayForEach = require("@nathanfaucett/array-for_each"),
    getNodeById = require("./utils/getNodeById"),
    createDOMElement = require("./utils/createDOMElement"),
    renderMarkup = require("./utils/renderMarkup"),
    renderString = require("./utils/renderString"),
    renderChildrenString = require("./utils/renderChildrenString"),
    addDOMNode = require("./utils/addDOMNode"),
    removeDOMNode = require("./utils/removeDOMNode"),
    removeDOMNodes = require("./utils/removeDOMNodes"),
    getNodeById = require("./utils/getNodeById"),
    applyProperties = require("./applyProperties");


var consts = virt.consts;


module.exports = applyPatch;


function applyPatch(patch, id, rootDOMNode, document) {
    switch (patch.type) {
        case consts.MOUNT:
            mount(rootDOMNode, patch.next, id);
            break;
        case consts.UNMOUNT:
            unmount(rootDOMNode);
            break;
        case consts.INSERT:
            insert(getNodeById(id), patch.childId, patch.index, patch.next, document);
            break;
        case consts.REMOVE:
            remove(getNodeById(id), patch.childId, patch.index);
            break;
        case consts.REPLACE:
            replace(getNodeById(id), patch.childId, patch.index, patch.next, document);
            break;
        case consts.TEXT:
            text(getNodeById(id), patch.index, patch.next, patch.props);
            break;
        case consts.ORDER:
            order(getNodeById(id), patch.order);
            break;
        case consts.PROPS:
            applyProperties(getNodeById(id), patch.id, patch.next, patch.previous);
            break;
    }
}

function remove(parentNode, id, index) {
    var node;

    if (isNull(id)) {
        node = parentNode.childNodes[index];
    } else {
        node = getNodeById(id);
        removeDOMNode(node);
    }

    parentNode.removeChild(node);
}

function mount(rootDOMNode, view, id) {
    rootDOMNode.innerHTML = renderString(view, null, id);
    arrayForEach(rootDOMNode.childNodes, addDOMNode);
}

function unmount(rootDOMNode) {
    removeDOMNodes(rootDOMNode.childNodes);
    rootDOMNode.innerHTML = "";
}

function insert(parentNode, id, index, view, document) {
    var node = createDOMElement(view, id, document);

    if (view.children) {
        node.innerHTML = renderChildrenString(view.children, view.props, id);
        arrayForEach(node.childNodes, addDOMNode);
    }

    parentNode.appendChild(node);
}

function text(parentNode, index, value, props) {
    var textNode = parentNode.childNodes[index];

    if (textNode) {
        if (textNode.nodeType === 3) {
            textNode.nodeValue = value;
        } else {
            textNode.innerHTML = renderMarkup(value, props);
        }
    }
}

function replace(parentNode, id, index, view, document) {
    var node = createDOMElement(view, id, document);

    if (view.children) {
        node.innerHTML = renderChildrenString(view.children, view.props, id);
        arrayForEach(node.childNodes, addDOMNode);
    }

    parentNode.replaceChild(node, parentNode.childNodes[index]);
}

var order_children = [];

function order(parentNode, orderIndex) {
    var children = order_children,
        childNodes = parentNode.childNodes,
        reverseIndex = orderIndex.reverse,
        removes = orderIndex.removes,
        insertOffset = 0,
        i = -1,
        length = childNodes.length - 1,
        move, node, insertNode;

    children.length = length;
    while (i++ < length) {
        children[i] = childNodes[i];
    }

    i = -1;
    while (i++ < length) {
        move = orderIndex[i];

        if (!isUndefined(move) && move !== i) {
            if (reverseIndex[i] > i) {
                insertOffset++;
            }

            node = children[move];
            insertNode = childNodes[i + insertOffset] || null;

            if (node !== insertNode) {
                parentNode.insertBefore(node, insertNode);
            }

            if (move < i) {
                insertOffset--;
            }
        }

        if (!isNullOrUndefined(removes[i])) {
            insertOffset++;
        }
    }
}