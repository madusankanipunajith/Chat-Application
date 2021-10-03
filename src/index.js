const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {genarateMessage, genarateLocationMessage} = require('./utils/messages');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

// middleware
app.use(express.static(publicDirectoryPath));

const message = 'Hello Welcome to Jithson chat application';

// configuring socket io connection
io.on('connection', (socket)=>{
    console.log('New websocket connection is running');

    socket.on('join', ({username, room}, callback) =>{

        const {error, user} = addUser({id: socket.id, username, room});

        if(error){
            return callback(error);
        }
        socket.join(user.room);

        socket.emit('welcomeMessage', genarateMessage('',message));
        socket.broadcast.to(user.room).emit('welcomeMessage', genarateMessage('',`${user.username} has joined to the chat application`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback();
    })

    socket.on('welcome', (reply, callback)=>{

        const user = getUser(socket.id);

        const filter = new Filter();
        if(filter.isProfane(reply)){
            return callback('Profanity is not allowed !');
        }

        if(user){
            io.to(user.room).emit('welcomeMessage', genarateMessage(user.username,reply));
            callback();
        }else{
            callback('something went wrong...');
        }
       
    })

    socket.on('sendLocation', (location, callback)=>{
        const user = getUser(socket.id);
        //io.emit('welcomeMessage', `latitude : ${location.latitude} and longitude: ${location.longitude}`);

        if(user){
            io.to(user.room).emit('locationMessage', genarateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`));
            callback();
        }
        
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('welcomeMessage', genarateMessage('',`${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
       
    })

})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));