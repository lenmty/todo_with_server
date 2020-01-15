import React from "react";
import PropTypes from "prop-types";

export default class extends React.Component {
    static propTypes = {
        onAddTask: PropTypes.func.isRequired
    };

    state = { newTask: "", id: 1, completed: false };

    onChangeTop = e => {
        const { value } = e.currentTarget;
        this.setState({ newTask: value });
    };

    onClickEnter = e => {
        e.preventDefault();
        let { id } = this.state;
        let value = e.target[0].value;
        if (value) {
            this.props.onAddTask(this.state);
            this.setState({ newTask: "", id: ++id });
        }
    };

    render() {
        return (
            <form onSubmit={this.onClickEnter}>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Task Enter"
                        onChange={this.onChangeTop}
                        autoFocus={true}
                        value={this.state.newTask}
                    />
                </div>
            </form>
        );
    }
}