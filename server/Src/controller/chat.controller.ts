import { Request, Response } from "express";
import { getChatHistory, getTotalMessages } from "../service/chat.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const chatHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const messages = await getChatHistory(req.user.userId, req.params.userId as string);
    return res.status(200).json({ messages });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export const totalChatCount = async (_req: Request, res: Response) => {
  try {
    const count = await getTotalMessages();
    return res.status(200).json({ totalChats: count });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};