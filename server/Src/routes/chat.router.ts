import { Router } from "express";
import { chatHistory, totalChatCount } from "../controller/chat.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/count", protect, totalChatCount);
router.get("/history/:userId", protect, chatHistory);

export default router;