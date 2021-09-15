const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    // console.log("New connection");

    socket.emit('message', 'Welcome to Realtime Chat');

    // Broadcast when user connects
    socket.broadcast.emit('message', 'A new user joined the room');

    //RUns when user discoonects
    socket.on('disconnect', () => {
        io.emit('message', 'A user left the room');
    })
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, function () {
    console.log("Server is running on the port", PORT);
})