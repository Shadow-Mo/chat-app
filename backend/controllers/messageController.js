import { Conversation } from "../models/conversationModel.js";
import { Group } from "../models/groupModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const { receiverId, groupId, message } = req.body;

        if (!message || (!receiverId && !groupId)) {
            return res.status(400).json({ error: 'Message content and either receiverId or groupId are required' });
        }

        let newMessage;
        let conversation;

        if (receiverId) {
            newMessage = await Message.create({
                senderId,
                receiverIds: [receiverId],
                message
            });

            conversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] }
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [senderId, receiverId],
                    messages: [newMessage._id]
                });
            } else {
                conversation.messages.push(newMessage._id);
                await conversation.save();
            }

            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', newMessage);
            }

        } else if (groupId) {
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ error: 'Group not found' });
            }

            newMessage = await Message.create({
                senderId,
                receiverIds: group.members,
                message
            });

            conversation = await Conversation.findOne({
                participants: { $in: [groupId] }
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [groupId],
                    messages: [newMessage._id]
                });
            } else {
                conversation.messages.push(newMessage._id);
                await conversation.save();
            }

            // Notify all group members
            group.members.forEach(memberId => {
                const memberSocketId = getReceiverSocketId(memberId);
                if (memberSocketId) {
                    io.to(memberSocketId).emit('newMessage', newMessage);
                }
            });
        }

        return res.status(201).json({ newMessage });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMessage = async (req,res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]}
        }).populate("messages");
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        console.log(error);
    }
}

export const getGroupMessage = async (req, res) => {
    try {
        const groupId  = req.params.id;

        // Find conversation where groupId is included in participants array
        const conversation = await Conversation.findOne({
            participants: { $in: [groupId] }
        }).populate('messages');

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Assuming 'messages' is an array of message objects linked to the conversation
        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching group messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
