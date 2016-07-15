var virt = require("@nathanfaucett/virt"),
    parallel = require("@nathanfaucett/parallel"),
    eventListener = require("@nathanfaucett/event_listener"),
    dispatcher = require("./dispatcher"),
    TodoStore = require("./todo_store");


var TodoFormPrototype;


module.exports = TodoForm;


function TodoForm(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.state = {
        name: "Default State"
    };

    this.onSubmit = function(e) {
        return _this.__onSubmit(e);
    };

    this.onInput = function(e) {
        return _this.__onInput(e);
    };
}
virt.Component.extend(TodoForm, "TodoForm");

TodoFormPrototype = TodoForm.prototype;

TodoFormPrototype.__onSubmit = function(e) {
    var _this = this,
        nameInput = this.refs.name;

    parallel([
        nameInput.getValue
    ], function(error, values) {
        var name = values[0][0];

        if (!error && name) {
            dispatcher.handleViewAction({
                actionType: TodoStore.consts.TODO_CREATE,
                text: name
            });

            nameInput.setValue("");

            _this.setState({
                name: ""
            });
        }
    });
};

TodoFormPrototype.__onInput = function() {
    var _this = this;

    this.refs.name.getValue(function(err, value) {
        if (!err) {
            _this.setState({
                name: value
            });
        }
    });
};

TodoFormPrototype.render = function() {
    return (
        virt.createView("div", {
                className: "todo-form"
            },
            virt.createView("form", {
                    action: "",
                    onSubmit: this.onSubmit
                },
                virt.createView("input", {
                    type: "text",
                    name: "name",
                    ref: "name",
                    placeholder: "Todo",
                    value: this.state.name,
                    onInput: this.onInput
                }),
                virt.createView("input", {
                    type: "submit",
                    name: "submit",
                    value: "submit",
                    onClick: this.onSubmit
                })
            )
        )
    );
};
