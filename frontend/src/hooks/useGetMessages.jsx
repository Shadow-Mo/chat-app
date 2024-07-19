import React, { useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const useGetMessages = () => {
    const { selectedUser, groups } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                axios.defaults.withCredentials = true;

                if (!selectedUser?._id) return; // Return if no selected user/group

                let res;

                // Check if selectedUser is a group
                const isGroup = groups.some(group => group._id === selectedUser?._id);

                if (isGroup) {
                    const groupId = selectedUser._id;
                    console.log("groupId - ",groupId);
                    res = await axios.post(`${BASE_URL}/api/v1/message/group/${groupId}`);
                } else {
                    // Fetch messages for a user
                    res = await axios.get(`${BASE_URL}/api/v1/message/user/${selectedUser?._id}`);
                }

                dispatch(setMessages(res.data));
            } catch (error) {
                console.error('Error fetching messages:', error);
                dispatch(setMessages(null));
            }
        };

        fetchMessages();
    }, [selectedUser, groups, dispatch]);

    return null; // Return JSX or null based on your requirement
};

export default useGetMessages;
