const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const messages = require('./utils/messages');
const { userJoin, getRoomUsers, userLeave, getCurrentUser } = require('./utils/users');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.send('<h1>hello<h1/>');
});

io.on('connection', (socket) => {

    // user join room
    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        
        // Welcome a new user
        socket.emit('message', messages('Chatcord Bot','Welcome to the chat room')); // broadcast the user that is connecting 
        
        // Broadcast when a user connects    
        socket.broadcast.to(user.room).emit('message', messages(username, `${username} has joined room ${user.room}`)); // broadcast to everyone excpet the one that is connecting
    
        // Get users and room info
        io.to(user.room).emit('roomInfos', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });

    // Listen for chatMessag
    socket.on('send message', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('send message', messages(user.username, `${user.username} said: ${msg}`));
    });

    socket.on('typing message', msg => {
        socket.broadcast.emit('typing message', `${msg} is typing...`);
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', messages('Chatcord Bot', `${user.username} has left the chat`)); // broadcast to everyone
        }
    });
});

const PORT = 5001 || process.env.PORT;


server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});