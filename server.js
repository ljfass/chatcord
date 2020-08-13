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
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg);
    });
    socket.broadcast.emit('connects', 'a user connects');

    socket.on('disconnect', () => {
        socket.broadcast.emit('disconnects', 'a user disconnected');
    });
});

const PORT = 5000 || process.env.PORT;


server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});