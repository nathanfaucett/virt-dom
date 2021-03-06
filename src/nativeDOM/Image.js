var virt = require("@nathanfaucett/virt"),
    has = require("@nathanfaucett/has"),
    emptyFunction = require("@nathanfaucett/empty_function");


var View = virt.View,
    Component = virt.Component,
    ImagePrototype;


module.exports = Image;


function Image(props, children, context) {
    if (process.env.NODE_ENV !== "production") {
        if (children.length > 0) {
            throw new Error("Image: img can not have children");
        }
    }

    Component.call(this, getProps(props), children, context);

    this.__lastSrc = null;
    this.__originalProps = props;
    this.__hasEvents = !!(props.onLoad || props.onError);
}
Component.extend(Image, "img");
ImagePrototype = Image.prototype;

ImagePrototype.componentDidMount = function() {
    var src = this.__originalProps.src;

    this.__lastSrc = src;
    this.emitMessage("virt.dom.Image.mount", {
        id: this.getInternalId(),
        src: src
    });
};

ImagePrototype.componentWillReceiveProps = function(nextProps) {
    Image_onProps(this, nextProps);
};

ImagePrototype.componentDidUpdate = function() {
    var src;

    Image_onProps(this, this.__originalProps);
    src = this.__originalProps.src;

    if (this.__lastSrc !== src) {
        this.__lastSrc = src;

        this.emitMessage("virt.dom.Image.setSrc", {
            id: this.getInternalId(),
            src: src
        });
    }
};

ImagePrototype.render = function() {
    return new View("img", null, null, this.props, this.children, null, null);
};

function Image_onProps(_this, props) {
    _this.props = getProps(props);
    _this.__originalProps = props;
    _this.__hasEvents = !!(props.onLoad || props.onError);
}

function getProps(props) {
    var localHas = has,
        renderProps = {
            onLoad: emptyFunction,
            onError: emptyFunction
        },
        key;

    for (key in props) {
        if (localHas(props, key) && key !== "src") {
            renderProps[key] = props[key];
        }
    }

    return renderProps;
}