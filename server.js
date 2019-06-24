const moment = require('moment');
const uuid = require('uuid');

const express = require('express');
const socket = require('socket.io');
const app = express();

// set port to serve requests
const PORT =process.env.PORT|| 5000;
// listens for requests at the specified port
let server = app.listen(PORT, () => console.log(`Running at ${PORT}`));


let connections = [];
let users = [];

//static files
app.use(express.static('public'));

// socket setup
let io = socket(server);
io.on('connection', (socket) => {

    // on connection
    connections.push(socket);
    //console.log(`connected socket: ${connections.length}`);

    // on disconnect
    socket.on('disconnect', (socket) => {
        users.splice(users.indexOf(socket.usernames), 1);
        
        updateUsernames();

        connections.splice(connections.indexOf(socket), 1);
        //console.log(`connected socket: ${connections.length}`);

    });

    // new user
    socket.on('new user', (data) => {
        socket.usernames = data;
        users.push(socket.usernames);
        // update usernames
        updateUsernames();
    });
    // emit message from sockets 
    socket.on('chat', (data) => {
        const newMessage = {
            id: uuid.v4(),
            message: data.message,
            name: data.name,
            timestamp: moment().format('LLL')
        };
        io.sockets.emit('chat', newMessage);
    });

    //emit broadcastings message
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });

   function updateUsernames(){
      // console.log(`users ${users.length}`);
        io.sockets.emit('get users', users);
    
    }
});

