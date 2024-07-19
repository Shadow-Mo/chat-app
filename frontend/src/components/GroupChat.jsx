// src/components/GroupChat.jsx
import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { BASE_URL } from '../config.js';

const GroupChat = () => {
  const [groupId, setGroupId] = useState('');
  const [message, setMessage] = useState('');
  const socket = useSocket();
  const { authUser } = useSelector(store => store.user);

  const handleJoinGroup = () => {
    if (authUser && groupId) {
      axios.post(`${BASE_URL}/api/groups/join`, {
        groupId,
        userId: authUser._id,
      })
      .then(() => {
        socket.emit('joinGroup', groupId);
      })
      .catch(err => {
        console.error(err);
      });
    }
  };

  const handleSendMessage = () => {
    if (socket && groupId && message) {
      socket.emit('groupMessage', groupId, message);
      setMessage('');
    }
  };

  return (
    <div className="p-4">
      <input 
        type="text" 
        placeholder="Group ID" 
        value={groupId} 
        onChange={(e) => setGroupId(e.target.value)}
        className="input input-bordered rounded-md w-full mb-2" 
      />
      <button onClick={handleJoinGroup} className="btn btn-primary w-full mb-4">Join Group</button>
      <div>
        <input 
          type="text" 
          placeholder="Message" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          className="input input-bordered rounded-md w-full mb-2"
        />
        <button onClick={handleSendMessage} className="btn btn-secondary w-full">Send</button>
      </div>
    </div>
  );
};

export default GroupChat;
