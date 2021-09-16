const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const chatBot = 'Admin';

io.on('connection', (socket) => {
  // console.log("New connection");

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit('message', formatMessage(chatBot, 'Welcome to Realtime Chat'));

    // Broadcast when user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(chatBot, `${user.username} joined the chat`)
      );
  });

  //Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  //Runs when user discoonects
  socket.on('disconnect', () => {

    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has left the chat`));
    }
    
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, function () {
  console.log('Server is running on the port', PORT);
});
