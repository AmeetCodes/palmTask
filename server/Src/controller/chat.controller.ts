import { Request, Response } from "express";
import mongoose from "mongoose";
import { getChatHistory, getTotalMessages } from "../service/chat.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const chatHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const targetUserId = req.params.userId as string;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: "Invalid target user ID format. Must be a valid 24-character MongoDB ObjectId." });
    }

    const messages = await getChatHistory(req.user.userId, targetUserId);
    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error in chatHistory controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const totalChatCount = async (_req: Request, res: Response) => {
  try {
    const count = await getTotalMessages();
    return res.status(200).json({ totalChats: count });
  } catch (error) {
    console.error("Error in totalChatCount controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};