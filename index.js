const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});



const users = {};

// Socket IO
io.sockets.on('connection', (socket) => {
	console.log('LOG:USER_CONNECTED: ' + socket.id);
  users[socket.id] = { id: socket.id, x: 0, y: 0 };

  socket.on('disconnect', () => {
    console.log('LOG:USER_DISCONNECTED: ' + socket.id);
    users[socket.id] = undefined;
  });


  // Movimentação
	socket.on('ON_USER_MOVE', (newPosition) => {
    const user = users[socket.id];
    user.x = user.x + (newPosition.move.x || 0);
    user.y = user.y + (newPosition.move.y || 0);
    console.log(user, newPosition);
    io.emit('ON_USERS_UPDATE', JSON.stringify(users));
	});
});


server.listen(3000, () => {
	console.log('listening on *:3000');
});
