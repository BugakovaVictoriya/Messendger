var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var online = 0;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  console.log('a user connected');
  online++;

  socket.username = 'Nemo';

  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.broadcast.emit('user left', {username : socket.username, online: online});
    online--;
  });

  socket.on('new name', (msg) => {
     socket.username = msg.username;
     socket.broadcast.emit('new name1', {username : msg.username});
  });

  socket.on('new message', (msg) => {

    io.emit('add message', {mesText : msg.mesText, username : socket.username, className:msg.className, online: online});
  });

  socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {username : socket.username});
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});