$(function () {
    var socket = io();
    socket.on('connects', msg => {
        console.log(msg);
    });
    socket.on('disconnects', msg => {
        console.log(msg);
    });
    $('form').submit(function (e) {
        // e.preventDefault();
        // socket.emit('chat message', $('#username').val() + ': ' + $('#content').val());
        // socket.on('chat message', msg => {
        //     $('#messages').append($('<li>').text(msg));
        // });
        window.localStorage.setItem('user', $('#username').val());
        return false;
    })
});