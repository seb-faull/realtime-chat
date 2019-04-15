const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 8080;
let users = [];

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', (socket) => {
	console.log('New connection established');

  // Show all users when first logged in
  socket.on('get-users', () => {
    socket.emit('all-users', users);
  });

  //When new socket joins
  socket.on('join', (data) => {
    console.log(data);  // nickname
    console.log(users);
    socket.nickname = data.nickname;
    users[socket.nickname] = socket;

    const userObj = {
      nickname: data.nickname,
      socketid: socket.id
    }
    users.push(userObj);
    io.emit('all-users', users);
  });

  // Broadcast the message
  socket.on('send-message', (data) => {
    // socket.broadcast.emit('message-received', data);
    io.emit('message-received', data);
  });

  // Send a 'like' to the user of my choice
  socket.on('send-like', (data) => {
    console.log(data);
    socket.broadcast.to(data.like).emit('user-liked', data);
  });

  socket.on('disconnect', () => {
    users = users.filter((item) => {
      return item.nickname !== socket.nickname;
    });
    io.emit('all-users', users);
  });

});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
