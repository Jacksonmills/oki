"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3001;
const generateRandomUsername = () => `User${Math.floor(Math.random() * 10000)}`;
io.on('connection', (socket) => {
    console.log('a user connected');
    const username = generateRandomUsername();
    socket.broadcast.emit('user-connected', `${username} has connected`);
    socket.on('message', (message) => {
        io.emit('message', `${username}: ${message}`);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
