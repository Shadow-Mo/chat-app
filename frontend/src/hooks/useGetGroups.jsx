import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setGroups } from '../redux/userSlice';
import { BASE_URL } from '../config.js';

const useGetGroups = () => {
    const dispatch = useDispatch();
    const { authUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.post(`${BASE_URL}/api/groups/getgroup`,{
                    userId: authUser._id
                });
                dispatch(setGroups(response.data));
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };
        
        fetchGroups();
    }, [dispatch]);
};

export default useGetGroups;
