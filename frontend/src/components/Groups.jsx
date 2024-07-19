import React from 'react';
import { useSelector } from "react-redux";
import OtherGroup from './OtherGroup';

const Groups = () => {
    const { groups } = useSelector(store => store.user);

    if (!groups) return null; // early return if no groups

    return (
        <div className='overflow-auto flex-1'>
            {
                groups?.map((group)=>{
                    return (
                        <OtherGroup key={group._id} group={group}/>
                    )
                })
            }
        </div>
    )
}

export default Groups;
