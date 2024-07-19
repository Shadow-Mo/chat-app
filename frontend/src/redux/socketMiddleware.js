import { io } from "socket.io-client";
import { BASE_URL } from "../config.js";

let socket;

const socketMiddleware = store => next => action => {
  switch(action.type) {
    case 'INIT_SOCKET':
      if (socket) {
        socket.disconnect();
      }
      socket = io(BASE_URL, {
        query: { userId: action.payload.userId }
      });

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socket.on('getOnlineUsers', (onlineUsers) => {
        store.dispatch({ type: 'SET_ONLINE_USERS', payload: onlineUsers });
      });

      socket.on('newMessage', (message) => {
        store.dispatch({ type: 'NEW_MESSAGE', payload: message });
      });

      break;
    case 'SEND_GROUP_MESSAGE':
      socket.emit('groupMessage', action.payload.groupId, action.payload.message);
      break;
    case 'JOIN_GROUP':
      socket.emit('joinGroup', action.payload.groupId);
      break;
    default:
      break;
  }

  next(action);
};

export const emitSocketEvent = (event, data) => {
  if (socket) {
    socket.emit(event, data);
  }
};

export default socketMiddleware;
