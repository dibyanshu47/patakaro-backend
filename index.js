const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

const positions = new Map();

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    console.log(positions);

    socket.on('location', (payload) => {
        positions.set(socket.id, { ...payload });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        positions.delete(socket.id);
    });
});

server.listen(5000, () => {
    console.log('listening on *:5000');
});