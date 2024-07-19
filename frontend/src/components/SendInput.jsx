import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { BASE_URL } from "..";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { selectedUser, authUser } = useSelector((store) => store.user);
  const { messages } = useSelector((store) => store.message);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (authUser._id === selectedUser._id) {
        // It's a single user conversation
        res = await axios.post(
          `${BASE_URL}/api/v1/message/send/${selectedUser._id}`,
          { message },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        // It's a group conversation
        const receiverIds = selectedUser.members.map((member) => member._id); // Assuming selectedUser.members contains group members
        const filteredReceiverIds = receiverIds.filter(
          (id) => id !== authUser._id
        ); // Exclude sender's ID

        res = await axios.post(
          `${BASE_URL}/api/v1/message/send/${authUser._id}`,
          {
            message,
            groupId: selectedUser._id,
            receiverIds: filteredReceiverIds,
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const updatedMessages = messages ? [...messages, res?.data?.newMessage] : [res?.data?.newMessage];
      dispatch(setMessages(updatedMessages));
    } catch (error) {
      console.log(error);
    }

    setMessage("");
  };

  return (
    <form onSubmit={onSubmitHandler} className="px-4 my-3">
      <div className="w-full relative">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Send a message..."
          className="border text-sm rounded-lg block w-full p-3 border-zinc-500 bg-gray-600 text-white"
        />
        <button
          type="submit"
          className="absolute flex inset-y-0 end-0 items-center pr-4">
          <IoSend />
        </button>
      </div>
    </form>
  );
};

export default SendInput;
