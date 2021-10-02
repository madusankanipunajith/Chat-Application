const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

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
    // socket.emit('countUpdated', count);

    // socket.on('increment', ()=>{
    //     count++;
    //     // socket.emit('countUpdate, count)
    //     io.emit('countUpdated', count);
    // })

    socket.emit('welcomeMessage', message);

    socket.on('welcome', (reply)=>{
        io.emit('welcomeMessage', reply);
    })

})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));