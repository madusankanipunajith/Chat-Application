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

// configuring socket io connection
io.on('connection', ()=>{
    console.log('New websocket connection is running');
})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));