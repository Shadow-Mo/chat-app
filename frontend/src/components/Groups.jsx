import React from 'react';
import { useSelector } from "react-redux";

const Groups = () => {
    const { groups } = useSelector(store => store.user);

    if (!groups) return null; // early return if no groups

    return (
        <div className='overflow-auto flex-1'>
            {
                groups.map(group => (
                    <div key={group._id} className='p-2 border-b border-gray-300'>
                        <h3 className='text-lg font-semibold'>{group.name}</h3>
                        <p>Members: {group.members.length}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default Groups;
