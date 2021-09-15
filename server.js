const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const chatBot = 'Admin';

io.on('connection', (socket) => {
  // console.log("New connection");

  socket.on('joinRoom', ({ username, room }) => {
    socket.emit('message', formatMessage(chatBot, 'Welcome to Realtime Chat'));

    // Broadcast when user connects
    socket.broadcast.emit(
      'message',
      formatMessage(chatBot, 'A user Joined the Chat')
    );
  });

  //Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage('USER', msg));
  });

  //Runs when user discoonects
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(chatBot, 'A user left the chat'));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, function () {
  console.log('Server is running on the port', PORT);
});
