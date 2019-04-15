const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 8080;
const users = [];

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', (socket) => {
	console.log('New connection established');

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
    io.emit('all-users', users)
  })

});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
