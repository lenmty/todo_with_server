import React from "react";
import Task from "./Task";
import PropTypes from "prop-types";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";

const SortableItem = sortableElement(({ value }) => <>{value}</>);

const SortableContainer = sortableContainer(({ children }) => {
    return <ul className="list-group list-group-flush">{children}</ul>;
});

export default class TaskList extends React.Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        subTasks: PropTypes.object.isRequired,
        onAddSubTask: PropTypes.func.isRequired,
        onDeleteTask: PropTypes.func.isRequired,
        onChangeTask: PropTypes.func.isRequired,
        onSortTask: PropTypes.func.isRequired
    };

    static getDerivedStateFromProps(nextProps) {
        return {
            items: nextProps.data,
            subItems: nextProps.subTasks
        };
    }

    state = { items: [], subItems: {}, marker: {} };

    onSortEnd = ({ oldIndex, newIndex }) => {
        const { items } = this.state;
        this.props.onSortTask(arrayMove(items, oldIndex, newIndex), false);
    };

    onSortSubEnd = idParent => ({ oldIndex, newIndex }) => {
        const subItems = this.state.subItems[idParent];
        this.props.onSortTask(arrayMove(subItems, oldIndex, newIndex), idParent);
    };

    onMarker = (marker, id) => {
        this.setState({ marker: { ...this.state.marker, [id]: marker } });
    };

    Sortable = () => {
        const { data, subTasks } = this.props;
        const { marker } = this.state;
        if (data.length) {
            return (
                <SortableContainer pressDelay={170} onSortEnd={this.onSortEnd}>
                    {data.map((item, index) => (
                        <SortableItem
                            key={`item-${item.id}`}
                            index={index}
                            value={
                                <li className="list-group-item">
                                    <Task
                                        data={{ ...item, hideMarker: subTasks[item.id].length ? false : true }}
                                        add={this.props.onAddSubTask}
                                        delete={this.props.onDeleteTask}
                                        change={this.props.onChangeTask}
                                        marker={this.onMarker}
                                    />
                                    <div className={"list-group-item__subtasks" + (marker[item.id] ? " marker" : "")}>
                                        {subTasks[item.id].length ? (
                                            <SortableContainer pressDelay={200} onSortEnd={this.onSortSubEnd(item.id)}>
                                                {subTasks[item.id].map((value, index) => (
                                                    <SortableItem
                                                        key={`item-${value.id}`}
                                                        index={index}
                                                        value={
                                                            <Task
                                                                data={{ ...value, completed: item.completed || value.completed }}
                                                                delete={this.props.onDeleteTask}
                                                                change={this.props.onChangeTask}
                                                            />
                                                        }
                                                    />
                                                ))}
                                            </SortableContainer>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </li>
                            }
                        />
                    ))}
                </SortableContainer>
            );
        }
    };

    render() {
        return <div className="card">{this.Sortable()}</div>;
    }
}
