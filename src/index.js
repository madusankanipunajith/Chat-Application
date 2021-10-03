const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

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

    socket.emit('welcomeMessage', message);
    socket.broadcast.emit('welcomeMessage', 'A new user has joined to the chat application');

    socket.on('welcome', (reply, callback)=>{

        const filter = new Filter();
        if(filter.isProfane(reply)){
            return callback('Profanity is not allowed !');
        }

        io.emit('welcomeMessage', reply);
        callback();
    })

    socket.on('sendLocation', (location, callback)=>{
        //io.emit('welcomeMessage', `latitude : ${location.latitude} and longitude: ${location.longitude}`);
        io.emit('locationMessage', `https://google.com/maps?q=${location.latitude},${location.longitude}`);
        callback();
    })

    socket.on('disconnect', ()=>{
        io.emit('welcomeMessage', 'A user has left');
    })

})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));