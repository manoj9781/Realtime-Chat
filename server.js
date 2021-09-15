const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log("New connection");

    socket.emit('message', 'Welcome to Realtime Chat');
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, function () {
    console.log("Server is running on the port", PORT);
})