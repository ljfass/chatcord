const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.send('<h1>hello<h1/>');
});

io.on('connection', (socket) => {

    socket.emit('message', 'Welcome to the chat room'); // broadcast the user that is connecting 

    socket.on('send message', (msg) => {
        io.emit('send message', msg);
    });

    socket.on('typing message', msg => {
        socket.broadcast.emit('typing message', `${msg} is typing...`);
    });

    socket.broadcast.emit('message', 'A user has joined the chat'); // broadcast to everyone excpet the one that is connecting


    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat'); // broadcast to everyone
    });
});

const PORT = 5001 || process.env.PORT;


server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});