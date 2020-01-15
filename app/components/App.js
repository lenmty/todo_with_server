import React from 'react';
import Input from './Input';
import TasksList from './TasksList';
import '../styles/bootstrap.css';
import '../styles/style.css';
import { taskToServer, taskFromServer, subTaskFromServer } from '../src/api'


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tasks: [], subTasks: {}, show: window.location.hash.substr(1), completedTasks: 0 };
        taskFromServer( task => this.setState({
            tasks: [task, ...this.state.tasks],
            subTasks: {[task.id]: [], ...this.state.subTasks }
        }));
        subTaskFromServer( subTask => {
            const nextTasks = [...this.state.subTasks[subTask.idParent], subTask];
            this.setState({ subTasks: {...this.state.subTasks, [subTask.idParent]: nextTasks} });
        });
    }

    handleAddTask = (data) => {  
        // const { id } = data;
        // const nextTasks = [...this.state.tasks, data];      
        // this.setState({ tasks: nextTasks, subTasks: {...this.state.subTasks,  [id]: [] }});
        taskToServer(data);
    }

    handleAddSubTask = (data) => {
        // const { idParent } = data;       
        // const nextTasks = [...this.state.subTasks[idParent], data];
        // this.setState({ subTasks: {...this.state.subTasks, [idParent]: nextTasks } });
        taskToServer(data, 'sub');
    }

    handleDeleteTask = (data) => {  
        const { subTask, idParent } = data;        
        const nextTasks = (!subTask ? this.state.tasks : this.state.subTasks[idParent]).filter((item) => item.id !== data.id); 
        if (!subTask) {          
            delete this.state.subTasks[data.id];   
            this.setState({ tasks: nextTasks }, this.countCompletedTasks);
        } else {          
            this.setState({ subTasks: {...this.state.subTasks, [idParent]: nextTasks } });
        }
    }

    handleChangeTask = (data) => {   
        const { subTask, idParent } = data;     
        const nextTasks = (!subTask ? this.state.tasks : this.state.subTasks[idParent]).map((item) => {
            if (item.id === data.id) {                
                data.name === 'checkbox' ? item.completed = data.completed : item.newTask = data.newTask;
            }
            return item;
        });         
        if (!subTask) {             
            this.setState({ tasks: nextTasks }, this.countCompletedTasks);
        } else {  
            const marker = nextTasks.some((item) => item.completed === false);
            if (!marker)  {
                const tasks = this.state.tasks.map((item) => (item.id === idParent) ? {...item, completed: true} : item )
                this.setState({ tasks: tasks }, this.countCompletedTasks); 
            };               
            this.setState({ subTasks: {...this.state.subTasks, [idParent]: nextTasks }});           
        }    
    }

    countCompletedTasks = () => {
        const completedTasks = this.state.tasks.filter(task => task.completed);
        this.setState({ completedTasks: completedTasks.length });
    }

    changeShowing = event => {
        const show = event.target.id;
        this.setState({show: show});
    }

    clearAllDone = () => {
        const activeTasks = this.state.tasks.filter(task => !task.completed);    
        this.setState({ tasks: activeTasks }, this.countCompletedTasks);
    }

    renderClearButton = (count) => {
        if(count) return (
            <a className="clear-all-done" onClick={this.clearAllDone}>Clear all Done({count})</a>
        );
    }

    handleSortTask = (data, idParent) => {  
        if (!idParent) {
            let i = 0;
            const nextTasks = this.state.tasks.map((item) => {                             
                if (i < data.length && item.completed === data[i].completed) {                   
                    const newItem = {...item, newTask: data[i].newTask, id: data[i].id};
                    ++i; 
                    return newItem;          
                }  else {          
                    return item;
                }
            }); 
            this.setState({ tasks: nextTasks });           
        } else  {
            this.setState({ subTasks: {...this.state.subTasks, [idParent]: data } }); 
        }
    }


    render () { 
        let showingTasks = this.state.tasks;        
        let { show, completedTasks } = this.state;      
        if (show === 'done') showingTasks = showingTasks.filter(item => item.completed);
        else if (show === 'active') showingTasks = showingTasks.filter(item => !item.completed);

        return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                <h4 className="m-3">Todo list</h4>    
                <Input onAddTask={this.handleAddTask}/>
                <div className="my-tasks-header">
                    <h4 className="m-3">My tasks</h4>
                    <div>
                        <a id="all" href="#all" onClick={this.changeShowing}>All</a>
                        <a id="active" href="#active" onClick={this.changeShowing}>Active</a>
                        <a id="done" href="#done" onClick={this.changeShowing}>Done</a>                        
                    </div>
                </div>
                <TasksList 
                    data={showingTasks}                    
                    subTasks={this.state.subTasks}
                    onAddSubTask={this.handleAddSubTask}             
                    onDeleteTask={this.handleDeleteTask}
                    onChangeTask={this.handleChangeTask}
                    onSortTask={this.handleSortTask}
                />
                {this.renderClearButton(completedTasks)}
                </div>
            </div>
        </div>
        );
    }
}  