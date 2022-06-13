const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
});

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Server is running');
});

const positions = new Map();

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    // console.log(positions);

    socket.on('location', (payload) => {
        positions.set(socket.id, { ...payload });
        const locations = [];
        positions.forEach((value, key) => {
            locations.push({ id: key, ...value });
        });
        io.emit('takeLocations', { locations });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        positions.delete(socket.id);
        const locations = [];
        positions.forEach((value, key) => {
            locations.push({ id: key, ...value });
        });
        io.emit('takeLocations', { locations });
    });
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});