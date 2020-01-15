const io = require('socket.io-client');
const socket = io('http://localhost:5000');

const taskToServer = (task, sub) => {
    sub ? socket.emit( 'new-sub-task', task ) : socket.emit( 'new-task', task );
}

const taskFromServer = setState => {
    socket.on('new-task', task => setState(task));
    socket.on('newbie_tasks', tasks => tasks.forEach( task => setState(task) ));
}

const subTaskFromServer = setState => {
    socket.on('new-sub-task', subTask => setState(subTask));
    socket.on('newbie_subTasks', subTasks => subTasks.forEach( subTask => setState(subTask) ));
}

export { taskToServer, taskFromServer, subTaskFromServer };