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
    console.log('conneced!!');
    socket.on('send message', (msg) => {
        console.log(msg);
        io.emit('send message', msg);
    });

    socket.on('disconnect', () => {
        console.log('disconneced!!');
    });
});

const PORT = 5000 || process.env.PORT;


server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});