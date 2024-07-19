import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../config.js';
import toast from 'react-hot-toast';
import { emitSocketEvent } from '../redux/socketMiddleware.js';

const CreateGroupModal = ({ setIsModalOpen }) => {
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { otherUsers } = useSelector(store => store.user);

  const handleUserSelect = (userId) => {
    setSelectedUsers(prevSelected =>
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0) {
      toast.error('Please provide a group name and select at least one user.');
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/groups/create`, {
        name: groupName,
        memberIds: selectedUsers,
      });
      toast.success('Group created successfully!');
      emitSocketEvent('joinGroup', res.data._id);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create group');
    }
  };

  const filteredUsers = otherUsers?.filter(user =>
    user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create Group</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Group Name</label>
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Search Users</label>
          <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="max-h-40 overflow-y-auto mb-4">
          {filteredUsers?.map(user => (
            <div key={user._id} className="flex items-center justify-between p-2 border-b border-gray-300">
              <span>{user.fullName}</span>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleUserSelect(user._id)}
                className="form-checkbox"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary mr-2">Cancel</button>
          <button onClick={handleCreateGroup} className="btn btn-primary">Create Group</button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
