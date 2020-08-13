$(function () {
    var socket = io();
    $('form').submit(function (e) {
        e.preventDefault();
        socket.emit('chat message', 'hello');
        socket.on('chat message', msg => {
            console.log(`receive msg from server: ${msg}`);
        })
        return false;
    })
});