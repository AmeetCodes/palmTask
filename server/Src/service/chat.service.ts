import mongoose from "mongoose";
import { Message } from "../models/chat.model";

export const saveMessage = async (sender: string, receiver: string, message: string) => {
  const newMessage = await Message.create({ sender, receiver, message });
  return newMessage.populate([
    { path: "sender", select: "name email" },
    { path: "receiver", select: "name email" },
  ]);
};

export const getChatHistory = async (userId: string, otherUserId: string) => {
  return Message.find({
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender", "name email")
    .populate("receiver", "name email");
};

export const getTotalMessages = async () => Message.countDocuments();