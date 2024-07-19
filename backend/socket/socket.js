import {Server} from "socket.io";
import http from "http";
import express from "express";
import { Group } from "../models/groupModel.js";
import { User } from "../models/userModel.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:['http://localhost:3000'],
        methods:['GET', 'POST'],
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId->socketId}


io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId !== undefined) {
        userSocketMap[userId] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('joinGroup', async (groupId) => {
        const group = await Group.findById(groupId).populate('members');
        if (group) {
            socket.join(groupId);
            io.to(groupId).emit('groupMessage', `${userId} has joined the group`);
        }
    });

    socket.on('groupMessage', (groupId, message) => {
        io.to(groupId).emit('groupMessage', { userId, message });
    });

    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export {app, io, server};

