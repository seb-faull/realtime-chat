const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 8080;

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', (socket) => {
	console.log('New connection established');
});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
