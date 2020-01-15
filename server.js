const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http);

const PORT = process.env.PORT || 5000;
let data = [];
let subData = [];

const getId = () => {
    let id = 1;
    return () => id++;
}
let serverId = getId();
let serverSubTaskId = getId();

app.get('/', (request, response) => {
    response.send("I'm server. You'r not.")
})

app.use((req, res, next) => {
    res.status(404).send('404 The page does not exist!');
});

io.on('connection', socket => {
    console.log('new user connected');

    if(data.length) {
        socket.emit('newbie_tasks', data);
        socket.emit('newbie_subTasks', subData);
    }

    socket.on('new-task', task => {
        console.log('wow i got a new task', task);
        task.id = serverId();
        data = [...data, task];

        io.emit('new-task', task);
    });

    socket.on('new-sub-task', subTask => {
        console.log("got subTask", subTask);
        subTask.id = String(subTask.idParent) + serverSubTaskId();
        subData = [...subData, subTask];
        
        io.emit('new-sub-task', subTask);
    });

    socket.on('disconnect', () => console.log('user disconnected'));
})

http.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))