import React from "react";
import PropTypes from "prop-types";

const ENTER_KEY = 13;
const ENTER_ESCAPE = 27;

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        this.subtaskInput = React.createRef();
    }

    static propTypes = {
        data: PropTypes.shape({
            newTask: PropTypes.string.isRequired
        }),
        delete: PropTypes.func.isRequired,
        change: PropTypes.func.isRequired
    };

    state = { editText: "", editing: false, subId: 1 };

    onClickEdit = () => {
        const { newTask } = this.props.data;
        this.setState({ editText: newTask, editing: true }, () => {
            const input = this.textInput.current;
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        });
    };

    onClickInput = () => {
        const { clickInput } = this.state;
        this.setState({ clickInput: clickInput ? false : true, clickInputText: "" }, () => {
            const input = this.subtaskInput.current;
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        });
    };

    onClickMarker = () => {
        const { id } = this.props.data;
        const { clickMarker } = this.state;
        this.setState({ clickMarker: clickMarker ? false : true });
        this.props.marker(clickMarker ? false : true, id);
    };

    onChange = e => {
        const { value } = e.currentTarget;
        if (value === this.textInput.current.value) this.setState({ editText: value });
        if (this.subtaskInput.current !== null && value === this.subtaskInput.current.value)
            this.setState({ clickInputText: value });
    };

    onClickClose = () => {
        this.props.delete(this.props.data);
    };

    onToggle = () => {
        const { completed, id, idParent, subTask } = this.props.data;
        this.props.change({ completed: !completed, id, name: "checkbox", idParent, subTask });
    };

    onKeyDown = e => {
        if (e.keyCode && e.keyCode !== ENTER_KEY && e.keyCode !== ENTER_ESCAPE) {
            return;
        }
        e.preventDefault();
        const { editing } = this.state;
        if (!editing) {
            let { subId, clickInputText } = this.state;
            const { id } = this.props.data;
            if (clickInputText) {
                this.props.add({ idParent: id, id: `${id}${subId}`, newTask: clickInputText, completed: false, subTask: true });
                this.setState({ subId: ++subId, clickInputText: "" });
            }
        } else {
            const { editText } = this.state;
            this.props.change({ ...this.props.data, newTask: editText });
            this.setState({ editing: false, editText: "" });
        }
    };

    render() {
        const { newTask, id, subTask, completed, hideMarker } = this.props.data;
        const { editing, clickInput, clickMarker } = this.state;
        const checkId = "checkbox" + id;
        return (
            <div className={(subTask ? "subtask" : "") + (editing ? " edit" : "")}>
                {!subTask && (
                    <div className={"list-group-item__input" + (clickInput ? " view" : "") + (completed ? " d-none" : "")}>
                        <label
                            className={"arrow " + (clickInput ? "arrow_up" : "arrow_down")}
                            onClick={this.onClickInput}
                        ></label>
                        <input
                            className="input-subtask form-control"
                            ref={this.subtaskInput}
                            value={this.state.clickInputText || ""}
                            onChange={this.onChange}
                            onKeyDown={this.onKeyDown}
                            placeholder="SubTask Enter"
                        />
                    </div>
                )}
                <div className="list-group-item__out" onDoubleClick={this.onClickEdit}>
                    <input type="checkbox" id={checkId} checked={this.props.data.completed} onChange={this.onToggle} />
                    <label className={"checkbox" + (completed ? " completed" : "")} htmlFor={checkId}></label>
                    <span>{newTask}</span>
                    <label className="close" onClick={this.onClickClose}></label>
                    {!subTask && (
                        <label
                            className={"marker " + (clickMarker ? "plus" : "minus") + (completed || hideMarker ? " d-none" : "")}
                            onClick={this.onClickMarker}
                        ></label>
                    )}
                </div>
                <input
                    className="list-group-item__inside form-control"
                    ref={this.textInput}
                    value={this.state.editText}
                    onBlur={this.onKeyDown}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                />
            </div>
        );
    }
}
