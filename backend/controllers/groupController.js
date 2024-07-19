// controllers/groupController.js
import { Group } from "../models/groupModel.js";

export const createGroup = async (req, res) => {
  try {
    const { name, memberIds } = req.body;
    if (!name || !memberIds) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const group = new Group({ name, members: memberIds });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    res.status(200).json(group);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getGroup = async (req, res) => {
    try {
      // Get the authenticated user ID from req.user (assuming it's set by middleware)
      const { userId } = req.body;
  
      // Find groups where the user is a member
      const groups = await Group.find({ members: userId }).populate('members', 'fullName profilePhoto');
  
      res.status(200).json(groups);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
