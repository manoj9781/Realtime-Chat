const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

//Get username and room from URL

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
// console.log(username, room);

const socket = io();

//Join chatRoom

socket.emit('joinRoom', { username, room });

//Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  //Scroll down

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const msg = event.target.elements.msg.value;
  // console.log(msg);
  //Emit the message to the Server

  socket.emit('chatMessage', msg);

  // Clear input

  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
});

//output message to dom

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `	<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}
